<script lang="ts">
	import Topbar from '$lib/components/topbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="bg-base-200 flex h-screen flex-col">
	<Topbar />

	<main class="pl-auto flex-1 overflow-hidden p-6">
		{@render children()}
	</main>
</div>
