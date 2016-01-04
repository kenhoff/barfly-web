var React = require('react');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var Order = React.createClass({
	getInitialState: function() {
		return {products: [], showNewProductModal: false}
	},
	render: function() {
		return (
			<div>
				<h1>Order #{this.props.params.orderID}</h1>
				{this.state.products.map(function(product) {
					return (<Product key={product} productID={product}/>)
				})}
				<p>Can't find what you're looking for?
					<a onClick={this.showNewProductModal}>Create a new product</a>
				</p>
				<NewProductModal showModal={this.state.showNewProductModal} onHide={this.closeNewProductModal} newProductCreated={this.getProducts}/>
			</div>
		)
	},
	showNewProductModal: function() {
		this.setState({showNewProductModal: true})
	},
	closeNewProductModal: function() {
		this.setState({showNewProductModal: false})
	},
	getProducts: function() {
		$.ajax({
			url: window.API_URL + "/products",
			// (no auth needed)
			method: "GET",
			success: function(products) {
				this.setState({products: products})
			}.bind(this)
		})
	},
	componentDidMount: function() {
		this.getProducts()
	}
})

var NewProductModal = React.createClass({
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new product to Barfly's database.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input type="text" label="What's the name of your product?" placeholder="Bob's Genuine Beer" ref="productNameInput"/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className="btn btn-primary" onClick={this.submitProduct}>Create</button>
				</Modal.Footer>
			</Modal>
		);
	},
	submitProduct: function() {
		$.ajax({
			url: window.API_URL + "/products",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				productName: this.refs.productNameInput.getValue()
			},
			success: function(data) {
				this.props.newProductCreated()
				this.props.onHide()
			}.bind(this)
		})
	}
})

var Product = React.createClass({
	getInitialState: function() {
		return ({name: ""})
	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">{this.state.name}</div>
			</div>
		)
	},
	componentDidMount: function() {
		// resolve name
		$.ajax({
			url: window.API_URL + "/products/" + this.props.productID,
			method: "GET",
			success: function(product) {
				this.setState({name: product.productName})
			}.bind(this)
		})
	}
})

module.exports = Order
