var React = require('react');
var PropTypes = React.PropTypes;

var Landing = React.createClass({
	render: function() {
		return (
			<div className="bg">
				<div className="centerBox">
					<div className="logo">burlock</div>
					<button className="loginButton" onClick={this.props.showLock}>LOG IN / SIGN UP</button>
				</div>
			</div>
		)
	}
})

module.exports = Landing
