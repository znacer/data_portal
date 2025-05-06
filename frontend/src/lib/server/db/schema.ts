import { pgTable, text, pgEnum, foreignKey } from 'drizzle-orm/pg-core';
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

export const nodes = pgTable(
	'nodes',
	{
		id: text().primaryKey(),
		name: text().notNull(),
		type: nodeTypeEnum().notNull(),
		parentId: text(),
		dbSensorId: text(),
		dbShipId: text()
	},
	(table) => [
		foreignKey({ columns: [table.parentId], foreignColumns: [table.id] })
	]
);

export const nodeSelectSchema = createSelectSchema(nodes);
export const nodeInsertSchema = createInsertSchema(nodes);
export const nodeUpdateSchema = createUpdateSchema(nodes);
