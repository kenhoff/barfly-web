var React = require('react');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ButtonInput = require('react-bootstrap').ButtonInput;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;

var QuantityInputWithSize = require('./QuantityInputWithSize.jsx');
var NewSizeForm = require('./NewSizeForm.jsx');

// passed in a list of sizes, and quantities

var SizeList = React.createClass({
	getInitialState: function() {
		state = {
			productSizes: []
		}
		return (state)
	},
	render: function() {
		return (
			<div>
				<ListGroup>
					{this.state.productSizes.map(function(sizeID) {
						return (
							<ListGroupItem key={sizeID}>
								<QuantityInputWithSize sizeID={sizeID} quantity={this.getQuantityForSizeID(sizeID)} changeQuantity={this.props.changeQuantity.bind(this, sizeID)} disabled={this.props.disabled}/>
							</ListGroupItem>
						)
					}.bind(this))}
				</ListGroup>
				<NewSizeForm productID={this.props.productID} refreshSizes={this.getSizesForProduct}/>
			</div>
		)
	},
	componentDidMount: function() {
		this.getSizesForProduct()
	},
	getQuantityForSizeID: function(sizeID) {
		for (quantity of this.props.quantities) {
			if (quantity.productSizeID == sizeID) {
				return quantity.productQuantity
			}
		}
	},
	getSizesForProduct: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/products/" + this.props.productID,
			method: "GET",
			success: function(product) {
				if ("productSizes" in product) {
					this.setState({productSizes: product.productSizes})
				} else {
					this.setState({productSizes: []})
				}
			}.bind(this)
		})
	}
});

module.exports = SizeList;
