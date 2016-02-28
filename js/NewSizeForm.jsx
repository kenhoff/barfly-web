var React = require('react')

var Button = require('react-bootstrap').Button
var AddNewSizeModal = require('./AddNewSizeModal.jsx')

var $ = require('jquery')

var NewSizeForm = React.createClass({
	getInitialState: function() {
		var state = {
			showAddNewSizeModal: false,
			containers: [],
			packaging: [],
			newSizeButtonEnabled: false
		}
		return state
	},
	render: function() {
		return (
			<div>
				<Button bsStyle="link" bsSize="xsmall" onClick={function() {
					this.setState({showAddNewSizeModal: true})
				}.bind(this)} className={this.state.showNewSizeForm
					? "hidden"
					: "show"}>Add new size for&nbsp;{this.props.productName}</Button>
				<AddNewSizeModal showModal={this.state.showAddNewSizeModal} onHide={function() {
					this.setState({showAddNewSizeModal: false})
				}.bind(this)} productName={this.props.productName}></AddNewSizeModal>
			</div>
		)
	},

	// <form className={this.state.showNewSizeForm
	// 	? "show"
	// 	: "hidden"} onSubmit={this.handleNewSizeSubmit} onChange={this.handleNewSizeChange}>
	// </form>

	handleNewSizeChange: function() {
		var containerID = this.refs.containerInput.getValue()
		var packagingID = this.refs.packagingInput.getValue()
		if ((containerID == "nullContainer") || (packagingID == "nullPackaging")) {
			this.setState({newSizeButtonEnabled: false})
		} else {
			this.setState({newSizeButtonEnabled: true})
		}
	},
	handleNewSizeSubmit: function(event) {
		event.preventDefault()
		var containerID = this.refs.containerInput.getValue()
		var packagingID = this.refs.packagingInput.getValue()
		// first, check to see if size already exists
		this.checkToSeeIfSizeExists(containerID, packagingID, function(err, size) {
			if (size) {
				// if size exists, save returned size to product
				this.saveSizeToProduct(size.id, function(err) {
					if (!err) {
						// do whatever it is that we do once saving a product
						this.refs.containerInput.getInputDOMNode().value = "nullContainer"
						this.refs.packagingInput.getInputDOMNode().value = "nullPackaging"
						this.props.refreshSizes()
						this.setState({newSizeButtonEnabled: false, showNewSizeForm: false})
					}
				}.bind(this))
			} else {
				// if not, create new size (and save new size to product)
				this.createNewSize(containerID, packagingID, function(err, sizeID) {
					this.saveSizeToProduct(sizeID, function(err) {
						if (!err) {
							// do whatever it is that we do once saving a product
							this.refs.containerInput.getInputDOMNode().value = "nullContainer"
							this.refs.packagingInput.getInputDOMNode().value = "nullPackaging"
							this.props.refreshSizes()
							this.setState({newSizeButtonEnabled: false, showNewSizeForm: false})
						}
					}.bind(this))
				}.bind(this))
			}
		}.bind(this))
	},
	checkToSeeIfSizeExists: function(containerID, packagingID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/sizes",
			data: {
				containerID: containerID,
				packagingID: packagingID
			},
			method: "GET",
			success: function(size) {
				cb(null, size)
			}
		})
	},
	createNewSize: function(containerID, packagingID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/sizes",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				containerID: containerID,
				packagingID: packagingID
			},
			success: function(sizeID) {
				if (cb) {
					cb(null, sizeID)
				}
			}
		})
	},
	saveSizeToProduct: function(sizeID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/products/" + this.props.productID + "/sizes",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				sizeID: parseInt(sizeID)
			},
			success: function() {
				if (cb) {
					cb(null)
				}
			}
		})
	}
})

module.exports = NewSizeForm
