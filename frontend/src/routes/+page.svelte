<script lang="ts">
	import type { PageProps } from './$types';
	import Treeview from '$lib/components/treeview.svelte';
	import NodeDetails from '$lib/components/node_details.svelte';

	let { data }: PageProps = $props();
	let selectedNode = $state(null);
</script>

<div class="flex h-full w-full gap-4">
	<div class="card bg-base-100 h-full w-2/3 overflow-scroll shadow-sm">
		<div
			class="card-title bg-base-100 sticky top-0 z-10 justify-center pb-2 shadow"
		>
			Arborescence
		</div>
		<div class="card-body relative overflow-visible">
			<Treeview data={data.nodes[0]} bind:selectedNode />
		</div>
	</div>
	<div class="card bg-base-100 h-full w-1/3 overflow-scroll shadow-sm">
		<div
			class="card-title bg-base-100 sticky top-0 z-10 justify-center pb-2 shadow"
		>
			Details
		</div>
		<div class="card-body relative overflow-visible">
			{#if selectedNode}
				<NodeDetails {selectedNode} />
			{:else}
				<NodeDetails selectedNode={data.nodes[0]} />
			{/if}
		</div>
	</div>
</div>
