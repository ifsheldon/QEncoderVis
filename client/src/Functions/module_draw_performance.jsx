import { useRef, useEffect } from "react";
import * as d3 from "d3";

function Module_draw_performance(props) {
	// data
	const dataset = props.dataset;

	const { module_name, translate } = props;

	const divRef = useRef(null);

	//////////////////////////////////////////////

	// Re-render whenever performance dataset changes
	useEffect(() => {
		draw_func();
	}, [dataset]);

	function draw_func() {
		// Clear previous render before drawing fresh
		d3.select(divRef.current).selectAll("*").remove();

		const size = 1000;
		const width = size * 0.21;
		const height = size * 0.14;
		const padding = {
			top: size * 0.02,
			left: size * 0.06,
			bottom: size * 0.005,
			right: size * 0.025,
		};

		const _axis_size = size * 0.05;
		const axis_width = width - padding.left - padding.right;
		const axis_height = (height - padding.top - padding.bottom) / 2;

		const loss_line_color = "#5694c7";
		const acc_line_color = "#f68915";
		const gap_length = 10;
		const line_stroke_width = 2;

		// 先给组件的根结点div给className + 移位
		d3.select(divRef.current)
			.attr("class", `${module_name}`)
			.attr("transform", `translate(${translate[0]}, ${translate[1]})`);

		// Prepare safe data
		const epochNumber =
			(dataset && typeof dataset["epoch_number"] === "number"
				? dataset["epoch_number"]
				: 0) || 0;
		const lossArray = Array.isArray(dataset && dataset["loss"])
			? dataset["loss"]
			: [];
		const accArray = Array.isArray(dataset && dataset["accuracy"])
			? dataset["accuracy"]
			: [];

		// Setup scales and axes
		const xScale = d3
			.scaleLinear()
			.domain([0, Math.max(0, epochNumber - 1)])
			.range([0, axis_width]);

		const lossMin = lossArray.length ? d3.min(lossArray) : 0;
		const lossMax = lossArray.length ? d3.max(lossArray) : 1;
		const yScaleLoss = d3
			.scaleLinear()
			.domain([lossMin, lossMax])
			.range([axis_height, 0]);

		const yScaleAccuracy = d3
			.scaleLinear()
			.domain([0, 1])
			.range([axis_height, 0]);

		const dataLoss = d3.range(lossArray.length).map((d) => [d, lossArray[d]]);
		const dataAcc = d3.range(accArray.length).map((d) => [d, accArray[d]]);

		const makeLossLine = d3
			.line()
			.x((d) => xScale(d[0]))
			.y((d) => yScaleLoss(d[1]));

		const makeAccLine = d3
			.line()
			.x((d) => xScale(d[0]))
			.y((d) => yScaleAccuracy(d[1]));

		const g = d3
			.select(`.${module_name}`)
			.append("g")
			.attr("transform", `translate(${padding.left},${padding.top})`);

		const gLoss = g
			.append("g")
			.attr("class", "gLoss")
			.attr("transform", `translate(0,0)`);

		const gAcc = g
			.append("g")
			.attr("class", "gAcc")
			.attr("transform", `translate(0,${axis_height + gap_length})`);

		if (dataLoss.length) {
			gLoss
				.append("path")
				.attr("d", makeLossLine(dataLoss))
				.attr("class", "loss_line")
				.attr("stroke", loss_line_color)
				.attr("stroke-width", line_stroke_width);
		}

		gLoss
			.append("g")
			.call(
				d3
					.axisLeft(yScaleLoss)
					.tickValues(lossArray.length ? [lossMin, lossMax] : [0, 1]),
			)
			.attr("transform", `translate(${-3}, 0)`);

		if (dataAcc.length) {
			gAcc
				.append("path")
				.attr("d", makeAccLine(dataAcc))
				.attr("class", "acc_line")
				.attr("stroke", acc_line_color)
				.attr("stroke-width", line_stroke_width);
		}

		gAcc
			.append("g")
			.call(d3.axisLeft(yScaleAccuracy).tickValues([0, 1]))
			.attr("transform", `translate(${-3}, 0)`);

		gAcc
			.append("line")
			.attr("x1", 0)
			.attr("y1", -gap_length / 2)
			.attr("x2", axis_width * 1.02)
			.attr("y2", -gap_length / 2)
			.attr("stroke", "#000000");

		gAcc
			.append("text")
			.attr("x", axis_width * 1.05)
			.attr("y", -gap_length / 2)
			.attr("dy", "0.35em")
			.text("Epoch")
			.style("font-size", "0.9em");

		// add text: Loss
		const lastLossText = lossArray.length
			? `${lossArray[lossArray.length - 1].toFixed(3)}`
			: "-";
		gLoss
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.style("font-size", "1em")
			.each(function () {
				const text = d3.select(this);
				const lines = ["Loss:", lastLossText];
				lines.forEach((line, i) => {
					text
						.append("tspan")
						.attr("x", 0)
						.attr("dy", i ? "1.2em" : 0)
						.text(line);
				});
			})
			.attr("transform", `translate(${axis_width * 1.1}, ${axis_height * 0.2})`)
			.attr("class", "light-text");

		// add text: Acc
		const lastAccText = accArray.length
			? `${accArray[accArray.length - 1].toFixed(3)}`
			: "-";
		gAcc
			.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.style("font-size", "1em")
			.each(function () {
				const text = d3.select(this);
				const lines = ["Acc:", lastAccText];
				lines.forEach((line, i) => {
					text
						.append("tspan")
						.attr("x", 0)
						.attr("dy", i ? "1.2em" : 0)
						.text(line);
				});
			})
			.attr("transform", `translate(${axis_width * 1.1}, ${axis_height * 0.6})`)
			.attr("class", "light-text");
	}

	return <g ref={divRef}></g>;
}

export default Module_draw_performance;
