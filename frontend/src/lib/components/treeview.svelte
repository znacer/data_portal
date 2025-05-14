<script lang="ts">
	import * as d3 from 'd3';
	import type { TreeNode } from '$lib/types';
	import { onMount } from 'svelte';

	let {
		data,
		selectedNode = $bindable()
	}: {
		data: TreeNode;
		selectedNode: TreeNode | null;
	} = $props();

	let width = $state(600);
	let height = $state(600);

	// Create the color scale.
	let color = $derived(
		d3.scaleOrdinal(d3.quantize(d3.interpolateWarm, data.children.length + 1))
	);

	// Compute the layout.
	let hierarchy = $derived(
		d3
			.hierarchy(data)
			.sum((d) => (d.children.length == 0 ? 1 : 0)) // define the size of each tile
			.sort((a, b) => b.height - a.height)
	);
	let root = $derived(
		d3
			.partition<TreeNode>()
			.size([height, ((hierarchy.height + 1) * width) / 3])(hierarchy)
	);
	let selectedRect = $state(root); // TODO: useContext

	let vis: HTMLDivElement | undefined = $state();
	function redraw() {
		if (vis === undefined) return;
		d3.select(vis).html(null);
		// Specify the chart’s dimensions.

		const svg = d3
			.select(vis)
			.append('svg')
			.attr('viewBox', [0, 0, width, height])
			.attr('width', width)
			.attr('height', height)
			.attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

		// Append cells.
		const cell = svg
			.selectAll('g')
			.data(root.descendants())
			.join('g')
			.attr('transform', (d) => `translate(${d.y0},${d.x0})`);

		const rect = cell
			.append('rect')
			.attr('width', (d) => d.y1 - d.y0 - 1)
			.attr('height', (d) => rectHeight(d))
			.attr('fill-opacity', 0.6)
			.attr('fill', (d) => {
				if (!d.depth) {
					return '#ccc';
				}
				while (d.depth > 1) {
					if (d.parent === null) {
						return color(d.data.name);
					}
					d = d.parent;
				}
				return color(d.data.name);
			})
			.style('cursor', 'pointer')
			.on('click', clicked);

		const text = cell
			.append('text')
			.style('user-select', 'none')
			.attr('fill', 'var(--color-base-content)')
			.attr('pointer-events', 'none')
			.attr('x', 4)
			.attr('y', 13)
			.attr('fill-opacity', (d) => +labelVisible(d));

		text.append('tspan').text((d) => `${d.data.name}`);

		const format = d3.format(',d');
		const tspan = text
			.append('tspan')
			.attr('fill-opacity', (d) => (labelVisible(d) ? 0.7 : 0))
			.text((d) => ` ${format(d.value ?? 0)}`);

		cell.append('title').text(
			(d) =>
				`${d
					.ancestors()
					.map((d) => d.data.name)
					.reverse()
					.join('/')}\n${format(d.value ?? 0)}`
		);

		// On click, change the focus and transitions it into view.
		selectedRect = root;
		function clicked(event: Event, p: d3.HierarchyRectangularNode<TreeNode>) {
			if (p.parent === null) return;
			selectedRect = selectedRect === p ? (p = p.parent) : p;
			selectedNode = selectedRect.data;

			root.each(
				(d) =>
					(d.target = {
						x0: ((d.x0 - p.x0) / (p.x1 - p.x0)) * height,
						x1: ((d.x1 - p.x0) / (p.x1 - p.x0)) * height,
						y0: d.y0 - p.y0,
						y1: d.y1 - p.y0
					})
			);

			const t = cell
				.transition()
				.duration(750)
				.attr('transform', (d) => `translate(${d.target.y0},${d.target.x0})`);

			rect.transition(t).attr('height', (d) => rectHeight(d.target));
			text.transition(t).attr('fill-opacity', (d) => +labelVisible(d.target));
			tspan
				.transition(t)
				.attr('fill-opacity', (d) => (labelVisible(d.target) ? 0.7 : 0));
		}

		function rectHeight(d: d3.HierarchyRectangularNode<TreeNode>) {
			return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
		}

		function labelVisible(d: d3.HierarchyRectangularNode<TreeNode>) {
			return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
		}
	}
	onMount(() => {
		redraw();
		window.addEventListener('resize', redraw);
	});
	// });
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each selectedRect.ancestors().reverse() as parent, i (i)}
			<li>
				<button>
					{parent.data.name}
				</button>
			</li>
		{/each}
	</ul>
</div>
<div
	id="vis"
	bind:this={vis}
	bind:clientHeight={height}
	bind:clientWidth={width}
	class="h-full"
></div>
