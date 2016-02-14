var React = require('react');

var browserHistory = require('react-router').browserHistory;

var OrderCard = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default" onClick={this.navigateToOrder}>
				<div className="panel-body">
					Order #{this.props.order}
				</div>
			</div>
		);
	},
	navigateToOrder: function() {
		browserHistory.push("/orders/" + this.props.order)
	}
});

module.exports = OrderCard
