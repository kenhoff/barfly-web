var React = require('React');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddRepModal = React.createClass({
	getInitialState: function() {
		return ({showNewRepInput: false, reps: []})
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Looks like we don't have a rep listed for you at&nbsp;
						{this.props.distributorName}. Mind helping us out?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input onChange={this.updateNewRepInput} type="select" label="Rep" ref= {function (thisInput) { this.addRepInput = thisInput }.bind(this)}>
						{this.state.reps.map(function(rep) {
							return (<RepOption key={rep.repID} repID={rep.repID}/>)
						})}
						<option value="newRep">Add New Rep</option>
					</Input>
					<div className={this.state.showNewRepInput
						? "show"
						: "hidden"}>
						<Input label="Rep Name" type="text" placeholder="Bob the Liquor Sales Rep" ref={function(thisInput) {
							this.newRepName = thisInput
						}.bind(this)}/>
						<Input label="Rep Phone #" type="text" placeholder="303-882-6490" ref={function(thisInput) {
							this.newRepPhone = thisInput
						}.bind(this)}/>
						<Input label="Rep Email" type="text" placeholder="bob@awesomedistributor.com" ref={function(thisInput) {
							this.newRepEmail = thisInput
						}.bind(this)}/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className="btn btn-primary" onClick={this.submitRep}>Add Rep</button>
				</Modal.Footer>
			</Modal>
		);
	},
	submitRep: function() {
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
	},
	createRep: function(cb) {
		$.ajax({
			url: window.API_URL + "/reps",
			method: "POST",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			data: {
				repName: this.newRepName.getValue(),
				repPhone: this.newRepPhone.getValue(),
				repEmail: this.newRepEmail.getValue()
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
				barID: barID,
				repID: repID,
				distributorID: distributorID
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
	updateNewRepInput: function() {
		if (this.addRepInput.getValue() == "newRep") {
			this.setState({showNewRepInput: true})
		} else {
			this.setState({showNewRepInput: false})
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
					this.setState({showNewRepInput: true})
				}
				// this.updateNewRepInput()
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
