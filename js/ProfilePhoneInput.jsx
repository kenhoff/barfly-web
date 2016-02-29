var React = require('react')
var Input = require('react-bootstrap').Input
var Button = require('react-bootstrap').Button

var $ = require('jquery')

var ProfilePhoneInput = React.createClass({
	getInitialState: function() {
		return {value: "", hasBeenChanged: false}
	},
	render: function() {
		return (
			<div>
				<Input onChange={this.handleChange} label="Phone" type="number" placeholder="3038826490" help={this.state.hasBeenChanged
					? "A number that we can send order confirmations to."
					: ""} value={this.state.value}/>
				<Button onClick={this.handleSave} bsStyle="primary" disabled={!this.state.hasBeenChanged}>Save</Button>
			</div>
		)
	},
	handleChange: function(event) {
		this.setState({value: event.target.value, hasBeenChanged: true})
	},
	handleSave: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/user",
			method: "PATCH",
			data: {
				phone: this.state.value
			},
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function() {
				this.setState({hasBeenChanged: false})
			}.bind(this)
		})
	},
	getPhoneNumber: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/user",
			method: "GET",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(user) {
				if ("user_metadata" in user) {
					this.setState({value: user.user_metadata.phone})
				}
			}.bind(this)
		})
	},
	componentDidMount: function() {
		this.getPhoneNumber()
	}
})

module.exports = ProfilePhoneInput
