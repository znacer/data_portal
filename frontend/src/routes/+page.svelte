<script lang="ts">
	import type { PageProps } from './$types';
	import Treeview from '$lib/components/treeview.svelte';

	let { data }: PageProps = $props();
	let selectedNode = $state(null);
</script>

<Treeview root={data.nodes[0]} {selectedNode} onSelectNode={() => {}} />
