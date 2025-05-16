<script lang="ts">
	import NodeForm from './node_form.svelte';
	import type { Node, D3Node } from '$lib/types';

	let {
		selectedNode = $bindable()
	}: {
		selectedNode: D3Node;
	} = $props();
	let editMode = $state(0);
	let addMode = $state(0);
	const defaultNode = {
		id: 'nouvel identifiant',
		name: 'nouveau noeud',
		type: 'SHIP',
		parentId: ''
	} as Node;
	let deleteMode = $state(0);
	let deleteId = $state('');

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
		<form
			class="flex w-full flex-col align-top"
			method="POST"
			action="/?/edit_node"
		>
			<NodeForm
				selectedNode={selectedNode.data}
				descendants={selectedNode.descendants()}
			/>
			<button class="btn btn-accent">Enregistrer</button>
		</form>
	{/if}
	{#if addMode === 1}
		<form
			class="flex w-full flex-col align-top"
			method="POST"
			action="/?/add_node"
		>
			<NodeForm selectedNode={defaultNode} descendants={[]} />
			<button class="btn btn-accent">Enregistrer</button>
		</form>
	{/if}
	{#if deleteMode === 1}
		<form
			class="mt-4 flex w-full flex-col align-top"
			method="POST"
			action="/?/delete_node"
		>
			<fieldset class="fieldset">
				<p>
					Renseigner l'identifiant du noeud
					<strong>{selectedNode.data.id}</strong> pour confirmer :
				</p>
				<label class="input">
					<span class="label">id </span>
					<input type="text" name="id" bind:value={deleteId} />
				</label>
				<button
					class="btn btn-accent"
					disabled={deleteId !== selectedNode.data.id}
				>
					Enregistrer
				</button>
			</fieldset>
		</form>
	{/if}
</div>
