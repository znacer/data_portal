<script lang="ts">
	import type { TreeNode } from '$lib/types';

	let { selectedNode }: { selectedNode: TreeNode } = $props();
</script>

<div class="flex flex-col align-top">
	<p>name: {selectedNode.name}</p>
	<p>id: {selectedNode.id}</p>
	<p>parent: {selectedNode.parentId}</p>
	<p>type: {selectedNode.type}</p>
</div>
