<script lang="ts">
	import { Ellipsis, Moon, Sun } from '@lucide/svelte';
</script>

<header class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/">My App</a>
	</div>
	<div class="flex-none">
		<label class="swap swap-rotate">
			<input type="checkbox" class="theme-controller hidden" value="business" />

			<Sun class="swap-off size-7 fill-current" />
			<Moon class="swap-on size-7 fill-current" />
		</label>
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<Ellipsis />
			</div>
			<ul
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
			>
				<li>
					<form method="POST" action="/?/dev">
						<button type="submit" class="justify-between">
							Initiate Tree
							<span class="badge badge-warning">dev</span>
						</button>
					</form>
				</li>
			</ul>
		</div>
	</div>
</header>
