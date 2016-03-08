var React = require('react');
var $ = require('jquery');
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var Popover = require('react-bootstrap').Popover;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;

var SubscriptionField = React.createClass({
	getInitialState: function() {
		return {subscription: null};
	},
	render: function() {
		if (!this.state.subscription) {
			return (<div/>);
		}
		if (Object.keys(this.state.subscription).length == 0) {
			return (
				<Col xs={12}>
					<label>Subscription</label>
					<p>
						<Button onClick={this.postSubscription} bsStyle="primary">Activate subscription</Button>
					</p>
				</Col>
			);
		} else {
			var popover = (
				<Popover title="This will cancel your subscription immediately." id="Cancel subscription">
					<Button bsStyle="danger" onClick={this.deleteSubscription}>Cancel subscription</Button>
				</Popover>
			);
			return (
				<Col xs={12}>
					<label>Subscription</label >
					<p>Standard Plan</p>
					<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
						<Button bsStyle="warning">
							Cancel subscription
						</Button>
					</OverlayTrigger>

				</Col>
			);
		}
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
	},
	postSubscription: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/subscriptions",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				this.componentDidMount();
			}.bind(this)
		});
	},
	deleteSubscription: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/subscriptions",
			method: "DELETE",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				this.componentDidMount();
			}.bind(this)
		});
	}

});

module.exports = SubscriptionField;
