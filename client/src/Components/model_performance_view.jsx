import ModuleDraw2dplot from "../Functions/module_draw_2dplot";
import ModuleDrawPerformance from "../Functions/module_draw_performance";

function ModelPerformanceView(props) {
	// dataset
	const dataset1 = props.dataset1;
	const dataset2 = props.dataset2;

	const { width, height, left, top } = props;

	const [class_color, color_model_performance_bg] = props.colors;

	// 定义新的measure
	const svg_width = width * 0.9;
	const svg_height = height * 0.8;

	return (
		<div
			className={"component model-performance-view"}
			style={{
				width: width,
				height: height,
				left: left,
				top: top,
			}}
		>
			<span className="component-title">Trained Map</span>
			{/*svg for one 2dplot*/}
			<svg
				title="model_performance_view"
				id={"model_performance_view"}
				width={svg_width}
				height={svg_height}
			>
				<rect
					x={0}
					y={0}
					width={svg_width}
					height={svg_height}
					fill={color_model_performance_bg}
					rx="10"
					ry="10"
				/>

				<ModuleDraw2dplot
					dataset={dataset2}
					boundary={null}
					mode={"medium"}
					translate={[6, -5]} // Position of the module
					module_name={"trained_map_2dplot"}
					class_color={class_color}
				/>

				<ModuleDrawPerformance
					dataset={dataset1}
					translate={[160, 0]} // Position of the module
					module_name={"model_performance_plot"}
				></ModuleDrawPerformance>
			</svg>
		</div>
	);
}

export default ModelPerformanceView;
