var React = require('react');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var AddDistributorModal = require('./AddDistributorModal.jsx');

var DistributorField = React.createClass({
	getInitialState: function() {
		return ({distributorName: "Finding distributor...", showAddDistributorModal: false, zipCode: null, resolving: true})
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
						<button className="btn btn-default" onClick={this.openModal}>Add a Distributor for {this.props.productName}</button>
					</p>
					<AddDistributorModal showModal={this.state.showAddDistributorModal} onHide={this.closeModal} productID={this.props.productID} zipCode={this.state.zipCode} productName={this.props.productName}/>
				</div>
			)
		} else {
			return (
				<div>
					<p>
						<b>Distributor:</b>&nbsp;
						{this.state.distributorName}</p>
				</div>
			);
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
						// console.log(distributor);
						if (Object.keys(distributor).length == 0) {
							this.setState({distributorName: -1, resolving: false})
							this.props.changeDistributor(null, null)
						} else {
							// finally, resolve distributor name
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
