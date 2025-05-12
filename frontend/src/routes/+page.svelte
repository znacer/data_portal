<script lang="ts">
	import type { PageProps } from './$types';
	import Treeview from '$lib/components/treeview.svelte';

	let { data }: PageProps = $props();
	let selectedNode = $state(null);
</script>

<div class="card bg-base-100 h-2/3 w-full overflow-auto shadow-sm">
	<div class="card-title bg-base-100 sticky top-0 justify-center shadow">
		Arborescence
	</div>
	<div class="card-body">
		<Treeview root={data.nodes[0]} bind:selectedNode />
	</div>
</div>
