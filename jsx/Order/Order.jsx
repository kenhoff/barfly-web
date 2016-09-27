import {connect} from "react-redux";
import React, {PropTypes} from "react";
import bartender from "../Bartender.jsx";
import SentOrderDetails from "./SentOrderDetails.jsx";
import Catalog from "./Catalog.jsx";

class Order_Presentational extends React.Component {
	render() {
		if (this.props.sent) {
			return (
				<SentOrderDetails barID={this.props.bar} orderID={this.props.routeParams.orderID}></SentOrderDetails>
			);
		} else {
			return (
				<Catalog bar={this.props.bar} orderID={this.props.routeParams.orderID}></Catalog>
			);
		}
	}
}

Order_Presentational.defaultProps = {
	productOrders: []
};

Order_Presentational.propTypes = {
	bar: PropTypes.number.isRequired,
	routeParams: PropTypes.shape({orderID: PropTypes.string.isRequired})
};

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("orders" in state) && (ownProps.routeParams.orderID in state.orders)) {
		props = Object.assign(props, state.orders[ownProps.routeParams.orderID]);
		if ("sentAt" in props) {
			props.sentAt = new Date(props.sentAt);
		}
	} else {
		bartender.resolve({collection: "orders", id: ownProps.routeParams.orderID, bar: ownProps.bar});
	}
	return props;
};

var Order_Container = connect(mapStateToProps)(Order_Presentational);

export default Order_Container;
