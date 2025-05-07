import { default as devNodes } from '$lib/server/dev.json';
import { addNode } from '../crud/nodes';

export async function initDb() {
	devNodes.forEach((n) => {
		const newNode = {
			name: n.name,
			type: n.node_type,
			parentId: n.parent_id,
			dbSensorId: null,
			dbShipId: null,
			id: n.id
		};
		addNode(newNode);
	});
}
