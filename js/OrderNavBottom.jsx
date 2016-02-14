var React = require('react');

var OrderNavBottom = React.createClass({
	render: function() {
		if (!this.props.disabled) {
			return (
				<nav className="navbar navbar-default navbar-fixed-bottom">
					<div className="container">
						<div className="navbar-form navbar-right">
							<button onClick={this.handleClick} className={"btn btn-primary " + (this.props.sending
								? "active"
								: "")}>{this.props.sending
									? "Sending order..."
									: "Send Order"}</button>
						</div>
					</div>
				</nav>
			)
		} else {
			return (<div/>)
		}
	},
	handleClick: function () {
		if (!this.props.sending) {
			this.props.sendOrder()
		} else {
			// do nothing
		}
	}
});

module.exports = OrderNavBottom
