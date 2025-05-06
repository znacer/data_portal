<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Treeview from '$lib/components/treeview.svelte';
	import '../app.css';
	// import { fn } from '@storybook/test';
	import type { Node } from '$lib/types';

	const mockHierarchy: Node[] = [
		{
			id: '1',
			name: 'Warship',
			node_type: 'Vessel',
			parent_id: null,
			db_sensor_id: null,
			db_system_id: null,
			children: [
				{
					id: '2',
					name: 'Propulsion System',
					node_type: 'System',
					parent_id: '1',
					db_sensor_id: null,
					db_system_id: 'PS123',
					children: [
						{
							id: '3',
							name: 'Main Engine',
							node_type: 'Equipment',
							parent_id: '2',
							db_sensor_id: 'ME456',
							db_system_id: null,
							children: []
						},
						{
							id: '4',
							name: 'Auxiliary Engine',
							node_type: 'Equipment',
							parent_id: '2',
							db_sensor_id: 'AE789',
							db_system_id: null,
							children: []
						}
					]
				},
				{
					id: '5',
					name: 'Navigation System',
					node_type: 'System',
					parent_id: '1',
					db_sensor_id: null,
					db_system_id: 'NS123',
					children: [
						{
							id: '6',
							name: 'GPS',
							node_type: 'Equipment',
							parent_id: '5',
							db_sensor_id: 'GPS456',
							db_system_id: null,
							children: []
						},
						{
							id: '7',
							name: 'Radar',
							node_type: 'Equipment',
							parent_id: '5',
							db_sensor_id: 'RAD789',
							db_system_id: null,
							children: []
						}
					]
				},
				{
					id: '8',
					name: 'Weapon System',
					node_type: 'System',
					parent_id: '1',
					db_sensor_id: null,
					db_system_id: 'WS123',
					children: [
						{
							id: '9',
							name: 'Missile Launcher',
							node_type: 'Equipment',
							parent_id: '8',
							db_sensor_id: 'ML456',
							db_system_id: null,
							children: []
						},
						{
							id: '10',
							name: 'Gun Turret',
							node_type: 'Equipment',
							parent_id: '8',
							db_sensor_id: 'GT789',
							db_system_id: null,
							children: []
						}
					]
				},
				{
					id: '11',
					name: 'Communication System',
					node_type: 'System',
					parent_id: '1',
					db_sensor_id: null,
					db_system_id: 'CS123',
					children: [
						{
							id: '12',
							name: 'Satellite Communication',
							node_type: 'Equipment',
							parent_id: '11',
							db_sensor_id: 'SAT456',
							db_system_id: null,
							children: []
						},
						{
							id: '13',
							name: 'Radio',
							node_type: 'Equipment',
							parent_id: '11',
							db_sensor_id: 'RADIO789',
							db_system_id: null,
							children: []
						}
					]
				}
			]
		}
	];
	const { Story } = defineMeta({
		title: 'components/Treeview',
		component: Treeview,
		tags: ['autodocs'],
		parameters: {},
		args: {
			nodes: mockHierarchy,
			selectedNode: null,
			onSelectNode: () => {}
		}
	});
</script>

<Story name="default" args={{}} />
