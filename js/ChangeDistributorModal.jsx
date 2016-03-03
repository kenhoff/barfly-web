var React = require('react')
var Modal = require('react-bootstrap').Modal
var Button = require('react-bootstrap').Button
var Input = require('react-bootstrap').Input
var DistributorSelect = require('./DistributorSelect.jsx')
var $ = require('jquery')

var ChangeDistributorModal = React.createClass({
	getInitialState: function() {
		var state = {
			selectedDistributor: null,
			distributors: [],
			newDistributorNameValue: "",
			buttonEnabled: false,
			validationInputValue: ""
		}
		return state
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						{"Do we have the wrong distributor for " + this.props.productName + "? Let's get that fixed."}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<label>{"Select the correct distributor for " + this.props.productName + ":"}</label>
					<DistributorSelect handleDistributorChange={this.handleDistributorChange} handleNewDistributorNameChange={this.handleNewDistributorNameChange} showNewDistributorInput={this.state.showNewDistributorInput} newDistributorNameValue={this.state.newDistributorNameValue} selectedDistributor={this.state.selectedDistributor} distributors={this.state.distributors}/>
					<label>{"This will change " + this.props.productName + "'s distributor for all bars in " + this.props.zipCode + ". "}</label>
					<label style={{
						color: "red"
					}}>{"Are you sure you want to do this?"}</label>
					<Input type="text" label="Type the new distributor's name to continue." onChange={this.handleValidationInputChange} value={this.state.validationInputValue}/>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.closeModal}>
						Cancel
					</Button>

					<Button disabled={!this.state.buttonEnabled} onClick={this.submitDistributor} bsStyle="primary">{"Save Distributor for " + this.props.productName}
					</Button>
				</Modal.Footer>
			</Modal>
		)
	},

	handleValidationInputChange: function(event) {
		this.setState({validationInputValue: event.target.value})
	},

	handleDistributorChange: function(event) {
		this.setState({selectedDistributor: event.target.value})
		if (event.target.value == "newDistributor") {
			this.setState({showNewDistributorInput: true})
			if (this.state.newDistributorNameValue.trim() != "") {
				this.setState({buttonEnabled: true})
			} else {
				this.setState({buttonEnabled: false})
			}
		} else {
			this.setState({showNewDistributorInput: false, buttonEnabled: true})
		}
	},
	handleNewDistributorNameChange: function(event) {
		this.setState({
			newDistributorNameValue: event.target.value
		}, function() {
			if (this.state.newDistributorNameValue.trim() != "") {
				this.setState({buttonEnabled: true})
			} else {
				this.setState({buttonEnabled: false})
			}
		}.bind(this))
	},
	submitDistributor: function() {
		if (this.state.buttonEnabled) {
			if (this.state.selectedDistributor == "newDistributor") {
				this.createNewDistributor(this.state.newDistributorNameValue, function(newDistributorID) {
					// now POST to product/zipcode/distributor with new distributorID
					this.saveDistributor(newDistributorID, function() {
						this.props.onHide()
						this.props.reresolveOrder()
					}.bind(this))
				}.bind(this))
			} else {
				// now POST to product/zipcode/distributor with new distributorID
				this.saveDistributor(this.state.selectedDistributor, function() {
					this.props.onHide()
					this.props.reresolveOrder()
				}.bind(this))
			}
		}
	},
	saveDistributor: function(distributorID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/products/" + this.props.productID + "/zipcodes/" + this.props.zipCode + "/distributor",
			method: "POST",
			data: {
				distributorID: parseInt(distributorID)
			},
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				cb()
			}
		})
	},
	getDistributors: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/distributors",
			method: "GET",
			success: function(distributors) {
				this.setState({distributors: distributors})
				if (distributors.length == 0) {
					this.setState({showNewDistributorInput: true, selectedDistributor: "newDistributor"})
				} else {
					this.setState({showNewDistributorInput: false, selectedDistributor: distributors[0]})
				}
			}.bind(this)
		})
	},
	createNewDistributor: function(distributorName, cb) {
		var data = {
			distributorName: distributorName
		}
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/distributors",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "POST",
			data: data,
			success: function(distributorID) {
				cb(distributorID.distributorID)
			}
		})
	},
	componentDidMount: function() {
		this.getDistributors()
	}
})

module.exports = ChangeDistributorModal
