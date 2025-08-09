import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

import Module_draw_performance from "../Functions/module_draw_performance";
import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function Comp5(props) {
	// dataset
	let dataset1 = props.dataset1;
	let dataset2 = props.dataset2;

	let { comp5_width, comp5_height, comp5_left, comp5_top } = props;
	const { comp6_width, comp6_height, comp6_left, comp6_top } = props;

	let [class_color, color_comp5_bg] = props.colors;

	// 定义新的measure
	let svg_width = comp5_width * 0.9;
	let svg_height = comp5_height * 0.8;

	//////////////////////////////////////////////

	// mount 的时候渲染一次
	useEffect(() => {
		let svg = d3.select("#comp5");
		let margin = { top: 15, left: 40, bottom: 15, right: 40 };
		let width = +svg.attr("width") - margin.left - margin.right;
		let height = +svg.attr("height") - margin.top - margin.bottom;
	}, []);

	return (
		<div
			className={"component comp5"}
			style={{
				width: comp5_width,
				height: comp5_height,
				left: comp5_left,
				top: comp5_top,
			}}
		>
			<span className="comp_title">Trained Map</span>
			{/*svg for one 2dplot*/}
			<svg id={"comp5"} width={svg_width} height={svg_height}>
				<rect
					x={0}
					y={0}
					width={svg_width}
					height={svg_height}
					fill={color_comp5_bg}
					rx="10"
					ry="10"
				/>

				<Module_draw_2dplot
					dataset={dataset2}
					boundary={null}
					mode={"medium"}
					translate={[6, -5]} // Position of the module
					module_name={"comp6_2dplot"}
					class_color={class_color}
				/>

				<Module_draw_performance
					dataset={dataset1}
					translate={[160, 0]} // Position of the module
					module_name={"comp5_performancePlot"}
				></Module_draw_performance>
			</svg>
		</div>
	);
}

export default Comp5;
