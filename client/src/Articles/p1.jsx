import React from "react";
import { Typography, Steps, theme, ConfigProvider } from "antd";

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
					<ul>
						<li>
							Each data point is color-coded to indicate its class (assigned
							values of -1 and +1).
						</li>
						<li>
							The view visualizes the original two-dimensional input before it is
							encoded into quantum states.
						</li>
					</ul>
				</Paragraph>
			),
		},
		{
			title: "Specify Encoder",
			description: (
				<Paragraph>
					Click <Text code>Specify encoder</Text> to select an encoder from a
					set of pre-configured options.
					<ul>
						<li>
							You can choose from 10 different 2-qubit encoder circuits
							incorporating various combinations of Pauli Rotation Gates and
							Control Gates.
						</li>
						<li>
							After selection, you can see the encoder circuit in the{" "}
							<Text code>Quantum Encoder</Text> view and the corresponding
							stage-by-stage mapping below it.
						</li>
					</ul>
				</Paragraph>
			),
		},
		{
			title: "Visualize Encoder Map",
			description: (
				<Paragraph>
					The <Text code>Encoder Map</Text> view visualizes the quantum state
					distribution of the encoded data using{" "}
					<Text strong>Encoder Expectation Measurement</Text>.
					<ul>
						<li>
							It maps the complex quantum states back to a scalar value (expectation value ranging from -1 to 1).
						</li>
						<li>
							Click <Text code>Show boundary line</Text> to overlay the original
							data's boundary on the quantum state distribution to see how
							patterns are preserved.
						</li>
					</ul>
				</Paragraph>
			),
		},
		{
			title: "Analyze State Comparison",
			description: (
				<Paragraph>
					The <Text code>State Comparison Map</Text> view reveals the separability of the two classes in the quantum feature space.
					<ul>
						<li>
							It uses <Text strong>Principal Component Analysis (PCA)</Text> to project high-dimensional density matrices of quantum states into 2D coordinates.
						</li>
						<li>
							<Text strong>Well-encoded:</Text> Distinct clusters for different classes (e.g., yellow vs. green).
						</li>
						<li>
							<Text strong>Poorly-encoded:</Text> Mixed or overlapping clusters, indicating the encoder struggles to distinguish the classes.
						</li>
					</ul>
				</Paragraph>
			),
		},
		{
			title: "Set Training Parameters",
			description: (
				<Paragraph>
					For training the Quantum Neural Network (QNN), you can configure:
					<ul>
						<li>
							<Text code>Epoch number</Text>: The number of training iterations.
						</li>
						<li>
							<Text code>Learning rate</Text>: Controls the step size during optimization.
						</li>
					</ul>
				</Paragraph>
			),
		},
		{
			title: "Start Training",
			description: (
				<Paragraph>
					Start training by clicking the ▶️ button. The system provides real-time feedback:
					<ul>
						<li>
							<Text code>Model Performance</Text> view: Displays training loss (blue line) and accuracy (orange line) evolving over epochs.
						</li>
						<li>
							<Text code>Trained Map</Text> view: Visualizes the learned decision boundaries and quantum state distribution of the trained model. Compare this against the <Text code>Encoder Map</Text> and <Text code>Original Data</Text> to assess how well the model captured the underlying patterns.
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
			<ConfigProvider
				theme={{
					components: {
						Steps: {
							titleLineHeight: 32,
						},
					},
					token: {
						colorTextDescription: "rgba(0, 0, 0, 0.45)",
						colorPrimary: "#006962", // Greenish theme color
					},
				}}
			>
				{/* We override styles directly because Steps 'process' status color logic can be tricky with inactive steps */}
				<style>{`
          .ant-steps-item-title {
            color: #006962 !important; /* Greenish theme color to match the site */
            font-weight: 600 !important;
            font-size: 16px !important;
          }
           .ant-steps-item-icon .ant-steps-icon {
            color: #006962 !important; /* Make the icon/number green too */
          }
           .ant-steps-item-tail::after {
            background-color: #006962 !important; /* Make the connecting line green */
             opacity: 0.3;
          }
        `}</style>
				<Steps
					direction="vertical"
					current={-1} // No active step, just a list
					items={stepsItems}
					size="small"
				/>
			</ConfigProvider>
		</div>
	);
}

export default P1;
