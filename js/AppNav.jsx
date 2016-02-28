var React = require('react')
var BarSelector = require('./BarSelector.jsx')
var ProfileDropdown = require('./ProfileDropdown.jsx')
var Navbar = require('react-bootstrap').Navbar
var Nav = require('react-bootstrap').Nav

var browserHistory = require('react-router').browserHistory

var AppNav = React.createClass({
	getInitialState: function() {
		return {profile: null, currentBar: null}
	},
	render: function() {
		return (
			<Navbar>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#" onClick={this.goHome} className="logo">burlock</a>
					</Navbar.Brand>
					<Navbar.Toggle/>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						<BarSelector currentBar={this.props.currentBar} changeBar={this.props.changeBar}/>
					</Nav>
					<Nav pullRight>
						<ProfileDropdown signOut={this.signOut} lock={this.props.lock}/>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	},

	componentDidMount: function() {},
	signOut: function() {
		localStorage.removeItem("access_jwt")
		localStorage.removeItem("refresh_token")
		window.location.href = "/"
	},
	goHome: function() {
		browserHistory.push('/')
	}
})

module.exports = AppNav
