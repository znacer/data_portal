<script lang="ts">
	import type { Node } from '$lib/types';
	import Treeview from '$lib/components/treeview.svelte';
	import { ChevronDown, ChevronRight } from '@lucide/svelte';

	let {
		nodes,
		selectedNode,
		onSelectNode
	}: {
		nodes: Node[];
		selectedNode: Node | null;
		onSelectNode: (node: Node) => void; // Callback to update parent state
	} = $props();

	// Local, non-reactive state for expansion toggles
	let expanded: Record<string, boolean> = $state({});
	nodes.forEach((n) => {
		expanded[n.id] = true;
	});
	function toggleExpand(nodeId: string) {
		expanded[nodeId] = !expanded[nodeId];
	}

	// Derive the selected ID directly from the selectedNode prop
	let currentSelectedId = $derived(selectedNode?.id ?? null);
</script>

<ul class="ml-4 list-none">
	{#each nodes as node (node.id)}
		<li>
			<div
				class="flex cursor-pointer items-center rounded-xl"
				class:font-bold={currentSelectedId === node.id}
				class:bg-info={currentSelectedId === node.id}
				class:text-info-content={currentSelectedId === node.id}
				onclick={() => onSelectNode(node)}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === '' || e.key === ' ') onSelectNode(node);
				}}
			>
				{#if node.children && node.children.length > 0}
					<button
						class="mr-2 w-4 text-center text-xs focus:outline-none"
						onclick={(e) => {
							e.stopPropagation();
							toggleExpand(node.id);
						}}
						aria-label={expanded[node.id] ? `Collapse ${node.name}` : `Expand ${node.name}`}
						aria-expanded={expanded[node.id]}
					>
						{#if expanded[node.id]}
							<ChevronDown class="size-5" />
						{:else}
							<ChevronRight class="size-5" />
						{/if}
						<!-- {expanded[node.id] ? '[-]' : '[+]'} -->
					</button>
				{:else}
					<!-- Placeholder for consistent spacing -->
					<span class="mr-1 inline-block w-4"></span>
				{/if}
				<span>
					{node.name}
					<span class="text-info-content/50 text-xs">({node.node_type})</span>
				</span>
			</div>

			{#if node.children && node.children.length > 0 && expanded[node.id]}
				<!-- Recursive Call: Pass props down -->
				<Treeview nodes={node.children} {selectedNode} {onSelectNode} />
			{/if}
		</li>
	{/each}
</ul>
