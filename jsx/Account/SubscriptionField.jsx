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
		return {subscription: null, invoice: null, user: null};
	},
	render: function() {
		if (!this.state.subscription) {
			return (<div/>);
		}
		if (Object.keys(this.state.subscription).length == 0) {
			// check if user has ever activated a subscription before
			if (("app_metadata" in this.state.user) && ("startedTrial" in this.state.user.app_metadata) && (this.state.user.app_metadata.startedTrial)) {
				var popover = (
					<Popover title="This will activate your subscription immediately and charge your card $30." id="Reactivate subscription">
						<Button bsStyle="primary" onClick={this.postSubscription}>Reactivate subscription</Button>
					</Popover>
				);
				return (
					<Col xs={12}>
						<h4>Subscription</h4>
						<p>
							<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
								<Button onClick={this.postSubscription} bsStyle="primary">Reactivate subscription</Button>
							</OverlayTrigger>
						</p>
					</Col>
				);
			} else {
				return (
					<Col xs={12}>
						<h4>Subscription</h4>
						<p>
							<Button onClick={this.postSubscription} bsStyle="primary">Activate trial</Button>
						</p>
					</Col>
				);
			}
		} else {
			if (this.state.subscription.status == "trialing") {
				var timezone = jstz.determine().name();
				var dateTrialEnds = moment(this.state.subscription.trial_end * 1000).tz(timezone).format('LL');
				var trialDaysRemaining = moment.duration((this.state.subscription.trial_end * 1000) - Date.now()).days();
				if (this.state.subscription.cancel_at_period_end == true) {
					return (
						<Col xs={12}>
							<h4>Subscription</h4>
							<p>{"Standard Plan - " + trialDaysRemaining + " trial days remaining"}</p>
							<p>{"On " + dateTrialEnds + ", your subscription will end, and your card will not be charged."}</p>
							<Button bsStyle="primary" onClick={this.postSubscription}>
								{"Set subscription to activate at end of trial"}
							</Button>
						</Col>
					);
				} else {
					return (
						<Col xs={12}>
							<h4>Subscription</h4>
							<p>{"Standard Plan - " + trialDaysRemaining + " trial days remaining"}</p>
							<p>{"On " + dateTrialEnds + ", your subscription will begin, and your card will be charged."}</p>
							<Button bsStyle="primary" onClick={this.deleteSubscription}>
								{"Set subscription to deactivate at end of trial"}
							</Button>
						</Col>
					);
				}
			} else {
				popover = (
					<Popover title="This will cancel your subscription immediately." id="Cancel subscription">
						<Button bsStyle="danger" onClick={this.deleteSubscription}>Cancel subscription</Button>
					</Popover>
				);
				var invoiceField;
				if (this.state.invoice && (this.state.invoice.paid == false)) {
					invoiceField = (
						<span>{" - $" + (this.state.invoice.amount_due / 100) + " past due "}
							<Button bsStyle="primary" onClick={this.postInvoice}>Pay now</Button>
						</span>
					);
				} else {
					invoiceField = (
						<span></span>
					);
				}
				if (this.state.subscription.status == "unpaid") {
					return (
						<Col xs={12}>
							<h4>Subscription</h4>
							<p>{"Standard Plan (paused)"}{invoiceField}</p>
						</Col>
					);
				} else if (this.state.subscription.status == "past_due") {
					return (
						<Col xs={12}>
							<h4>Subscription</h4>
							<p>{"Standard Plan"}{invoiceField}</p>
						</Col>
					);
				} else {
					return (
						<Col xs={12}>
							<h4>Subscription</h4>
							<p>{"Standard Plan"}{invoiceField}</p>
							<OverlayTrigger trigger="click" rootClose placement="right" overlay={popover}>
								<Button bsStyle="warning">
									Cancel subscription
								</Button>
							</OverlayTrigger>
						</Col>
					);
				}
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
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/invoices",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(invoice) {
				this.setState({invoice: invoice});
			}.bind(this)
		});
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/user",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(user) {
				this.setState({user: user});
			}.bind(this)
		});
	},
	postInvoice: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/invoices",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				this.componentDidMount();
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
