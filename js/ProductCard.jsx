var React = require('React');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var ProductCard = React.createClass({
	getInitialState: function() {
		return ({productName: "", productSizeName: ""})
	},
	render: function() {
		minusButton = <Button onClick={this.decrement}>-</Button>
		plusButton = <Button onClick={this.increment}>+</Button>
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<p>
						{this.state.productName}
					</p>
					<p>
						{this.state.productSizeName}
					</p>
					<p>{this.props.barID}</p>
					<Input buttonBefore={minusButton} buttonAfter={plusButton} placeholder="0" type="number" value={this.props.productQuantity} onChange={this.changeQuantity} ref={function(thisComponent) {
						this.quantityInput = thisComponent
					}.bind(this)}/>
				</div>
			</div>
		)
		// ,
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
		// resolve distributor
		// well, first resolve bar zip code
		$.ajax({
			url: window.API_URL + "/bars/" + this.props.barID,
			headers :{
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function (bar) {
				$.ajax({
					url: window.API_URL + "/products/" + this.props.productID + "/zipcodes/" + bar.zipCode + "/distributor",
					method: "GET",
					success: function (distributor) {
						console.log("distributor for", this.props.productID, "in", bar.zipCode, ":", distributor);
					}.bind(this)
				})
			}.bind(this)
		})
	}
})

module.exports = ProductCard
