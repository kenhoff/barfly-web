var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;

var SearchNav = React.createClass({

	render: function() {
		return (
			<Navbar fixedTop={this.props.fixedTop}>
				<Nav>
					<NavItem>This is where the search box would go</NavItem>
				</Nav>
			</Navbar>
		);
	}

});

module.exports = SearchNav;
