var React = require('react')
var Button = require('react-bootstrap').Button

var $ = require('jquery')

var AddDistributorModal = require('./AddDistributorModal.jsx')
var ChangeDistributorModal = require('./ChangeDistributorModal.jsx')

var DistributorField = React.createClass({
	getInitialState: function() {
		var state = {
			distributorName: "Finding distributor...",
			showAddDistributorModal: false,
			zipCode: null,
			resolving: true,
			showChangeDistributorModal: false
		}
		return (state)
	},
	render: function() {
		if (this.state.resolving) {
			return (
				<p>Looking up the distributor for&nbsp;{this.props.productName}...</p>
			)
		} else if (this.state.distributorName == -1) {
			return (
				<div>
					<p>
						<button className="btn btn-default" onClick={this.openModal}>{"Add a Distributor for " + this.props.productName}</button>
					</p>
					<AddDistributorModal showModal={this.state.showAddDistributorModal} onHide={this.closeModal} productID={this.props.productID} zipCode={this.state.zipCode} productName={this.props.productName} reresolveOrder={this.props.reresolveOrder}/>
				</div>
			)
		} else {
			var changeDistributorProps = {
				productID: this.props.productID,
				productName: this.props.productName,
				showModal: this.state.showChangeDistributorModal,
				closeModal: function() {
					this.setState({showChangeDistributorModal: false})
				}.bind(this)
			}
			return (
				<div>
					<span>
						{this.state.distributorName}</span>
					<Button bsStyle="link" bsSize="xs" onClick={function() {
						this.setState({showChangeDistributorModal: true})
					}.bind(this)}>Change distributor</Button>
					<ChangeDistributorModal {...changeDistributorProps}/>
				</div>
			)
		}
	},
	openModal: function() {
		this.setState({showAddDistributorModal: true})
	},
	closeModal: function() {
		this.setState({showAddDistributorModal: false})
		this.resolveDistributor()
	},
	componentDidMount: function() {
		this.resolveDistributor()
	},
	resolveDistributor: function() {
		// resolve distributor
		// well, first resolve bar zip code
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + this.props.barID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(bar) {
				this.setState({
					zipCode: parseInt(bar.zipCode)
				})
				// then resolve distributor for that product in that zip code
				$.ajax({
					url: process.env.BURLOCK_API_URL + "/products/" + this.props.productID + "/zipcodes/" + bar.zipCode + "/distributor",
					method: "GET",
					success: function(distributor) {
						if (Object.keys(distributor).length == 0) {
							this.setState({distributorName: -1, resolving: false})
							this.props.changeDistributor(null, null)
						} else {
							$.ajax({
								url: process.env.BURLOCK_API_URL + "/distributors/" + distributor.distributorID,
								method: "GET",
								success: function(finalDistributor) {
									this.setState({distributorName: finalDistributor.distributorName, resolving: false})
									this.props.changeDistributor(parseInt(distributor.distributorID), finalDistributor.distributorName)
								}.bind(this)
							})
						}
					}.bind(this)
				})
			}.bind(this)
		})
	}
})

module.exports = DistributorField
