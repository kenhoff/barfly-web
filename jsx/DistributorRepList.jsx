import React, {PropTypes} from "react";
import {connect} from "react-redux";
import AppNav from "./AppNav/AppNav.jsx";
import DistributorName from "./Order/DistributorName.jsx";
import bartender from "./Bartender.jsx";
import RepName from "./Order/RepName.jsx";
import RepPhone from "./RepPhone.jsx";
import {browserHistory} from "react-router";

class DistributorRepList extends React.Component {
	render() {
		var repList;
		if (this.props.reps.length == 0) {
			repList = (
				<div>{"No reps for "}
					<DistributorName distributorID={parseInt(this.props.routeParams.distributorID)}></DistributorName>
				</div>
			);
		} else {
			repList = (
				<div className="barfly list">
					{this.props.reps.map((repID) => {
						return (
							<div key={repID} onClick={() => {
								bartender.changeRep({distributorID: this.props.routeParams.distributorID, repID: repID, barID: this.props.bar});
							}}>
								<div className="listItemContents">
									<RepName repID={repID}></RepName>
									<RepPhone repID={repID}></RepPhone>
								</div>
								<div className="listItemRight">
									{((this.props.currentRep == repID)
										? (
											<i className="fa fa-check-circle" aria-hidden="true"></i>
										)
										: (
											<i className="fa fa-circle-o" aria-hidden="true"></i>
										))}
								</div>
							</div>
						);
					})}
				</div>
			);
		}

		return (
			<div>
				<AppNav backURL={"/distributors/" + this.props.routeParams.distributorID} backText={this.props.distributorName}></AppNav>
				<div className="barflyContainer">
					<h1>
						<DistributorName distributorID={parseInt(this.props.routeParams.distributorID)}></DistributorName>{" Reps"}
					</h1>
					{repList}
					<button className="barfly primary" onClick={() => {
						browserHistory.push("/distributors/" + this.props.routeParams.distributorID + "/reps/new")
					}}>{"Create new rep "}<i className="fa fa-user" aria-hidden="true"></i></button>
				</div>
			</div>
		);
	}
}

DistributorRepList.propTypes = {
	bar: PropTypes.number.isRequired,
	routeParams: PropTypes.shape({distributorID: PropTypes.string.isRequired}),
	reps: PropTypes.arrayOf(PropTypes.string),
	currentRep: PropTypes.string,
	distributorName: PropTypes.string
};

DistributorRepList.defaultProps = {
	reps: []
};

var mapStateToProps = function(state, ownProps) {
	var props = {};
	if ("distributor_memberships" in state && ownProps.routeParams.distributorID in state.distributor_memberships) {
		props.reps = state.distributor_memberships[ownProps.routeParams.distributorID];
	} else {
		bartender.resolve({collection: "distributor_memberships", id: ownProps.routeParams.distributorID});
	}
	if ("distributors" in state && ownProps.routeParams.distributorID in state.distributors) {
		props.distributorName = state.distributors[ownProps.routeParams.distributorID].distributorName;
	} else {
		// resolve all distributors
		bartender.resolve("distributors");
	}
	if ("accounts" in state) {
		// find account object
		var accountObject = state.accounts.find(function(account) {
			if ((account.barID == ownProps.bar) && (account.distributorID == ownProps.routeParams.distributorID)) {
				return true;
			} else {
				return false;
			}
		});
		if (accountObject) {
			// if an account object exists with the bar, the distributor, and with a rep, then that's the rep
			if ("repID" in accountObject) {
				props.currentRep = accountObject.repID;
			} else {
				props.currentRep = null;
			}
			// if an account object exists with the bar, the distributor, and without a rep, then there's no rep assigned to this account
		} else {
			// if no account object exists with the bar + distributor, tell bartender to resolve it
			bartender.resolve({collection: "accounts", barID: ownProps.bar, distributorID: ownProps.routeParams.distributorID});
		}
	} else {
		bartender.resolve({collection: "accounts", barID: ownProps.bar, distributorID: ownProps.routeParams.distributorID});
	}

	return props;
};

var DistributorRepList_Connected = connect(mapStateToProps)(DistributorRepList);

export default DistributorRepList_Connected;
