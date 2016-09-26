import React from "react";
import bartender from "./Bartender.jsx";
import {browserHistory} from "react-router";
import AppNav from "./AppNav/AppNav.jsx";
import BarName from "./BarName.jsx";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.newOrder = this.newOrder.bind(this);
		this.signOut = this.signOut.bind(this);
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
					<button className="barfly primary" onClick={() => browserHistory.push("/distributors")}>{"Distributors "}
						<i className="fa fa-truck" aria-hidden="true"></i>
					</button>
					<button className="barfly primary" onClick={() => browserHistory.push("/bars")}>{"Bars "}
						<i className="fa fa-glass" aria-hidden="true"></i>
					</button>
					<button className="barfly primary" onClick={() => browserHistory.push("/account")}>{"Account"}</button>
					<button className="barfly primary" onClick={this.signOut}>{"Sign Out"}</button>
				</div>
			</div>
		);
	}
	signOut() {
		localStorage.removeItem("access_jwt");
		localStorage.removeItem("refresh_token");
		window.location.href = "/";
	}
	newOrder() {
		bartender.createNewOrder({barID: this.props.bar});
	}
}

export default Dashboard;
