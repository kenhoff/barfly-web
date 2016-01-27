var React = require('react');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var DistributorField = require('./DistributorField.jsx');
var RepField = require('./RepField.jsx');
var QuantityInputWithSizeList = require('./QuantityInputWithSizeList.jsx');

var ProductCard = React.createClass({
	getInitialState: function() {
		return ({productName: "", distributorID: null})
	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<p>
						<b>Product:</b>&nbsp;{this.state.productName}
					</p>
					<DistributorField barID={this.props.barID} productID={this.props.productID} productName={this.state.productName} changeDistributor={this.handleDistributorChange}/>
					<RepField barID={this.props.barID} distributorID={this.state.distributorID} distributorName={this.state.distributorName} reresolveOrder={this.props.reresolveOrder}/>
					<QuantityInputWithSizeList productSizes={this.state.productSizes} quantities={this.props.quantities} changeQuantity={this.handleQuantityChange.bind(this, this.props.productID)}/>
				</div>
			</div>
		)
	},
	handleQuantityChange: function(productID, productSizeID, productQuantity) {
		// for some reason this is necessary - trying to bind directly to this.props.changeQuantity causes React to get cranky :(
		this.props.changeQuantity(productID, productSizeID, productQuantity)
	},
	handleDistributorChange: function(distributorID, distributorName) {
		this.setState({distributorID: distributorID, distributorName: distributorName})
	},
	getSizesForProduct: function() {
		$.ajax({
			url: window.API_URL + "/products/" + this.props.productID,
			method: "GET",
			success: function(product) {
				this.setState({productSizes: product.productSizes})
			}.bind(this)
		})
	},
	componentDidMount: function() {
		// resolve name
		$.ajax({
			url: window.API_URL + "/products/" + this.props.productID,
			method: "GET",
			success: function(product) {
				this.setState({productName: product.productName})
			}.bind(this)
		})
		this.getSizesForProduct()
	}
})

module.exports = ProductCard
