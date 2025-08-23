import { useState, useEffect } from "react";

function DataSelectorPanel(props) {
	const onDatasetClick = props.onDatasetClick;
	const disabled = !!props.disabled;
	const handleDatasetClick = (e) => {
		if (disabled) return;
		onDatasetClick(e);
	};

	const { width, height, left, top, vis_width } = props;
	const [_, color_data_selector_panel_bg] = props.colors;

	const paddingLeft = vis_width * 0.01;
	const paddingTop = vis_width * 0.01;
	const optionGapX = vis_width * 0.059;
	const optionGapY = vis_width * 0.06;

	const default_circuit = props.default_circuit;
	const [selectedOption, setSelectedOption] = useState(default_circuit);

	// keep local selection in sync if parent updates default
	useEffect(() => {
		setSelectedOption(default_circuit);
	}, [default_circuit]);

	return (
		<div
			className={"component data-selector-panel"}
			style={{
				width: width,
				height: height,
				left: left,
				top: top,
				opacity: disabled ? 0.6 : 1,
				cursor: disabled ? "not-allowed" : "default",
			}}
		>
			<span className="component-title">Data Selector</span>

			{/*svg for one data selector*/}
			<svg
				title="data_selector_panel"
				id="data_selector_panel"
				width={width}
				height={height}
				style={{ marginTop: "10px" }}
			>
				<rect
					x={0}
					y={0}
					width={width}
					height={height}
					fill={color_data_selector_panel_bg}
					rx="10"
					ry="10"
				/>

				<g transform={`translate(${paddingLeft}, ${paddingTop})`}>
					{/* Iteration to generate 6 option datasets in a 2x3 grid */}
					{Array.from({ length: 6 }, (_, i) => {
						return (
							<g
								transform={`translate(${(i % 3) * optionGapX + 4}, ${Math.floor(i / 3) * optionGapY + 4})`}
								className={
									selectedOption?.split("_")[1] === `${i}`
										? "data-option-selected"
										: "data-option-unselected"
								}
								key={i}
								id={`circuit_${i}`}
								onClick={(e) => {
									if (disabled) return;
									setSelectedOption(e.currentTarget.id);
									handleDatasetClick(e.currentTarget.id);
								}}
							>
								<image
									href={`/thumbnails/circuit_${i}.png`}
									x={0}
									y={0}
									width={optionGapX - 12}
									height={optionGapY - 12}
								/>
								<rect
									x={0}
									y={0}
									width={optionGapX - 12}
									height={optionGapY - 12}
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
