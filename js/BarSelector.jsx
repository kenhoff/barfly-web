var React = require('react');

var Modal = require('react-bootstrap').Modal;

window.jQuery = window.$ = require('jquery');

var BarSelector = React.createClass({
	getInitialState: function () {
		return {
			showModal: false
		}
	},
	render: function () {
		if (!this.props.currentBar) {
			return (
				<div>
					<div className="navbar-form navbar-left">
						<button onClick={this.openNewBarModal} className="btn btn-default">Add a new Bar</button>
					</div>

					<Modal show = {this.state.showModal} onHide = {this.close}>
						<Modal.Header closeButton>
							<Modal.Title>Let's add a new bar.</Modal.Title>
						</Modal.Header>
					</Modal>

				</div>
			)
		}
		else {
			return (
				<ul className = "nav navbar-nav">
					<li className = "dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.currentBar} <span className="caret"></span></a>
						<ul className = "dropdown-menu">
							<li><a href="#">Action</a></li>
						</ul>
					</li>
				</ul>
			)
		}
	},
	componentWillMount: function () {
	},
	openNewBarModal: function () {
		this.setState({showModal: true})
	},
	closeNewBarModal: function () {
		this.setState({showModal: false})
	}
})
module.exports = BarSelector
