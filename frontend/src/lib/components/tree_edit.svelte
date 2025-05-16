<script lang="ts">
	import NodeForm from './node_form.svelte';
	import type { D3Node } from '$lib/types';

	let {
		selectedNode = $bindable()
	}: {
		selectedNode: D3Node;
	} = $props();
	let editMode = $state(0);
	let addMode = $state(0);
	let deleteMode = $state(0);

	// if more than 1 mode activated, deactivate all
	$effect(() => {
		if (editMode + addMode + deleteMode > 1) {
			editMode = 0;
			addMode = 0;
			deleteMode = 0;
		}
	});
</script>

<div class="bg-base-100 border-base-300 flex-1 gap-2">
	<div class="flex w-full justify-evenly py-2 shadow-md">
		<button
			class="btn btn-primary"
			disabled={addMode + deleteMode >= 1}
			onclick={() => (editMode = 1 - editMode)}
		>
			Editer
		</button>
		<button
			class="btn btn-secondary"
			disabled={editMode + deleteMode >= 1}
			onclick={() => (addMode = 1 - addMode)}
		>
			Ajouter
		</button>
		<button
			class="btn btn-warning"
			disabled={editMode + addMode >= 1}
			onclick={() => (deleteMode = 1 - deleteMode)}
		>
			Supprimer
		</button>
	</div>
	{#if editMode === 1}
		<NodeForm {selectedNode} />
	{/if}
</div>
