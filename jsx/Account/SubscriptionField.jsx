var React = require('react');
var $ = require('jquery');
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var Popover = require('react-bootstrap').Popover;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;

var moment = require('moment-timezone');
var jstz = require('jstimezonedetect');

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

			if (this.state.subscription.status == "trialing") {
				var timezone = jstz.determine().name();
				var dateTrialEnds = moment(this.state.subscription.trial_end * 1000).tz(timezone).format('LL');
				var trialDaysRemaining = moment.duration((this.state.subscription.trial_end * 1000) - Date.now()).days();
				if (this.state.subscription.cancel_at_period_end == true) {
					return (
						<Col xs={12}>
							<label>Subscription</label >
							<p>{"Standard Plan - " + trialDaysRemaining + " trial days remaining. Your card will not be charged, and your subscription will end on " + dateTrialEnds + "."}</p>
							<Button bsStyle="primary">
								Activate subscription
							</Button>

						</Col>
					);
				} else {
					return (
						<Col xs={12}>
							<label>Subscription</label >
							<p>Standard Plan</p>
							<Button bsStyle="warning">
								Cancel subscription
							</Button>
						</Col>
					);
				}
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
