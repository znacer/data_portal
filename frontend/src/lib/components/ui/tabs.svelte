<script lang="ts">
	import type { Snippet } from 'svelte';

	// --- Props ---
	let {
		titles,
		contentSnippets
	}: { titles: string[]; contentSnippets: Snippet[] } = $props();

	// --- State ---
	let activeIndex = $state(0);

	// --- Lifecycle/Logic ---
	$effect(() => {
		if (titles.length !== contentSnippets.length) {
			console.warn(
				'Tabs component: The number of titles and content snippets do not match.'
			);
		}
		if (activeIndex >= titles.length) {
			activeIndex = Math.max(0, titles.length - 1);
		}
	});

	// --- Accessibility helper functions ---
	const componentId = Math.random().toString(36).substring(2, 10);

	function getTabId(index: number): string {
		return `tab-${componentId}-${index}`;
	}

	function getPanelId(index: number): string {
		return `panel-${componentId}-${index}`;
	}
</script>

<div class="flex h-full flex-col content-start gap-2">
	<!-- Tab Headers -->
	<div
		class="border-base-200 bg-base-100 z-10 flex flex-none border-b"
		role="tablist"
		aria-label="Tabs"
	>
		{#each titles as title, index (index)}
			<!-- Check if a corresponding snippet exists for this title -->
			{#if contentSnippets[index]}
				<button
					id={getTabId(index)}
					aria-controls={getPanelId(index)}
					aria-selected={activeIndex === index}
					tabindex={activeIndex === index ? 0 : -1}
					role="tab"
					class="flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none"
					class:text-info-content={activeIndex === index}
					class:bg-info={activeIndex === index}
					class:border-b-2={activeIndex === index}
					class:border-info={activeIndex === index}
					class:text-base-content={activeIndex !== index}
					class:hover:text-info={activeIndex !== index}
					onclick={() => {
						activeIndex = index;
					}}
					type="button"
				>
					{title}
				</button>
			{:else}
				<button
					id={getTabId(index)}
					aria-controls={getPanelId(index)}
					role="tab"
					disabled
					class="text-base-400 cursor-not-allowed px-4 py-2 text-sm font-medium"
					type="button"
				>
					{title} (Content Missing)
				</button>
			{/if}
		{/each}
	</div>

	<!-- Tab Content -->
	<!-- <div class="mt-4 flex-1"> -->
	{#if contentSnippets[activeIndex]}
		<div
			id={getPanelId(activeIndex)}
			aria-labelledby={getTabId(activeIndex)}
			role="tabpanel"
			tabindex="0"
			class="border-base-200 flex overflow-auto rounded-r-md rounded-b-md border p-4"
		>
			{@render contentSnippets[activeIndex]()}
		</div>
	{:else if titles.length > 0}
		<div class="p-4 text-gray-500 italic">Selected tab content not found.</div>
	{:else}
		<div class="p-4 text-gray-500 italic">No tabs defined.</div>
	{/if}
	<!-- </div> -->
</div>
