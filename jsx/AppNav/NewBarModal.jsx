var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;
var bartender = require('../Bartender.jsx');

var connect = require('react-redux').connect;

var PresentationalNewBarModal = React.createClass({
	getInitialState: function() {
		return ({zipCodeInputValue: "", barNameInputValue: "", buttonEnabled: false});
	},
	render: function() {
		return (
			<Modal show={this.props.show} onHide={this.props.close} ref="NewBarModal">
				<Modal.Header closeButton>
					<Modal.Title>{"Let's add a new bar."}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Input value={this.state.barNameInputValue} type="text" label="What's the name of your bar?" placeholder="Bob's Burgers" ref={function(thisInput) {
						this.barNameInput = thisInput;
					}.bind(this)} onChange={this.handleBarNameInputChange}/>
					<Input value={this.state.zipCodeInputValue} type="text" label="What zip code is your bar in?" placeholder="80302" ref={function(thisInput) {
						this.zipCodeInput = thisInput;
					}.bind(this)} onChange={this.handleZipCodeInputChange}/>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.close}>Cancel</button>
					<button className={"btn btn-primary " + (this.state.buttonEnabled
						? ""
						: "disabled")} onClick={this.submitBar}>Create</button>
				</Modal.Footer>
			</Modal>
		);
	},
	handleBarNameInputChange: function(event) {
		var newValue = event.target.value;
		this.setState({
			barNameInputValue: newValue
		}, function() {
			this.updateButtonState();
		});
	},
	handleZipCodeInputChange: function(event) {
		var newValue = event.target.value.replace(/[^0-9]/g, "").slice(0, 5);
		this.setState({
			zipCodeInputValue: newValue
		}, function() {
			this.updateButtonState();
		});
	},
	updateButtonState: function() {
		if ((this.state.barNameInputValue == "") || (this.state.zipCodeInputValue.length != 5)) {
			this.setState({buttonEnabled: false});
		} else {
			this.setState({buttonEnabled: true});
		}
	},
	submitBar: function() {
		if (this.state.buttonEnabled) {
			bartender.submitNewBar(this.barNameInput.getValue().trim(), this.zipCodeInput.getValue());
		}
	}
});

var mapStateToProps = function(state) {
	var props = {};
	if (("ui" in state) && ("newBarModal" in state.ui) && (state.ui.newBarModal)) {
		props.show = true;
	} else {
		props.show = false;
	}
	return props;
};

var mapDispatchToProps = function(dispatch) {
	var props = {};
	props.close = function() {
		dispatch({type: "CLOSE_NEW_BAR_MODAL"});
	};
	return props;
};

var ContainerNewBarModal = connect(mapStateToProps, mapDispatchToProps)(PresentationalNewBarModal);

module.exports = ContainerNewBarModal;
