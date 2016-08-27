var React = require("react");

var connect = require("react-redux").connect;

import {browserHistory} from "react-router";

import AppNav from "./AppNav/AppNav.jsx";
import bartender from "./Bartender.jsx";

// barcontext can serve as a gateway to make sure that a user has a bar created and selected

var BarContext_Presentational = React.createClass({
	propTypes: {
		bar: React.PropTypes.number
	},
	render: function() {
		if (!("bar" in this.props)) {
			// if we're still resolving the current bar, the "bar" key does not exist
			return (
				<div>loading bars...</div>
			);
		} else if (this.props.bar == null) {
			// if the user has 0 bars, and there isn't a current bar selected, then bar is null
			return (
				<div>
					<AppNav></AppNav>
					<div className="barflyContainer">
						<h1>Welcome to Barfly!</h1>
						<p>To get started, create your first bar.</p>
						<button className="barfly primary" onClick={() => {
							browserHistory.push("/bars");
						}}>{"bars "}
							<i className="fa fa-chevron-right" aria-hidden="true"></i>
						</button>
					</div>
				</div>
			);
		} else {
			// if a current bar is selected, bar is a number
			return (
				<div>
					{React.cloneElement(this.props.children, {bar: this.props.bar})}
				</div>
			);
		}
	}
});

var mapStateToProps = function(state) {
	var props = {};
	if (("ui" in state) && ("currentBar" in state.ui)) {
		if (state.ui.currentBar == null) {
			props.bar = null;
		} else {
			props.bar = state.ui.currentBar;
		}
	}
	// else, we haven't resolved the current bar yet - don't return anything

	// if there are no bar_memberships in state, tell bartender to get all bar memberships
	if ("bar_memberships" in state) {
		// for each bar membership, ensure that that specific bar is resolved
		for (var bar_membership of state.bar_memberships) {
			if (!("bars" in state) || !(bar_membership in state.bars)) {
				bartender.resolve({collection: "bars", id: bar_membership});
			}
		}
	} else {
		bartender.resolve("bar_memberships");
	}

	return props;
};

var BarContext_Container = connect(mapStateToProps)(BarContext_Presentational);

module.exports = BarContext_Container;
