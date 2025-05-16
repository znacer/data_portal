<script lang="ts">
	import type { D3Node } from '$lib/types';
	import {
		Brain,
		BrainCircuit,
		ChevronsLeftRightEllipsis,
		Database,
		ShoppingCart
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	let {
		selectedNode
	}: {
		selectedNode: D3Node;
	} = $props();
</script>

<div class="bg-base-100 border-base-300 flex flex-col gap-2">
	<div class="rounded-box border-base-content/5 bg-base-100 border">
		<table class="table">
			<thead>
				<tr>
					<th>Id</th>
					<th>Nom</th>
					<th>Type</th>
					<th>Parent</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>{selectedNode.data.id}</td>
					<td>{selectedNode.data.name}</td>
					<td>{selectedNode.data.type}</td>
					<td>{selectedNode.data.parentId}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="stats stats-vertical lg:stats-horizontal flex-none shadow-md">
		{@render stat('Bronze', Database, 123)}
		{@render stat('Silver', Brain, 12)}
		{@render stat('Gold', BrainCircuit, 3)}
	</div>
	<div class="flex h-full overflow-auto shadow-md">
		<ul class="list bg-base-100 rounded-box flex-1">
			<li class="p-4 pb-2 text-xs tracking-wide opacity-60">
				List des jeux de données disponibles
			</li>
			{@render dpListElt(
				'Gold',
				'Performances DA 4',
				'DA4: indicateurs de performances'
			)}
			{@render dpListElt('Silver', 'DA 4', 'DA4: données de fonctionnement')}
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as i (i)}
				{@render dpListElt(
					'Bronze',
					`Source ${i}`,
					`DA1: température du cylindre ${i}`
				)}
			{/each}
		</ul>
	</div>
</div>

{#snippet stat(dpType: string, icon: Component, dpSize: number)}
	{@const DpIcon = icon}
	<div class="stats stats-vertical lg:stats-horizontal flex-none shadow-md">
		<div class="stat">
			<div class="stat-title flex justify-around align-middle">
				<DpIcon />
				{dpType}
			</div>
			<div class="stat-value flex justify-center">{dpSize}</div>
		</div>
	</div>
{/snippet}

{#snippet dpListElt(dpType: string, dpTitle: string, dpDescription: string)}
	<li class="list-row">
		<div>
			{#if dpType === 'Gold'}
				<Brain />
			{:else if dpType === 'Silver'}
				<BrainCircuit />
			{:else}
				<Database />
			{/if}
		</div>
		<div>
			<div>{dpTitle}</div>
			<div class="text-xs font-semibold uppercase opacity-60">
				{dpDescription}
			</div>
		</div>
		<button class="btn btn-square btn-ghost">
			<ShoppingCart />
		</button>
		<button class="btn btn-square btn-ghost">
			<ChevronsLeftRightEllipsis />
		</button>
	</li>
{/snippet}
