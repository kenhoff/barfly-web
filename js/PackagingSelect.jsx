var React = require('react');
var PropTypes = React.PropTypes;
var Input = require('react-bootstrap').Input;

var PackagingSelect = React.createClass({

	render: function() {
		return (
			<Input type="select" label="Packaging" ref="packagingInput"></Input>
		);
	}

});

module.exports = PackagingSelect;
