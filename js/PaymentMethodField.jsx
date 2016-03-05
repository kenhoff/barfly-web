var React = require('react')
var $ = require('jquery')

var PaymentMethodField = React.createClass({

	render: function() {
		return (
			<div>
				<label>Payment Method</label>
			</div>
		)
	},
	componentDidMount: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/paymentmethods",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {}.bind(this)
		})

	}
})

module.exports = PaymentMethodField
