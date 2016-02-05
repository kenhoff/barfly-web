var React = require('react');

var Link = require('react-router').Link;
var History = require('react-router').History;

var OrderCard = React.createClass({
	mixins: [History],
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
		this.history.push("/orders/" + this.props.order)
	}
});

module.exports = OrderCard
