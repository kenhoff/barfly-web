var React = require('react');

var connect = require('react-redux').connect;

var PresentationalApp = React.createClass({
	propTypes: {
		bar: React.PropTypes.number
	},
	render: function() {
		if (this.props.bar) {
			return (
				<div className="app">
					{React.cloneElement(this.props.children, {bar: this.props.bar})}
				</div>
			);
		} else {
			return (
				<div></div>
			);
		}
	}
});

var mapStateToProps = function(state) {
	var props = {};
	if (("ui" in state) && ("currentBar" in state.ui)) {
		props.bar = state.ui.currentBar;
	} else {
		props.bar == null;
	}
	return props;
};

var ContainerApp = connect(mapStateToProps)(PresentationalApp);

module.exports = ContainerApp;
