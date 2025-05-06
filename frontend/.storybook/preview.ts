import type { Preview } from '@storybook/svelte';
import DocumentationTemplate from './DocumentationTemplate.mdx';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		docs: {
			toc: true,
			page: DocumentationTemplate
		}
	},
	tags: ['autodocs']
};

export default preview;
