var React = require('react');
var BarSelector = require('./BarSelector.jsx');
var AccountDropdown = require('./AccountDropdown.jsx');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;

var browserHistory = require('react-router').browserHistory;

var AppNav = React.createClass({
	propTypes: {
		signOut: React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<Navbar>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#" onClick={function() {
							browserHistory.push('/');
						}} className="logo">barfly</a>
					</Navbar.Brand>
					<Navbar.Toggle/>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<BarSelector/>
					</Nav>
					<Nav pullRight>
						<AccountDropdown signOut={this.props.signOut} lock={this.props.lock}/>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
});

module.exports = AppNav;
