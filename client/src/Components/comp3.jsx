import { useEffect } from "react";
import * as d3 from "d3";

// import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function QuantumCircuitView(props) {
	// dataset
	const dataset = props.dataset;

	const comp3_width = props.comp3_width;
	const comp3_height = props.comp3_height;
	const comp3_left = props.comp3_left;
	const comp3_top = props.comp3_top;

	// 定义新的measure
	const svg_width = comp3_width * 0.9;
	const svg_height = comp3_height * 0.8;

	// color
	const { color_comp3_bg } = props;

	//////////////////////////////////////////////

	// mount 的时候渲染一次
	useEffect(() => {
		const svg = d3.select("#comp3");
		const margin = { top: 15, left: 20, bottom: 15, right: 30 };
		const width = +svg.attr("width") - margin.left - margin.right;
		const height = +svg.attr("height") - margin.top - margin.bottom;
		const qubit_number = dataset["qubit_number"];
		const step_number = dataset["encoder_step"];

		const wire_length = width * 1;
		const wire_gap_left = wire_length * 0.2;
		const wire_gap_right = wire_length * 0.25;
		const wire_height = height / qubit_number;
		const gate_width =
			(wire_length - wire_gap_left - wire_gap_right) / (step_number - 1);
		const wire_stroke_width = 1;
		const gate_symbol_fill = color_comp3_bg;
		const gate_symbol_stroke = color_comp3_bg;
		const gate_symbol_text_fill = "#1a1a1a";
		const gate_symbol_r = 25;
		const _gate_symbol_r_control = 3;
		const gate_symbol_text_fontSize = "1.1em";
		const gate_symbol_text_fontWeight = 400;
		const qubitDot_fill = color_comp3_bg;
		const qubitDot_radius = 3;
		const qubitDot_stroke = "#000000";
		const _qubitDot_strokeWidth = 1.5;

		// color
		const wire_color = "#414141";

		const group = svg
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "quantum_circuit");

		// Draw qubit wires
		for (let i = 0; i < qubit_number; i++) {
			group
				.append("line")
				.attr("class", "comp3_wire")
				.attr("x1", 0)
				.attr("y1", i * wire_height + wire_height / 2)
				.attr("x2", wire_length)
				.attr("y2", i * wire_height + wire_height / 2)
				.attr("stroke", wire_color)
				.attr("stroke-width", wire_stroke_width);
		}

		// Draw qubit
		for (let i = 0; i < qubit_number; i++) {
			group
				.append("circle")
				.attr("cx", 0)
				.attr("cy", i * wire_height + wire_height / 2)
				.attr("r", qubitDot_radius)
				.attr("fill", qubitDot_fill)
				.attr("stroke", qubitDot_stroke)
				.attr("stroke-width", wire_stroke_width);
		}

		const data = dataset["encoder"];

		data.forEach((step, step_i) => {
			const gateX = wire_gap_left + step_i * gate_width;
			step.forEach((gate, gate_i) => {
				// 没有 “-”, 代表不是Controlled gate, 而是H等的gate
				if (gate.includes("-") && !gate.includes("(")) {
					const _gate_name = gate.split("-")[0];
					const gate_role = gate.split("-")[1];

					const gateY = gate_i * wire_height + wire_height / 2;

					if (gate_role == "0") {
						group
							.append("circle")
							.attr("cx", gateX)
							.attr("cy", gateY)
							.attr("r", 1)
							.attr("stroke", gate_symbol_stroke)
							.attr("fill", gate_symbol_fill); // Control bit is solid
					} else {
						group
							.append("circle")
							.attr("cx", gateX)
							.attr("cy", gateY)
							.attr("r", gate_symbol_r)
							.attr("fill", gate_symbol_fill)
							.attr("stroke", "none")
							.attr("stroke-width", 1)
							.attr("class", "symbol_position");
					}
				} else {
					const gateY = gate_i * wire_height + wire_height / 2;

					group
						.append("circle")
						.attr("cx", gateX)
						.attr("cy", gateY)
						.attr(
							"r",
							dataset["encoder"][step_i][gate_i].length * 4 +
								gate_symbol_r * 0.2,
						)
						.attr("fill", gate_symbol_fill)
						.attr("stroke", gate_symbol_stroke)
						.attr("class", "symbol_position");
					// .attr('stroke', '#000000')
				}
			});
		});

		let Y_dotControl, Y_dotTarget, X_dot;

		data.forEach((step, step_i) => {
			const gateX = wire_gap_left + step_i * gate_width;
			step.forEach((gate, gate_i) => {
				// 没有 “-”, 代表不是Controlled gate, 而是H等的gate
				if (gate.includes("-") && !gate.includes("(")) {
					const gate_name = gate.split("-")[0];
					const gate_role = gate.split("-")[1];

					const gateY = gate_i * wire_height + wire_height / 2;

					if (gate_role == "0") {
						group
							.append("circle")
							.attr("cx", gateX)
							.attr("cy", gateY)
							.attr("r", 2)
							.attr("fill", "#000000")
							.attr("stroke", "none");

						Y_dotControl = gateY;
						X_dot = gateX;
					} else {
						group
							.append("text")
							.attr("x", gateX)
							.attr("y", gateY)
							.attr("dy", ".35em")
							.attr("text-anchor", "middle")
							.attr("font-size", gate_symbol_text_fontSize)
							.attr("font-weight", gate_symbol_text_fontWeight)
							.attr("fill", gate_symbol_text_fill)
							.text(gate_name);

						Y_dotTarget = gateY;
					}
				} else {
					const gateY = gate_i * wire_height + wire_height / 2;

					const _gateText = group
						.append("text")
						.attr("x", gateX)
						.attr("y", gateY)
						.attr("dy", ".35em")
						.attr("text-anchor", "middle")
						.attr("font-size", gate_symbol_text_fontSize)
						.attr("font-weight", gate_symbol_text_fontWeight)
						.attr("fill", gate_symbol_text_fill)
						.text((_d) => dataset["encoder"][step_i][gate_i]);
				}
			});
		});

		// CNOT的连接线
		// group.append("line")
		//     .attr('class', 'comp3_wire')
		//     .attr("x1", X_dot)
		//     .attr("y1", Y_dotControl)
		//     .attr("x2", X_dot)
		//     .attr("y2", Y_dotTarget-9)
		//     .attr("stroke", wire_color)
		//     .attr('stroke-width', wire_stroke_width)
	}, []);

	return (
		<div
			className={"component comp3"}
			style={{
				width: comp3_width,
				height: comp3_height,
				left: comp3_left,
				top: comp3_top,
			}}
		>
			<span className="comp_title">Quantum encoder</span>
			{/*svg for one 2dplot*/}
			<svg
				id={"comp3"}
				width={svg_width}
				height={svg_height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={svg_width}
					height={svg_height}
					fill={color_comp3_bg}
					rx="10"
					ry="10"
				/>
			</svg>
		</div>
	);
}

export default QuantumCircuitView;
