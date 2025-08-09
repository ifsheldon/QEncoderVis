import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

function Module_draw_performance(props) {
	// data
	let dataset = props.dataset;

	let { module_name, translate } = props;

	const divRef = useRef(null);

	//////////////////////////////////////////////

	// mount 的时候渲染一次
	useEffect(() => {
		draw_func();
	}, []);

	function draw_func() {
		// console.log(dataset)

		let size = 1000;
		let width = size * 0.21;
		let height = size * 0.14;
		let padding = {
			top: size * 0.02,
			left: size * 0.06,
			bottom: size * 0.005,
			right: size * 0.025,
		};

		let axis_size = size * 0.05;
		let axis_width = width - padding.left - padding.right;
		let axis_height = (height - padding.top - padding.bottom) / 2;

		let loss_line_color = "#5694c7";
		let acc_line_color = "#f68915";
		let gap_length = 10;
		let line_stroke_width = 2;

		// 先给组件的根结点div给className + 移位
		d3.select(divRef.current)
			.attr("class", `${module_name}`)
			.attr("transform", `translate(${translate[0]}, ${translate[1]})`);

		// Setup scales and axes
		let xScale = d3
			.scaleLinear()
			.domain([0, dataset["epoch_number"] - 1]) // Assuming dataset.epoch is an array of epoch numbers
			.range([0, axis_width]);

		let yScaleLoss = d3
			.scaleLinear()
			.domain([d3.min(dataset["loss"]), d3.max(dataset["loss"])])
			.range([axis_height, 0]);

		let yScaleAccuracy = d3
			.scaleLinear()
			.domain([d3.min(dataset["accuracy"]), d3.max(dataset["accuracy"])])
			.range([axis_height, 0]);

		let dataLoss = d3
			.range(dataset["epoch_number"])
			.map((d, i) => [d, dataset["loss"][d]]);
		let dataAcc = d3
			.range(dataset["epoch_number"])
			.map((d, i) => [d, dataset["accuracy"][d]]);

		// console.log(dataLoss)

		let makeLossLine = d3
			.line()
			.x((d) => xScale(d[0]))
			.y((d) => yScaleLoss(d[1]));

		let makeAccLine = d3
			.line()
			.x((d) => xScale(d[0]))
			.y((d) => yScaleAccuracy(d[1]));

		let g = d3
			.select(`.${module_name}`)
			.append("g")
			.attr("transform", `translate(${padding.left},${padding.top})`);

		let gLoss = g
			.append("g")
			.attr("class", "gLoss")
			.attr("transform", `translate(0,0)`);

		let gAcc = g
			.append("g")
			.attr("class", "gAcc")
			.attr("transform", `translate(0,${axis_height + gap_length})`);

		gLoss
			.append("path")
			.attr("d", makeLossLine(dataLoss))
			.attr("class", "loss_line")
			.attr("stroke", loss_line_color)
			.attr("stroke-width", line_stroke_width);

		gLoss
			.append("g")
			.call(
				d3
					.axisLeft(yScaleLoss)
					.tickValues([d3.min(dataset["loss"]), d3.max(dataset["loss"])]),
			)
			.attr("transform", `translate(${-3}, 0)`);

		gAcc
			.append("path")
			.attr("d", makeAccLine(dataAcc))
			.attr("class", "acc_line")
			.attr("stroke", acc_line_color)
			.attr("stroke-width", line_stroke_width);

		gAcc
			.append("g")
			.call(
				d3
					.axisLeft(yScaleAccuracy)
					.tickValues([
						d3.min(dataset["accuracy"]),
						d3.max(dataset["accuracy"]),
					]),
			)
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
			.attr("x", axis_width * 1.05) // Small gap after the circle
			.attr("y", -gap_length / 2)
			.attr("dy", "0.35em")
			.text("Epoch")
			.style("font-size", "0.9em");

		// add text: Loss: 0.805
		gLoss
			.append("text")
			.attr("x", 0) // Position of the text
			.attr("y", 0) // Vertical alignment of the first line
			.style("font-size", "1em")
			.each(function () {
				let text = d3.select(this);
				let lines = [
					"Loss:",
					`${dataset["loss"][dataset["loss"].length - 1].toFixed(3)}`,
				]; // Each item represents a line
				lines.forEach(function (line, i) {
					text
						.append("tspan") // Adding a tspan for each line
						.attr("x", 0) // Align with the starting x position
						.attr("dy", i ? "1.2em" : 0) // Move subsequent lines down
						.text(line);
				});
			})
			.attr("transform", `translate(${axis_width * 1.1}, ${axis_height * 0.2})`)
			.attr("class", "light-text");

		// add text: Acc: 0.805
		gAcc
			.append("text")
			.attr("x", 0) // Position of the text
			.attr("y", 0) // Vertical alignment of the first line
			.style("font-size", "1em")
			.each(function () {
				let text = d3.select(this);
				let lines = [
					"Acc:",
					`${dataset["accuracy"][dataset["accuracy"].length - 1].toFixed(3)}`,
				]; // Each item represents a line
				lines.forEach(function (line, i) {
					text
						.append("tspan") // Adding a tspan for each line
						.attr("x", 0) // Align with the starting x position
						.attr("dy", i ? "1.2em" : 0) // Move subsequent lines down
						.text(line);
				});
			})
			.attr("transform", `translate(${axis_width * 1.1}, ${axis_height * 0.6})`)
			.attr("class", "light-text");
	}

	return <g ref={divRef}></g>;
}

export default Module_draw_performance;
