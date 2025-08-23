import { useState, useEffect } from "react";
import * as d3 from "d3";

function DataSelectorPanel(props) {
	// dataset
	const _dataset = props.dataset;
	const _boundary = props.boundary;

	const onDatasetClick = props.onDatasetClick;
	const disabled = !!props.disabled;
	const handleDatasetClick = (e) => {
		if (disabled) return;
		onDatasetClick(e);
	};

	const { comp2_width, comp2_height, comp2_left, comp2_top, vis_width } = props;
	const [class_color, color_comp2_bg] = props.colors;
	const [_color_class1, _color_class2] = class_color;

	const comp2_paddingLeft = vis_width * 0.01;
	const comp2_paddingTop = vis_width * 0.01;
	const comp2_dataOption_distanceX = vis_width * 0.059;
	const comp2_dataOption_distanceY = vis_width * 0.06;

	const default_circuit = props.default_circuit;
	const [_selectedDataOption, setSelectedDataOption] =
		useState(default_circuit);

	// keep local selection in sync if parent updates default
	useEffect(() => {
		setSelectedDataOption(default_circuit);
	}, [default_circuit]);
	// let {showBoundary, setShowBoundary} = useState('visible')

	function _onChange(e) {
		if (e.target.checked) {
			d3.selectAll(".boundary-line").style("visibility", "hidden");
		} else {
			d3.selectAll(".boundary-line").style("visibility", "visible");
		}
	}

	//////////////////////////////////////////////

	// mount 的时候渲染一次
	useEffect(() => {
		// console.log('comp2 mount')
		// console
	}, []);

	return (
		<div
			className={"component data-selector-panel"}
			style={{
				width: comp2_width,
				height: comp2_height,
				left: comp2_left,
				top: comp2_top,
				opacity: disabled ? 0.6 : 1,
				cursor: disabled ? "not-allowed" : "default",
			}}
		>
			<span className="comp_title">Data Selector</span>

			{/*svg for one data selector*/}
			<svg
				title="comp1_data_selector"
				id="comp1_data_selector"
				width={comp2_width}
				height={comp2_height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={comp2_width}
					height={comp2_height}
					fill={color_comp2_bg}
					rx="10"
					ry="10"
				/>

				<g transform={`translate(${comp2_paddingLeft}, ${comp2_paddingTop})`}>
					{/* Iteration to generate 6 option datasets in a 2x3 grid */}
					{Array.from({ length: 6 }, (_, i) => {
						return (
							<g
								transform={`translate(${(i % 3) * comp2_dataOption_distanceX + 4}, ${Math.floor(i / 3) * comp2_dataOption_distanceY + 4})`}
								className={
									_selectedDataOption?.split("_")[1] === `${i}`
										? "data-option-selected"
										: "data-option-unselected"
								}
								key={i}
								id={`circuit_${i}`}
								onClick={(e) => {
									if (disabled) return;
									setSelectedDataOption(e.currentTarget.id);
									handleDatasetClick(e.currentTarget.id);
								}} // Set the selected module on click
							>
								<image
									href={`/thumbnails/circuit_${i}.png`}
									x={0}
									y={0}
									width={comp2_dataOption_distanceX - 12}
									height={comp2_dataOption_distanceY - 12}
								/>
								<rect
									x={0}
									y={0}
									width={comp2_dataOption_distanceX - 12}
									height={comp2_dataOption_distanceY - 12}
									strokeWidth={2.3} // Border width
									className={`data-option-border`}
									rx={"2px"}
									ry={"2px"}
								/>
							</g>
						);
					})}
				</g>
			</svg>
		</div>
	);
}

export default DataSelectorPanel;
