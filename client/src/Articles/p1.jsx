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
## What is Quantum Neural Network (QNN)?

Quantum Neural Networks (QNNs) are a hybrid machine learning paradigm that combines the computational power of quantum computing with the architecture and principles of classical neural networks. In classical neural networks, information is processed through layers of interconnected nodes (neurons), using weights and activation functions to learn patterns in data. QNNs, on the other hand, utilize quantum bits (qubits) and quantum gates to perform similar operations but with the added advantage of quantum mechanics principles such as superposition, entanglement, and interference.

**QNNs aim to:**

- Solve problems that are computationally expensive for classical neural networks, such as optimization problems and high-dimensional data analysis.
- Leverage quantum parallelism to process multiple states simultaneously, potentially reducing the time complexity of certain tasks.
- Enable applications in quantum chemistry, cryptography, material science, and other domains where quantum phenomena are central.

A QNN typically consists of layers of quantum circuits performing operations analogous to classical layers, followed by measurements to extract classical outputs.

## What is a Quantum Data Encoder?

A Quantum Data Encoder transforms classical data into quantum states, acting as a bridge between classical datasets and quantum algorithms. The encoded quantum states are represented as vectors in a Hilbert space, enabling quantum operations to be performed on them.

**Key purposes of quantum data encoders:**

- Data representation: Encode classical data points into quantum states that can be manipulated by quantum algorithms.
- Feature mapping: Map features into higher-dimensional spaces using quantum properties, potentially enabling better separability for machine learning tasks.
- Input preparation: Prepare data for use in quantum circuits, ensuring efficient representation and compatibility with quantum gates.

Common encoding methods include angle encoding, which uses rotation angles of quantum gates (such as RX, RY, or RZ) to represent data features. For example, a feature value xi can be encoded via a rotation applied to the initial state.

![Example encoder circuit](/thumbnails/circuit_0.png)
`;

export default P1;
