var React = require('react')
var Input = require('react-bootstrap').Input
var $ = require('jquery')

var PackagingSelect = React.createClass({
	getInitialState: function() {
		return {packaging: []}
	},
	render: function() {
		return (
			<Input type="select" label="Packaging" ref="packagingInput">
				<option key={null} value="nullPackaging">Please select a packaging</option>
				{this.state.packaging.map(function(packaging) {
					return (
						<option key={packaging.id} value={packaging.id}>{packaging.packagingName}</option>
					)
				})}
			</Input>
		)
	},
	componentDidMount: function() {
		this.getPackaging()
	},
	getPackaging: function() {
		$.ajax({
			url: process.env.BURLOCK_API_URL + "/packaging",
			method: "GET",
			success: function(packaging) {
				packaging.sort(function(a, b) {
					if (a.packagingName == "Individual") {
						return -1
					} else if (b.packagingName == "Individual") {
						return 1
					} else if (a.packagingName.toLowerCase() > b.packagingName.toLowerCase()) {
						return 1
					} else if (a.packagingName.toLowerCase() < b.packagingName.toLowerCase()) {
						return -1
					} else {
						return 0
					}
				})
				this.setState({packaging: packaging})
			}.bind(this)
		})
	}
})

module.exports = PackagingSelect
