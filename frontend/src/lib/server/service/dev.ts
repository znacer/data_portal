import { default as devNodes } from '$lib/server/dev.json';
import { addNode } from '../crud/nodes';

export async function initDb() {
	devNodes.forEach((n) => {
		addNode(n);
	});
}
