var React = require('react');

var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var connect = require('react-redux').connect;
var bartender = require('../Bartender.jsx');

var OrderListItem = require('./OrderListItem.jsx');

var PresentationalOrders = React.createClass({
	propTypes: {
		bar: React.PropTypes.number.isRequired,
		orders: React.PropTypes.arrayOf(React.PropTypes.number)
	},
	getDefaultProps: function() {
		return {orders: []};
	},
	render: function() {
		return (
			<Grid>
				<Row>
					<Col xs={12}>
						<h1>Orders</h1>
						<Button bsStyle="primary" bsSize="large" onClick={this.newOrder}>New Order</Button>
					</Col>
				</Row>
				<Row>
					<Col xs={12}>
						{this.props.orders.map(function(order) {
							return (<OrderListItem key={order} barID={this.props.bar}/>);
						}.bind(this))}
					</Col>
				</Row>
			</Grid>
		);
	},
	newOrder: function() {
		bartender.createNewOrder({barID: this.props.bar});
	}
});

var mapStateToProps = function(state, ownProps) {
	var props = {};
	if (("bar_orders" in state) && (ownProps.bar in state.bar_orders)) {
		// then there's a list of orders in state.bar_orders[ownProps.bar]
		props.orders = state.bar_orders[ownProps.bar];
	} else {
		bartender.resolve({collection: "bar_orders", id: ownProps.bar});
	}
	return props;
};

var ContainerOrders = connect(mapStateToProps)(PresentationalOrders);

module.exports = ContainerOrders;
