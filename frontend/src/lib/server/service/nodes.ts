import { buildTreeFromFlatNodes, fetchNodeTypes } from '../crud/nodes';

export async function getNodes() {
	return await buildTreeFromFlatNodes();
}
export async function getNodeTypes() {
	return await fetchNodeTypes();
}
