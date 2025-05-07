import type { z } from 'zod';
import type { nodeSelectSchema } from './server/db/schema';

export type Node = z.infer<typeof nodeSelectSchema>;

export interface TreeNode extends Node {
	children: TreeNode[];
}
