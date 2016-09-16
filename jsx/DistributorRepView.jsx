import React from "react";
import AppNav from "./AppNav/AppNav.jsx";
import bartender from "./Bartender.jsx";
import {connect} from "react-redux";
import RepName from "./Order/RepName.jsx";
import RepPhone from "./RepPhone.jsx";
import {browserHistory} from "react-router";

class DistributorRepView extends React.Component {
	render() {
		return (
			<div>
				<AppNav backURL={"/distributors/" + this.props.routeParams.distributorID + "/reps"} backText={this.props.distributorName + " Reps"}></AppNav>
				<div className="barflyContainer">
					<h1>
						<RepName repID={this.props.routeParams.repID}></RepName>
					</h1>
					<p>
						{"Phone: "}
						<RepPhone repID={this.props.routeParams.repID}></RepPhone>
					</p>
					<button className="barfly primary" onClick={() => {
						browserHistory.push("/distributors/" + this.props.routeParams.distributorID + "/reps/" + this.props.routeParams.repID + "/edit");
					}}>Edit rep</button>
				</div>
			</div>
		);
	}
}

var mapStateToProps = function(state, ownProps) {
	var props = {};
	if ("distributors" in state && ownProps.routeParams.distributorID in state.distributors) {
		props.distributorName = state.distributors[ownProps.routeParams.distributorID].distributorName;
	} else {
		// resolve all distributors
		bartender.resolve("distributors");
	}
	return props;
};

var DistributorRepView_Connected = connect(mapStateToProps)(DistributorRepView);

export default DistributorRepView_Connected;
