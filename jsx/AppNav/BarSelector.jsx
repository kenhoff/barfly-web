var React = require('react');
var $ = require('jquery');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var Button = require('react-bootstrap').Button;

var NewBarModal = require('./NewBarModal.jsx');

var BarSelector = React.createClass({
	propTypes: {
		currentBar: React.PropTypes.number
	},
	getInitialState: function() {
		return {showModal: false, bars: [], selectedBarName: "Loading bar..."};
	},
	render: function() {
		if (this.props.currentBar == null) {
			return (
				<NavItem>
					Loading...
				</NavItem>
			);
		} else if (this.props.currentBar == -1) {
			return (
				<div>
					<Navbar.Form>
						<Button onClick={this.openNewBarModal}>
							Add a new Bar
						</Button>
					</Navbar.Form>
					<NewBarModal showModal={this.state.showModal} onHide={this.closeNewBarModal} onBarChange={this.props.changeBar}/>
				</div>
			);
		} else {
			var bars = this.state.bars;
			// index of current bar
			var index = bars.indexOf(this.props.currentBar);
			bars.splice(index, 1);
			return (
				<Nav>
					<NavDropdown id="Bar Select Menu" title={this.state.selectedBarName}>
						{this.state.bars.map(function(bar) {
							return (<IndividualBarInDropdownList key={bar} barID={bar} changeBar={this.props.changeBar}/>);
						}.bind(this))}
					</NavDropdown>
				</Nav>
			);
		}
	},
	changeBar: function(barID) {
		this.props.changeBar(barID);
	},
	openNewBarModal: function() {
		this.setState({showModal: true});
	},
	closeNewBarModal: function() {
		this.setState({showModal: false});
	},
	loadBars: function(cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/user/bars",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				if (data.length != 0) {
					cb(data);
				}
			}
		});
	},
	componentDidMount: function() {
		if (this.props.currentBar && this.props.currentBar >= 0) {
			this.loadBars(function(bars) {
				this.setState({bars: bars});
			}.bind(this));
			this.resolveBarName(this.props.currentBar, function(barName) {
				this.setState({selectedBarName: barName});
			}.bind(this));
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.currentBar && nextProps.currentBar >= 0) {
			this.loadBars(function(bars) {
				this.setState({bars: bars});
			}.bind(this));
			this.resolveBarName(nextProps.currentBar, function(barName) {
				this.setState({selectedBarName: barName});
			}.bind(this));
		}
	},
	resolveBarName: function(barID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + barID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(barInfo) {
				cb(barInfo.barName);
			}
		});
	}
});

var IndividualBarInDropdownList = React.createClass({
	getInitialState: function() {
		return {barName: "Loading bar..."};
	},
	render: function() {
		return (
			<MenuItem onClick={this.changeBar}>
				{this.state.barName}
			</MenuItem>
		);
	},
	changeBar: function() {
		this.props.changeBar(this.props.barID);
	},
	componentDidMount: function() {
		this.resolveBarName(this.props.barID, function(barName) {
			this.setState({barName: barName});
		}.bind(this));
	},
	componentWillReceiveProps: function(nextProps) {
		this.resolveBarName(nextProps.barID, function(barName) {
			this.setState({barName: barName});
		}.bind(this));
	},
	resolveBarName: function(barID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + barID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(barInfo) {
				cb(barInfo.barName);
			}
		});
	}
});

module.exports = BarSelector;
