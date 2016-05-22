var React = require('react');

import {Button, Col, Row, Grid} from "react-bootstrap";
import {connect} from "react-redux";
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
						{this.props.orders.map((order) => {
							return (<OrderListItem key={order} orderID={order} barID={this.props.bar}/>);
						})}
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
	let props = {};
	if (("bar_orders" in state) && (ownProps.bar in state.bar_orders)) {
		props.orders = [...state.bar_orders[ownProps.bar]];
		props.orders.sort(function(a, b) {
			return (b - a);
		});
	} else {
		bartender.resolve({collection: "bar_orders", id: ownProps.bar});
	}
	return props;
};

var ContainerOrders = connect(mapStateToProps)(PresentationalOrders);

module.exports = ContainerOrders;
