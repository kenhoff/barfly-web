var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;
var $ = require('jquery');

var NewBarModal = React.createClass({
	getInitialState: function() {
		return ({zipCodeInputValue: "", barNameInputValue: "", buttonEnabled: false})
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="NewBarModal">
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new bar.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input value={this.state.barNameInputValue} type="text" label="What's the name of your bar?" placeholder="Bob's Burgers" ref={function(thisInput) {
						this.barNameInput = thisInput
					}.bind(this)} onChange={this.handleBarNameInputChange}/>
					<Input value={this.state.zipCodeInputValue} type="text" label="What zip code is your bar in?" placeholder="80302" ref={function(thisInput) {
						this.zipCodeInput = thisInput
					}.bind(this)} onChange={this.handleZipCodeInputChange}/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className={"btn btn-primary " + (this.state.buttonEnabled
						? ""
						: "disabled")} onClick={this.submitBar}>Create</button>
				</Modal.Footer>
			</Modal>
		)
	},
	handleBarNameInputChange: function(event) {
		var newValue = event.target.value
		this.setState({
			barNameInputValue: newValue
		}, function() {
			this.updateButtonState()
		})
	},
	handleZipCodeInputChange: function(event) {
		var newValue = event.target.value.replace(/[^0-9]/g, "").slice(0, 5)
		this.setState({
			zipCodeInputValue: newValue
		}, function() {
			this.updateButtonState()
		})
	},
	updateButtonState: function() {
		if ((this.state.barNameInputValue == "") || (this.state.zipCodeInputValue.length != 5)) {
			this.setState({buttonEnabled: false})
		} else {
			this.setState({buttonEnabled: true})
		}
	},
	submitBar: function() {
		if ((this.state.barNameInputValue.trim() == "") || (this.state.zipCodeInputValue.length != 5)) {
			// handle some kind of err?
		} else {
			$.ajax({
				url: process.env.BURLOCK_API_URL + "/user/bars",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				data: {
					barName: this.barNameInput.getValue().trim(),
					zipCode: this.zipCodeInput.getValue()
				},
				success: function(data) {
					this.props.onBarChange(data.id)
					this.props.onHide()
				}.bind(this)
			})
		}
	}
})

module.exports = NewBarModal
