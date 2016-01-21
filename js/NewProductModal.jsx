var React = require('react');
var $ = require('jquery');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var NewProductModal = React.createClass({
	getInitialState: function() {
		return ({showNewSizeInput: false, sizes: [], buttonEnabled: false})
	},
	componentDidMount: function() {
		// bullshit that we can't initialize the ref to productSizeInput here, but whatever. We can work around it somehow
		this.updateSizes()
		// this.updateFormIsValid()
	},
	updateSizes: function() {
		$.ajax({
			url: window.API_URL + "/sizes",
			method: "GET",
			success: function(sizes) {
				if (sizes.length == 0) {
					this.setState({sizes: sizes, showNewSizeInput: true})
				} else {
					this.setState({sizes: sizes, showNewSizeInput: false})
				}
			}.bind(this)
		})
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="NewProductModal">
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new product to Barfly.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input type="text" label="What's the name of your product?" placeholder="Bob's Genuine Beer" ref="productNameInput" onChange={this.updateFormIsValid}/>
					<Input type="select" label="What size does your product come in?" ref="productSizeInput" onChange={this.selectSize}>
						{this.state.sizes.map(function(size) {
							return (<SizeOption key={size} sizeID={size}/>)
						})}
						<option value="newSize">Add new size</option>
					</Input>
					<Input className={this.state.showNewSizeInput
						? "show"
						: "hidden"} type="text" placeholder="750ml" ref="productNewSizeInput" onChange={this.updateFormIsValid}/>
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
			if ((this.refs.productSizeInput.getValue() == "newSize") && (this.refs.productNewSizeInput.getValue().trim() != "")) {
				this.setState({buttonEnabled: true})
			} else if (parseInt(this.refs.productSizeInput.getValue()) > 0) {
				this.setState({buttonEnabled: true})
			} else {
				this.setState({buttonEnabled: false})
			}
		} else {
			this.setState({buttonEnabled: false})
		}
	},
	submitProduct: function() {
		// if the user has specified a new size, POST /sizes first, then POST /products with the new ID.
		// if the user didn't specify a new size, then just POST /products with the given ID.
		productName = this.refs.productNameInput.getValue().trim()
		if (this.state.buttonEnabled) {
			if (this.refs.productSizeInput.getValue() == "newSize") {
				this.sendNewSize(this.refs.productNewSizeInput.getValue(), function(newSizeID) {
					this.sendNewProduct(productName, newSizeID, function() {
						this.updateSizes()
						this.props.newProductCreated()
						this.props.onHide()
						this.setState({showNewSizeInput: false})
					}.bind(this))
				}.bind(this))
			} else {
				this.sendNewProduct(productName, this.refs.productSizeInput.getValue(), function() {
					this.updateSizes()
					this.props.newProductCreated()
					this.props.onHide()
					this.setState({showNewSizeInput: false})
				}.bind(this))
			}
		} else {
			// do a toast or something
		}

	},
	selectSize: function() {
		if (this.refs.productSizeInput.getValue() == "newSize") {
			this.setState({showNewSizeInput: true})
		} else {
			this.setState({showNewSizeInput: false})
		}
		this.updateFormIsValid()
	},
	sendNewSize: function(sizeName, cb) {
		$.ajax({
			url: window.API_URL + "/sizes",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				sizeName: sizeName
			},
			success: function(sizeID) {
				if (cb) {
					cb(sizeID)
				}
			}.bind(this)
		})
	},
	sendNewProduct: function(name, sizeID, cb) {
		$.ajax({
			url: window.API_URL + "/products",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				productName: name,
				productSize: parseInt(sizeID)
			},
			success: function(data) {
				if (cb) {
					cb()
				}
			}.bind(this)
		})
	}
})

var SizeOption = React.createClass({
	getInitialState: function() {
		return ({sizeName: ""})
	},
	render: function() {
		return (
			<option value={this.props.sizeID}>{this.state.sizeName}</option>
		)
	},
	componentDidMount: function() {
		$.ajax({
			url: window.API_URL + "/sizes/" + this.props.sizeID,
			method: "GET",
			success: function(size) {
				this.setState({sizeName: size.sizeName})
			}.bind(this)
		})
	}
})

module.exports = NewProductModal
