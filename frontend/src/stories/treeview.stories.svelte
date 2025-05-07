<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Treeview from '$lib/components/treeview.svelte';
	import '../app.css';
	// import { fn } from '@storybook/test';
	import { default as mockHierarchy } from '$lib/mocks/dev_tree.json';
	import type { TreeNode } from '$lib/types';

	const { Story } = defineMeta({
		title: 'components/Treeview',
		component: Treeview,
		tags: ['autodocs'],
		parameters: {},
		args: {
			root: mockHierarchy[0] as TreeNode,
			selectedNode: null
		}
	});
</script>

<Story name="default" args={{}} />
