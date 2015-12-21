var React = require('react');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

window.jQuery = window.$ = require('jquery');

var BarSelector = React.createClass({
	getInitialState: function() {
		return {showModal: false}
	},
	render: function() {
		if (!this.props.currentBar) {
			return (
				<div>
					<div className="navbar-form navbar-left">
						<button onClick={this.openNewBarModal} className="btn btn-default">Add a new Bar</button>
					</div>

					<NewBarModal showModal = {this.state.showModal} onHide = {this.closeNewBarModal} />

				</div>
			)
		} else {
			return (
				<ul className="nav navbar-nav">
					<li className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.currentBar}
							<span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							<li>
								<a href="#">Action</a>
							</li>
						</ul>
					</li>
				</ul>
			)
		}
	},
	componentWillMount: function() {},
	openNewBarModal: function() {
		this.setState({showModal: true})
	},
	closeNewBarModal: function() {
		this.setState({showModal: false})
	}
})

NewBarModal = React.createClass({
	getInitialState: function () {
		return {
			isValid: false
		}
	},
	render: function () {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new bar.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<Input type="text" label="What's the name of your bar?" placeholder="Bob's Burgers"/>
						<ZipCodeInput/>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className = "btn btn-primary" onClick = {this.submitBar}>Create</button>
				</Modal.Footer>
			</Modal>
		)
	},
	submitBar: function () {

	}
})

ZipCodeInput = React.createClass({
	getInitialState: function () {
		return {
			value: ""
		}
	},
	validationState: function () {
		input = this.state.value
	 	return 'error'
	},
	render: function() {
		return (<Input type="text" label="What zip code is your bar in?" placeholder="80302" onChange = {this.handleChange} ref = "zipCodeInput" value = {this.state.value} bsStyle = {this.validationState()} onBlur = {function () {
			console.log("blurred!");
		}}/>)
	},
	handleChange: function() {
		this.setState({value: this.refs.zipCodeInput.getValue()})
		console.log("changing");
	}
})

module.exports = BarSelector
