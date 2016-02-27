var React = require('react');
var moment = require('moment-timezone');
var jstz = require('jstimezonedetect');

timezone = jstz.determine().name()

var browserHistory = require('react-router').browserHistory;

var OrderCard = React.createClass({
	render: function() {
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
					Order #{this.props.order.id}
					<div className="pull-right">
						{displayTime}
					</div>
				</div>
			</div>
		);
	},
	navigateToOrder: function() {
		browserHistory.push("/orders/" + this.props.order.id)
	}
});

module.exports = OrderCard
