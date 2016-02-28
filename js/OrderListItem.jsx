var React = require('react')
var moment = require('moment-timezone')
var jstz = require('jstimezonedetect')
var $ = require('jquery')
var Row = require('react-bootstrap').Row
var Col = require('react-bootstrap').Col

var browserHistory = require('react-router').browserHistory

var OrderListItem = React.createClass({
	getInitialState: function() {
		return {productOrders: []}
	},
	render: function() {
		var displayTime
		var timezone = jstz.determine().name()
		if ("sent" in this.props.order) {
			if (this.props.order.sent) {
				if ("sentAt" in this.props.order) {
					displayTime = "Sent: " + moment(this.props.order.sentAt).tz(timezone).format('llll')
				} else {
					displayTime = "Sent"
				}
			} else {
				displayTime = "Unsent"
			}
		} else {
			displayTime = ""
		}
		return (
			<div className="panel panel-default" onClick={this.navigateToOrder}>
				<div className="panel-body">
					<Row>
						<Col xs={2}>
							Order #{this.props.order.id}
						</Col>
						<Col xs={7}>
							this is where the order info goes
						</Col>
						<Col xs={3}>
							{displayTime}
						</Col>
					</Row>
				</div>
			</div>
		)
	},
	navigateToOrder: function() {
		browserHistory.push("/orders/" + this.props.order.id)
	},
	componentDidMount: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.order.id,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(data) {
				// handle if sent isn't actually in the order yet
				this.setState({
					productOrders: data.productOrders,
					sent: (data.sent || false)
				})
			}.bind(this)
		})
	}
})

module.exports = OrderListItem
