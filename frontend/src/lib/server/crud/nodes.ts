import { db } from '$lib/server/db';
import {
	nodeInsertSchema,
	nodes,
	nodeTypeEnum,
	nodeUpdateSchema
} from '$lib/server/db/schema';
import type { NodeInsert, NodeUpdate, TreeNode } from '$lib/types';
import { eq } from 'drizzle-orm';

export async function fetchNodes() {
	// return await db.select().from(nodes);
	return await db.query.nodes.findMany({
		with: {
			children: true
		}
	});
}

export async function addNode(newNode: NodeInsert) {
	const payload = nodeInsertSchema.parse({
		...newNode,
		type: newNode.type.toUpperCase()
	});
	try {
		const response = db
			.insert(nodes)
			.values(payload)
			.onConflictDoNothing()
			.returning();
		return response;
	} catch (error) {
		console.error(`Add Node error: ${error}`);
	}
}

export async function updateNode(updatedNode: NodeUpdate) {
	const payload = nodeUpdateSchema.parse({
		...updatedNode,
		type: updatedNode.type?.toUpperCase(),
		parentId: updatedNode.parentId === '' ? null : updatedNode.parentId
	});

	if (payload.id !== undefined) {
		try {
			const response = await db
				.update(nodes)
				.set(payload)
				.where(eq(nodes.id, payload.id))
				.returning();
			console.info(`updated node ${response}`);
		} catch (error) {
			console.error(`Update Node error: ${error}`);
		}
	} else {
		console.warn('Tried to update a node without specifying the id');
	}
}

export async function deleteNode(nodeId: string) {
	try {
		const response = await db
			.delete(nodes)
			.where(eq(nodes.id, nodeId))
			.returning();
		console.info(`deleted node ${response}`);
	} catch (error) {
		console.error(`Update Node error: ${error}`);
	}
}

export async function buildTreeFromFlatNodes(): Promise<TreeNode[]> {
	// 1. Fetch all nodes
	const allNodes = await db.query.nodes.findMany();

	if (!allNodes.length) {
		return [];
	}

	// 2. Create a map for easy lookup and to attach children
	const nodeMap = new Map<string, TreeNode>();

	// Initialize each node in the map and add a children array
	allNodes.forEach((node) => {
		nodeMap.set(node.id, { ...node, children: [] });
	});

	const tree: TreeNode[] = [];

	// 3. Iterate and build the tree structure
	allNodes.forEach((node) => {
		const treeNode = nodeMap.get(node.id)!; // We know it's there
		if (node.parentId && nodeMap.has(node.parentId)) {
			// If it has a parent, add it to the parent's children array
			const parentNode = nodeMap.get(node.parentId)!;
			parentNode.children.push(treeNode);
		} else {
			// If it has no parent (or parentId doesn't exist in the map, which shouldn't happen with FKs),
			// it's a root node
			tree.push(treeNode);
		}
	});

	return tree;
}

export async function fetchNodeTypes(): Promise<string[]> {
	return nodeTypeEnum.enumValues.map((v) => v.toString());
}
