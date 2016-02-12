var React = require('react');
var $ = require('jquery');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var NewProductModal = React.createClass({
	getInitialState: function() {
		state = {
			buttonEnabled: false
		}
		return (state)
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="NewProductModal">
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new product to Barfly.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input type="text" label="What's the name of your product?" placeholder="Bob's Genuine Beer" ref="productNameInput" onChange={this.updateFormIsValid}/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className={"btn btn-primary " + (this.state.buttonEnabled
						? ""
						: "disabled")} onClick={this.submitProduct}>Create</button>
				</Modal.Footer>
			</Modal>
		)
	},
	updateFormIsValid: function() {
		if (this.refs.productNameInput.getValue().trim() != "") {
			this.setState({buttonEnabled: true})
		} else {
			this.setState({buttonEnabled: false})
		}
	},
	submitProduct: function() {
		productName = this.refs.productNameInput.getValue().trim()
		if (this.state.buttonEnabled) {
			this.sendNewProduct(productName, function() {
				this.props.newProductCreated()
				this.props.onHide()
			}.bind(this))
		} else {
			// do a toast or something
		}
	},
	sendNewProduct: function(name, cb) {
		$.ajax({
			url: window.API_URL + "/products",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				productName: name
			},
			success: function(data) {
				if (cb) {
					cb()
				}
			}.bind(this)
		})
	}
})

module.exports = NewProductModal
