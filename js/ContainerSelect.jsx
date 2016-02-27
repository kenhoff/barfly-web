var React = require('react');
var PropTypes = React.PropTypes;
var Input = require('react-bootstrap').Input;

var ContainerSelect = React.createClass({

	render: function() {
		return (
			<Input type="select" label="Container" ref="containerInput"></Input>
		);
	}

});

module.exports = ContainerSelect;
