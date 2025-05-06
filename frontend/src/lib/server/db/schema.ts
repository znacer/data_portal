import { relations } from 'drizzle-orm';
import { pgTable, text, pgEnum, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { createUpdateSchema } from 'drizzle-zod';
import { createInsertSchema } from 'drizzle-zod';
import { createSelectSchema } from 'drizzle-zod';

export const nodeTypeEnum = pgEnum('type', [
	'SHIP',
	'SYSTEM',
	'SUBSYSTEM',
	'EQUIPMENT',
	'PART',
	'SENSOR'
]);

export const nodes = pgTable('nodes', {
	id: text().primaryKey(),
	name: text().notNull(),
	type: nodeTypeEnum().notNull(),
	parentId: text().references((): AnyPgColumn => nodes.id),
	dbSensorId: text(),
	dbShipId: text()
});

export const nodesRelations = relations(nodes, ({ one, many }) => ({
	parent: one(nodes, {
		fields: [nodes.parentId],
		references: [nodes.id],
		relationName: 'children'
	}),
	children: many(nodes, { relationName: 'children' })
}));

export const nodeSelectSchema = createSelectSchema(nodes);
export const nodeInsertSchema = createInsertSchema(nodes);
export const nodeUpdateSchema = createUpdateSchema(nodes);
