<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Topbar from '$lib/components/topbar.svelte';
	import '../app.css';
	// import { fn } from '@storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'components/Topbar',
		component: Topbar,
		// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
		tags: ['autodocs'],
		parameters: {
			// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
			// layout: 'fullscreen'
		},
		args: {}
	});
</script>

<Story name="default" args={{}} />
