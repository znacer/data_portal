<script lang="ts">
	import type { Node, TreeNode } from '$lib/types';
	import Treeview from '$lib/components/treeview.svelte';
	import { ChevronDown, ChevronRight } from '@lucide/svelte';

	let {
		root,
		selectedNode,
		onSelectNode
	}: {
		root: TreeNode;
		selectedNode: Node | null;
		onSelectNode: (node: TreeNode) => void; // Callback to update parent state
	} = $props();

	// Local, non-reactive state for expansion toggles
	let expanded: Record<string, boolean> = $state({});
	root.children?.forEach((n) => {
		expanded[n.id] = true;
	});
	function toggleExpand(nodeId: string) {
		expanded[nodeId] = !expanded[nodeId];
	}
	const handleClick = (e: Event) => {
		e.stopPropagation();
		toggleExpand(root.id);
	};

	// Derive the selected ID directly from the selectedNode prop
	let currentSelectedId = $derived(selectedNode?.id ?? null);
</script>

<ul class="mx-2">
	<div
		class="flex cursor-pointer items-center rounded-xl"
		class:font-bold={currentSelectedId === root.id}
		class:bg-info={currentSelectedId === root.id}
		class:text-info-content={currentSelectedId === root.id}
		onclick={() => onSelectNode(root)}
		role="button"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'ENTER' || e.key === ' ') onSelectNode(root);
		}}
	>
		{#if root.children && root.children.length > 0}
			<button
				class="mr-2 w-4 text-center text-xs focus:outline-none"
				onclick={handleClick}
				aria-label={expanded[root.id]
					? `Collapse ${root.name}`
					: `Expand ${root.name}`}
				aria-expanded={expanded[root.id]}
			>
				{#if !expanded[root.id]}
					<ChevronDown class="size-5" />
				{:else}
					<ChevronRight class="size-5" />
				{/if}
			</button>
		{:else}
			<span class="mr-1 inline-block w-4"></span>
		{/if}
		<p class="text-base-content">
			{root.name} <span class="text-base-content/50">({root.type})</span>
		</p>
	</div>
	{#if root.children && root.children.length > 0 && !expanded[root.id]}
		{#each root.children as node (node.id)}
			<li>
				<Treeview root={node} {selectedNode} {onSelectNode} />
			</li>
		{/each}
	{/if}
</ul>
