var React = require('react');

window.jQuery = window.$ = require('jquery');

var App = React.createClass({
	render: function() {
		return (
			<h1>Hello!</h1>
		)
	},
	loadOrders: function() {
		$.ajax({
			url: window.API_URL + "/legacy_orders",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				console.log(data);
			}.bind(this)
		})
	}
})

module.exports = App
