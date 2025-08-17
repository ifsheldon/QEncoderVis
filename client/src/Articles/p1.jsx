function P1() {
	return (
		<>
			<h1>What is Quantum Neural Network (QNN)?</h1>
			<p>
				Quantum Neural Networks (QNNs) are a hybrid machine learning paradigm
				that combines the computational power of quantum computing with the
				architecture and principles of classical neural networks. In classical
				neural networks, information is processed through layers of
				interconnected nodes (neurons), using weights and activation functions
				to learn patterns in data. QNNs, on the other hand, utilize quantum bits
				(qubits) and quantum gates to perform similar operations but with the
				added advantage of quantum mechanics principles such as superposition,
				entanglement, and interference.
			</p>
			<p>QNNs aim to:</p>
			<ul>
				<li>
					<p>
						Solve problems that are computationally expensive for classical
						neural networks, such as optimization problems and high-dimensional
						data analysis.
					</p>
				</li>
				<li>
					<p>
						Leverage quantum parallelism to process multiple states
						simultaneously, potentially reducing the time complexity of certain
						tasks.
					</p>
				</li>
				<li>
					<p>
						Enable applications in quantum chemistry, cryptography, material
						science, and other domains where quantum phenomena are central.
					</p>
				</li>
			</ul>
			<p>
				A QNN typically consists of layers of quantum circuits performing
				operations analogous to classical layers, followed by measurements to
				extract classical outputs.
			</p>

			<h1>What is a Quantum Data Encoder?</h1>
			<p>
				A Quantum Data Encoder is a fundamental component in quantum machine
				learning that transforms classical data into quantum states. Since
				quantum computers operate on quantum states rather than classical data,
				the encoder serves as a bridge between classical datasets and quantum
				algorithms. The encoded quantum states are represented as vectors in a
				Hilbert space, enabling quantum operations to be performed on them.
			</p>
			<p>Key purposes of quantum data encoders:</p>
			<ul>
				<li>
					<p>
						Data Representation: Encode classical data points into quantum
						states that can be manipulated by quantum algorithms.
					</p>
				</li>
				<li>
					<p>
						Feature Mapping: Map features into higher-dimensional spaces using
						quantum properties, potentially enabling better separability for
						machine learning tasks.
					</p>
				</li>
				<li>
					<p>
						Input Preparation: Prepare data for use in quantum circuits,
						ensuring efficient representation and compatibility with quantum
						gates.
					</p>
				</li>
			</ul>
			<p>
				Common encoding methods are the angle encoding: Uses rotation angles of
				quantum gates (such as <code>R(X)</code>, <code>R(Y)</code>, or{" "}
				<code>R(Z)</code>) to represent data features. For example, a feature
				value <code>x(i)</code> can be encoded as <code>R(Y)(2(Xi))|0⟩</code>.
			</p>
		</>
	);
}

export default P1;
