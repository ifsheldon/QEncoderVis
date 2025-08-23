import { useEffect } from "react";
import * as d3 from "d3";

function QuantumCircuitView(props) {
	// dataset
	const dataset = props.dataset;

	const width = props.width;
	const height = props.height;
	const left = props.left;
	const top = props.top;

	// allow multiple instances by providing unique svg id
	const svgId = props.svgId || "quantum_circuit";

	// whether this instance is used in small cards; avoid leaking global selectors
	const forCards = props.forCards || false;

	// 定义新的measure
	const svg_width = width * 0.9;
	const svg_height = height * 0.8;

	// color
	const { color_circuit_bg } = props;

	// Redraw when dataset changes
	useEffect(() => {
		const svg = d3.select(`#${svgId}`);
		// remove previous circuit drawing if any
		svg.select(".quantum_circuit").remove();
		const margin = { top: 15, left: 20, bottom: 15, right: 30 };
		const widthInner = +svg.attr("width") - margin.left - margin.right;
		const heightInner = +svg.attr("height") - margin.top - margin.bottom;
		const qubit_number = dataset["qubit_number"];
		const step_number = dataset["encoder_step"];

		const wire_length = widthInner * 1;
		const wire_gap_left = wire_length * 0.2;
		const wire_gap_right = wire_length * 0.25;
		const wire_height = heightInner / qubit_number;
		const gate_width =
			(wire_length - wire_gap_left - wire_gap_right) / (step_number - 1);
		const wire_stroke_width = 1;
		const gate_symbol_fill = color_circuit_bg;
		const gate_symbol_stroke = color_circuit_bg;
		const gate_symbol_text_fill = "#1a1a1a";
		const gate_symbol_r = 25;
		const gate_symbol_text_fontSize = "1.1em";
		const gate_symbol_text_fontWeight = 400;
		const qubitDot_fill = color_circuit_bg;
		const qubitDot_radius = 3;
		const qubitDot_stroke = "#000000";

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
				.attr("class", "circuit-wire")
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

		// Helper to determine whether a gate is effectively empty
		const isEmptyGate = (gate) => {
			if (gate === null || gate === undefined) return true;
			if (typeof gate !== "string") return false;
			const trimmed = gate.trim();
			if (trimmed.length === 0) return true;
			return trimmed.toLowerCase() === "none";
		};

		// Precompute max occlusion half-width per step to repair empty-wire gaps
		const stepMaxOcclusion = data.map(() => 0);
		data.forEach((step, step_i) => {
			step.forEach((gate, gate_i) => {
				if (isEmptyGate(gate)) return;
				// non-controlled gate: use text-circle radius; controlled target gate: use base radius
				let occlusion = gate_symbol_r;
				if (!(gate.includes("-") && !gate.includes("("))) {
					occlusion =
						dataset["encoder"][step_i][gate_i].length * 4 + gate_symbol_r * 0.2;
				}
				stepMaxOcclusion[step_i] = Math.max(
					stepMaxOcclusion[step_i],
					occlusion,
				);
			});
		});

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
				} else if (!isEmptyGate(gate)) {
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
						.attr(
							"class",
							forCards ? "symbol_position-card" : "symbol_position",
						);
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
				} else if (!isEmptyGate(gate)) {
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

		// Repair: redraw thin wire segments where this wire has no gate, to keep continuity
		data.forEach((step, step_i) => {
			const gateX = wire_gap_left + step_i * gate_width;
			const halfW = stepMaxOcclusion[step_i];
			if (halfW <= 0) return;
			step.forEach((gate, gate_i) => {
				if (!isEmptyGate(gate)) return;
				const y = gate_i * wire_height + wire_height / 2;
				group
					.append("line")
					.attr("x1", gateX - halfW - 1)
					.attr("y1", y)
					.attr("x2", gateX + halfW + 1)
					.attr("y2", y)
					.attr("stroke", wire_color)
					.attr("stroke-width", wire_stroke_width);
			});
		});

		// Notify parent (e.g., encoder-step-mapping-view) that circuit finished rendering
		if (typeof props.onRendered === "function") {
			requestAnimationFrame(() => props.onRendered());
		}
	}, [dataset, svgId, forCards, color_circuit_bg]);

	return (
		<div
			className={forCards ? "quantum-circuit" : "component quantum-circuit"}
			style={
				forCards
					? {
							width: width,
							height: height,
							position: "relative",
						}
					: {
							width: width,
							height: height,
							left: left,
							top: top,
						}
			}
		>
			{!forCards && <span className="component-title">Quantum encoder</span>}
			{/*svg for one 2dplot*/}
			<svg
				id={svgId}
				width={svg_width}
				height={svg_height}
				style={{ marginTop: forCards ? 0 : "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={svg_width}
					height={svg_height}
					fill={color_circuit_bg}
					rx="10"
					ry="10"
				/>
			</svg>
		</div>
	);
}

export default QuantumCircuitView;
