import React from "react";
import { Typography, Steps, theme } from "antd";

const { Title, Text, Paragraph } = Typography;

function P1() {
	const { token } = theme.useToken();

	const stepsItems = [
		{
			title: "Select Dataset",
			description: (
				<Paragraph>
					Select a dataset with the <Text code>Data Selector</Text> view. You can
					inspect the selected dataset using the <Text code>Original Data</Text>{" "}
					view.
				</Paragraph>
			),
		},
		{
			title: "Specify Encoder",
			description: (
				<Paragraph>
					Click <Text code>Specify encoder</Text> to select an encoder. After that
					you can see the encoder circuit in the <Text code>Quantum Encoder</Text>{" "}
					view and corresponding stage-by-stage mapping below it.
				</Paragraph>
			),
		},
		{
			title: "Visualize Encoder Map",
			description: (
				<Paragraph>
					<Text code>Encoder Map</Text> view visualizes the quantum state
					distribution of the encoded data. Click{" "}
					<Text code>Show boundary line</Text> to show the boundary line of the
					original data on top of the quantum state distribution.
				</Paragraph>
			),
		},
		{
			title: "Analyze State Comparison",
			description: (
				<Paragraph>
					<Text code>State Comparison Map</Text> view reveals the mixed states of
					encoded values of class A and class B, in terms of the representation of
					quantum states (quantum version data). The more the two color circles
					are mixed, the worse the encoder distinguish the two classes data.
					<ul>
						<li>
							Hover over the points to see the corresponding data point in the{" "}
							<Text code>Original Data</Text> view.
						</li>
					</ul>
				</Paragraph>
			),
		},
		{
			title: "Set Training Parameters",
			description: (
				<Paragraph>
					For training, you can set <Text code>Epoch number</Text> and{" "}
					<Text code>Learning rate</Text>.
				</Paragraph>
			),
		},
		{
			title: "Start Training",
			description: (
				<Paragraph>
					Start training by clicking the ▶️ button.
					<ul>
						<li>
							You can see the training progress with{" "}
							<Text code>Training epoch</Text> progress bar.
						</li>
						<li>
							Accuracies and losses are displayed in the{" "}
							<Text code>Model Performance</Text> view (bottom right).
						</li>
						<li>
							The <Text code>Trained Map</Text> view (bottom left) visualizes
							the quantum state distribution of the features of datapoints
							encoded by the trained QNN models. Compare it against the{" "}
							<Text code>Encoder Map</Text> view and the{" "}
							<Text code>Original Data</Text> view.
						</li>
					</ul>
				</Paragraph>
			),
		},
	];

	return (
		<div style={{ padding: "0 24px" }}>
			<Title level={2} style={{ marginTop: 0, marginBottom: 32 }}>
				XQAI Encoder Visualization Step-by-step Guide
			</Title>
			<Steps
				direction="vertical"
				current={-1} // No active step, just a list
				items={stepsItems}
				size="small"
			/>
		</div>
	);
}

export default P1;
