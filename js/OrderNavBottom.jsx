var React = require('react');

var OrderNavBottom = React.createClass({
	render: function() {
		if (!this.props.disabled) {
			return (
				<nav className="navbar navbar-default navbar-fixed-bottom">
					<div className="container">
						<div className="navbar-form navbar-right">
							<button onClick={this.props.sendOrder} className={"btn btn-primary " + (this.props.sending
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
	}
});

module.exports = OrderNavBottom
