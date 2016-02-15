var React = require('react');
var $ = require('jquery');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddDistributorModal = React.createClass({
	getInitialState: function() {
		return ({showNewDistributorInput: false, distributors: [], selectedDistributor: "newDistributor", buttonEnabled: false, newDistributorNameValue: ""})
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="AddDistributorModal">
				<Modal.Header closeButton>
					<Modal.Title>Looks like we don't have a distributor listed for&nbsp;{this.props.productName}&nbsp;in&nbsp;{this.props.zipCode}&nbsp;yet. Mind helping us out?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.state.distributors.map(function(distributor) {
						return (<Input key={distributor.id} name="distributors" type="radio" value={distributor.id} label={distributor.distributorName} onChange={this.handleDistributorChange} checked={this.state.selectedDistributor == distributor.id}/>)
					}.bind(this))}
					<Input type="radio" name="distributors" value="newDistributor" label="Add new distributor" onChange={this.handleDistributorChange} checked={this.state.selectedDistributor == "newDistributor"}/>
					<Input value={this.state.newDistributorNameValue} onChange={this.handleNewDistributorNameChange} className={this.state.showNewDistributorInput
						? "show"
						: "hidden"} type="text" placeholder="Bob's Distribution Company"/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className={"btn btn-primary " + (this.state.buttonEnabled
						? ""
						: "disabled")} onClick={this.submitDistributor}>Add Distributor</button>
				</Modal.Footer>
			</Modal>
		);
	},
	handleDistributorChange: function(event) {
		// console.log(event.target.getChecked());
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
				this.setState({buttonEnabled: false});
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
					}.bind(this))
				}.bind(this))
			} else {
				// now POST to product/zipcode/distributor with new distributorID
				this.saveDistributor(this.state.selectedDistributor, function() {
					this.props.onHide()
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
			success: function(response) {
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
		data = {
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
});

module.exports = AddDistributorModal
