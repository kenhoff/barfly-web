var React = require('react');
var $ = require('jquery');

var AddRepModal = require('./AddRepModal.jsx');

var RepField = React.createClass({
	getInitialState: function() {
		return ({repName: "Finding rep...", repID: null, addNewRepModalOpen: false, resolving: true})
	},
	render: function() {
		if (this.state.resolving) {
			return (
				<p>Looking up your rep at&nbsp;{this.props.distributorName}...</p>
			)
		} else {
			if (this.state.repID) {
				return (
					<div>
						<p>
							<b>Rep:</b>&nbsp;{this.state.repName}
						</p>
					</div>
				)
			} else {
				return (
					<div>
						<p>
							<button className="btn btn-default" onClick={this.openModal}>Add my rep at&nbsp;
								{this.props.distributorName}</button>
						</p>
						<AddRepModal showModal={this.state.addNewRepModalOpen} onHide={this.closeModal} distributorName={this.props.distributorName} distributorID={this.props.distributorID} barID={this.props.barID}/>
					</div>
				);
			}
		}
	},
	openModal: function() {
		this.setState({addNewRepModalOpen: true})
	},
	closeModal: function() {
		this.setState({addNewRepModalOpen: false})
		this.resolveAccount(function(account) {
			if (account) {
				this.resolveRepName(account.repID, function(repName) {
					this.setState({repID: account.repID, repName: repName})
					this.props.changeRep(account.repID, repName)
					this.props.reresolveOrder()
				}.bind(this))
			}
		}.bind(this))
	},
	componentDidMount: function() {
		this.setState({
			resolving: true
		}, function() {
			// if this.props.distributorID == null, then don't display anything yet.
			// if this.props.distributorID != null, then attempt to resolve the account.
			if (this.props.distributorID) {
				this.resolveAccount(function(account) {
					if (account) {
						this.resolveRepName(account.repID, function(repName) {
							this.props.changeRep(account.repID, repName)
							this.setState({repID: account.repID, repName: repName, resolving: false})
						}.bind(this))
					} else {
						this.setState({repID: null, repName: null, resolving: false})
					}
				}.bind(this))
			}
		}.bind(this))
	},
	componentDidUpdate: function(prevProps) {
		if (prevProps.distributorID != this.props.distributorID) {
			this.setState({
				resolving: true
			}, function() {
				this.resolveAccount(function(account) {
					if (account) {
						this.resolveRepName(account.repID, function(repName) {
							this.setState({repID: account.repID, repName: repName, resolving: false})
						}.bind(this))
					} else {
						this.setState({repID: null, repName: null, resolving: false})
					}
				}.bind(this))
			}.bind(this))
		}
	},
	resolveAccount: function(cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/accounts",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			data: {
				barID: this.props.barID,
				distributorID: this.props.distributorID
			},
			success: function(account) {
				if (Object.keys(account).length == 0) {
					cb(null)
				} else {
					cb(account)
				}
			}
		})
	},
	resolveRepName: function(repID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/reps/" + repID,
			method: "GET",
			success: function(rep) {
				cb(rep.name)
			}
		})
	}

});

module.exports = RepField
