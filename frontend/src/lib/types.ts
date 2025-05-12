import type { z } from 'zod';
import type {
	connectionInsertSchema,
	connectionSelectSchema,
	connectionTypeEnum,
	connectionUpdateSchema,
	nodeInsertSchema,
	nodeSelectSchema,
	nodeTypeEnum,
	nodeUpdateSchema,
	sensorDataLinkInsertSchema,
	sensorDataLinkSelectSchema,
	sensorDataLinkUpdateSchema
} from './server/db/schema';

export type NodeType = (typeof nodeTypeEnum.enumValues)[number];
export type ConnectionType = (typeof connectionTypeEnum.enumValues)[number];

export type Node = z.infer<typeof nodeSelectSchema>;
export type NodeInsert = z.infer<typeof nodeInsertSchema>;
export type NodeUpdate = z.infer<typeof nodeUpdateSchema>;

export type Connection = z.infer<typeof connectionSelectSchema>;
export type ConnectionInsert = z.infer<typeof connectionInsertSchema>;
export type ConnectionUpdate = z.infer<typeof connectionUpdateSchema>;

export type SensorDataLink = z.infer<typeof sensorDataLinkSelectSchema>;
export type SensorDataLinkInsert = z.infer<typeof sensorDataLinkInsertSchema>;
export type SensorDataLinkUpdate = z.infer<typeof sensorDataLinkUpdateSchema>;

// Augment the Node type to include the joined dataLink relation for convenience
// This is how you'd typically work with the data after a Drizzle join
export type NodeWithLink = Node & {
	dataLink?: SensorDataLink | null; // dataLink relation is optional
	children?: NodeWithLink[]; // Keep the recursive structure if joining children
};
export interface TreeNode extends Node {
	children: TreeNode[];
}
