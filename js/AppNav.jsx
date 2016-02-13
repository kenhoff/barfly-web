var React = require('react');
var BarSelector = require('./BarSelector.jsx');
var ProfileDropdown = require('./ProfileDropdown.jsx');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;

var History = require('react-router').History;

var AppNav = React.createClass({
	mixins: [History],
	getInitialState: function() {
		return {profile: null, currentBar: null}
	},
	render: function() {
		return (
			<Navbar fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#" onClick = {this.goHome} className="logo">burlock</a>
					</Navbar.Brand>
					<Navbar.Toggle/>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<BarSelector currentBar={this.props.currentBar} changeBar={this.props.changeBar}/>
					</Nav>
					<Nav pullRight>
						<ProfileDropdown signOut={this.signOut} lock={this.props.lock}/>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	},

	componentDidMount: function() {},
	signOut: function() {
		localStorage.removeItem("access_jwt")
		localStorage.removeItem("refresh_token")
		window.location.href = "/"
	},
	goHome: function() {
		this.history.push('/')
	}
})

module.exports = AppNav
