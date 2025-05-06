import { db } from '$lib/server/db';
import { nodes } from '$lib/server/db/schema';

export async function fetchNodes() {
	return await db.select().from(nodes);
}
