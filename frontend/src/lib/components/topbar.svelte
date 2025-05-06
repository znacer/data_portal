<script lang="ts">
	import { Ellipsis, Moon, Sun } from '@lucide/svelte';
	// import { default as demoNodes } from '$lib/nodes.json';
	// import { createNode } from '$lib/api_client';

	// You can add props or logic here if needed later
	// import { ModeWatcher } from "mode-watcher"; // Example if using mode-watcher for dark mode
	function initiateTree() {
		// demoNodes.forEach((n) => {
		// 	const newNode = {
		// 		id: n.id,
		// 		name: n.name,
		// 		parent_id: n.parent_id,
		// 		db_sensor_id: null,
		// 		db_system_id: null, // Use null explicitly to clear
		// 		node_type: n.type.toUpperCase()
		// 	};
		// 	console.log(newNode);
		// createNode(newNode);
		// });
	}
</script>

<header class="navbar bg-base-100">
	<!-- <ModeWatcher /> Example -->
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/">My App</a>
	</div>
	<div class="flex-none">
		<label class="swap swap-rotate">
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" class="theme-controller hidden" value="business" />

			<!-- sun icon -->
			<Sun class="swap-off size-7 fill-current" />
			<!-- moon icon -->
			<Moon class="swap-on size-7 fill-current" />
		</label>
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<Ellipsis />
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				<li>
					<button onclick={initiateTree} class="justify-between">
						Initiate Tree
						<span class="badge badge-warning">dev</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
</header>
