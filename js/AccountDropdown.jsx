var React = require('react')
var Nav = require('react-bootstrap').Nav
var NavDropdown = require('react-bootstrap').NavDropdown
var MenuItem = require('react-bootstrap').MenuItem

var browserHistory = require('react-router').browserHistory

var AccountDropdown = React.createClass({
	getInitialState: function() {
		return {}
	},
	render: function() {
		if (this.state.profile) {
			return (
				<Nav pullRight>
					<NavDropdown id="Profile Dropdown" title={"Hi there, " + this.state.profile.given_name + "!"}>
						<MenuItem target="/account" onSelect={this.navigate}>
							Account
						</MenuItem>
						<MenuItem divider/>
						<MenuItem onSelect={this.props.signOut}>Log out</MenuItem>
					</NavDropdown>
				</Nav>
			)
		} else {
			return <div/>
		}
	},
	navigate: function(e) {
		// a little hacky, but it works.
		browserHistory.push(e.target.target)
	},
	componentDidMount: function() {
		this.props.lock.getProfile(localStorage.getItem("access_jwt"), function(err, profile) {
			if (err) {
				this.refreshToken(function() {
					this.componentDidMount()
				}.bind(this))
				return
			} else {
				this.setState({profile: profile})
			}
		}.bind(this))
	}
})
module.exports = AccountDropdown
