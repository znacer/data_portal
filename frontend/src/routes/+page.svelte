<script lang="ts">
	import type { PageProps } from './$types';
	import Treeview from '$lib/components/treeview.svelte';
	import NodeDetails from '$lib/components/node_details.svelte';
	import { setContext } from 'svelte';
	import * as d3 from 'd3';

	let { data }: PageProps = $props();
	setContext(
		'hierarchy',
		d3
			.hierarchy(data.nodes)
			.sum((d) => (d.children && d.children.length > 0 ? 0 : 1))
			.sort((a, b) => b.height - a.height)
	);
	setContext('nodeTypes', data.nodeTypes);
	let selectedNode = $state(null);
</script>

<div class="flex h-full w-full gap-4">
	<div class="card bg-base-100 w-2/3 grow overflow-scroll shadow-sm">
		<div
			class="card-title bg-base-100 sticky top-0 z-10 justify-center pb-2 shadow"
		>
			Arborescence
		</div>
		<div class="card-body relative overflow-visible">
			<Treeview bind:selectedNode />
		</div>
	</div>
	<div class="flex w-1/3 grow flex-col gap-4">
		<div class="card bg-base-100 min-h-1/2 grow shadow-sm">
			<div
				class="card-title bg-base-100 sticky top-0 z-10 justify-center pb-2 shadow"
			>
				Details
			</div>
			<div class="card-body flex flex-1 overflow-scroll">
				{#if selectedNode}
					<NodeDetails {selectedNode} />
				{:else}
					<!-- <NodeDetails selectedNode={data.[0]} /> -->
				{/if}
			</div>
		</div>
	</div>
</div>
