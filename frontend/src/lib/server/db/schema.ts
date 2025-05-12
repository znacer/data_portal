import { relations } from 'drizzle-orm';
import {
	jsonb,
	pgEnum,
	pgTable,
	text,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from 'drizzle-zod';
import { z } from 'zod';

export const nodeTypeEnum = pgEnum('type', [
	'SHIP',
	'SYSTEM',
	'SUBSYSTEM',
	'EQUIPMENT',
	'PART',
	'SENSOR'
]);

// New enum for connection types (how the frontend interacts)
export const connectionTypeEnum = pgEnum('connection_type', [
	'REST_API',
	'FILE_DOWNLOAD' // Endpoint that returns a file
	// TODO: Add other types like 'WEBSOCKET', 'GRAPHQL', etc. as needed
]);

export const nodes = pgTable('nodes', {
	id: text().primaryKey(),
	name: text().notNull(),
	type: nodeTypeEnum().notNull(),
	parentId: text().references((): AnyPgColumn => nodes.id)
	// dbSensorId: text(), // REMOVED
	// dbShipId: text()  // REMOVED
});

export const nodesRelations = relations(nodes, ({ one, many }) => ({
	parent: one(nodes, {
		fields: [nodes.parentId],
		references: [nodes.id],
		relationName: 'children'
	}),
	children: many(nodes, { relationName: 'children' }),
	dataLink: one(sensorDataLinks, {
		fields: [nodes.id],
		references: [sensorDataLinks.nodeId],
		relationName: 'node'
	})
}));

/**
 * defines external data source connections
 * */
export const connections = pgTable('connections', {
	id: text().primaryKey(), // Use UUID or a short identifier (e.g., 'my-fastapi', 'other-service')
	name: text().notNull(), // Display name
	type: connectionTypeEnum().notNull(),
	address: text().notNull(), // Base URL for APIs, or identifier for file sources etc.
	description: text()
	// TODO: authentication details ?
	// apiKey: text(),
	// username: text(),
	// password: text(), // Use secure storage methods!
	// customHeaders: jsonb(), // For API keys in headers etc.
});

export const connectionsRelations = relations(connections, ({ many }) => ({
	linkedSensors: many(sensorDataLinks)
}));

/**
 * table to link SENSOR nodes to connection-specific parameters
 * */
export const sensorDataLinks = pgTable('sensor_data_links', {
	// Use sensor_data_links for clarity
	nodeId: text()
		.primaryKey()
		.references(() => nodes.id)
		.notNull(),
	connectionId: text()
		.references(() => connections.id)
		.notNull(),
	params: jsonb('params').notNull() // Parameters required by the specific connection for THIS sensor
});

export const sensorDataLinksRelations = relations(
	sensorDataLinks,
	({ one }) => ({
		node: one(nodes, {
			fields: [sensorDataLinks.nodeId],
			references: [nodes.id],
			relationName: 'dataLink'
		}),
		connection: one(connections, {
			fields: [sensorDataLinks.connectionId],
			references: [connections.id],
			relationName: 'linkedSensors'
		})
	})
);

// Zod schemas
export const nodeSelectSchema = createSelectSchema(nodes);
export const nodeInsertSchema = createInsertSchema(nodes);
export const nodeUpdateSchema = createUpdateSchema(nodes);

export const connectionSelectSchema = createSelectSchema(connections);
export const connectionInsertSchema = createInsertSchema(connections);
export const connectionUpdateSchema = createUpdateSchema(connections);

//TODO: infer this from the openapi.json
const openimsSourceSchema = z.object({
	dbSensorId: z.string().optional(),
	dbShipId: z.string().optional()
});

export const sensorDataLinkSelectSchema = createSelectSchema(sensorDataLinks, {
	// Refine schema for known structures
	params: z.union([
		openimsSourceSchema,
		z.object({
			// TODO: Declare other params schemas depending on the connection
		})
	])
});
export const sensorDataLinkInsertSchema = createInsertSchema(sensorDataLinks, {
	params: z.preprocess(
		// Preprocess allows converting input strings to JSON
		(val) => {
			if (typeof val === 'string') {
				try {
					return JSON.parse(val);
				} catch (e) {
					console.warn(`parsing error for value: ${val}, ${e}`);
					return val; // Let Zod validation fail if it's not valid JSON string
				}
			}
			return val; // Pass through if already an object
		},
		z.object({}).passthrough() // Basic validation: must be an object (adjust as needed)
	)
});
export const sensorDataLinkUpdateSchema = createUpdateSchema(sensorDataLinks, {
	params: z.preprocess(
		(val) => {
			if (typeof val === 'string') {
				try {
					return JSON.parse(val);
				} catch (e) {
					console.warn(`parsing error for value: ${val}, ${e}`);
					return val;
				}
			}
			return val;
		},
		z.object({}).passthrough().optional() // Optional for update
	)
});
