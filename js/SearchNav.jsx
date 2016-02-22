var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Input = require('react-bootstrap').Input;

var SearchNav = React.createClass({

	render: function() {
		return (
			<Navbar fixedTop={this.props.fixedTop}>
				<Navbar.Form>
					<Input type="text" placeholder="Search"/>
				</Navbar.Form>
			</Navbar>
		);
	}

});

module.exports = SearchNav;
