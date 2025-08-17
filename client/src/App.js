import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
	Layout,
	Form,
	Button,
	InputNumber,
	Slider,
	Spin,
	Select,
	Row,
	Col,
	Progress,
	Drawer,
	Avatar,
	List,
} from "antd";
import { RightOutlined, PlayCircleFilled } from "@ant-design/icons";

import P1 from "./Articles/p1";
import Footer from "./Articles/footer";
import Top from "./Articles/top";

import OriginalDataView from "./Components/comp1";
import DataSelectorPanel from "./Components/comp2";
import QuantumCircuitView from "./Components/comp3";
import EncodedMapView from "./Components/comp4";
import ModelPerformanceView from "./Components/comp5";
import EncoderStepMappingView from "./Components/comp6";
import QuantumStateDistributionView from "./Components/comp7";
import Link from "./Components/link";
import DescriptionComp from "./Components/description";

// 布局参数
const vis_width = 1060;
const vis_height = vis_width * 0.525;

const control_width = vis_width;
const control_height = vis_width * 0.1;

const comp1_width = vis_width * 0.23;
const comp1_height = vis_width * 0.26;
const comp1_left = vis_width * 0.04,
	comp1_top = vis_width * 0.023;

const comp2_width = vis_width * 0.19;
const comp2_height = vis_width * 0.133;
const comp2_left = vis_width * 0.038,
	comp2_top = vis_width * 0.34;

const comp3_width = vis_width * 0.45;
const comp3_height = vis_width * 0.07;
const comp3_left = vis_width * 0.29,
	comp3_top = vis_width * 0.023;

const comp4_width = vis_width * 0.4;
const comp4_height = vis_width * 0.295;
const comp4_left = vis_width * 0.72,
	comp4_top = vis_width * 0.023;

const linkComp_width =
	comp3_left - (comp1_left + comp1_width) + comp3_width + 40;
const linkComp_height = vis_width * 0.07;
const linkComp_left = comp1_width - 20,
	linkComp_top = comp3_top + comp3_height + 10;

const comp5_width = vis_width * 0.54;
const comp5_height = vis_width * 0.2;
const comp5_left = vis_width * 0.565,
	comp5_top = vis_width * 0.34;

const comp6_width = vis_width * 0.45;
const comp6_height = vis_width * 0.25;
const comp6_left = comp3_left,
	comp6_top = comp3_top + comp3_height + 10;

const comp7_width = vis_width * 0.28;
const comp7_height = vis_width * 0.145;
const comp7_left = vis_width * 0.26,
	comp7_top = vis_width * 0.34;

// Description: position it below the Original Data view
const descriptionComp_width = comp1_width;
const descriptionComp_height = comp1_height * 0.22;
const descriptionComp_left = comp1_left;
const descriptionComp_top = comp1_top + comp1_height + 6;

// Ensure components below description have enough padding
const below_desc_padding = 20;
const comp2_top_adjusted = Math.max(
	comp2_top,
	descriptionComp_top + descriptionComp_height + below_desc_padding,
);

const comp7_top_adjusted = Math.max(
	comp7_top,
	descriptionComp_top + descriptionComp_height + below_desc_padding,
);

const comp5_top_adjusted = Math.max(
	comp5_top,
	descriptionComp_top + descriptionComp_height + below_desc_padding,
);

const article_width = 650;
const centered_footer_bgColor = 650;

// All color setting here
// define colors here
// const color_class1 = "#ffe682";
// const color_class2 = "#006962";
// const color_class1 = "#eebc6f";
// const color_class2 = "#6fc6be";
// const color_class1 = "#114057";
// const color_class2 = "#fde625";
// const color_class1 = "#f65262";
// const color_class2 = "#4f7cff";
const color_class1 = "#80ee02";
const color_class2 = "#750d0d";
const top_bg_color = "#183D4E";
const centered_control_color = "#ffffff";
const container_control_color = "#ffffff";
const centered_vis_color = "#fafafa";
const container_vis_color = "#fafafa";
const play_btn_color = "#2c2c2c";
const progress_color = "#545454";
const centered_article_bgColor = "#ffeeff";
const color_comp2_bg = "#ececec";
const color_comp3_bg = "#ececec";
const color_comp4_bg = "#f1f1f1";
const color_comp5_bg = "#f9f9f9";
const color_comp6_bg = "#f9f9f9";
const color_comp7_bg = "#ececec";
const color_linkComp_bg = "#fafafa";

// dataset and backend circuit ids
const data_port_map = {
	circuit_0: 0,
	circuit_1: 1,
	circuit_2: 2,
	circuit_3: 3,
	circuit_4: 4,
	circuit_5: 5,

	circuit_21: 21,
};

// feature map options and defaults by circuit
const featureMapOptions = [
	{ label: "FMArcsin", value: "FMArcsin" },
	{ label: "FMArcLogTrig", value: "FMArcLogTrig" },
	{ label: "FMArctanTrig", value: "FMArctanTrig" },
	{ label: "FMExpTrig", value: "FMExpTrig" },
];

const defaultFeatureMapByCircuit = {
	0: "FMArcsin",
	1: "FMArcsin",
	2: "FMArcsin",
	3: "FMArcLogTrig",
	4: "FMArctanTrig",
	5: "FMExpTrig",
	21: "FMArcsin",
};

function App() {
	const default_circuit = "circuit_5";
	const [data_name, set_dataName] = useState(default_circuit);
	const [dataset, setDataset] = useState(null);
	const [featureMap, setFeatureMap] = useState(
		defaultFeatureMapByCircuit[data_port_map[default_circuit]],
	);

	// Derive circuit-specific default feature map label for options
	const currentCircuitId = data_port_map[data_name];
	const recommendedFeatureMap = defaultFeatureMapByCircuit[currentCircuitId];
	const featureMapOptionsWithDefault = featureMapOptions.map((opt) => ({
		label:
			opt.value === recommendedFeatureMap
				? `${opt.label} (default)`
				: opt.label,
		value: opt.value,
	}));

	const [drawer_open, set_drawer_open] = useState(false);
	const [_comp6Loading, _setComp6Loading] = useState(true);

	const handleDatasetClick = (datasetName) => {
		set_dataName(datasetName);
		const cid = data_port_map[datasetName];
		setFeatureMap(defaultFeatureMapByCircuit[cid]);
	};

	/*设置抽屉的状态的函数*/
	const showDrawer = () => {
		set_drawer_open(true);
	};

	const onClose = () => {
		set_drawer_open(false);
	};

	//////////////////////////////////////////////

	// mount 的时候渲染一次
	useEffect(() => {
		const circuit_id = data_port_map[data_name];
		const request_url = `http://127.0.0.1:3030/api/run_circuit`;

		const fetchData = async () => {
			try {
				const result = await axios.post(request_url, {
					circuit: circuit_id,
					feature_map: featureMap,
				});
				console.log(`'App.js' - Dataset (${data_name}) loaded. `, result.data);
				setDataset(result.data);
			} catch (err) {
				console.error("Failed to load dataset", err);
				setDataset(null);
			}
		};

		fetchData();
	}, [data_name, featureMap]);

	// useEffect(() => {
	//
	//     setTimeout(() => {
	//         setComp6Loading(false);
	//     }, 1500); // Delay for 1.5 seconds
	//
	// }, [dataset])

	return (
		<Layout
			style={{
				height: "100%",
				width: "100%",
				backgroundColor: "#ffffff" /* *** */,
				position: "relative",
			}}
		>
			{/* the top board component */}
			<Top top_bg_color={top_bg_color}></Top>

			{/* GUI for vis interface */}
			<div
				className={"container-for-centered"}
				style={{ backgroundColor: container_control_color /* *** */ }}
			>
				<div
					id={"control"}
					className={"centered"}
					style={{
						height: control_height,
						width: control_width,
						backgroundColor: centered_control_color /* *** */,
						padding: "1.5em",
					}}
				>
					<div style={{ marginTop: "10px", marginLeft: "1.4em" }}>
						<span className={"control_font"}>Specify encoder</span>
						<Row style={{ width: "180px", marginTop: "5px" }}>
							<Col span={16}>
								<Select
									// showArrow={'false'}
									mode="multiple"
									style={{
										width: "100%",
										height: "32px",
									}}
									size={"small"}
									placeholder="Select an encoder"
									defaultValue={["(RX+RX)-(RY+RY)-(RY+RY)-(CNOT)"]}
									// onChange={handleChange}
									// options={options}
								/>
							</Col>
							<Col>
								<Button
									style={{ width: "100%", marginLeft: "0.2em", height: "32px" }}
									onClick={showDrawer}
									size={"small"}
								>
									<RightOutlined />
								</Button>
								<Drawer
									title="Basic Drawer"
									placement="right"
									closable={false}
									onClose={onClose}
									open={drawer_open}
								>
									{/*抽屉里面的内容*/}
									<List
										dataSource={[
											{
												id: 1,
												name: "Lily",
											},
											{
												id: 2,
												name: "Lily",
											},
										]}
										bordered
										renderItem={(item) => (
											<List.Item
												key={item.id}
												actions={[
													<a onClick={showDrawer} key={`a-${item.id}`}>
														View Profile
													</a>,
												]}
											>
												<List.Item.Meta
													avatar={
														<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
													}
													title={
														<a href="https://ant.design/index-cn">
															{item.name}
														</a>
													}
													description="Progresser XTech"
												/>
											</List.Item>
										)}
									/>
									<div className={"drawer_button_group"}>
										<Button
											style={{ marginRight: 8, display: "inline" }}
											// onClick={this.onClose}
										>
											Cancel
										</Button>
										<Button
											type="primary"
											// onClick={this.onClose}
										>
											Submit
										</Button>
									</div>
								</Drawer>
							</Col>
						</Row>
					</div>

					{/* Feature map selector */}
					<div style={{ marginTop: "10px", marginLeft: "1.4em" }}>
						<span className={"control_font"}>Feature map</span>
						<Row style={{ width: "220px", marginTop: "5px" }}>
							<Col span={16}>
								<Select
									style={{
										width: "100%",
										height: "32px",
									}}
									size={"small"}
									placeholder="Select feature map"
									value={featureMap}
									onChange={(val) => setFeatureMap(val)}
									options={featureMapOptionsWithDefault}
								/>
							</Col>
						</Row>
					</div>

					<div style={{ marginTop: "10px", marginRight: "1.5em" }}>
						<span className={"control_font"}>Training epoch</span>
						<Progress
							percent={100}
							status="active"
							strokeColor={progress_color}
							style={{ width: "150px", marginRight: "-30px", marginTop: "5px" }}
						/>
					</div>

					<div className="button-group">
						<Button
							icon={
								<span
									className="material-symbols-outlined"
									style={{ fontSize: "2em" }}
								>
									timer_pause
								</span>
							}
							type="text"
						/>
						<Button
							className={"play-button"}
							style={{
								color: play_btn_color,
								marginLeft: "2em",
								marginRight: "2em",
							}}
							icon={<PlayCircleFilled style={{ fontSize: "4.5em" }} />}
							type="text"
						/>
						<Button
							icon={
								<span className="material-icons" style={{ fontSize: "2em" }}>
									replay
								</span>
							}
							type="text"
						/>
					</div>

					<div style={{ marginTop: "10px" }}>
						<span className={"control_font"}>Epoch number</span>
						<Form.Item
							style={{ width: "200px", marginRight: "-30px", marginTop: "5px" }}
						>
							<Row>
								<Col span={14}>
									<Slider
										min={0}
										max={1000}
										step={100}
										value={100}
										// onAfterChange={this.view2_gate_qual_filter}
										// disabled={check1()}
									/>
								</Col>
								<Col>
									<InputNumber
										style={{ width: "40px" }}
										size={"small"}
										value={100}
										controls={false}
									/>
								</Col>
							</Row>
						</Form.Item>
					</div>

					<div style={{ marginTop: "10px", marginRight: "1em" }}>
						<span className={"control_font"}>Learning rate</span>
						<Form.Item
							style={{ width: "200px", marginRight: "-30px", marginTop: "5px" }}
						>
							<Row>
								<Col span={14}>
									<Slider
										min={0}
										max={0.1}
										step={0.01}
										value={0.02}
										// onAfterChange={this.view2_gate_qual_filter}
										// disabled={check1()}
									/>
								</Col>
								<Col>
									<InputNumber
										style={{ width: "40px" }}
										size={"small"}
										value={0.02}
										controls={false}
									/>
								</Col>
							</Row>
						</Form.Item>
					</div>
				</div>
			</div>

			{/* vis interface*/}
			<div
				className={"container-for-centered"}
				style={{ backgroundColor: container_vis_color /* *** */ }}
			>
				<div
					id={"vis_system"}
					style={{
						height: vis_height,
						width: vis_width,
						backgroundColor: centered_vis_color /* *** */,
					}}
				>
					{/* Component-1: original data view*/}
					{dataset
						? <OriginalDataView
								dataset={dataset["original_data"]}
								class_color={[color_class1, color_class2]}
								comp1_width={comp1_width}
								comp1_height={comp1_height}
								comp1_left={comp1_left}
								comp1_top={comp1_top}
							></OriginalDataView>
						: <Spin
								fullscreen={true}
								tip="Loading"
								className={"spin-comp1"}
								size="large"
							/>}

					{/* Component-2: data selector panel*/}
					{dataset && (
						<DataSelectorPanel
							dataset={dataset["original_data"]}
							default_circuit={default_circuit}
							onDatasetClick={handleDatasetClick}
							colors={[[color_class1, color_class2], color_comp2_bg]}
							comp2_width={comp2_width}
							comp2_height={comp2_height}
							comp2_left={comp2_left}
							comp2_top={comp2_top_adjusted}
							vis_width={vis_width}
						></DataSelectorPanel>
					)}

					{/* Component-3: quantum circuit show*/}
					{dataset && (
						<QuantumCircuitView
							dataset={dataset["circuit"]}
							comp3_width={comp3_width}
							comp3_height={comp3_height}
							comp3_left={comp3_left}
							comp3_top={comp3_top}
							color_comp3_bg={color_comp3_bg}
						></QuantumCircuitView>
					)}

					{/* Component-4: encoded map*/}
					{dataset && (
						<EncodedMapView
							dataset={dataset["encoded_data"]}
							boundary={dataset["boundary"]}
							colors={[[color_class1, color_class2], color_comp4_bg]}
							comp4_width={comp4_width}
							comp4_height={comp4_height}
							comp4_left={comp4_left}
							comp4_top={comp4_top}
						></EncodedMapView>
					)}

					{/* Link: animated line from Comp1 to Comp4*/}
					{dataset && (
						<Link
							// dataset={dataset['encoded_data']}
							boundary={null}
							colors={[[color_class1, color_class2], color_linkComp_bg]}
							linkComp_width={linkComp_width}
							linkComp_height={linkComp_height}
							linkComp_left={linkComp_left}
							linkComp_top={linkComp_top}
						></Link>
					)}

					{/* Component-5: Model performance view*/}
					{dataset && (
						<ModelPerformanceView
							dataset1={dataset["performance"]}
							dataset2={dataset["trained_data"]}
							colors={[[color_class1, color_class2], color_comp5_bg]}
							comp5_width={comp5_width}
							comp5_height={comp5_height}
							comp5_left={comp5_left}
							comp5_top={comp5_top_adjusted}
						></ModelPerformanceView>
					)}

					{/* Component-6: encoder step map*/}
					{dataset && (
						<EncoderStepMappingView
							dataset={[dataset["encoded_steps"], dataset["encoded_steps_sub"]]}
							comp6_width={comp6_width}
							comp6_height={comp6_height}
							comp6_left={comp6_left}
							comp6_top={comp6_top}
							colors={[[color_class1, color_class2], color_comp6_bg]}
						></EncoderStepMappingView>
					)}

					{/* Component-7: Quantum state distribution*/}
					{dataset && (
						<QuantumStateDistributionView
							dataset={dataset["distribution_map"]}
							comp7_width={comp7_width}
							comp7_height={comp7_height}
							comp7_left={comp7_left}
							comp7_top={comp7_top_adjusted}
							colors={[[color_class1, color_class2], color_comp7_bg]}
						></QuantumStateDistributionView>
					)}

					{/* Component-descriptionComp: some description*/}
					{dataset && (
						<DescriptionComp
							formula={dataset["feature_map_formula"]}
							left={descriptionComp_left}
							top={descriptionComp_top}
							width={descriptionComp_width}
							height={descriptionComp_height}
						/>
					)}
				</div>
			</div>

			<article>
				<div
					className="article-body"
					style={{ width: article_width, background: centered_article_bgColor }}
				>
					<P1></P1> {/*Article here*/}
				</div>
			</article>

			<footer>
				<div
					className="centered-footer"
					style={{ width: article_width, background: centered_footer_bgColor }}
				>
					<Footer></Footer>
				</div>
			</footer>
		</Layout>
	);
}

export default App;
