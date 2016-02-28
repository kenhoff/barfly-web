var React = require('react')
var Navbar = require('react-bootstrap').Navbar
var Button = require('react-bootstrap').Button

var OrderNavBottom = React.createClass({
	render: function() {
		if (!this.props.disabled) {
			return (
				<Navbar fixedBottom>
					<Navbar.Form pullRight>
						<Button onClick={this.handleClick} bsStyle="primary" active={this.props.sending}>{this.props.sending
								? "Sending order..."
								: "Send Order"}</Button>
					</Navbar.Form>
				</Navbar>
			)
		} else {
			return (<div/>)
		}
	},
	handleClick: function() {
		if (!this.props.sending) {
			this.props.sendOrder()
		}
	}
})

module.exports = OrderNavBottom
