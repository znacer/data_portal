<script lang="ts">
	import type { D3Node, Node, TreeNode } from '$lib/types';
	import { getContext } from 'svelte';

	let {
		selectedNode = $bindable(),
		descendants = []
	}: {
		selectedNode: Node;
		descendants?: D3Node[];
	} = $props();

	let hierarchy: d3.HierarchyRectangularNode<TreeNode> =
		getContext('hierarchy');
	let nodeTypes: string[] = getContext('nodeTypes');
</script>

<!-- <form class="flex w-full flex-col align-top"> -->
<fieldset class="fieldset">
	<legend class="fieldset-legend">Noeud</legend>
	<label class="input">
		<span class="label">id </span>
		<input type="text" value={selectedNode.id} disabled />
		<input name="id" type="text" value={selectedNode.id} hidden />
	</label>
	<label class="input">
		<span class="label"> name </span>
		<input name="name" type="text" value={selectedNode.name} />
	</label>
	<label class="select">
		<span class="label"> parentId </span>
		<select name="parentId" class="select">
			<option selected>
				{selectedNode.parentId}
			</option>
			{#each hierarchy.descendants() as d, i (i)}
				{#if descendants.length === 0 || descendants.findIndex((sd) => sd.id === d.id) !== -1}
					<option>
						{d.data.id}
					</option>
				{/if}
			{/each}
		</select>
	</label>
	<label class="select">
		<span class="label"> type </span>
		<select name="type" class="select">
			<option selected>
				{selectedNode.type}
			</option>
			{#each nodeTypes as typeOption, i (i)}
				<option>
					{typeOption}
				</option>
			{/each}
		</select>
	</label>
</fieldset>
<!-- </form> -->
