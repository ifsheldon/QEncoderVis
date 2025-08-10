import { useEffect } from "react";
import * as d3 from "d3";

function Comp7(props) {
	// dataset
	const dataset = props.dataset;

	const comp7_width = props.comp7_width;
	const comp7_height = props.comp7_height;
	const comp7_left = props.comp7_left;
	const comp7_top = props.comp7_top;

	// Colors
	const [class_color, color_comp7_bg] = props.colors;

	//////////////////////////////////////////////
	// Mount the component once
	useEffect(() => {
		const svg = d3.select("#comp7");
		svg.selectAll("circle.data-point").remove();

		// Define margins and inner dimensions
		const margin = { top: 20, right: 25, bottom: 20, left: 25 };
		const innerWidth = comp7_width - margin.left - margin.right;
		const innerHeight = comp7_height - margin.top - margin.bottom;

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
		let tooltip = d3.select("body").select(".comp7-tooltip");
		if (tooltip.empty()) {
			tooltip = d3
				.select("body")
				.append("div")
				.attr("class", "comp7-tooltip")
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
			})
			.on("mouseout", () => {
				tooltip.transition().duration(500).style("opacity", 0);
			});
	}, []);

	//////////////////////////////////////////////

	return (
		<div
			className={"component comp7"}
			style={{
				width: comp7_width,
				height: comp7_height,
				left: comp7_left,
				top: comp7_top,
			}}
		>
			<span className="comp_title">Quantum Distribution Map</span>
			<svg
				title={"comp7"}
				id={"comp7"}
				width={comp7_width}
				height={comp7_height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={comp7_width}
					height={comp7_height}
					fill={color_comp7_bg}
					rx="10"
					ry="10"
				/>
			</svg>
		</div>
	);
}

export default Comp7;
