var React = require("react");

import {connect} from "react-redux";
var bartender = require("../Bartender.jsx");

var OrderListItem = require("./OrderListItem.jsx");
import AppNav from "../AppNav/AppNav.jsx";

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
			<div>
				<AppNav></AppNav>
				<div className="orderListScreen">
					<h1>Order History</h1>
					<button className="barfly emphasis" onClick={this.newOrder}>{"Start New Order "}
						<i className="fa fa-file-text-o" aria-hidden="true"></i>
					</button>
					<div className="barfly list">
						{this.props.orders.map((order) => {
							return (<OrderListItem key={order} orderID={order} barID={this.props.bar}/>);
						})}
					</div>
				</div>
			</div>
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
