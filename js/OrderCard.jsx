var React = require('react');
var moment = require('moment-timezone');
var jstz = require('jstimezonedetect');

timezone = jstz.determine().name()

var browserHistory = require('react-router').browserHistory;

var OrderCard = React.createClass({
	render: function() {
		if (("sent" in this.props.order) && this.props.order.sent) {
			displayTime = moment(this.props.order.sentAt).tz(timezone).format('llll')
		} else {
			displayTime = ""
		}
		return (
			<div className="panel panel-default" onClick={this.navigateToOrder}>
				<div className="panel-body">
					Order #{this.props.order.id} {displayTime}
				</div>
			</div>
		);
	},
	navigateToOrder: function() {
		browserHistory.push("/orders/" + this.props.order.id)
	}
});

module.exports = OrderCard
