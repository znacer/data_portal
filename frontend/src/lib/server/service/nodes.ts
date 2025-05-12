import { buildTreeFromFlatNodes } from '../crud/nodes';

export async function getNodes() {
	return await buildTreeFromFlatNodes();
}
