import {connect} from "react-redux";
import React, {PropTypes} from "react";
import bartender from "../Bartender.jsx";
import ProductName from "./ProductName.jsx";
import SizeDescription from "../_shared/SizeDescription.jsx";
import {browserHistory} from "react-router";
import $ from "jquery";
import SentOrderDetails from "./SentOrderDetails.jsx";
import AppNav from "../AppNav/AppNav.jsx";

class Order_Presentational extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sending: false
		};
		this.sendOrder = this.sendOrder.bind(this);
	}
	render() {
		if (this.props.sent) {
			return (
				<SentOrderDetails barID={this.props.bar} orderID={this.props.routeParams.orderID}></SentOrderDetails>
			);
		} else {
			if (this.props.productOrders.length == 0) {
				var productOrderList = (
					<p>{"You don't have any items in this order yet."}</p>
				);
			} else {
				productOrderList = (
					<ul>
						{this.props.productOrders.map((productOrder) => {
							return (
								<li key={Math.random()}>
									{productOrder.productQuantity + " "}<ProductName productID={productOrder.productID}/>{" "}<SizeDescription sizeID={productOrder.productSizeID}/>
								</li>
							);
						})}
					</ul>
				);
			}
			var sendOrderButtonText;
			if (this.state.sending) {
				sendOrderButtonText = (
					<span>{"sending order..."}
						<i className="fa fa-spinner fa-pulse fa-fw"></i>
					</span>
				);
			} else {
				sendOrderButtonText = (
					<span>{"send order "}
						<i className="fa fa-paper-plane" aria-hidden="true"></i>
					</span>
				);

			}
			return (
				<div>
					<AppNav backURL="/orders" backText={"Orders"}></AppNav>
					<div className="orderSummaryScreen">
						<button onClick={() => {
							browserHistory.push("/orders/" + this.props.routeParams.orderID + "/catalog");
						}} className="barfly primary">{"add items "}
							<i className="fa fa-chevron-right" aria-hidden="true"></i>
						</button>
						<h1>{"Order #" + this.props.id}</h1>
						<p>Unsent</p>
						{productOrderList}
						<button onClick={this.sendOrder} className="barfly primary" disabled={this.state.sending}>{sendOrderButtonText}</button>
					</div>
				</div>
			);
		}
	}
	sendOrder() {
		if (!this.state.sending) {
			this.setState({sending: true});
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.params.orderID,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				success: function() {
					this.setState({sending: false});
					bartender.sendOrder(this.props.params.orderID);
				}.bind(this),
				error: function() {
					this.setState({sending: false});
				}.bind(this)
			});
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
