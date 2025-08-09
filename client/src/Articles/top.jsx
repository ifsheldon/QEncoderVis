import React, { useState, useRef, useEffect } from "react";
import { Layout, Tooltip } from "antd";

const { Header, Content } = Layout;

function Top(props) {
	let { top_bg_color } = props;

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
