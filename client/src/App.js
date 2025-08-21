import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import {
	Layout,
	Form,
	Button,
	InputNumber,
	Slider,
	Spin,
	Row,
	Col,
	Progress,
	Drawer,
	Card,
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
};

function App() {
	const default_circuit = "circuit_5";
	const [data_name, set_dataName] = useState(default_circuit);
	const [dataset, setDataset] = useState(null);
	const [encoders, setEncoders] = useState({});
	const [defaults, setDefaults] = useState({});
	const [selectedEncoder, setSelectedEncoder] = useState(null);

	const [drawer_open, set_drawer_open] = useState(false);
	const [_comp6Loading, _setComp6Loading] = useState(true);
	const prevDataNameRef = useRef(data_name);
	const [encStepsKey, setEncStepsKey] = useState(0);

	const handleDatasetClick = (datasetName) => {
		set_dataName(datasetName);
	};

	/*设置抽屉的状态的函数*/
	const showDrawer = () => {
		set_drawer_open(true);
	};

	const onClose = () => {
		set_drawer_open(false);
	};

	//////////////////////////////////////////////

	// Load encoders once
	useEffect(() => {
		const fetchEncoders = async () => {
			try {
				const res = await axios.get(`http://127.0.0.1:3030/api/get_encoders`);
				setEncoders(res.data.encoders || {});
				setDefaults(res.data.defaults || {});
			} catch (err) {
				console.error("Failed to fetch encoders", err);
			}
		};
		fetchEncoders();
	}, []);

	// Sync selected encoder with dataset defaults when circuit changes
	useEffect(() => {
		const circuit_id = data_port_map[data_name];
		if (
			defaults &&
			Object.prototype.hasOwnProperty.call(defaults, circuit_id)
		) {
			setSelectedEncoder(defaults[circuit_id]);
		}
	}, [data_name, defaults]);

	// Fetch data when circuit or encoder changes
	useEffect(() => {
		const circuit_id = data_port_map[data_name];
		const request_url = `http://127.0.0.1:3030/api/run_circuit`;
		const defaultsReady = defaults && Object.keys(defaults).length > 0;
		const defaultEnc = defaultsReady ? defaults[circuit_id] : null;
		const prevCircuitId = data_port_map[prevDataNameRef.current];
		const dataNameChanged = prevCircuitId !== circuit_id;

		// Avoid double fetch: when dataset changes, wait for selectedEncoder to sync to default
		if (dataNameChanged && defaultEnc && selectedEncoder !== defaultEnc) {
			return;
		}
		// Also wait until defaults are available (initial mount)
		if (!defaultsReady) {
			return;
		}

		const fetchData = async () => {
			try {
				prevDataNameRef.current = data_name; // mark fetch for this dataset
				const payload = { circuit: circuit_id };
				if (selectedEncoder) payload.encoder_name = selectedEncoder;
				const result = await axios.post(request_url, payload);
				console.log(
					`'App.js' - Dataset (${data_name}) loaded with encoder ${selectedEncoder}. `,
					result.data,
				);
				setDataset(result.data);
			} catch (err) {
				console.error("Failed to load dataset", err);
				setDataset(null);
			}
		};

		fetchData();
	}, [data_name, selectedEncoder, defaults]);

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
						<Row
							style={{ width: "260px", marginTop: "5px", alignItems: "center" }}
						>
							<Col span={18}>
								<span
									onClick={showDrawer}
									style={{ cursor: "pointer", color: "#1677ff" }}
								>
									{selectedEncoder || "(default)"}
								</span>
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
									title={null}
									placement="right"
									closable={true}
									onClose={onClose}
									open={drawer_open}
									width={640}
									bodyStyle={{ padding: 16 }}
								>
									<div
										style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}
									>
										Select an encoder
									</div>
									<Row gutter={[12, 12]}>
										{Object.entries(encoders).map(([name, steps]) => {
											const stepsCount = Array.isArray(steps)
												? steps.length
												: 0;
											const isSelected = selectedEncoder === name;
											const previewCircuit = {
												qubit_number:
													(dataset &&
														dataset.circuit &&
														dataset.circuit.qubit_number) ||
													2,
												encoder_step: stepsCount,
												encoder: steps,
												ansatz:
													(dataset &&
														dataset.circuit &&
														dataset.circuit.ansatz) ||
													[],
												measure:
													(dataset &&
														dataset.circuit &&
														dataset.circuit.measure) ||
													[],
											};
											return (
												<Col xs={24} sm={12} key={name}>
													<Card
														hoverable
														onClick={() => {
															setSelectedEncoder(name);
															set_drawer_open(false);
														}}
														style={{
															width: "100%",
															border: isSelected
																? "2px solid #1677ff"
																: undefined,
														}}
													>
														<div
															style={{
																display: "flex",
																justifyContent: "space-between",
																alignItems: "center",
															}}
														>
															<div style={{ fontWeight: 600 }}>{name}</div>
														</div>
														<QuantumCircuitView
															dataset={previewCircuit}
															comp3_width={280}
															comp3_height={90}
															comp3_left={0}
															comp3_top={0}
															color_comp3_bg={color_comp3_bg}
															svgId={`enc-card-${name}`}
															forCards={true}
														/>
													</Card>
												</Col>
											);
										})}
									</Row>
								</Drawer>
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
							key={`${data_name}-${selectedEncoder || "default"}`}
							dataset={dataset["circuit"]}
							comp3_width={comp3_width}
							comp3_height={comp3_height}
							comp3_left={comp3_left}
							comp3_top={comp3_top}
							color_comp3_bg={color_comp3_bg}
							onRendered={() => setEncStepsKey((k) => k + 1)}
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
							key={encStepsKey}
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
