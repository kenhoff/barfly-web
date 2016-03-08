var async = require('async')
var React = require('react')
var $ = require('jquery')

var ProductOrderSummaryItem = require('./ProductOrderSummaryItem.jsx')

var SentOrderMessages = React.createClass({
	propTypes: {
		productOrders: React.PropTypes.array.isRequired,
		barID: React.PropTypes.number.isRequired
	},
	getInitialState: function() {
		return {distributors: [], zipCode: null}
	},
	render: function() {
		if (this.state.zipCode) {
			return (
				<div>
					<h4>Messages sent</h4>
					{this.state.distributors.map(function(distributor) {
						return (<SentOrderMessagesDistributor key={distributor.id} distributor={distributor} productOrders={this.props.productOrders} barID={this.props.barID} zipCode={this.state.zipCode}/>)
					}.bind(this))}
				</div>
			)
		} else {
			return (<div/>)
		}
	},
	componentDidMount: function() {
		// get list of distributors
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/distributors",
			method: "GET",
			success: function(distributors) {
				this.setState({distributors: distributors})
			}.bind(this)
		})

		// also get zip code for bar - ugh, so hacky.
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
			}.bind(this)
		})
	}
})

var SentOrderMessagesDistributor = React.createClass({
	propTypes: {
		distributor: React.PropTypes.object.isRequired,
		productOrders: React.PropTypes.array.isRequired,
		barID: React.PropTypes.number.isRequired,
		zipCode: React.PropTypes.number.isRequired
	},
	getInitialState: function() {
		return {repName: "", filteredProductOrders: []}
	},
	render: function() {
		if (this.state.filteredProductOrders.length == 0) {
			return (<div/>)
		} else {
			return (
				<div>
					<p>{this.props.distributor.distributorName + ", " + this.state.repName}</p>
					<ul>
						{this.state.filteredProductOrders.map(function(filteredProductOrder) {
							return (<ProductOrderSummaryItem key={filteredProductOrder.id} productOrder={filteredProductOrder}/>)
						})}
					</ul>
				</div>
			)
		}
	},
	componentDidMount: function() {
		this.resolveAccount(function(account) {
			if (account) {
				this.resolveRepName(account.repID, function(repName) {
					this.setState({repName: repName})
				}.bind(this))
			}
		}.bind(this))
		this.filterProductOrders(this.props.productOrders)
	},
	componentWillReceiveProps: function(nextProps) {
		this.resolveAccount(function(account) {
			if (account) {
				this.resolveRepName(account.repID, function(repName) {
					this.setState({repName: repName})
				}.bind(this))
			}
		}.bind(this))
		this.filterProductOrders(nextProps.productOrders)
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
				distributorID: this.props.distributor.id
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
	},
	filterProductOrders: function(productOrders) {
		async.filter(productOrders, this.checkIfProductIsCarriedByDistributor, function(results) {
			this.setState({filteredProductOrders: results})
		}.bind(this))
	},
	checkIfProductIsCarriedByDistributor: function(productOrder, cb) { // look up if the distributor carries this product
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/products/" + productOrder.productID + "/zipcodes/" + this.props.zipCode + "/distributor",
			method: "GET",
			success: function(distributor) {
				if (distributor.distributorID == this.props.distributor.id) {
					return cb(true)
				} else {
					return cb(false)
				}
			}.bind(this)
		})
	}
})

module.exports = SentOrderMessages
