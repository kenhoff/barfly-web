var React = require('react');
var DropdownButton = require('react-bootstrap').DropdownButton;
var Badge = require('react-bootstrap').Badge;
var MenuItem = require('react-bootstrap').MenuItem;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;
var PropTypes = React.PropTypes;

var ShoppingCart = React.createClass({
	propTypes: {
		sending: PropTypes.bool,
		disabled: PropTypes.bool,
		sendOrder: PropTypes.func.isRequired
	},
	getDefaultProps: function() {
		return {sending: false, disabled: false, productOrders: []};
	},
	render: function() {
		var buttonTitle = (
			<span>
				<Badge>{this.props.productOrders.length}</Badge>{" "}
				<Glyphicon glyph="shopping-cart"/>
			</span>
		);

		var productOrderElements = (this.props.productOrders.map(function(productOrder) {
			return (
				<MenuItem key={Math.random()}>{productOrder.productQuantity + " " + productOrder.productName + " " + productOrder.containerName + ", " + productOrder.packagingName}
				</MenuItem>
			);
		}));

		return (
			<div>
				<DropdownButton title={buttonTitle} bsStyle={(this.props.productOrders.length == 0
					? "default"
					: "primary")} id="Shopping Cart">{(this.props.productOrders.length == 0
						? <MenuItem>{"You don't have any items in this order yet. Add some below to get started!"}</MenuItem>
						: productOrderElements)}
					<MenuItem divider/>
					<Button onClick={this.handleClick} bsStyle="primary" active={this.props.sending} disabled={this.props.disabled}>{this.props.sending
							? "Sending order..."
							: "Send Order"}</Button>
				</DropdownButton>
			</div>
		);
	},
	handleClick: function() {
		if (!this.props.sending && !this.props.disabled) {
			this.props.sendOrder();
		}
	}
});

module.exports = ShoppingCart;
