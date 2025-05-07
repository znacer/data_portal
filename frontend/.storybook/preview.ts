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
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo'
		}
	},
	tags: ['autodocs'],
	initialGlobals: {
		dataTheme: 'corporate'
	}
};

export default preview;
