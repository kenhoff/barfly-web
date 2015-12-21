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

					<NewBarModal showModal={this.state.showModal} onHide={this.closeNewBarModal}/>

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
	isValid: false,
	// this whole bit is absurd. this needs to get fixed
	zipCodeInput: null,
	getInitialState: function() {
		return {
			barName: "",
			zipCode: ""
		}
	},
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new bar.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<Input type="text" label="What's the name of your bar?" placeholder="Bob's Burgers" ref = "barNameInput"/>
						<ZipCodeInput inputIsValid={this.formIsValid} ref = {(ZipCodeInput) => this.zipCodeInput = ZipCodeInput.refs.zipCodeInput}/>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-default" onClick={this.props.onHide}>Cancel</button>
					<button className="btn btn-primary" onClick={this.submitBar}>Create</button>
				</Modal.Footer>
			</Modal>
		)
	},
	formIsValid: function(valid) {
		// this only works for one validation checking element right now~!!!
		this.isValid = valid
	},
	submitBar: function() {
		if (this.isValid) {
			console.log("everything looks good! submitting bar");
			console.log(this.refs.barNameInput.getValue());
			console.log(this.zipCodeInput.getValue());
			$.ajax({
				url: window.API_URL + "/user/bars",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				data: {
					barName: this.refs.barNameInput.getValue(),
					zipCode: this.zipCodeInput.getValue()
				},
				success: function (data) {
					console.log(data);
					this.props.onHide()
				}.bind(this)
			})
		} else {
			console.log("uh oh! stuff needs to get checked");
		}
	}
})

ZipCodeInput = React.createClass({
	getInitialState: function() {
		return {value: ""}
	},
	validationState: function() {
		input = this.state.value
		re = /^\d{5}$/ig
		if (input.match(re) && input.match(re).length == 1) {
			this.props.inputIsValid(true)
			return 'success'
		} else {
			this.props.inputIsValid(false)
			return 'error'
		}
	},
	render: function() {
		return (<Input type="text" label="What zip code is your bar in?" placeholder="80302" onChange={this.handleChange} ref="zipCodeInput" value={this.state.value} bsStyle={this.validationState()} onBlur={function() {
			console.log("blurred!");
		}}/>)
	},
	handleChange: function() {
		this.setState({value: this.refs.zipCodeInput.getValue()})
		console.log("changing");
	}
})

module.exports = BarSelector
