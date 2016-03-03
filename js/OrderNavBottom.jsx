var React = require('react')
var Navbar = require('react-bootstrap').Navbar
var Button = require('react-bootstrap').Button

var OrderNavBottom = React.createClass({
	render: function() {
		return (
			<Navbar fixedBottom>
				<Navbar.Form pullRight>
					<Button onClick={this.handleClick} bsStyle="primary" active={this.props.sending} disabled={this.props.disabled}>{this.props.sending
							? "Sending order..."
							: "Send Order"}</Button>
				</Navbar.Form>
			</Navbar>
		)
	},
	handleClick: function() {
		if (!this.props.sending && !this.props.disabled) {
			this.props.sendOrder()
		}
	}
})

module.exports = OrderNavBottom
