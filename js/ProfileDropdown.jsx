var React = require('react');
var PropTypes = React.PropTypes;

var Link = require('react-router').Link;

var ProfileDropdown = React.createClass({
	getInitialState: function() {
		return {};
	},
	render: function() {
		if (this.state.profile) {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Hi there,&nbsp;
							{this.state.profile.given_name}!
							<span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							<li>
								<Link to={'/profile'}>
									Profile
								</Link>
							</li>
							<li role="separator" className="divider"></li>
							<li onClick={this.props.signOut}>
								<a href="#">
									Log out
								</a>
							</li>
						</ul>
					</li>
				</ul>
			)
		} else {
			return <div/>
		}
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
});

module.exports = ProfileDropdown
