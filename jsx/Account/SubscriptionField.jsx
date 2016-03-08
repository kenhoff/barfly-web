var React = require('react');
var $ = require('jquery');

var SubscriptionField = React.createClass({

	render: function() {
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
			success: function() {}.bind(this)
		});
	}

});

module.exports = SubscriptionField;
