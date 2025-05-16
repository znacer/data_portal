<script lang="ts">
	import Tabs from '$lib/components/ui/tabs.svelte';
	import type { D3Node } from '$lib/types';
	import NodeInfo from './node_info.svelte';
	import TreeEdit from './tree_edit.svelte';

	let {
		selectedNode = $bindable()
	}: {
		selectedNode: D3Node;
	} = $props();

	const tabTitles = ['Info', "Edition de l'arbre"];
</script>

<Tabs titles={tabTitles} contentSnippets={[info, editor]} />

{#snippet info()}
	<NodeInfo {selectedNode} />
{/snippet}

{#snippet editor()}
	<TreeEdit {selectedNode} />
{/snippet}
