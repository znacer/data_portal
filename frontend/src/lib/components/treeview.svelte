<script lang="ts">
	import * as d3 from 'd3';
	import type { TreeNode } from '$lib/types';

	let {
		data,
		selectedNode = $bindable()
	}: {
		data: TreeNode;
		selectedNode: TreeNode | null;
	} = $props();

	const numCol = 3;
	const transitionDuration = 750;
	let width = $state(600);
	let height = $state(600);

	// d3 format function
	const format = d3.format(',d');

	type d3Node = d3.HierarchyRectangularNode<TreeNode> & {
		target?: d3.HierarchyRectangularNode<TreeNode>['target'];
	};
	// Compute the color scale. Handle potential null data initially.
	let color = $derived(
		data && data.children
			? d3.scaleOrdinal(
					d3.quantize(d3.interpolateWarm, data.children.length + 1)
				)
			: null
	);

	// Compute the hierarchy layout. Handle potential null data initially.
	let hierarchy = $derived(
		data
			? d3
					.hierarchy(data)
					.sum((d) => (d.children && d.children.length > 0 ? 0 : 1))
					.sort((a, b) => b.height - a.height)
			: null
	);

	// Compute the partition layout. Handle potential null hierarchy initially.
	let root = $derived(
		hierarchy
			? d3
					.partition<TreeNode>()
					.size([height, ((hierarchy.height + 1) * width) / numCol])(hierarchy)
			: null
	);

	// State for the currently "selected" or zoomed partition node in the visualization layout
	let selectedRect = $state<d3.HierarchyRectangularNode<TreeNode> | null>(null);

	// References to DOM elements obtained via bind:this
	let vis: HTMLDivElement | undefined = $state();
	let svg: SVGSVGElement | undefined = $state();

	// Effect to set initial selectedRect when root is first computed
	$effect(() => {
		if (root && !selectedRect) {
			selectedRect = root;
			selectedNode = root.data;
		}
	});

	// Helper functions for D3 transitions - now these need to work with 'target' coordinates
	// We'll attach 'target' coordinates to the data nodes within the transition effect
	function rectHeight(d: d3Node) {
		return (
			d.target.x1 - d.target.x0 - Math.min(1, (d.target.x1 - d.target.x0) / 2)
		);
	}

	function labelVisible(d: d3Node) {
		// Check if the label would be visible within the *target* viewport dimensions (width, height)
		return (
			d.target.y1 <= width && d.target.y0 >= 0 && d.target.x1 - d.target.x0 > 16
		);
	}

	// Effect to handle D3 transitions when selectedRect changes
	$effect(() => {
		if (!selectedRect || !svg || !root) return;

		const p = selectedRect; // The new node to focus on

		root.each(
			(d: d3Node) =>
				(d.target = {
					x0: ((d.x0 - p.x0) / (p.x1 - p.x0)) * height,
					x1: ((d.x1 - p.x0) / (p.x1 - p.x0)) * height,
					y0: d.y0 - p.y0,
					y1: d.y1 - p.y0
				})
		);

		const cells = d3
			.select(svg)
			.selectAll<SVGGElement, d3.HierarchyRectangularNode<TreeNode>>('g.cell')
			.data(root.descendants()); // Use the id as the key

		// Animate the group transform using the target coordinates
		cells
			.transition()
			.duration(transitionDuration)
			.attr(
				'transform',
				(d: d3Node) => `translate(${d.target.y0},${d.target.x0})`
			);
		// Animate the rect height using the helper function with target coordinates
		cells
			.select('rect')
			.transition()
			.duration(transitionDuration)
			.attr('height', (d: d3Node) => rectHeight(d));

		// Animate text opacity based on target visibility
		cells
			.select('text')
			.transition()
			.duration(transitionDuration)
			.attr('fill-opacity', (d) => +labelVisible(d)); // Cast needed

		// Animate the second tspan (the value) opacity specifically
		cells
			.select('text')
			.select('tspan:nth-child(2)')
			.transition()
			.duration(transitionDuration)
			.attr('fill-opacity', (d) => (labelVisible(d) ? 0.7 : 0));
	});

	// Click handler for the rects and breadcrumbs
	// Needs to update the selectedRect state variable
	function clicked(
		event: MouseEvent,
		p: d3.HierarchyRectangularNode<TreeNode>
	) {
		event.stopPropagation();

		// Cannot click on the root itself to zoom out further
		if (p.parent === null && selectedRect === p) {
			return;
		}

		// If clicking the currently selected node, zoom out to its parent. Otherwise, zoom into the clicked node.
		selectedRect = selectedRect === p ? (p = p.parent!) : p;
		selectedNode = selectedRect.data;
		// The $effect above will react to the change in selectedRect and trigger the D3 transition
	}
</script>

<div class="flex h-full flex-col">
	<!-- Breadcrumbs -->
	<div class="breadcrumbs bg-base-200 mb-2 h-10 px-2 text-sm">
		<ul>
			{#if selectedRect}
				<!-- Ensure selectedRect is not null before iterating -->
				{#each selectedRect.ancestors().reverse() as parent (parent.data.id)}
					<!-- Use node id as key for list items -->
					<li>
						<!-- Clicking a breadcrumb zooms out to that level -->
						<button onclick={(e) => clicked(e, parent)}>
							{parent.data.name}
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	</div>

	<!-- Container for the SVG, dimensions are bound -->
	<div
		id="vis"
		bind:this={vis}
		bind:clientHeight={height}
		bind:clientWidth={width}
		class="grow"
	>
		<!-- Render SVG only when D3 root and color scale are ready -->
		{#if root && color}
			<svg
				bind:this={svg}
				viewBox="0 0 {width} {height}"
				{width}
				{height}
				style="max-width: 100%; height: auto; font: 10px sans-serif;"
			>
				<!-- Loop through all nodes in the partition layout -->
				{#each root.descendants() as d (d.data.id)}
					<!-- Group element for each node -->
					<g class="cell" transform="translate({d.y0},{d.x0})">
						<!-- Rectangle element for the partition tile -->
						<rect
							width={width / numCol - 1}
							height={d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2)}
							fill-opacity="0.6"
							fill={d.depth
								? d.depth > 1
									? d.parent
										? color(d.parent.data.name)
										: '#ccc'
									: color(d.data.name)
								: '#ccc'}
							style="cursor: pointer;"
							onclick={(e) => clicked(e, d)}
						></rect>

						<!-- Text element for node label and value -->
						<text
							style="user-select: none;"
							fill="var(--color-base-content)"
							pointer-events="none"
							x="4"
							y="16"
							font-size="16"
							fill-opacity={+labelVisible({
								...d,
								target: d
							})}
						>
							<tspan>{d.data.name}</tspan>
							<tspan
								fill-opacity={labelVisible({
									...d,
									target: d
								})
									? 0.7
									: 0}
							>
								{format(d.value ?? 0)}</tspan
							>
						</text>

						<!-- Title for tooltip -->
						<title
							>{d
								.ancestors()
								.map((a) => a.data.name)
								.reverse()
								.join('/')}\n{format(d.value ?? 0)}</title
						>
					</g>
				{/each}
			</svg>
		{/if}
	</div>
</div>
