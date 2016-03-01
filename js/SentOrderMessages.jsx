var React = require('react')
var $ = require('jquery')

var SentOrderMessages = React.createClass({
	getInitialState: function() {
		return {distributors: []}
	},
	render: function() {
		return (
			<div>
				<h1>Messages</h1>
				{this.state.distributors.map(function(distributor) {
					return (<SentOrderMessagesDistributor id={distributor.id} distributor={distributor}/>)
				})}
			</div>
		)
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
	}
})

var SentOrderMessagesDistributor = React.createClass({
	render: function() {
		return (
			<p>{this.props.distributor.distributorName}</p>
		)
	}
})

module.exports = SentOrderMessages
