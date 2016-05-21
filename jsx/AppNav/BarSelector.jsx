var React = require('react');
// var $ = require('jquery');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var Button = require('react-bootstrap').Button;
var MenuItem = require('react-bootstrap').MenuItem;

var connect = require('react-redux').connect;

var bartender = require('../Bartender.jsx');
var browserHistory = require('react-router').browserHistory;

var NewBarModal = require('./NewBarModal.jsx');

var PresentationalBarSelector = React.createClass({
	propTypes: {
		currentBar: React.PropTypes.number,
		bars: React.PropTypes.array,
		loading: React.PropTypes.bool
	},
	getInitialState: function() {
		return {showModal: false};
	},
	render: function() {
		if (this.props.loading) {
			return (
				<NavItem>
					Loading...
				</NavItem>
			);
		} else if (this.props.currentBar == null) {
			return (
				<div>
					<Navbar.Form>
						<Button bsStyle="primary" onClick={this.props.openNewBarModal}>
							{"Add a new Bar"}
						</Button>
					</Navbar.Form>
					<NewBarModal/>
				</div>
			);
		} else {
			var listOfBars = [...this.props.bars];
			// index of current bar
			// find current bar in list of bars - indexes don't match up to IDs
			for (var i = 0; i < listOfBars.length; i++) {
				if (listOfBars[i].id == this.props.currentBar) {
					var currentBar = Object.assign({}, listOfBars[i]);
					listOfBars.splice(i, 1);
					break;
				}
			}
			return (
				<Nav>
					<NavDropdown id="Bar Select Menu" title={currentBar.barName}>
						{listOfBars.map((bar) => {
							return (
								<MenuItem key={bar.id} onClick={this.props.changeBar.bind(this, bar.id)}>{bar.barName}</MenuItem>
							);
						})}
						{listOfBars.length > 0
							? (<MenuItem divider/>)
							: (<div/>)}
						<MenuItem onClick={this.props.openNewBarModal}>
							{"Add a new Bar"}
						</MenuItem>
					</NavDropdown>
					<NewBarModal/>
				</Nav>
			);
		}
	}
});

var mapStateToProps = function(state) {
	var props = {};
	props.loading = false;
	// if there are no bars, tell bartender to get all bars
	if ("bar_memberships" in state) {
		// for each bar membership, ensure that that specific bar is resolved
		props.bars = [];
		for (var bar_membership of state.bar_memberships) {
			if (("bars" in state) && (bar_membership in state.bars)) {
				props.bars.push(state.bars[bar_membership]);
			} else {
				bartender.resolve({collection: "bars", id: bar_membership});
				props.loading = true;
			}
		}
	} else {
		bartender.resolve("bar_memberships");
		props.loading = true;
	}
	// get current bar
	if (("ui" in state) && ("currentBar" in state.ui)) {
		props.currentBar = state.ui.currentBar;
	} else {
		props.loading = true;
	}
	return props;
};

var mapDispatchToProps = function(dispatch) {
	var props = {};
	props.openNewBarModal = function() {
		dispatch({type: "OPEN_NEW_BAR_MODAL"});
	};
	props.changeBar = function(barID) {
		dispatch({type: "CHANGE_CURRENT_BAR", barID});
		browserHistory.push("/orders");
	};
	return props;
};

var ContainerBarSelector = connect(mapStateToProps, mapDispatchToProps)(PresentationalBarSelector);

module.exports = ContainerBarSelector;
