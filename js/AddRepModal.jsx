var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;
var $ = require('jquery');

var AddRepModal = React.createClass({
	getInitialState: function() {
		return ({
			showNewRepInput: false,
			reps: [],
			repSelectValue: "newRep",
			buttonEnabled: false,
			newRepNameValue: "",
			newRepPhoneValue: ""
		})
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="AddRepModal">
				<Modal.Header closeButton>
					<Modal.Title>Looks like we don't have a rep listed for you at&nbsp;
						{this.props.distributorName}. Mind helping us out?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input value={this.state.repSelectValue} onChange={this.handleRepSelectChange} type="select" label="Rep" ref= {function (thisInput) { this.addRepInput = thisInput }.bind(this)}>
						{this.state.reps.map(function(rep) {
							return (<RepOption key={rep.repID} repID={rep.repID}/>)
						})}
						<option value="newRep">Add New Rep</option>
					</Input>
					<div id="newRepForm" className={this.state.showNewRepInput
						? "show"
						: "hidden"}>
						<Input value={this.state.newRepNameValue} label="Rep Name" type="text" placeholder="Bob the Liquor Sales Rep" onChange={this.handleRepNameChange}/>
						<Input value={this.state.newRepPhoneValue} label="Rep Phone #" type="tel" placeholder="3038826490" onChange={this.handleRepPhoneChange}/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className={"btn btn-primary " + (this.state.buttonEnabled
						? ""
						: "disabled")} onClick={this.submitRep}>Add Rep</button>
				</Modal.Footer>
			</Modal>
		);
	},
	submitRep: function() {
		if (this.state.buttonEnabled) {
			// if this.state.showNewRepInput, create the rep, then add it to this distributor
			// if not, just save it to this distributor
			if (this.addRepInput.getValue() == "newRep") {
				this.createRep(function(newRepID) {
					this.saveRepToDistributor(newRepID, this.props.distributorID, function() {
						this.createAccount(this.props.barID, newRepID, this.props.distributorID, function() {
							this.props.onHide()
						}.bind(this))
					}.bind(this))
				}.bind(this))
			} else {
				this.createAccount(this.props.barID, this.addRepInput.getValue(), this.props.distributorID, function() {
					this.props.onHide()
				}.bind(this))
			}
		} else {
			// toast or something
		}
	},
	createRep: function(cb) {
		$.ajax({
			url: window.API_URL + "/reps",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			data: {
				repName: this.state.newRepNameValue.trim(),
				repPhone: this.state.newRepPhoneValue
			},
			success: function(newRep) {
				cb(newRep.user_id)
			}
		})
	},
	saveRepToDistributor: function(repID, distributorID, cb) {
		$.ajax({
			url: window.API_URL + "/reps/" + repID + "/memberships",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			data: {
				distributorID: distributorID
			},
			success: function() {
				if (cb) {
					cb()
				}
			}
		})
	},
	createAccount: function(barID, repID, distributorID, cb) {
		$.ajax({
			url: window.API_URL + "/accounts",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			data: {
				barID: parseInt(barID),
				repID: parseInt(repID),
				distributorID: parseInt(distributorID)
			},
			success: function() {
				if (cb) {
					cb()
				}
			}
		})
	},
	componentDidMount: function() {
		if (this.props.distributorID) {
			this.getAllRepsForDistributor(this.props.distributorID)
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.distributorID) {
			this.getAllRepsForDistributor(nextProps.distributorID)
		}
	},
	handleRepNameChange: function(event) {
		this.setState({
			newRepNameValue: event.target.value
		}, function() {
			this.updateButtonEnabled()
		}.bind(this))
	},
	handleRepPhoneChange: function(event) {
		this.setState({
			newRepPhoneValue: event.target.value.replace(/[^0-9]/g, "").slice(0, 10)
		}, function() {
			this.updateButtonEnabled()
		}.bind(this))
	},
	handleRepSelectChange: function(event) {
		this.setState({
			repSelectValue: event.target.value
		}, function() {
			this.updateNewRepFormShown()
			this.updateButtonEnabled()
		}.bind(this))
	},
	updateNewRepFormShown: function() {
		if (this.state.repSelectValue == "newRep") {
			this.setState({showNewRepInput: true})
		} else {
			this.setState({showNewRepInput: false})
		}
	},
	updateButtonEnabled: function() {
		if (this.state.repSelectValue && (this.state.repSelectValue != "newRep")) {
			this.setState({buttonEnabled: true})
		} else if ((this.state.newRepNameValue.trim() != "") && (this.state.newRepPhoneValue.length == 10)) {
			this.setState({buttonEnabled: true})
		} else {
			this.setState({buttonEnabled: false})
		}
	},
	getAllRepsForDistributor: function(distributorID) {
		$.ajax({
			url: window.API_URL + "/reps",
			method: "GET",
			data: {
				distributorID: distributorID
			},
			success: function(reps) {
				this.setState({reps: reps})
				if (reps.length == 0) {
					this.setState({showNewRepInput: true, repSelectValue: "newRep", buttonEnabled: false})
				} else {
					this.setState({showNewRepInput: false, repSelectValue: reps[0].repID, buttonEnabled: true})
				}
			}.bind(this)
		})
	}
})

var RepOption = React.createClass({
	getInitialState: function() {
		return {repName: ""};
	},
	render: function() {
		return (
			<option value={this.props.repID}>
				{this.state.repName}
			</option>
		);
	},
	componentDidMount: function() {
		this.resolveRepName(function(repName) {
			this.setState({repName: repName})
		}.bind(this))
	},
	resolveRepName: function(cb) {
		$.ajax({
			url: window.API_URL + "/reps/" + this.props.repID,
			method: "GET",
			success: function(rep) {
				cb(rep.name)
			}
		})
	}

});

module.exports = AddRepModal
