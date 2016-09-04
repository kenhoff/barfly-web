import React, {PropTypes} from "react";
import {connect} from "react-redux";
import RepInfoResolved from "./RepInfoResolved.jsx";
import bartender from "./Bartender.jsx";
import AppNav from "./AppNav/AppNav.jsx";
import {browserHistory} from "react-router";

class Distributor extends React.Component {
	render() {
		return (
			<div>
				<AppNav backURL="/distributors" backText="Distributors"></AppNav>
				<div className="barflyContainer">
					<h1>{this.props.distributorName}</h1>
					<RepInfoResolved barID={this.props.bar} distributorID={parseInt(this.props.routeParams.distributorID)}></RepInfoResolved>
					<button className="barfly primary" onClick={() => {
						browserHistory.push("/distributors/" + this.props.routeParams.distributorID + "/reps");
					}}>Select Rep
						<i className="fa fa-chevron-right" aria-hidden="true"></i>
					</button>
				</div>
			</div>
		);
	}
}

Distributor.propTypes = {
	routeParams: PropTypes.shape({distributorID: PropTypes.string.isRequired}),
	bar: PropTypes.number.isRequired,
	distributorName: PropTypes.string
};

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

var Distributor_Connected = connect(mapStateToProps)(Distributor);

export default Distributor_Connected;
