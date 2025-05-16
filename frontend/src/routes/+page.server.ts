import { initDb } from '$lib/server/service/dev';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNodes, getNodeTypes } from '$lib/server/service/nodes';

export const load: PageServerLoad = async () => {
	return {
		nodes: (await getNodes())[0],
		nodeTypes: await getNodeTypes()
	};
};

export const actions = {
	dev: async () => {
		await initDb();
	}
} satisfies Actions;
