var React = require('react')
var Modal = require('react-bootstrap').Modal
var Button = require('react-bootstrap').Button
var DistributorSelect = require('./DistributorSelect.jsx')
var $ = require('jquery')

var ChangeDistributorModal = React.createClass({
	getInitialState: function() {
		var state = {
			selectedDistributor: null,
			distributors: [],
			newDistributorNameValue: "",
			buttonEnabled: false
		}
		return state
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.closeModal}>
				<Modal.Header closeButton>
					<Modal.Title>
						{"Change distributor for " + this.props.productName}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<DistributorSelect handleDistributorChange={this.handleDistributorChange} handleNewDistributorNameChange={this.handleNewDistributorNameChange} showNewDistributorInput={this.state.showNewDistributorInput} newDistributorNameValue={this.state.newDistributorNameValue} selectedDistributor={this.state.selectedDistributor} distributors={this.state.distributors}/>
				</Modal.Body>
				<Modal.Footer onClick={this.props.closeModal}>
					<Button>
						Cancel
					</Button>

					<Button disabled={!this.state.buttonEnabled} onClick={this.submitDistributor} bsStyle="primary">{"Save Distributor for " + this.props.productName}
					</Button>
				</Modal.Footer>
			</Modal>
		)
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
