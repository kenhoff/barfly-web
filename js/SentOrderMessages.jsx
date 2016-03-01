var React = require('react')
var $ = require('jquery')

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
					<h1>Messages</h1>
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
		return {repName: ""}
	},
	render: function() {
		return (
			<p>{this.props.distributor.distributorName + ", " + this.state.repName}</p>
		)
	},
	componentDidMount: function() {
		this.resolveAccount(function(account) {
			if (account) {
				this.resolveRepName(account.repID, function(repName) {
					this.setState({repName: repName})
				}.bind(this))
			}
		}.bind(this))
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
	}
})

module.exports = SentOrderMessages
