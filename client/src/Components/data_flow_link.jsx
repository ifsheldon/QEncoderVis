import { useEffect } from "react";
import * as d3 from "d3";

function DataFlowLink(props) {
	// dataset
	const data_flow_link_width = props.linkComp_width;
	const data_flow_link_height = props.linkComp_height;
	const data_flow_link_left = props.linkComp_left;
	const data_flow_link_top = props.linkComp_top;

	// Define new measure
	const svg_width = data_flow_link_width;
	const svg_height = data_flow_link_height;

	// Colors
	const [_class_color, color_link_bg] = props.colors;

	//////////////////////////////////////////////
	// Mount the component once
	useEffect(() => {
		const svg = d3.select("#data_flow_link");
		const lineY = svg_height / 2;
		const segmentWidth = 20; // Width of the white segment

		// Add a line
		const group = svg.append("g").attr("class", "data_flow_link_group");

		group
			.append("line")
			.attr("x1", 0)
			.attr("y1", lineY)
			.attr("x2", svg_width)
			.attr("y2", lineY)
			.attr("stroke", "#343434")
			.attr("stroke-width", 2);

		// Add a triangle arrow using `path`
		const arrowSize = 10; // Size of the arrow triangle
		group
			.append("path")
			.attr(
				"d",
				`
					M ${0} ${lineY - arrowSize} 
					L ${0} ${lineY + arrowSize} 
					L ${arrowSize - 3} ${lineY} 
					Z
				`,
			)
			// Draw the arrow shape
			.attr("fill", "#343434");

		const segment = group
			.append("rect")
			.attr("x", -segmentWidth)
			.attr("y", lineY - 4) // Centered on the line
			.attr("width", segmentWidth)
			.attr("height", 8)
			.attr("fill", "#ffffff");

		// Animation loop with constant speed
		function animateSegment() {
			const totalDuration = 300; // Total duration for the segment to move across the line

			function loop() {
				segment
					.attr("x", -segmentWidth)
					.transition()
					.ease(d3.easeLinear)
					.duration(totalDuration)
					.attr("x", svg_width)
					.on("end", loop); // Repeat the animation
			}

			loop(); // Start the animation loop
		}

		animateSegment();
	}, []);

	//////////////////////////////////////////////

	return (
		<div
			className={"component data-flow-link"}
			style={{
				width: data_flow_link_width,
				height: data_flow_link_height,
				left: data_flow_link_left,
				top: data_flow_link_top,
			}}
		>
			<svg
				title={"data_flow_link"}
				id={"data_flow_link"}
				width={data_flow_link_width}
				height={data_flow_link_height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={data_flow_link_width}
					height={data_flow_link_height}
					fill={color_link_bg}
					rx="10"
					ry="10"
				/>
			</svg>
		</div>
	);
}

export default DataFlowLink;
