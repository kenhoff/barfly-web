var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Button = require('react-bootstrap').Button;

var OrderNavBottom = React.createClass({
	render: function() {
		return (
			<Navbar fixedBottom>
				<Navbar.Form>
					<Button onClick={this.handleClick}>{"Create a new product"}</Button>
				</Navbar.Form>
			</Navbar>
		);
	},
	handleClick: function() {
		this.props.showNewProductModal();
	}
});

module.exports = OrderNavBottom;
