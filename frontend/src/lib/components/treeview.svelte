<script lang="ts">
	import * as echarts from 'echarts';
	import type { TreeNode } from '$lib/types';

	let {
		root,
		selectedNode = $bindable()
	}: {
		root: TreeNode;
		selectedNode: string | null;
	} = $props();

	function charts(node: HTMLDivElement, option: echarts.EChartsOption) {
		const chart = echarts.init(node);
		chart.setOption(option);
		chart.on('click', (params) => {
			if (params.componentType === 'series') {
				selectedNode = params.data.id;
			}
		});
	}

	let option: echarts.EChartsOption = {
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove'
		},
		series: [
			{
				type: 'tree',
				id: 0,
				name: 'tree1',
				data: [root],

				top: '10%',
				left: '8%',
				bottom: '22%',
				right: '20%',

				symbolSize: 12,

				edgeShape: 'polyline',
				edgeForkPosition: '33%',
				initialTreeDepth: 1,

				lineStyle: {
					width: 2
				},

				label: {
					backgroundColor: '#fff',
					position: 'left',
					verticalAlign: 'middle',
					align: 'right'
				},

				leaves: {
					label: {
						position: 'right',
						verticalAlign: 'middle',
						align: 'left'
					}
				},

				emphasis: {
					focus: 'descendant'
				},

				expandAndCollapse: true,
				animationDuration: 550,
				animationDurationUpdate: 750
			}
		]
	};
</script>

<div use:charts={option} class="h-full w-full"></div>
