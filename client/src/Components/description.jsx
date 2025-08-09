import { MathJaxContext, MathJax } from "better-react-mathjax";

function DescriptionComp(_props) {
	const text1_span = {
		left: 250,
		top: 163,
		width: 150,
		height: 100,
		x2: 20,
		y2: 20,
	};

	text1_span.width_text = text1_span.width - text1_span.x2;
	text1_span.height_text = text1_span.height - text1_span.y2;

	const stroke_color = "#595959";

	const formula = "2 \\cdot \\arcsin\\left(\\sqrt{x_0}\\right)";

	const startX = text1_span.left + text1_span.x2; // x2 of the text box
	const startY = text1_span.top + text1_span.y2; // y2 of the text box
	const endX = text1_span.left; // Center of span
	const endY = text1_span.top; // Center of span

	// Calculate midpoints for the curve
	const midX = (startX + endX) / 2;
	const midY = (startY + endY) / 2 + 10; // Light curve above the midpoint

	// Path for the curved arrow
	const _curvePath = `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;

	return (
		<>
			{/* SVG for the arrow */}
			{/*<svg style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%",}}>*/}
			{/*    <path d={curvePath} stroke={stroke_color} strokeWidth="1" fill="none" markerEnd="url(#arrowhead)"/>*/}
			{/*    <defs>*/}
			{/*        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="7" refY="3.5" orient="auto">*/}
			{/*            <polygon points="0 0, 10 3.5, 0 7" fill={stroke_color} />*/}
			{/*        </marker>*/}
			{/*    </defs>*/}
			{/*</svg>*/}

			{/* Text span */}
			<span
				style={{
					position: "absolute",
					width: text1_span.width_text,
					height: text1_span.height_text,
					left: text1_span.left + text1_span.x2 - 40,
					top: text1_span.top + text1_span.y2 + 5,
					fontSize: "11px",
					fontWeight: 350,
					lineHeight: "1.38em",
					color: stroke_color,
					fontStyle: "italic",
				}}
			>
				Two data dimensions will be converted initially based on:
				<MathJaxContext>
					<div>
						<MathJax style={{ fontStyle: "italic", fill: "#000000" }}>
							{`\\(${formula}\\)`}
						</MathJax>
					</div>
				</MathJaxContext>
			</span>
		</>
	);
}

export default DescriptionComp;
