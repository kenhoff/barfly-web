var React = require('React');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

var DistributorField = React.createClass({
	getInitialState: function() {
		return ({distributorName: "Finding distributor...", showAddDistributorModal: false, zipCode: null})
	},

	render: function() {
		if (this.state.distributorName == -1) {
			return (
				<div>
					<p>Distributor not found!
						<a onClick={this.showAddDistributorModal}>Add one?</a>
					</p>
					<AddDistributorModal showModal={this.state.showAddDistributorModal} onHide={this.closeAddDistributorModal} productID={this.props.productID} zipCode={this.state.zipCode} productName={this.props.productName}/>
				</div>
			)
		} else {
			return (
				<div>
					<p>Distributor:&nbsp;
						{this.state.distributorName}</p>
				</div>
			);
		}
	},
	showAddDistributorModal: function() {
		this.setState({showAddDistributorModal: true})
	},
	closeAddDistributorModal: function() {
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
			url: window.API_URL + "/bars/" + this.props.barID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			method: "GET",
			success: function(bar) {
				this.setState({zipCode: bar.zipCode})
				// then resolve distributor for that product in that zip code
				$.ajax({
					url: window.API_URL + "/products/" + this.props.productID + "/zipcodes/" + bar.zipCode + "/distributor",
					method: "GET",
					success: function(distributor) {
						// console.log(distributor);
						if (Object.keys(distributor).length == 0) {
							// console.log("no distributor found for", this.props.productID, "in", bar.zipCode);
							this.setState({distributorName: -1})
						} else {
							// console.log("distributor for", this.props.productID, "in", bar.zipCode, ":", distributor);
							// finally, resolve distributor name
							$.ajax({
								url: window.API_URL + "/distributors/" + distributor.distributorID,
								method: "GET",
								success: function(finalDistributor) {
									this.setState({distributorName: finalDistributor.distributorName})
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
