var React = require('react');

var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;

window.jQuery = window.$ = require('jquery');

var BarSelector = React.createClass({
	getInitialState: function() {
		return {showModal: false, bars: []}
	},
	render: function() {
		if (this.props.currentBar == null) {
			return (
				<div>
					<ul className="nav navbar-nav">
						<li>
							<a>Loading...</a>
						</li>
					</ul>
				</div>
			)
		} else if (this.props.currentBar == -1) {
			return (
				<div>
					<div className="navbar-form navbar-left">
						<button onClick={this.openNewBarModal} className="btn btn-default">Add a new Bar</button>
					</div>
					<NewBarModal showModal={this.state.showModal} onHide={this.closeNewBarModal} onBarChange={this.props.changeBar}/>
				</div>
			)
		} else {
			bars = this.state.bars
			// index of current bar
			index = bars.indexOf(this.props.currentBar)
			bars.splice(index, 1)
			return (
				<ul className="nav navbar-nav">
					<li className="dropdown">
						<BarSelectorDropdownDisplayed currentBar={this.props.currentBar}/>
						<BarSelectorDropdownList bars={bars} changeBar={this.changeBar}/>
					</li>
				</ul>
			)
		}
	},
	changeBar: function(barID) {
		this.props.changeBar(barID)
	},
	openNewBarModal: function() {
		this.setState({showModal: true})
	},
	closeNewBarModal: function() {
		this.setState({showModal: false})
	},
	loadBars: function(cb) {
		$.ajax({
			url: window.API_URL + "/user/bars",
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(data) {
				if (data.length != 0) {
					cb(data)
				}
			}
		})
	},
	componentDidMount: function() {
		if (this.props.currentBar >= 0) {
			this.loadBars(function(bars) {
				this.setState({bars: bars})
			}.bind(this))
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.currentBar >= 0) {
			this.loadBars(function(bars) {
				this.setState({bars: bars})
			}.bind(this));
		}
	}
})

BarSelectorDropdownDisplayed = React.createClass({
	getInitialState: function() {
		return ({barName: "Loading bars..."})
	},
	render: function() {
		return (
			<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.state.barName}
				<span className="caret"></span>
			</a>
		)
	},
	componentDidMount: function() {
		resolveBarName(this.props.currentBar, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	},
	componentWillReceiveProps: function(nextProps) {
		resolveBarName(nextProps.currentBar, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	}
})

BarSelectorDropdownList = React.createClass({
	render: function() {
		bars = this.props.bars
		return (
			<ul className="dropdown-menu">
				{bars.map(function(bar) {
					return (<IndividualBarInDropdownList key={bar} barID={bar} changeBar={this.props.changeBar}/>)
				}.bind(this))}
			</ul>
		)
		// whoops - needed to bind to this, when using map
	}
})

IndividualBarInDropdownList = React.createClass({
	getInitialState: function() {
		return {barName: "Loading bar..."}
	},
	render: function() {
		return (
			<li key={this.props.barID} onClick={this.changeBar}>
				<a>{this.state.barName}</a>
			</li>
		)
	},
	changeBar: function() {
		this.props.changeBar(this.props.barID)
	},
	componentDidMount: function() {
		resolveBarName(this.props.barID, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	},
	componentWillReceiveProps: function(nextProps) {
		resolveBarName(nextProps.barID, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	}
})

resolveBarName = function(barID, cb) {
	$.ajax({
		url: window.API_URL + "/bars/" + barID,
		headers: {
			"Authorization": "Bearer " + localStorage.getItem("access_jwt")
		},
		success: function(barInfo) {
			cb(barInfo.barName)
		}
	})
}

NewBarModal = React.createClass({
	render: function() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Let's add a new bar.</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<Input type="text" label="What's the name of your bar?" placeholder="Bob's Burgers" ref="barNameInput"/>
						<Input type="text" label="What zip code is your bar in?" placeholder="80302" ref="zipCodeInput"/>
					</form>
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
		zipCode = this.refs.zipCodeInput.getValue()

		isValid = (zipCode.match(re) && (zipCode.match(re).length == 1))

		if (isValid) {
			$.ajax({
				url: window.API_URL + "/user/bars",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("access_jwt")
				},
				method: "POST",
				data: {
					barName: this.refs.barNameInput.getValue(),
					zipCode: this.refs.zipCodeInput.getValue()
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

module.exports = BarSelector
