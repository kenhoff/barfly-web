import AppNav from "../AppNav/AppNav.jsx";
import React, {PropTypes} from "react";
import {browserHistory} from "react-router";
import {connect} from "react-redux";
import bartender from "../Bartender.jsx";
import $ from "jquery";
import ProductName from "./ProductName.jsx";
import SizeDescription from "../_shared/SizeDescription.jsx";

class OrderReview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sending: false
		};
		this.sendOrder = this.sendOrder.bind(this);
	}
	render() {
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
				<AppNav backURL={"/orders/" + this.props.routeParams.orderID} backText={"Order " + this.props.routeParams.orderID}></AppNav>
				<div className="barflyContainer">
					<h1>{"Review Order #" + this.props.routeParams.orderID}</h1>
					<div>
						<button onClick={() => {
							browserHistory.push("/orders/" + this.props.routeParams.orderID);
						}} className="barfly primary">
							<i className="fa fa-chevron-left" aria-hidden="true"></i>
							{" add more items"}
						</button>
						{productOrderList}
						<button onClick={this.sendOrder} className="barfly emphasis" disabled={this.state.sending}>{sendOrderButtonText}</button>
					</div>
				</div>
			</div>
		);
	}
	sendOrder() {
		if (!this.state.sending) {
			this.setState({sending: true});
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/bars/" + this.props.bar + "/orders/" + this.props.routeParams.orderID,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				success: function() {
					this.setState({sending: false});
					bartender.sendOrder(this.props.routeParams.orderID);
					browserHistory.push("/orders/" + this.props.routeParams.orderID);
				}.bind(this),
				error: function() {
					this.setState({sending: false});
				}.bind(this)
			});
		}
	}
}

OrderReview.defaultProps = {
	productOrders: []
};

OrderReview.propTypes = {
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

var OrderReview_Container = connect(mapStateToProps)(OrderReview);

export default OrderReview_Container;
