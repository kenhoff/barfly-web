import React, {PropTypes} from "react";
import {connect} from "react-redux";

var browserHistory = require("react-router").browserHistory;

import bartender from "../Bartender.jsx";
import BarName from "../BarName.jsx";
import ProductName from "../Order/ProductName.jsx";
import SizeDescription from "../_shared/SizeDescription.jsx";

var AppNav_Presentational = React.createClass({
	getDefaultProps: function() {
		return {productOrders: []};
	},
	getInitialState: function() {
		return {menuDropdownDisplayed: false, cartDropdownDisplayed: false};
	},
	propTypes: {
		currentBarID: PropTypes.number,
		backURL: PropTypes.string,
		backText: PropTypes.string,
		orderID: PropTypes.number
	},
	toggleCart: function() {
		this.setState({
			cartDropdownDisplayed: !this.state.cartDropdownDisplayed
		});
	},
	toggleMenu: function() {
		this.setState({
			menuDropdownDisplayed: !this.state.menuDropdownDisplayed
		});
	},
	closeMenus: function() {
		this.setState({menuDropdownDisplayed: false, cartDropdownDisplayed: false});
	},
	signOut: function() {
		localStorage.removeItem("access_jwt");
		localStorage.removeItem("refresh_token");
		window.location.href = "/";
	},
	newOrder: function() {
		bartender.createNewOrder({barID: this.props.currentBarID});
	},
	render: function() {
		var backButton;
		var backText;
		if ("backURL" in this.props) {
			if ("backText" in this.props) {
				backText = " " + this.props.backText;
			} else {
				backText = "";
			}
			backButton = (
				<div className="home" onClick={() => {
					browserHistory.push(this.props.backURL);
				}}>
					<div className="back">
						<i className="fa fa-chevron-left" aria-hidden="true"></i>{backText}
					</div>
				</div>
			);
		} else {
			backButton = (
				<div className="home" onClick={() => {
					browserHistory.push("/");
				}}>
					<div className="logo">
						<i className="fa fa-home" aria-hidden="true"></i>
						{" barfly"}
					</div>
				</div>
			);
		}
		var currentBarText;
		if (!("currentBarID" in this.props)) {
			currentBarText = (
				<div>{"Loading bars..."}</div>
			);
		} else if (this.props.currentBarID == null) {
			currentBarText = (
				<div>{"No bar selected!"}</div>
			);
		} else {
			currentBarText = (
				<div>
					<BarName barID={this.props.currentBarID}></BarName>
				</div>
			);
		}

		// cart
		if (this.props.productOrders.length > 0) {
			var cart = (
				<div className="cart">
					<button onClick={this.toggleCart}>{this.props.productOrders.length + " "}
						<i className="fa fa-shopping-cart" aria-hidden="true"></i>
					</button>
					<div className="dropdown" style={{
						display: (this.state.cartDropdownDisplayed
							? "block"
							: "none")
					}}>
						<ol>
							{this.props.productOrders.map((productOrder) => {
								return (
									<li key={Math.random()}>
										{productOrder.productQuantity + " "}<ProductName productID={productOrder.productID}/>{" "}<SizeDescription sizeID={productOrder.productSizeID}/>
									</li>
								);
							})}
							<li className="emphasis" onClick={() => {
								browserHistory.push("/orders/" + this.props.orderID + "/review")
							}}>{"Review order "}
								<i className="fa fa-chevron-right" aria-hidden="true"></i>
							</li>
						</ol>
					</div>
					<div className="clickCatcher" style={{
						display: (this.state.cartDropdownDisplayed
							? "block"
							: "none")
					}} onClick={this.closeMenus}></div>
				</div>
			);
		} else {
			cart = (null);
		}

		return (
			<div>
				<div className="barfly nav">
					{backButton}
					{cart}
					<div className="hamburger">
						<button onClick={this.toggleMenu}>{(this.state.menuDropdownDisplayed
								? (
									<i className="fa fa-times" aria-hidden="true"></i>
								)
								: (
									<i className="fa fa-bars" aria-hidden="true"></i>
								))}
						</button>
						<div className="dropdown" style={{
							display: (this.state.menuDropdownDisplayed
								? "block"
								: "none")
						}}>
							<ol>
								<li onClick={() => {
									this.toggleMenu();
									browserHistory.push("/bars");
								}}>{currentBarText}</li>
								<li className="emphasis" onClick={() => {
									this.toggleMenu();
									this.newOrder();
								}}>Start New Order</li>
								<li onClick={() => {
									this.toggleMenu();
									browserHistory.push("/orders");
								}}>Order History</li>
								<li onClick={() => {
									this.toggleMenu();
									browserHistory.push("/distributors");
								}}>Distributors</li>
								<li onClick={() => {
									this.toggleMenu();
									browserHistory.push("/bars");
								}}>Bars</li>
								<li onClick={() => {
									this.toggleMenu();
									browserHistory.push("/account");
								}}>Account</li>
								<li onClick={() => {
									this.toggleMenu();
									this.signOut();
								}}>Sign Out</li>
							</ol>
						</div>
						<div className="clickCatcher" style={{
							display: (this.state.menuDropdownDisplayed
								? "block"
								: "none")
						}} onClick={this.closeMenus}></div>
					</div>
				</div>
			</div>
		);
	}
});

var mapStateToProps = function(state) {
	var props = {};
	if (("ui" in state) && ("currentBar" in state.ui)) {
		if (state.ui.currentBar == null) {
			props.currentBarID = null;
		} else {
			props.currentBarID = state.ui.currentBar;
		}
	}
	// else, we haven't resolved the current bar yet - don't return anything

	// if there are no bar_memberships in state, tell bartender to get all bar memberships
	if ("bar_memberships" in state) {
		// for each bar membership, ensure that that specific bar is resolved
		for (var bar_membership of state.bar_memberships) {
			if (!("bars" in state) || !(bar_membership in state.bars)) {
				bartender.resolve({collection: "bars", id: bar_membership});
			}
		}
	} else {
		bartender.resolve("bar_memberships");
	}

	return props;
};

var AppNav_Container = connect(mapStateToProps)(AppNav_Presentational);

// <li>Reps</li>
// <li>Distributors</li>
// <li>Bars</li>

module.exports = AppNav_Container;
