var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var $ = require('jquery');

import {connect} from "react-redux";

var ContainerSelect = require('./ContainerSelect.jsx');
var PackagingSelect = require('./PackagingSelect.jsx');

var bartender = require('../Bartender.jsx');

var AddNewSizeModal = React.createClass({
	getInitialState: function() {
		return {selectedContainerID: null, selectedPackagingID: null};
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="AddNewSizeModal">
				<Modal.Header closeButton>
					<Modal.Title>Looks like we don't have all the sizes for&nbsp;{this.props.productName}&nbsp;yet. Mind helping us out?</Modal.Title>
				</Modal.Header>
				<form onChange={this.handleNewSizeChange} onSubmit={this.handleFormSubmit}>
					<Modal.Body>
						<ContainerSelect selectedContainerID={this.state.selectedContainerID}/>
						<PackagingSelect selectedPackagingID={this.state.selectedPackagingID}/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.props.onHide}>Cancel</Button>
						<Button bsStyle="primary" disabled={!(this.state.selectedContainerID && this.state.selectedPackagingID)} onClick={this.handleModalSave}>{this.state.selectedContainerID && this.state.selectedPackagingID
								? "Save size for " + this.props.productName
								: "Please select a container and packaging"}</Button>
					</Modal.Footer>
				</form>
			</Modal>
		);
	},
	handleModalSave: function() {
		if (this.state.selectedContainerID && this.state.selectedPackagingID) {
			this.checkToSeeIfSizeExists(this.state.selectedContainerID, this.state.selectedPackagingID, function(err, size) {
				if (size) {
					// if size exists, save returned size to product
					this.saveSizeToProduct(size.id, function(err) {
						if (!err) {
							this.setState({selectedContainerID: null, selectedPackagingID: null});
							// do whatever it is that we do once saving a product
							this.props.saveSizeToProduct(this.props.productID, size.id);
							bartender.resolve({collection: "sizes", id: size.id});
							// this.props.refreshSizes();
							this.props.onHide();
						}
					}.bind(this));
				} else {
					// if not, create new size (and save new size to product)
					this.createNewSize(this.state.selectedContainerID, this.state.selectedPackagingID, function(err, sizeID) {
						this.saveSizeToProduct(sizeID, function(err) {
							if (!err) {
								// do whatever it is that we do once saving a product
								this.setState({selectedContainerID: null, selectedPackagingID: null});
								this.props.saveSizeToProduct(this.props.productID, sizeID);
								bartender.resolve({collection: "sizes", id: sizeID});
								// this.props.refreshSizes();
								this.props.onHide();
							}
						}.bind(this));
					}.bind(this));
				}
			}.bind(this));
		}
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
				cb(null, size);
			}
		});
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
					cb(null, sizeID);
				}
			}
		});
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
					cb(null);
				}
			}
		});
	},
	handleNewSizeChange: function(e) {
		if (e.target.id == "ContainerSelect") {
			if (e.target.value == "nullContainer") {
				this.setState({selectedContainerID: null});
			} else {
				this.setState({selectedContainerID: e.target.value});
			}
		} else if (e.target.id == "PackagingSelect") {
			if (e.target.value == "nullPackaging") {
				this.setState({selectedPackagingID: null});
			} else {
				this.setState({selectedPackagingID: e.target.value});
			}
		}
	}
});

let mapDispatchToProps = function(dispatch) {
	return {
		saveSizeToProduct: (productID, sizeID) => {
			let action = {
				type: "SAVE_NEW_SIZE_TO_PRODUCT",
				productID: productID,
				sizeID: sizeID
			};
			dispatch(action);
		}
	};
};

AddNewSizeModal = connect(() => ({}), mapDispatchToProps)(AddNewSizeModal);

module.exports = AddNewSizeModal;
