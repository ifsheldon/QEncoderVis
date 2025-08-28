import { useEffect, useState } from "react";
import { Checkbox } from "antd";
import * as d3 from "d3";

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function get_svg(size, circuit_id) {
	// Layout constants matching Module_draw_2dplot for mode "large"
	const axis_length = size * 0.15;
	const g_paddingLeft = size * 0.027;
	const g_paddingTop = size * 0.02;
	const global_transform = `translate(${g_paddingLeft}, ${g_paddingTop}) scale(${axis_length / 100}, ${axis_length / 100})`;

	if (circuit_id === 0) {
		return (
			<g className={"boundary-line"} transform={global_transform}>
				<g transform="matrix(0.896623,0,0,1.13966,0,-13.9661)">
					<path
						d="M0,50C31.925,48.676 60.898,69.371 70,100"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
						style={{
							fill: "none",
							fillRule: "nonzero",
							stroke: "white",
							strokeWidth: 2,
						}}
					/>
				</g>
				<g transform="matrix(-0.928123,-0.0181772,0.0230015,-1.17445,101.767,118.518)">
					<path
						d="M0,50C31.925,48.676 60.898,69.371 70,100"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
						style={{
							fill: "none",
							fillRule: "nonzero",
							stroke: "white",
							strokeWidth: 2,
						}}
					/>
				</g>
			</g>
		);
	} else if (circuit_id === 1) {
		return (
			<g className={"boundary-line"} transform={global_transform}>
				<g transform="matrix(0.00504453,-0.999987,0.999987,0.00504453,19.8546,57.3173)">
					<clipPath id="_clip1">
						<rect x="36.311" y="12.254" width="24.261" height="24.161" />
					</clipPath>
					<g clip-path="url(#_clip1)">
						<path
							d="M48.442,13.876L60.572,37.864L36.311,37.864L48.442,13.876Z"
							style={{
								fill: "none",
								fillRule: "nonzero",
								stroke: "white",
								strokeWidth: 1,
							}}
						/>
					</g>
				</g>
				<g transform="matrix(0.00504453,-0.999987,0.999987,0.00504453,18.6917,81.3433)">
					<clipPath id="_clip2">
						<rect x="36.311" y="12.254" width="24.261" height="24.161" />
					</clipPath>
					<g clip-path="url(#_clip2)">
						<path
							d="M48.442,13.876L60.572,37.864L36.311,37.864L48.442,13.876Z"
							style={{
								fill: "none",
								fillRule: "nonzero",
								stroke: "white",
								strokeWidth: 1,
							}}
						/>
					</g>
				</g>
				<g transform="matrix(0.00504453,-0.999987,0.999987,0.00504453,17.8355,105.663)">
					<clipPath id="_clip3">
						<rect x="36.311" y="12.254" width="24.261" height="24.161" />
					</clipPath>
					<g clip-path="url(#_clip3)">
						<path
							d="M48.442,13.876L60.572,37.864L36.311,37.864L48.442,13.876Z"
							style={{
								fill: "none",
								fillRule: "nonzero",
								stroke: "white",
								strokeWidth: 1,
							}}
						/>
					</g>
				</g>
				<g transform="matrix(0.00504453,-0.999987,0.999987,0.00504453,17.0759,129.683)">
					<clipPath id="_clip4">
						<rect x="36.311" y="12.254" width="24.261" height="24.161" />
					</clipPath>
					<g clip-path="url(#_clip4)">
						<path
							d="M48.442,13.876L60.572,37.864L36.311,37.864L48.442,13.876Z"
							style={{
								fill: "none",
								fillRule: "nonzero",
								stroke: "white",
								strokeWidth: 1,
							}}
						/>
					</g>
				</g>
				<g transform="matrix(0.00504453,-0.999987,0.999987,0.00504453,15.675,153.243)">
					<clipPath id="_clip5">
						<rect x="36.311" y="12.254" width="24.261" height="24.161" />
					</clipPath>
					<g clip-path="url(#_clip5)">
						<path
							d="M48.442,13.876L60.572,37.864L36.311,37.864L48.442,13.876Z"
							style={{
								fill: "none",
								fillRule: "nonzero",
								stroke: "white",
								strokeWidth: 1,
							}}
						/>
					</g>
				</g>
			</g>
		);
	} else if (circuit_id === 2) {
		return (
			<g className={"boundary-line"} transform={global_transform}>
				<g transform="matrix(2.30703,0,0,2.30183,-56.7934,-59.6599)">
					<ellipse
						cx="49.744"
						cy="44.094"
						rx="16.459"
						ry="16.585"
						style={{
							fill: "rgb(235,235,235)",
							fillOpacity: 0,
							stroke: "white",
							strokeWidth: "0.65px",
						}}
					/>
				</g>
			</g>
		);
	} else if (circuit_id === 3) {
		return (
			<g className={"boundary-line"} transform={global_transform}>
				<g transform="matrix(2.13566,0,0,1.96602,-56.8191,-65.0671)">
					<clipPath id="_clip1">
						<rect x="36.153" y="30.394" width="31.089" height="56.67" />
					</clipPath>
					<g clip-path="url(#_clip1)">
						<circle
							cx="37.548"
							cy="58.698"
							r="25.395"
							style={{
								fill: "none",
								stroke: "white",
								strokeWidth: "0.73px",
							}}
						/>
					</g>
				</g>
			</g>
		);
	} else if (circuit_id === 4) {
		return (
			<g className={"boundary-line"} transform={global_transform}>
				<path
					d={"M0,100 L100,0"}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
					style={{ fill: "none", stroke: "white", strokeWidth: 2 }}
				/>
			</g>
		);
	} else if (circuit_id === 5) {
		return (
			<g className={"boundary-line"} transform={global_transform}>
				<path
					d="M97.984,2.983C97.946,3.019 97.585,3.371 97.293,3.757C96.258,5.126 94.654,7.808 92.657,11.398C81.113,32.154 56.686,82.992 53.715,88.439C53.587,88.673 53.344,88.822 53.077,88.829C52.81,88.836 52.559,88.701 52.419,88.474C48.009,81.337 8.294,10.99 2.98,2.092C2.768,1.736 2.884,1.275 3.239,1.063C3.595,0.851 4.056,0.967 4.268,1.322C9.371,9.868 46.203,75.09 53.011,86.551C57.814,77.194 80.386,30.376 91.346,10.669C93.39,6.995 95.037,4.254 96.096,2.852C96.681,2.078 97.178,1.673 97.467,1.575C97.859,1.442 98.285,1.653 98.418,2.045C98.546,2.425 98.353,2.837 97.984,2.983Z"
					style={{
						fill: "white",
						strokeWidth: 0.5,
					}}
				/>
			</g>
		);
	}

	// Placeholder for other circuits: simple diagonal line
	return (
		<g className={"boundary-line"} transform={global_transform}>
			<path
				d={"M0,100 L100,0"}
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				style={{ fill: "none", stroke: "white", strokeWidth: 2 }}
			/>
		</g>
	);
}

function EncodedMapView(props) {
	const dataset = props.dataset;
	const circuit_id = props.circuit_id;

	const { width, height, left, top, colors } = props;
	const [class_color, _] = colors;

	const [showBoundary, setShowBoundary] = useState(false);

	const margin = { top: 15, left: 40, bottom: 15, right: 40 };
	const svg_width = width - margin.left - margin.right;
	const svg_height = height - margin.top - margin.bottom;
	const mode = "large";
	const largeSize = 1350,
		mediumSize = 900,
		smallSize = 320,
		smallerSize = 240;
	const size =
		mode == "large"
			? largeSize
			: mode == "medium"
				? mediumSize
				: mode == "small"
					? smallSize
					: smallerSize;

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
					mode={mode}
					translate={[0, 0]} // Position of the module
					module_name={"encoded_map_view_2dplot"}
					class_color={class_color}
					isLegend={true}
				/>
				{/* Boundary overlay provided by helper */}
				{get_svg(size, circuit_id)}
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
