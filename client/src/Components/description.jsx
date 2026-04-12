import { MathJax, MathJaxContext } from "better-react-mathjax";

function DescriptionComp(props) {
	// Allow external positioning and sizing
	const baseLeft = props.left ?? 250;
	const baseTop = props.top ?? 163;
	const baseWidth = props.width ?? 150;
	const baseHeight = props.height ?? 100;

	const text1_span = {
		left: baseLeft,
		top: baseTop,
		width: baseWidth,
		height: baseHeight,
		x2: 20,
		y2: 20,
	};

	text1_span.width_text = text1_span.width - text1_span.x2;
	text1_span.height_text = text1_span.height - text1_span.y2;

	const stroke_color = "#595959";

	const formula = props.formula || "";

	return (
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
					{formula && (
						<MathJax dynamic style={{ fontStyle: "italic", fill: "#000000" }}>
							{`\\(${formula}\\)`}
						</MathJax>
					)}
				</div>
			</MathJaxContext>
		</span>
	);
}

export default DescriptionComp;
