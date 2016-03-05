var React = require('react')
var $ = require('jquery')
var StripeCheckout = require('react-stripe-checkout')
var Button = require('react-bootstrap').Button

var PaymentMethodField = React.createClass({
	getInitialState: function() {
		var data = {
			resolving: true,
			card: null
		}
		return data
	},

	render: function() {
		return (
			<div>
				<label>Payment Method</label>
				{(!this.state.resolving && this.state.card)
					? <div>
							<p>{this.state.card.brand + " **** **** **** " + this.state.card.last4}</p>
							<StripeCheckout name="Update card" token={this.handleToken} stripeKey="pk_test_oCFFFgI2gCUg4T5emh8EYsBQ" allowRememberMe={false}>
								<Button bsStyle="primary">Update card</Button>
							</StripeCheckout>
							<Button>Remove card</Button>
						</div>
					: <div>
						<p>No card found</p>
						<StripeCheckout name="Add card" token={this.handleToken} stripeKey="pk_test_oCFFFgI2gCUg4T5emh8EYsBQ" allowRememberMe={false}>
							<Button bsStyle="primary">Add card</Button>
						</StripeCheckout>
					</div>
}
			</div>
		)
	},
	handleToken: function() {},
	componentDidMount: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/paymentmethods",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(card) {
				if (Object.keys(card).length == 0) {
					this.setState({resolving: false, card: null})
				} else {
					this.setState({resolving: false, card: card})
				}
			}.bind(this)
		})

	}
})

module.exports = PaymentMethodField
