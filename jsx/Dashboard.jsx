import React from "react";
import bartender from "./Bartender.jsx";
import {browserHistory} from "react-router";
import AppNav from "./AppNav/AppNav.jsx";
import BarName from "./BarName.jsx";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.newOrder = this.newOrder.bind(this);
	}
	render() {
		return (
			<div>
				<AppNav></AppNav>
				<div className="dashboard">
					<h1>
						<BarName barID={this.props.bar}></BarName>
					</h1>
					<button className="barfly primary" onClick={this.newOrder}>{"Start New Order "}
						<i className="fa fa-file-text-o" aria-hidden="true"></i>
					</button>
					<button className="barfly primary" onClick={() => browserHistory.push("/orders")}>{"Order History "}
						<i className="fa fa-chevron-right" aria-hidden="true"></i>
					</button>
				</div>
			</div>
		);
	}
	newOrder() {
		bartender.createNewOrder({barID: this.props.bar});
	}
}

export default Dashboard;
