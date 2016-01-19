var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

NewBarModal = React.createClass({
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide} ref = "NewBarModal">
				<Modal.Header closeButton>
					<Modal.Title>Add a new bar.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input type="text" label="What's the name of your bar?" placeholder="Bob's Burgers" ref={function(thisInput) {
						this.barNameInput = thisInput
					}.bind(this)}/>
					<Input type="text" label="What zip code is your bar in?" placeholder="80302" ref={function(thisInput) {
						this.zipCodeInput = thisInput
					}.bind(this)}/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className="btn btn-primary" onClick={this.submitBar}>Create</button>
				</Modal.Footer>
			</Modal>
		)
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
