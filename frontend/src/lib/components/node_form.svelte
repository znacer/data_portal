<script lang="ts">
	import type { D3Node, TreeNode } from '$lib/types';
	import { getContext } from 'svelte';

	let {
		selectedNode
	}: {
		selectedNode: D3Node;
	} = $props();

	let hierarchy: d3.HierarchyRectangularNode<TreeNode> =
		getContext('hierarchy');
	let nodeTypes: string[] = getContext('nodeTypes');
</script>

<form class="flex w-full flex-col align-top">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Noeud</legend>
		<label class="input">
			<span class="label">id </span>
			<input type="text" value={selectedNode.data.id} disabled />
		</label>
		<label class="input">
			<span class="label"> name </span>
			<input type="text" value={selectedNode.data.name} />
		</label>
		<label class="select">
			<span class="label"> parentId </span>
			<select class="select">
				<option disabled selected>
					{selectedNode.data.parentId}
				</option>
				{#each hierarchy.descendants() as d, i (i)}
					{#if selectedNode
						.descendants()
						.findIndex((sd) => sd.id === d.id) !== -1}
						<option>
							{d.data.name}
						</option>
					{/if}
				{/each}
			</select>
		</label>
		<label class="select">
			<span class="label"> type </span>
			<select class="select">
				<option disabled selected>
					{selectedNode.data.type}
				</option>
				{#each nodeTypes as typeOption, i (i)}
					<option>
						{typeOption}
					</option>
				{/each}
			</select>
		</label>
	</fieldset>
</form>
