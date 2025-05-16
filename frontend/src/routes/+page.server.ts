import { initDb } from '$lib/server/service/dev';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNodes, getNodeTypes } from '$lib/server/service/nodes';
import { nodeInsertSchema, nodeUpdateSchema } from '$lib/server/db/schema';
import type { NodeUpdate } from '$lib/types';
import { addNode, deleteNode, updateNode } from '$lib/server/crud/nodes';

export const load: PageServerLoad = async () => {
	return {
		nodes: (await getNodes())[0],
		nodeTypes: await getNodeTypes()
	};
};

export const actions = {
	dev: async () => {
		await initDb();
	},
	edit_node: async (event) => {
		const formData = await event.request.formData();

		const editedNode: NodeUpdate = nodeUpdateSchema.parse({
			id: formData.get('id'),
			name: formData.get('name'),
			type: formData.get('type'),
			parentId: formData.get('parentId')
		});
		await updateNode(editedNode);
	},

	add_node: async (event) => {
		const formData = await event.request.formData();
		const newNode = nodeInsertSchema.parse({
			id: formData.get('id'),
			name: formData.get('name'),
			type: formData.get('type'),
			parentId: formData.get('parentId')
		});
		await addNode(newNode);
	},

	delete_node: async (event) => {
		const formData = await event.request.formData();
		const nodeId = formData.get('id')?.toString();
		if (nodeId !== null && nodeId !== undefined && nodeId !== '') {
			await deleteNode(nodeId);
		}
	}
} satisfies Actions;
