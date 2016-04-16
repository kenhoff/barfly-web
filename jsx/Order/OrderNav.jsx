var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Input = require('react-bootstrap').Input;

var OrderNav = React.createClass({
	render: function() {
		return (
			<Navbar fixedTop={this.props.fixedTop}>
				<Navbar.Form>
					<Input type="text" placeholder="Search" value={this.props.value} onChange={this.props.updateSearch}/>
				</Navbar.Form>
			</Navbar>
		);
	}
});

module.exports = OrderNav;
