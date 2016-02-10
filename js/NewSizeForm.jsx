var React = require('react');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ButtonInput = require('react-bootstrap').ButtonInput;

var $ = require('jquery');

var NewSizeForm = React.createClass({
	getInitialState: function() {
		state = {
			showNewSizeForm: false,
			containers: [],
			packaging: [],
			newSizeButtonEnabled: false
		}
		return state;
	},
	render: function() {
		return (
			<div>
				<Button onClick={function() {
					this.setState({showNewSizeForm: true})
				}.bind(this)} className={this.state.showNewSizeForm
					? "hidden"
					: "show"}>Add new size</Button>
				<form className={this.state.showNewSizeForm
					? "show"
					: "hidden"} onSubmit={this.handleNewSizeSubmit} onChange={this.handleNewSizeChange}>
					<Input type="select" label="Container" ref="containerInput">
						<option key={null} value="nullContainer">Please select a container</option>
						{this.state.containers.map(function(container) {
							return (
								<option key={container.id} value={container.id}>{container.containerName}</option>
							)
						})}
					</Input>
					<Input type="select" label="Packaging" ref="packagingInput">
						<option key={null} value="nullPackaging">Please select a packaging</option>
						{this.state.packaging.map(function(packaging) {
							return (
								<option key={packaging.id} value={packaging.id}>{packaging.packagingName}</option>
							)
						})}
					</Input>
					<ButtonInput type="submit" value="Add New Size" disabled={!this.state.newSizeButtonEnabled}/>
				</form>
			</div>
		);
	},
	componentDidMount: function() {
		this.getContainers()
		this.getPackaging()
	},
	handleNewSizeChange: function() {
		containerID = this.refs.containerInput.getValue()
		packagingID = this.refs.packagingInput.getValue()
		if ((containerID == "nullContainer") || (packagingID == "nullPackaging")) {
			this.setState({newSizeButtonEnabled: false})
		} else {
			this.setState({newSizeButtonEnabled: true})
		}
	},
	handleNewSizeSubmit: function(event) {
		event.preventDefault();
		containerID = this.refs.containerInput.getValue()
		packagingID = this.refs.packagingInput.getValue()
		// first, check to see if size already exists
		this.checkToSeeIfSizeExists(containerID, packagingID, function(err, sizeID) {
			if (sizeID) {
				// if size exists, save returned size to product
				this.saveSizeToProduct(sizeID, function(err) {
					if (err) {
						console.log(err);
					} else {
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
						if (err) {
							console.log(err);
						} else {
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
			url: window.API_URL + "/sizes",
			data: {
				containerID: containerID,
				packagingID: packagingID
			},
			method: "GET",
			success: function(size) {
				console.log(size);
				cb(null, size)
			}
		})
	},
	createNewSize: function(containerID, packagingID, cb) {
		$.ajax({
			url: window.API_URL + "/sizes",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				containerID: containerID,
				packagingID: packagingID
			},
			success: function(sizeID) {
				console.log(sizeID);
				if (cb) {
					cb(null, sizeID)
				}
			}
		})
	},
	saveSizeToProduct: function(sizeID, cb) {
		$.ajax({
			url: window.API_URL + "/products/" + this.props.productID + "/sizes",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: {
				sizeID: parseInt(sizeID)
			},
			success: function() {
				console.log("success!");
				if (cb) {
					cb(null)
				}
			}
		})
	},
	getContainers: function() {
		$.ajax({
			url: window.API_URL + "/containers",
			method: "GET",
			success: function(containers) {
				containers.sort(function(a, b) {
					if (a.containerName.toLowerCase() > b.containerName.toLowerCase()) {
						return 1
					} else if (a.containerName.toLowerCase() < b.containerName.toLowerCase()) {
						return -1
					} else {
						return 0
					}
				})
				this.setState({containers: containers})
			}.bind(this)
		})
	},
	getPackaging: function() {
		$.ajax({
			url: window.API_URL + "/packaging",
			method: "GET",
			success: function(packaging) {
				packaging.sort(function(a, b) {
					if (a.packagingName.toLowerCase() > b.packagingName.toLowerCase()) {
						return 1
					} else if (a.packagingName.toLowerCase() < b.packagingName.toLowerCase()) {
						return -1
					} else {
						return 0
					}
				})
				this.setState({packaging: packaging})
			}.bind(this)
		})
	}
});

module.exports = NewSizeForm;
