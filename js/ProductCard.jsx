var React = require('React');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var DistributorField = require('./DistributorField.jsx');
var RepField = require('./RepField.jsx');

var ProductCard = React.createClass({
	getInitialState: function() {
		return ({productName: "", productSizeName: "", distributorID: null, distributorName: null})
	},
	render: function() {
		minusButton = <Button onClick={this.decrement}>-</Button>
		plusButton = <Button onClick={this.increment}>+</Button>
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<p>
						<b>Product:</b>&nbsp;{this.state.productName}
					</p>
					<p>
						<b>Size:</b>&nbsp;{this.state.productSizeName}
					</p>
					<DistributorField barID={this.props.barID} productID={this.props.productID} productName={this.state.productName} changeDistributor={this.handleDistributorChange}/>
					<RepField barID={this.props.barID} distributorID={this.state.distributorID} distributorName={this.state.distributorName} reresolveOrder={this.props.reresolveOrder}/>
					<Input label="Quantity" buttonBefore={minusButton} buttonAfter={plusButton} placeholder="0" type="number" value={this.props.productQuantity} onChange={this.changeQuantity} ref={function(thisComponent) {
						this.quantityInput = thisComponent
					}.bind(this)}/>
				</div>
			</div>
		)
		// ,
	},
	handleDistributorChange: function(distributorID, distributorName) {
		this.setState({distributorID: distributorID, distributorName: distributorName})
	},
	increment: function() {
		if (this.quantityInput.getValue() == "") {
			newQuantity = 1
		} else {
			newQuantity = parseInt(this.quantityInput.getValue()) + 1
		}
		this.props.changeQuantity(this.props.productID, this.props.productSizeID, newQuantity)
	},
	decrement: function() {
		this.props.changeQuantity(this.props.productID, this.props.productSizeID, parseInt(this.quantityInput.getValue()) - 1)
	},
	changeQuantity: function() {
		// this is gross. gotta find a better way to do this
		this.props.changeQuantity(this.props.productID, this.props.productSizeID, parseInt(this.quantityInput.getValue()))
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
		// resolve size
		$.ajax({
			url: window.API_URL + "/sizes/" + this.props.productSizeID,
			method: "GET",
			success: function(size) {
				this.setState({productSizeName: size.sizeName})
			}.bind(this)
		})
	}
})

module.exports = ProductCard
