var React = require("react");
var $ = require("jquery");
var StripeCheckout = require("react-stripe-checkout");
var Button = require("react-bootstrap").Button;
var OverlayTrigger = require("react-bootstrap").OverlayTrigger;
var Popover = require("react-bootstrap").Popover;
var Col = require("react-bootstrap").Col;

var PaymentMethodField = React.createClass({
	getInitialState: function() {
		var data = {
			resolving: true,
			card: null
		};
		return data;
	},

	render: function() {
		if (!this.state.resolving) {
			if (this.state.card) {
				var popover = (
					<Popover title="Are you sure you want to remove this card?" id="Remove card">
						<Button bsStyle="danger" onClick={this.deleteCard}>Remove card</Button>
					</Popover>
				);
				return (
					<Col xs={12}>
						<h4>Payment Method</h4>
						<p>{this.state.card.brand + " **** **** **** " + this.state.card.last4}</p>
						<StripeCheckout name="Update card" token={this.handleToken} stripeKey={process.env.STRIPE_PUBLISHABLE_KEY} allowRememberMe={false} panelLabel="Update card">
							<Button bsStyle="primary">Update card</Button>
						</StripeCheckout>
						<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
							<Button>Remove card</Button>
						</OverlayTrigger>
					</Col>
				);
			} else {
				return (
					<Col xs={12}>
						<h4>Payment Method</h4>
						<p>No card found</p>
						<StripeCheckout name="Add card" token={this.handleToken} stripeKey={process.env.STRIPE_PUBLISHABLE_KEY} allowRememberMe={false} panelLabel="Add card">
							<Button bsStyle="primary">Add card</Button>
						</StripeCheckout>
					</Col>
				);
			}
		} else {
			return (<div/>);
		}
	},
	handleToken: function(token) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/paymentmethods",
			data: {
				token: token
			},
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				this.componentDidMount();
			}.bind(this)
		});
	},
	deleteCard: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/paymentmethods",
			method: "DELETE",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				this.componentDidMount();
			}.bind(this)
		});
	},
	componentDidMount: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/paymentmethods",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(card) {
				if (Object.keys(card).length == 0) {
					this.setState({resolving: false, card: null});
				} else {
					this.setState({resolving: false, card: card});
				}
			}.bind(this)
		});
	}
});

module.exports = PaymentMethodField;
