import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function OriginalDataView(props) {
	const width = props.width;
	const height = props.height;
	const left = props.left;
	const top = props.top;
	const { class_color } = props;
	const features = props.features || [];
	const labels = props.labels || [];
	const selectedIndex = props.selectedIndex;

	// 定义新的measure
	const svg_width = width * 0.9;
	const svg_height = height * 0.9;

	const hasData =
		Array.isArray(features) &&
		Array.isArray(labels) &&
		features.length === labels.length &&
		features.length > 0;

	return (
		<div
			className={"component original-data-view"}
			style={{
				width: width,
				height: height,
				left: left,
				top: top,
			}}
		>
			<span className="component-title">Original Data</span>

			{/*svg for one 2dplot*/}
			<svg
				title="original_data_view_plot"
				id={"original_data_view_plot"}
				width={svg_width}
				height={svg_height}
			>
				{hasData ? (
					<Module_draw_2dplot
						dataset={{ feature: features, label: labels }}
						class_color={class_color}
						boundary={null}
						mode={"medium"}
						translate={[5, 0]} /*module这个g在svg元素里的位置*/
						module_name={"original_data_view_2dplot"} /*module这个g的名字*/
						isLegend={true}
						selectedIndex={selectedIndex}
					></Module_draw_2dplot>
				) : (
					<text>No original data</text>
				)}
			</svg>
		</div>
	);
}

export default OriginalDataView;
