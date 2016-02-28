var React = require('react')
var $ = require('jquery')

var NewBarModal = require('./NewBarModal.jsx')


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
			var bars = this.state.bars
			// index of current bar
			var index = bars.indexOf(this.props.currentBar)
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
			url: process.env.BURLOCK_API_URL + "/user/bars",
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
			}.bind(this))
		}
	}
})

var BarSelectorDropdownDisplayed = React.createClass({
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
		this.resolveBarName(this.props.currentBar, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	},
	componentWillReceiveProps: function(nextProps) {
		this.resolveBarName(nextProps.currentBar, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	},
	resolveBarName: function(barID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + barID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(barInfo) {
				cb(barInfo.barName)
			}
		})
	}
})

var BarSelectorDropdownList = React.createClass({
	render: function() {
		var bars = this.props.bars
		return (
			<ul className="dropdown-menu">
				{bars.map(function(bar) {
					return (<IndividualBarInDropdownList key={bar} barID={bar} changeBar={this.props.changeBar}/>)
				}.bind(this))}
			</ul>
		)
	}
})

var IndividualBarInDropdownList = React.createClass({
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
		this.resolveBarName(this.props.barID, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	},
	componentWillReceiveProps: function(nextProps) {
		this.resolveBarName(nextProps.barID, function(barName) {
			this.setState({barName: barName})
		}.bind(this))
	},
	resolveBarName: function(barID, cb) {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/bars/" + barID,
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_jwt")
			},
			success: function(barInfo) {
				cb(barInfo.barName)
			}
		})
	}
})

module.exports = BarSelector
