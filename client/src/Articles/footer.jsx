import { Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";

function Footer() {
	return (
		<>
			<div className={"avatar-contributor-text"}>Contributor</div>
			<Avatar.Group className={"avatar-group"}>
				<Tooltip title="Shaolun Ruan" placement="top">
					<a href="https://shaolun-ruan.com/">
						<Avatar
							style={{
								backgroundColor: "#be65b2",
							}}
							src={"https://api.dicebear.com/7.x/miniavs/svg?seed=1"}
						/>
					</a>
				</Tooltip>
				<Tooltip title="User" placement="top">
					<a href="">
						<Avatar
							style={{
								backgroundColor: "#93b7d9",
							}}
							src={"https://api.dicebear.com/7.x/miniavs/svg?seed=1"}
						/>
					</a>
				</Tooltip>
				<Tooltip title="User" placement="top">
					<Avatar
						gap={20}
						style={{
							backgroundColor: "#87d068",
						}}
						icon={<UserOutlined />}
					/>
				</Tooltip>
				<Tooltip title="User" placement="top">
					<Avatar
						gap={20}
						style={{
							backgroundColor: "#87d068",
						}}
						icon={<UserOutlined />}
					/>
				</Tooltip>
			</Avatar.Group>
		</>
	);
}

export default Footer;
