import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import {
	Layout,
	Form,
	Button,
	InputNumber,
	Slider,
	Row,
	Col,
	Progress,
	Drawer,
	Card,
} from "antd";
import {
	RightOutlined,
	PlayCircleFilled,
	PauseCircleFilled,
} from "@ant-design/icons";

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

// All color setting here`
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
	const DEFAULT_EPOCH = 100;
	const DEFAULT_LR = 0.02;
	const [data_name, set_dataName] = useState(default_circuit);
	const [dataset, setDataset] = useState(null);
	const [encoders, setEncoders] = useState({});
	const [defaults, setDefaults] = useState({});
	const [selectedEncoder, setSelectedEncoder] = useState(null);
	const [epochNumber, setEpochNumber] = useState(DEFAULT_EPOCH);
	const [learningRate, setLearningRate] = useState(DEFAULT_LR);
	const [circuitPreview, setCircuitPreview] = useState(null);
	const [encodedData, setEncodedData] = useState(null);
	const [lastTrained, setLastTrained] = useState({
		circuitId: null,
		encoderName: null,
		epochNumber: null,
		learningRate: null,
	});

	// Streaming training session state
	const [sessionId, setSessionId] = useState(null);
	const eventSourceRef = useRef(null);
	const [trainingActive, setTrainingActive] = useState(false);
	const [paused, setPaused] = useState(false);
	const [currentEpoch, setCurrentEpoch] = useState(0);

	const [drawer_open, set_drawer_open] = useState(false);
	const prevDataNameRef = useRef(data_name);
	const initialFetchDoneRef = useRef(false);

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

	// Helper: cleanup current EventSource
	const cleanupStream = async (doStop = false) => {
		try {
			if (doStop && sessionId) {
				await axios.post(`http://127.0.0.1:3030/api/train/stop`, {
					session_id: sessionId,
				});
			}
		} catch (e) {}
		if (eventSourceRef.current) {
			try {
				eventSourceRef.current.close();
			} catch (e) {}
			eventSourceRef.current = null;
		}
		setSessionId(null);
		setTrainingActive(false);
		setPaused(false);
		setCurrentEpoch(0);
	};

	// Helper: whether current selection matches last trained configuration
	const isCurrentSelectionTrained = () => {
		const currentCircuitId = data_port_map[data_name];
		if (!lastTrained) return false;
		return (
			lastTrained.circuitId === currentCircuitId &&
			lastTrained.encoderName === selectedEncoder &&
			lastTrained.epochNumber === epochNumber &&
			lastTrained.learningRate === learningRate
		);
	};

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

	// One-time initial fetch on first mount after defaults/encoder are ready
	useEffect(() => {
		const defaultsReady = defaults && Object.keys(defaults).length > 0;
		if (!defaultsReady) return;
		if (!selectedEncoder) return;
		if (initialFetchDoneRef.current) return;
		const circuit_id = data_port_map[data_name];
		const request_url = `http://127.0.0.1:3030/api/run_circuit`;
		const payload = {
			circuit: circuit_id,
			encoder_name: selectedEncoder,
			epoch_number: epochNumber,
			lr: learningRate,
		};
		const fetchData = async () => {
			try {
				setDataset(null);
				prevDataNameRef.current = data_name;
				const result = await axios.post(request_url, payload);
				initialFetchDoneRef.current = true;
				setDataset(result.data);
				setLastTrained({
					circuitId: circuit_id,
					encoderName: selectedEncoder,
					epochNumber: epochNumber,
					learningRate: learningRate,
				});
			} catch (err) {
				console.error("Failed to load initial dataset", err);
				initialFetchDoneRef.current = true;
				setDataset(null);
			}
		};
		fetchData();
	}, [defaults, selectedEncoder]);

	// Unmount cleanup
	useEffect(() => {
		return () => {
			cleanupStream(false);
		};
	}, []);

	// Start streaming training
	const startStreamingTraining = async () => {
		const circuit_id = data_port_map[data_name];
		const start_url = `http://127.0.0.1:3030/api/train/start`;
		const payload = {
			circuit: circuit_id,
			epoch_number: epochNumber,
			lr: learningRate,
		};
		if (selectedEncoder) payload.encoder_name = selectedEncoder;
		try {
			await cleanupStream(true);
			setDataset(null);
			prevDataNameRef.current = data_name;
			const res = await axios.post(start_url, payload);
			const newSessionId = res.data.session_id;
			setSessionId(newSessionId);
			setTrainingActive(true);
			setPaused(false);
			setCurrentEpoch(0);
			// Initialize dataset holder for progressive updates
			setDataset({
				performance: { epoch_number: epochNumber, loss: [], accuracy: [] },
				trained_data: { feature: [], label: [] },
				distribution_map: [],
				feature_map_formula: encoders[selectedEncoder]?.feature_map_formula,
				circuit: circuitPreview || null,
			});
			setLastTrained({
				circuitId: circuit_id,
				encoderName: selectedEncoder,
				epochNumber: epochNumber,
				learningRate: learningRate,
			});

			// Open SSE stream
			const streamUrl = `http://127.0.0.1:3030/api/train/stream?session_id=${newSessionId}`;
			const es = new EventSource(streamUrl);
			eventSourceRef.current = es;
			es.onmessage = (ev) => {
				try {
					const msg = JSON.parse(ev.data);
					if (msg.type === "session") {
						return;
					}
					if (msg.type === "epoch") {
						setCurrentEpoch(msg.epoch || 0);
						setDataset((prev) => {
							const perf = prev?.performance || {
								epoch_number: msg.epoch_number,
								loss: [],
								accuracy: [],
							};
							const nextLoss = Array.isArray(perf.loss)
								? [...perf.loss, msg.loss]
								: [msg.loss];
							const nextAcc = Array.isArray(perf.accuracy)
								? [...perf.accuracy, msg.accuracy]
								: [msg.accuracy];
							return {
								...prev,
								performance: {
									epoch_number: msg.epoch_number,
									loss: nextLoss,
									accuracy: nextAcc,
								},
								trained_data: msg.trained_data,
								distribution_map: msg.distribution_map,
								feature_map_formula:
									msg.feature_map_formula || prev?.feature_map_formula,
							};
						});
						return;
					}
					if (msg.type === "done") {
						setTrainingActive(false);
						setPaused(false);
						if (eventSourceRef.current) {
							eventSourceRef.current.close();
							eventSourceRef.current = null;
						}
						setSessionId(null);
						return;
					}
				} catch (e) {
					console.error("Failed to parse SSE message", e);
				}
			};
			es.onerror = () => {
				if (eventSourceRef.current) {
					eventSourceRef.current.close();
					eventSourceRef.current = null;
				}
				setTrainingActive(false);
				setPaused(false);
				setSessionId(null);
			};
		} catch (err) {
			console.error("Failed to start streaming training", err);
			setTrainingActive(false);
			setPaused(false);
			setSessionId(null);
		}
	};

	const togglePauseResume = async () => {
		if (!sessionId) return;
		try {
			if (!paused) {
				await axios.post(`http://127.0.0.1:3030/api/train/pause`, {
					session_id: sessionId,
				});
				setPaused(true);
			} else {
				await axios.post(`http://127.0.0.1:3030/api/train/resume`, {
					session_id: sessionId,
				});
				setPaused(false);
			}
		} catch (e) {
			console.error("Failed to toggle pause/resume", e);
		}
	};

	const stopTraining = async () => {
		await cleanupStream(true);
	};

	// Fast updates for circuit preview and encoded data when dataset or encoder changes
	useEffect(() => {
		// Build circuit preview from encoders list and current dataset (for qubit/ansatz if available)
		if (
			selectedEncoder &&
			encoders &&
			Object.prototype.hasOwnProperty.call(encoders, selectedEncoder)
		) {
			const steps = encoders[selectedEncoder].steps || [];
			const stepsCount = Array.isArray(steps) ? steps.length : 0;
			const preview = {
				qubit_number:
					(dataset && dataset.circuit && dataset.circuit.qubit_number) || 2,
				encoder_step: stepsCount,
				encoder: steps,
				ansatz: (dataset && dataset.circuit && dataset.circuit.ansatz) || [],
				measure: (dataset && dataset.circuit && dataset.circuit.measure) || [],
			};
			setCircuitPreview(preview);
		} else {
			setCircuitPreview(null);
		}

		// Fetch encoded data quickly for the selected dataset and encoder
		const circuit_id = data_port_map[data_name];
		if (!selectedEncoder) {
			setEncodedData(null);
			return;
		}
		const source = axios.CancelToken.source();
		axios
			.get(`http://127.0.0.1:3030/api/get_encoded_data`, {
				params: { circuit_id, encoder_name: selectedEncoder },
				cancelToken: source.token,
			})
			.then((res) => {
				setEncodedData(res.data || null);
			})
			.catch((err) => {
				if (!axios.isCancel(err)) {
					console.error("Failed to fetch encoded data quickly", err);
				}
				setEncodedData(null);
			});
		return () => {
			source.cancel("Route changed");
		};
	}, [data_name, selectedEncoder, encoders, dataset]);

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
									onClick={!trainingActive ? showDrawer : undefined}
									style={{
										cursor: trainingActive ? "not-allowed" : "pointer",
										color: "#1677ff",
										opacity: trainingActive ? 0.6 : 1,
									}}
								>
									{selectedEncoder || "(default)"}
								</span>
							</Col>
							<Col>
								<Button
									style={{ width: "100%", marginLeft: "0.2em", height: "32px" }}
									onClick={showDrawer}
									size={"small"}
									disabled={trainingActive}
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
										style={{
											fontSize: 18,
											fontWeight: 600,
											marginBottom: 12,
											opacity: trainingActive ? 0.6 : 1,
										}}
									>
										Select an encoder
									</div>
									<Row gutter={[12, 12]}>
										{Object.entries(encoders).map(([name, encoder]) => {
											const steps = encoder.steps;
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
															if (trainingActive) return;
															setSelectedEncoder(name);
															set_drawer_open(false);
														}}
														style={{
															width: "100%",
															border: isSelected
																? "2px solid #1677ff"
																: undefined,
															opacity: trainingActive ? 0.6 : 1,
															cursor: trainingActive
																? "not-allowed"
																: "pointer",
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
															id={"enc-preview"}
															style={{ opacity: trainingActive ? 0.6 : 1 }}
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
							percent={Math.min(
								100,
								Math.round((currentEpoch / Math.max(1, epochNumber)) * 100),
							)}
							status="active"
							strokeColor={progress_color}
							style={{ width: "150px", marginRight: "-30px", marginTop: "5px" }}
						/>
					</div>

					<div className="button-group">
						<Button
							className={"play-button"}
							style={{
								color: play_btn_color,
								marginLeft: "2em",
								marginRight: "2em",
							}}
							icon={
								trainingActive
									? paused
										? <PlayCircleFilled style={{ fontSize: "4.5em" }} />
										: <PauseCircleFilled style={{ fontSize: "4.5em" }} />
									: <PlayCircleFilled style={{ fontSize: "4.5em" }} />
							}
							type="text"
							onClick={
								trainingActive ? togglePauseResume : startStreamingTraining
							}
						/>
						<Button
							icon={
								<span className="material-icons" style={{ fontSize: "2em" }}>
									replay
								</span>
							}
							type="text"
							onClick={async () => {
								if (trainingActive) {
									await stopTraining();
								} else {
									setEpochNumber(DEFAULT_EPOCH);
									setLearningRate(DEFAULT_LR);
								}
							}}
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
										min={1}
										max={1000}
										step={1}
										value={epochNumber}
										onChange={setEpochNumber}
										disabled={trainingActive}
									/>
								</Col>
								<Col>
									<InputNumber
										style={{ width: "60px" }}
										size={"small"}
										min={1}
										max={1000}
										value={epochNumber}
										onChange={(v) => {
											if (typeof v === "number") setEpochNumber(v);
										}}
										disabled={trainingActive}
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
										value={learningRate}
										onChange={setLearningRate}
										disabled={trainingActive}
									/>
								</Col>
								<Col>
									<InputNumber
										style={{ width: "60px" }}
										size={"small"}
										min={0}
										max={0.1}
										step={0.01}
										value={learningRate}
										onChange={(v) => {
											if (typeof v === "number") setLearningRate(v);
										}}
										disabled={trainingActive}
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
					<OriginalDataView
						circuitId={data_port_map[data_name]}
						class_color={[color_class1, color_class2]}
						comp1_width={comp1_width}
						comp1_height={comp1_height}
						comp1_left={comp1_left}
						comp1_top={comp1_top}
					></OriginalDataView>

					{/* Component-2: data selector panel (always rendered) */}
					<DataSelectorPanel
						default_circuit={data_name}
						onDatasetClick={handleDatasetClick}
						colors={[[color_class1, color_class2], color_comp2_bg]}
						comp2_width={comp2_width}
						comp2_height={comp2_height}
						comp2_left={comp2_left}
						comp2_top={comp2_top_adjusted}
						vis_width={vis_width}
						disabled={trainingActive}
					></DataSelectorPanel>

					{/* Component-3: quantum circuit show*/}
					{circuitPreview && (
						<QuantumCircuitView
							key={`${data_name}-${selectedEncoder || "default"}`}
							dataset={circuitPreview}
							comp3_width={comp3_width}
							comp3_height={comp3_height}
							comp3_left={comp3_left}
							comp3_top={comp3_top}
							color_comp3_bg={color_comp3_bg}
						></QuantumCircuitView>
					)}

					{/* Component-4: encoded map*/}
					{encodedData?.encoded_data && (
						<EncodedMapView
							dataset={encodedData.encoded_data}
							boundary={null}
							colors={[[color_class1, color_class2], color_comp4_bg]}
							comp4_width={comp4_width}
							comp4_height={comp4_height}
							comp4_left={comp4_left}
							comp4_top={comp4_top}
						></EncodedMapView>
					)}

					{/* Link: animated line from Comp1 to Comp4*/}
					{encodedData?.encoded_data && (
						<Link
							boundary={null}
							colors={[[color_class1, color_class2], color_linkComp_bg]}
							linkComp_width={linkComp_width}
							linkComp_height={linkComp_height}
							linkComp_left={linkComp_left}
							linkComp_top={linkComp_top}
						></Link>
					)}

					{/* Component-5: Model performance view*/}
					{dataset && isCurrentSelectionTrained() && (
						<ModelPerformanceView
							key={`mp-${currentEpoch}`}
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
					{encodedData?.encoded_steps && encodedData?.encoded_steps_sub && (
						<EncoderStepMappingView
							key={`${data_name}-${selectedEncoder || "default"}-steps`}
							dataset={[
								encodedData.encoded_steps,
								encodedData.encoded_steps_sub,
							]}
							comp6_width={comp6_width}
							comp6_height={comp6_height}
							comp6_left={comp6_left}
							comp6_top={comp6_top}
							colors={[[color_class1, color_class2], color_comp6_bg]}
						></EncoderStepMappingView>
					)}

					{/* Component-7: Quantum state distribution*/}
					{encodedData?.distribution_map && (
						<QuantumStateDistributionView
							dataset={encodedData.distribution_map}
							comp7_width={comp7_width}
							comp7_height={comp7_height}
							comp7_left={comp7_left}
							comp7_top={comp7_top_adjusted}
							colors={[[color_class1, color_class2], color_comp7_bg]}
						></QuantumStateDistributionView>
					)}

					{/* Component-descriptionComp: some description*/}
					{encoders && encoders[selectedEncoder] && (
						<DescriptionComp
							formula={encoders[selectedEncoder].feature_map_formula}
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
