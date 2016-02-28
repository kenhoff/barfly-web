var React = require('react')
var Input = require('react-bootstrap').Input
var $ = require('jquery')

var ContainerSelect = React.createClass({
	getInitialState: function() {
		return {containers: []}
	},
	render: function() {
		return (
			<Input type="select" label="Container" ref="containerInput">
				<option key={null} value="nullContainer">Please select a container</option>
				{this.state.containers.map(function(container) {
					return (
						<option key={container.id} value={container.id}>{container.containerName}</option>
					)
				})}
			</Input>
		)
	},
	componentDidMount: function() {
		this.getContainers()
	},
	getContainers: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/containers",
			method: "GET",
			success: function(containers) {
				containers.sort(function(a, b) {
					if (a.containerName.toLowerCase() > b.containerName.toLowerCase()) {
						return 1
					} else if (a.containerName.toLowerCase() < b.containerName.toLowerCase()) {
						return -1
					} else {
						return 0
					}
				})
				this.setState({containers: containers})
			}.bind(this)
		})
	}

})

module.exports = ContainerSelect
