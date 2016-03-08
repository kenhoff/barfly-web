var React = require('react');
var $ = require('jquery');
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;

var SubscriptionField = React.createClass({
	getInitialState: function() {
		return {subscription: {}};
	},
	render: function() {
		if (Object.keys(this.state.subscription).length == 0) {
			return (
				<Col xs={12}>
					<label>Subscription</label>
					<Button>Activate subscription</Button>
				</Col>
			)
		}

		return (
			<div>
				<label>Subscription</label>
				<p>Subscription info goes here</p>
			</div>
		);
	},
	componentDidMount: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/subscriptions",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(subscription) {
				this.setState({subscription: subscription});
			}.bind(this)
		});
	}

});

module.exports = SubscriptionField;
