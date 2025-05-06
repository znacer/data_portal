export interface Node {
	id: string;
	name: string;
	node_type: string;
	parent_id: string | null;
	db_sensor_id: string | null;
	db_system_id: string | null;
	children: Node[];
}
