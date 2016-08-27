import React from "react";
import AppNav from "./AppNav/AppNav.jsx";

class NotFound extends React.Component {
	render() {
		return (
			<div>
				<AppNav></AppNav>
				<div className="notfound">
					<h1>{"Hm. We couldn't find what you're looking for!"}</h1>
				</div>
			</div>
		);
	}
}

export default NotFound;
