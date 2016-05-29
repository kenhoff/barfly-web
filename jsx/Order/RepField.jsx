var React = require('react');
var $ = require('jquery');
var Button = require('react-bootstrap').Button;

var AddRepModal = require('./AddRepModal.jsx');
var DistributorName = require('./DistributorName.jsx');
var RepName = require('./RepName.jsx');

var RepField = React.createClass({
	propTypes: {
		distributorID: React.PropTypes.number.isRequired
	},
	getInitialState: function() {
		return ({repID: null, addNewRepModalOpen: false, resolving: true});
	},
	render: function() {
		if (this.state.resolving) {
			return (
				<p>{"Looking up your rep at "}
					<DistributorName distributorID={this.props.distributorID}></DistributorName>
					{"..."}</p>
			);
		} else {
			if (this.state.repID) {
				return (
					<div>
						<span>
							<RepName repID={this.state.repID}/>
						</span>
						<Button bsStyle="link" bsSize="xs" onClick={this.openModal}>Change rep</Button>
						<AddRepModal changeRep={true} showModal={this.state.addNewRepModalOpen} onHide={this.closeModal} distributorName={this.props.distributorName} distributorID={this.props.distributorID} barID={this.props.barID}/>
					</div>
				);
			} else {
				return (
					<div>
						<p>
							<button className="btn btn-default" onClick={this.openModal}>{"Add my rep at "}
								<DistributorName distributorID={this.props.distributorID}></DistributorName>
							</button>
						</p>
						<AddRepModal showModal={this.state.addNewRepModalOpen} onHide={this.closeModal} distributorName={this.props.distributorName} distributorID={this.props.distributorID} barID={this.props.barID}/>
					</div>
				);
			}
		}
	},
	openModal: function() {
		this.setState({addNewRepModalOpen: true});
	},
	closeModal: function() {
		this.setState({addNewRepModalOpen: false});
		this.resolveAccount(function(account) {
			if (account) {
				this.setState({repID: account.repID});
				this.props.changeRep(account.repID);
				this.props.reresolveOrder();
			}
		}.bind(this));
	},
	componentDidMount: function() {
		this.setState({
			resolving: true
		}, () => {
			// if this.props.distributorID == null, then don't display anything yet.
			// if this.props.distributorID != null, then attempt to resolve the account.
			if (this.props.distributorID) {
				this.resolveAccount((account) => {
					if (account) {
						this.props.changeRep(account.repID);
						this.setState({repID: account.repID, resolving: false});
					} else {
						this.setState({repID: null, resolving: false});
					}
				});
			}
		});
	},
	componentDidUpdate: function(prevProps) {
		if (prevProps.distributorID != this.props.distributorID) {
			this.setState({
				resolving: true
			}, () => {
				this.resolveAccount((account) => {
					if (account) {
						this.props.changeRep(account.repID);
						this.setState({repID: account.repID, resolving: false});
					} else {
						this.setState({repID: null, resolving: false});
					}
				});
			});
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
					cb(null);
				} else {
					cb(account);
				}
			}
		});
	}
});

module.exports = RepField;
