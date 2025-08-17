import { Layout } from "antd";

const { Header } = Layout;

function Top(props) {
	const { top_bg_color } = props;

	return (
		<Header className={"header"} style={{ backgroundColor: top_bg_color }}>
			<h1>
				Quantum Neural Network is no longer in the textbook!
				<br /> Explore how the Encoder works here.
			</h1>
		</Header>
	);
}

export default Top;
