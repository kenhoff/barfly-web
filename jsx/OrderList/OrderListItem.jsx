var React = require('react');
var moment = require('moment-timezone');
var jstz = require('jstimezonedetect');

import {Row, Col} from 'react-bootstrap';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

var ProductOrderSummaryItem = require("../_shared/ProductOrderSummaryItem.jsx");
var bartender = require('../Bartender.jsx');

var PresentationalOrderListItem = React.createClass({
	propTypes: {
		orderID: React.PropTypes.number.isRequired,
		productOrders: React.PropTypes.array,
		sent: React.PropTypes.bool,
		sentAt: React.PropTypes.instanceOf(Date)
	},
	getDefaultProps: function() {
		return {productOrders: [], sent: false};
	},
	render: function() {
		if (this.props.sent) {
			if ("sentAt" in this.props) {
				var displayTime = "Sent: " + moment(this.props.sentAt).tz(jstz.determine().name()).format('llll');
			} else {
				displayTime = "Sent";
			}
		} else {
			displayTime = "Unsent";
		}
		return (
			<div className="panel panel-default" onClick={this.navigateToOrder}>
				<div className="panel-body">
					<Row>
						<Col xs={4} sm={2}>
							Order #{this.props.orderID}
						</Col>
						<Col xs={8} sm={3} smPush={7}>
							{displayTime}
						</Col>
						<Col xs={12} sm={7} smPull={3}>
							<ul>
								{this.props.productOrders.map(function(productOrder) {
									return (<ProductOrderSummaryItem key={productOrder.productID + "_" + productOrder.productQuantity + "_" + productOrder.productSizeID} {...productOrder}/>);
								})}
							</ul>
						</Col>
					</Row>
				</div>
			</div>
		);
	},
	navigateToOrder: function() {
		browserHistory.push("/orders/" + this.props.orderID);
	}
});

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

var ContainerOrderListItem = connect(mapStateToProps)(PresentationalOrderListItem);

module.exports = ContainerOrderListItem;
