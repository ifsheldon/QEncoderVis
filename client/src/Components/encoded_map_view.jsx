import { useEffect, useState } from "react";
import { Checkbox } from "antd";
import * as d3 from "d3";

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function EncodedMapView(props) {
	const dataset = props.dataset;
	const boundary = props.boundary;

	const { width, height, left, top, colors } = props;
	const [class_color, _] = colors;

	const [showBoundary, setShowBoundary] = useState(false);

	const margin = { top: 15, left: 40, bottom: 15, right: 40 };
	const svg_width = width - margin.left - margin.right;
	const svg_height = height - margin.top - margin.bottom;

	function onChange(e) {
		setShowBoundary(e.target.checked);
	}

	// Checkbox onChange event handler
	useEffect(() => {
		d3.selectAll(".boundary-line").style(
			"visibility",
			showBoundary ? "visible" : "hidden",
		);
	}, [showBoundary]);

	return (
		<div
			className={"component encoded-map-view"}
			style={{
				width: width,
				height: height,
				left: left,
				top: top,
			}}
		>
			<span className="component-title">Encoder Map</span>
			<svg
				title={"encoded_map_view"}
				id={"encoded_map_view"}
				width={svg_width}
				height={svg_height}
			>
				<Module_draw_2dplot
					dataset={dataset}
					boundary={boundary}
					mode={"large"}
					translate={[0, 0]} // Position of the module
					module_name={"encoded_map_view_2dplot"}
					class_color={class_color}
					isLegend={true}
				/>
			</svg>
			<Checkbox
				onChange={onChange}
				checked={showBoundary}
				style={{ marginLeft: "90px", marginTop: "8px" }}
			>
				Show boundary line
			</Checkbox>
		</div>
	);
}

export default EncodedMapView;
