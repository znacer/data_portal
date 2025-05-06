import type { z } from 'zod';
import type { nodeSelectSchema } from './server/db/schema';

export interface Node {
	id: string;
	name: string;
	node_type: string;
	parent_id: string | null;
	db_sensor_id?: string | null;
	db_system_id?: string | null;
	children?: Node[];
}

export interface TreeNode extends z.infer<typeof nodeSelectSchema> {
	children: TreeNode[];
}
