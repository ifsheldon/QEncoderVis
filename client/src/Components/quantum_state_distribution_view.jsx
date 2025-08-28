import { useEffect } from "react";
import * as d3 from "d3";

function QuantumStateDistributionView(props) {
	// dataset
	const dataset = props.dataset;

	const onHoverIndex = props.onHoverIndex;

	const width = props.width;
	const height = props.height;
	const left = props.left;
	const top = props.top;

	// Colors
	const [class_color, color_quantum_distribution_bg] = props.colors;

	// Re-render whenever dataset changes
	useEffect(() => {
		if (!dataset || dataset.length === 0) return;
		const svg = d3.select("#quantum_state_distribution_view");
		// clear previous points
		svg.selectAll("circle.data-point").remove();

		// Define margins and inner dimensions
		const margin = { top: 20, right: 25, bottom: 20, left: 25 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		// Compute x and y extents from the distribution_data
		const xExtent = d3.extent(dataset, (d) => d.x);
		const yExtent = d3.extent(dataset, (d) => d.y);

		// Create linear scales
		const xScale = d3
			.scaleLinear()
			.domain(xExtent)
			.range([margin.left, innerWidth + margin.left]);

		const yScale = d3
			.scaleLinear()
			.domain(yExtent)
			.range([innerHeight + margin.top, margin.top]); // inverted y-axis

		// Create or select a tooltip div
		let tooltip = d3.select("body").select(".quantum-state-tooltip");
		if (tooltip.empty()) {
			tooltip = d3
				.select("body")
				.append("div")
				.attr("class", "quantum-state-tooltip")
				.style("position", "absolute")
				.style("padding", "6px")
				.style("background", "rgba(0,0,0,0.6)")
				.style("color", "#fff")
				.style("border-radius", "4px")
				.style("pointer-events", "none")
				.style("opacity", 0);
		}

		// Append circles for each data point
		svg
			.selectAll("circle.data-point")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("class", "data-point")
			.attr("cx", (d) => xScale(d.x))
			.attr("cy", (d) => yScale(d.y))
			.attr("r", 4)
			.attr("fill", (d) => (d.label === -1 ? class_color[0] : class_color[1]))
			.attr("stroke", "#1f1f1f")
			.attr("stroke-width", 0.5)
			.on("mouseover", (event, d) => {
				tooltip.transition().duration(200).style("opacity", 0.9);
				tooltip
					.html(
						`Label: ${d.label}<br/>x: ${d.x.toFixed(2)}<br/>y: ${d.y.toFixed(2)}`,
					)
					.style("left", event.pageX + 10 + "px")
					.style("top", event.pageY - 28 + "px");
				// emit hovered index
				const index = d.index !== undefined ? d.index : dataset.indexOf(d);
				if (typeof onHoverIndex === "function" && index !== -1) {
					onHoverIndex(index);
				}
			})
			.on("mouseout", () => {
				tooltip.transition().duration(500).style("opacity", 0);
				// clear selection on mouse out
				if (typeof onHoverIndex === "function") {
					onHoverIndex(null);
				}
			});
	}, [dataset, width, height]);

	//////////////////////////////////////////////

	return (
		<div
			className={"component quantum-state-distribution-view"}
			style={{
				width: width,
				height: height,
				left: left,
				top: top,
			}}
		>
			<span className="component-title">Quantum Distribution Map</span>
			<svg
				title={"quantum_state_distribution_view"}
				id={"quantum_state_distribution_view"}
				width={width}
				height={height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={width}
					height={height}
					fill={color_quantum_distribution_bg}
					rx="10"
					ry="10"
				/>
			</svg>
		</div>
	);
}

export default QuantumStateDistributionView;
