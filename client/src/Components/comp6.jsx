import { useState, useEffect } from "react";
import * as d3 from "d3";

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp6(props) {
	// dataset
	const [encoded_data, encoded_sub_data] = props.dataset;

	// console.log(encoded_data)
	// console.log(encoded_sub_data)

	const comp6_width = props.comp6_width;
	const comp6_height = props.comp6_height;
	const comp6_left = props.comp6_left;
	const comp6_top = props.comp6_top;

	const g1_top = 65;
	const g2_top = 115;

	const [class_color, color_comp6_bg] = props.colors;

	// 定义新的measure
	const svg_width = comp6_width * 0.9;
	const svg_height = comp6_height * 0.8;
	const margin = { top: 15, left: 40, bottom: 15, right: 40 };
	const dx = 40;
	const border_r = 39;

	const [symbol_positions, set_symbol_positions] = useState(null);

	const [_isFinished, _set_isFinished] = useState(false);

	// function func_loading(step_number){
	//     if (step_number*2 == d3.selectAll('.loading_count').size()){
	//         set_isFinished(true)
	//     }
	// }

	const _svg = d3.select("#comp6");

	// console.log(dataset)

	//////////////////////////////////////////////

	// mount 的时候渲染一次
	useEffect(() => {
		const symbol_positions = [];
		d3.selectAll(".symbol_position").each(function () {
			const cx = d3.select(this).attr("cx"); // Get the 'cx' attribute
			symbol_positions.push(cx); // Push the value into the array
		});

		set_symbol_positions(
			[...new Set(symbol_positions.map(Number))].sort((a, b) => a - b),
		);
	}, []);

	// mount 的时候渲染一次
	useEffect(() => {
		const container = d3.select("#comp6");

		const borderElements_1 = d3.selectAll(".encoder-step-sub-border").nodes();
		const borderElements_2 = d3
			.selectAll(".encoder-step-sub-sub-border")
			.nodes();

		const N = borderElements_1.length;

		for (let i = 0; i < N; i++) {
			const group = container
				.append("g")
				.attr("class", `half-circle-group-${i}`);

			const elementBBox_1 = borderElements_1[i].getBBox(); // Get bounding box of the border element
			const elementBBox_2 = borderElements_2[i].getBBox(); // Get bounding box of the border element

			const cx = elementBBox_1.x + 5;
			const cy = (elementBBox_2.y + elementBBox_2.height + elementBBox_1.y) / 2; // Circle center Y
			const r = elementBBox_1.width * 0.7; // Radius of the circle (half width of the border element)

			group
				.append("path")
				.attr(
					"d",
					d3.arc()({
						innerRadius: r,
						outerRadius: r,
						startAngle: 0 - Math.PI * 0.1,
						endAngle: -Math.PI + Math.PI * 0.1,
					}),
				)
				.attr("transform", `translate(${cx}, ${cy})`)
				.attr("fill", "none")
				.attr("stroke", "#bdbdbd")
				.attr("stroke-width", "1.3px");
		}

		for (let i = 0; i < N; i++) {
			const group = d3.select(`.half-circle-group-${i}`);
			const x = group.node().getBBox().x;
			const y = group.node().getBBox().y + group.node().getBBox().height / 2;

			const symbol_g = container.append("g");
			const r = 10;

			symbol_g
				.append("circle")
				.attr("cx", x)
				.attr("cy", y)
				.attr("r", r)
				.attr("fill", color_comp6_bg)
				.attr("stroke", "none");

			symbol_g
				.append("text")
				.attr("x", x)
				.attr("y", y)
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.attr("font-size", "1.3em")
				.attr("fill", "#444444")
				.text("⊖");
		}

		const elements = d3.selectAll(".encoder-step-border").nodes();

		// 连接的band
		for (let i = 0; i < N; i++) {
			const group = container.append("g").attr("class", `band`);

			const elementBBox_1 = elements[i].getBBox(); // Get bounding box of the border element

			const band_length = 24;
			const start_x = elementBBox_1.x + elementBBox_1.width / 2;
			const start_y = elementBBox_1.y + elementBBox_1.height;
			const end_x = elementBBox_1.x + elementBBox_1.width / 2;
			const end_y = elementBBox_1.y + elementBBox_1.height + band_length;

			group
				.append("line")
				.attr("x1", start_x)
				.attr("y1", start_y + 2)
				.attr("x2", end_x)
				.attr("y2", end_y)
				.attr("fill", "none")
				.attr("stroke", "#d9d9d9")
				.attr("stroke-width", "15px");
		}
	}, [symbol_positions]);

	return (
		<div
			className={"component comp6"}
			style={{
				width: comp6_width,
				height: comp6_height,
				left: comp6_left,
				top: comp6_top,
			}}
		>
			{/*<span className="comp_title"></span>*/}
			{/*svg for one 2dplot*/}
			<svg
				id={"comp6"}
				width={svg_width}
				height={svg_height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={svg_width}
					height={svg_height}
					fill={"none"}
					style={{ stroke: "color_comp6_bg" }}
					rx="10"
					ry="10"
				/>

				{symbol_positions ? (
					symbol_positions.map((symbol_position, i) => {
						// console.log(symbol_position)

						return (
							<g key={i}>
								<Module_draw_2dplot
									dataset={encoded_data[i]}
									boundary={null}
									mode={"smaller"}
									translate={[margin.left + symbol_position - dx, margin.top]} // Position of the module
									module_name={`comp6_encoder_step_${i}`}
									class_color={class_color}
									isLegend={false}
								></Module_draw_2dplot>
								<rect
									x={margin.left + symbol_position - dx + 4}
									y={margin.top + 3}
									width={border_r}
									height={border_r}
									strokeWidth={2} // Border width
									className={`encoder-step-border`}
									rx={"2px"}
									ry={"2px"}
								></rect>
							</g>
						);
					})
				) : (
					<div>Loading...</div>
				)}

				{symbol_positions ? (
					symbol_positions.map((symbol_position, i) => {
						// console.log(symbol_position)

						return (
							<g key={i}>
								<Module_draw_2dplot
									dataset={encoded_sub_data[i][0]}
									boundary={null}
									mode={"smaller"}
									translate={[
										margin.left + symbol_position - dx,
										margin.top + g1_top,
									]} // Position of the module
									module_name={`comp6_encoder_step_sub_${i}`}
									class_color={class_color}
									isLegend={false}
								></Module_draw_2dplot>
								<rect
									x={margin.left + symbol_position - dx + 4}
									y={margin.top + g1_top + 3}
									width={border_r}
									height={border_r}
									strokeWidth={1.5} // Border width
									className={`encoder-step-sub-border`}
									rx={"2px"}
									ry={"2px"}
								/>
							</g>
						);
					})
				) : (
					<div>Loading...</div>
				)}

				{symbol_positions ? (
					symbol_positions.map((symbol_position, i) => {
						// console.log(symbol_position)

						return (
							<g key={i}>
								<Module_draw_2dplot
									dataset={encoded_sub_data[i][1]}
									boundary={null}
									mode={"smaller"}
									translate={[
										margin.left + symbol_position - dx,
										margin.top + g2_top,
									]} // Position of the module
									module_name={`comp6_encoder_step_sub_sub_${i}`}
									class_color={class_color}
									isLegend={false}
								></Module_draw_2dplot>
								<rect
									x={margin.left + symbol_position - dx + 4}
									y={margin.top + g2_top + 3}
									width={border_r}
									height={border_r}
									strokeWidth={1.5} // Border width
									className={`encoder-step-sub-sub-border`}
									rx={"2px"}
									ry={"2px"}
								/>
							</g>
						);
					})
				) : (
					<div>Loading...</div>
				)}
			</svg>
		</div>
	);
}

export default Comp6;
