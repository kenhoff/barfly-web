import {connect} from "react-redux";
import bartender from "../Bartender.jsx";
import moment from "moment-timezone";
import SentOrderMessages from "./SentOrderMessages.jsx";
import SentOrderContents from "./SentOrderContents.jsx";
import AppNav from "../AppNav/AppNav.jsx";
import React, {PropTypes} from "react";
import jstz from "jstimezonedetect";

var timezone = jstz.determine().name();

class SentOrderDetails extends React.Component {
	render() {
		return (
			<div>
				<AppNav backURL="/orders" backText={"Orders"}></AppNav>
				<div className="orderSummaryScreen">
					<h1>{"Order #" + this.props.id}</h1>
					<p>{(this.props.sentAt
							? moment(this.props.sentAt).tz(timezone).format("llll")
							: "Sent")}</p>
					<SentOrderContents productOrders={this.props.productOrders}/>
					<h2>Reps:</h2>
					<SentOrderMessages productOrders={this.props.productOrders} barID={this.props.barID}/>
				</div>
			</div>
		);
	}
}

SentOrderDetails.defaultProps = {
	productOrders: []
};

SentOrderDetails.propTypes = {
	barID: PropTypes.number.isRequired,
	orderID: PropTypes.string.isRequired
};

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("orders" in state) && (ownProps.orderID in state.orders)) {
		props = Object.assign(props, state.orders[ownProps.orderID]);
		if ("sentAt" in props) {
			props.sentAt = new Date(props.sentAt);
		}
	} else {
		bartender.resolve({collection: "orders", id: ownProps.orderID, bar: ownProps.barID});
	}
	return props;
};

var SentOrderDetails_Container = connect(mapStateToProps)(SentOrderDetails);

export default SentOrderDetails_Container;
