import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function P1() {
	return (
		<>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					img: ({ node, ...props }) => (
						<img {...props} style={{ maxWidth: "100%", height: "auto" }} />
					),
				}}
			>
				{md}
			</ReactMarkdown>
		</>
	);
}

const md = `
# XQAI Encoder Visualization Step-by-step Guide

1. Select a dataset with the \`Data Selector\` view. You can inspect the selected dataset using the\`Original Data\` view.
2. Click \`Specify encoder\` to select an encoder. After that you can see the encoder circuit in the \`Quantum Encoder\` view and corresponding stage-by-stage mapping below it.
3. \`Encoder Map\` view visualizes the quantum state distribution of the encoded data. Click \`Show boundary line\` to show the boundary line of the original data on top of the quantum state distribution.
4. \`State Comparison Map\` view reveals the mixed states of encoded values of class A and class B, in terms of the representation of quantum states (quantum version data). The more the two color circles are mixed, the worse the encoder distinguish the two classes data.
   * Hover over the points to see the corresponding data point in the \`Original Data\` view.
5. For training, you can set \`Epoch number\` and \`Learning rate\`.
6. Start training by clicking the ▶️ button. 
   * You can see the training progress with \`Training epoch\` progress bar.
   * Accuracies and losses are displayed in the \`Model Performance\` view (bottom right).
   * The \`Trained Map\` view (bottom left) visualizes the quantum state distribution of the features of datapoints encoded by the trained QNN models. Compare it against the \`Encoder Map\` view and the \`Original Data\` view.

`;

export default P1;
