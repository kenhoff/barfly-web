var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

NewBarModal = React.createClass({
	getInitialState: function() {
		return {zipCodeInputValue: "", barNameInputValue: ""};
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref="NewBarModal">
				<Modal.Header closeButton>
					<Modal.Title>Add a new bar.</Modal.Title>
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
					<button className="btn btn-primary" onClick={this.submitBar}>Create</button>
				</Modal.Footer>
			</Modal>
		)
	},
	handleBarNameInputChange: function(event) {
		newValue = event.target.value.trim()
		this.setState({barNameInputValue: newValue})
	},
	handleZipCodeInputChange: function(event) {
		newValue = event.target.value.replace(/[^0-9]/g, "").slice(0, 5)
		this.setState({zipCodeInputValue: newValue})

	},
	submitBar: function() {
		re = /^\d{5}$/ig
		zipCode = this.zipCodeInput.getValue()

		isValid = (zipCode.match(re) && (zipCode.match(re).length == 1))

		if (isValid) {
			$.ajax({
				url: window.API_URL + "/user/bars",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				data: {
					barName: this.barNameInput.getValue(),
					zipCode: this.zipCodeInput.getValue()
				},
				success: function(data) {
					this.props.onBarChange(data.id)
					this.props.onHide()
				}.bind(this)
			})
		} else {
			// throw error or something
		}
	}
})

module.exports = NewBarModal
