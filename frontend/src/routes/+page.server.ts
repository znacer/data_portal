import { initDb } from '$lib/server/service/dev';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getNodes } from '$lib/server/service/nodes';

export const load: PageServerLoad = async () => {
	return {
		nodes: await getNodes()
	};
};

export const actions = {
	dev: async () => {
		await initDb();
	}
} satisfies Actions;
