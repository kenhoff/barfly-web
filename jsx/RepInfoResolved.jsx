import React, {PropTypes} from "react";
import {connect} from "react-redux";
import bartender from "./Bartender.jsx";
import RepName from "./Order/RepName.jsx";
import RepPhone from "./RepPhone.jsx";

class RepInfoResolved extends React.Component {
	render() {
		if (this.props.repID) {
			return (
				<div>
					<RepName repID={this.props.repID}></RepName>
					<RepPhone repID={this.props.repID}></RepPhone>
				</div>
			);
		} else {
			return (
				<div>No rep assigned</div>
			);
		}
	}
}

RepInfoResolved.propTypes = {
	barID: PropTypes.number.isRequired,
	distributorID: PropTypes.number.isRequired,
	repID: PropTypes.string
};

var mapStateToProps = function(state, ownProps) {
	// first, need to ensure that the account for the bar + distributor already exists in state
	var props = {};
	if ("accounts" in state) {
		// find account object
		var accountObject = state.accounts.find(function(account) {
			if ((account.barID == ownProps.barID) && (account.distributorID == ownProps.distributorID)) {
				return true;
			} else {
				return false;
			}
		});
		if (accountObject) {
			// if an account object exists with the bar, the distributor, and with a rep, then that's the rep
			if ("repID" in accountObject) {
				props.repID = accountObject.repID;
			} else {
				props.repID = null;
			}
			// if an account object exists with the bar, the distributor, and without a rep, then there's no rep assigned to this account
		} else {
			// if no account object exists with the bar + distributor, tell bartender to resolve it
			bartender.resolve({collection: "accounts", barID: ownProps.barID, distributorID: ownProps.distributorID});
		}
	} else {
		bartender.resolve({collection: "accounts", barID: ownProps.barID, distributorID: ownProps.distributorID});
	}
	return props;
};

var RepInfoResolved_Connected = connect(mapStateToProps)(RepInfoResolved);

export default RepInfoResolved_Connected;
