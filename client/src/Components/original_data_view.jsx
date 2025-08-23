import { useEffect, useState } from "react";
import axios from "axios";

import Module_draw_2dplot from "../Functions/module_draw_2dplot";

function OriginalDataView(props) {
	const circuitId = props.circuitId;

	const width = props.width;
	const height = props.height;
	const left = props.left;
	const top = props.top;
	const { class_color } = props;

	const [originalData, setOriginalData] = useState(null);
	const [loading, setLoading] = useState(false);

	// 定义新的measure
	const svg_width = width * 0.9;
	const svg_height = height * 0.9;

	// Fetch original data when dataset (circuitId) changes
	useEffect(() => {
		const fetchOriginal = async () => {
			try {
				setLoading(true);
				const res = await axios.get(
					"http://127.0.0.1:3030/api/get_original_data",
					{
						params: { circuit_id: circuitId },
					},
				);
				setOriginalData(res.data);
			} catch (err) {
				console.error("Failed to fetch original data", err);
				setOriginalData(null);
			} finally {
				setLoading(false);
			}
		};
		if (circuitId !== undefined && circuitId !== null) {
			fetchOriginal();
		}
	}, [circuitId]);

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
				{loading || !originalData ? (
					// simple fallback while loading
					<text>Loading original data...</text>
				) : (
					<Module_draw_2dplot
						dataset={originalData}
						class_color={class_color}
						boundary={null}
						mode={"medium"}
						translate={[5, 0]} /*module这个g在svg元素里的位置*/
						module_name={"original_data_view_2dplot"} /*module这个g的名字*/
						isLegend={true}
					></Module_draw_2dplot>
				)}
			</svg>
		</div>
	);
}

export default OriginalDataView;
