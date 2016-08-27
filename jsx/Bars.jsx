import React, {PropTypes} from "react";
import {connect} from "react-redux";

import AppNav from "./AppNav/AppNav.jsx";
import BarName from "./BarName.jsx";

import bartender from "./Bartender.jsx";
import {browserHistory} from "react-router";

class Bars_Presentational extends React.Component {
	constructor(props) {
		super(props);
		this.changeToBar = this.changeToBar.bind(this);
	}
	changeToBar(barID) {
		bartender.changeBar(barID);
	}
	render() {
		if (!("currentBarID" in this.props)) {
			// if we're still resolving the current bar, the "bar" key does not exist
			return (
				<div>
					<AppNav></AppNav>
					<div>loading bars...</div>
				</div>
			);
		} else {
			// if a current bar is selected, bar is a number
			var bars;
			if (this.props.bars.length == 0) {
				bars = (
					<p>No bars yet!</p>
				);
			} else {
				bars = (
					<div className="barfly list">
						{this.props.bars.map((barID) => {
							return (
								<div key={barID} onClick={() => {
									this.changeToBar(barID);
								}}>
									<div className="listItemContents">
										<h4>
											<BarName barID={barID}></BarName>
										</h4>
									</div>
									<div className="listItemRight">
										{((this.props.currentBarID == barID)
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
					<AppNav></AppNav>
					<div className="bars">
						<h1>Bars</h1>
						{bars}
						<button className="barfly primary" onClick={() => {
							browserHistory.push("/bars/new");
						}}>{"Create new bar "}
							<i className="fa fa-file-text-o" aria-hidden="true"></i>
						</button>
					</div>
				</div>
			);
		}
	}
}

Bars_Presentational.propTypes = {
	currentBarID: PropTypes.number,
	bars: PropTypes.arrayOf(PropTypes.number)
};

Bars_Presentational.defaultProps = {
	bars: []
};

var mapStateToProps = function(state) {
	var props = {};
	if (("ui" in state) && ("currentBar" in state.ui)) {
		if (state.ui.currentBar == null) {
			props.currentBarID = null;
		} else {
			props.currentBarID = state.ui.currentBar;
		}
	}
	// else, we haven't resolved the current bar yet - don't return anything

	// if there are no bar_memberships in state, tell bartender to get all bar memberships
	if ("bar_memberships" in state) {
		// for each bar membership, ensure that that specific bar is resolved
		props.bars = [];
		for (var bar_membership of state.bar_memberships) {
			if (!("bars" in state) || !(bar_membership in state.bars)) {
				bartender.resolve({collection: "bars", id: bar_membership});
			}
			props.bars.push(bar_membership);
		}
	} else {
		bartender.resolve("bar_memberships");
	}
	return props;
};

var Bars_Container = connect(mapStateToProps)(Bars_Presentational);

export default Bars_Container;
