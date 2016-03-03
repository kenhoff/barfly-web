var React = require('react')
var Input = require('react-bootstrap').Input

var DistributorSelect = React.createClass({
	propTypes: {
		// selectedDistributor: React.PropTypes.oneOfType([React.PropTypes.number, "newDistributor", null])
	},
	render: function() {
		return (
			<div>
				{this.props.distributors.map(function(distributor) {
					return (<Input key={distributor.id} name="distributors" type="radio" value={distributor.id} label={distributor.distributorName} onChange={this.props.handleDistributorChange} checked={this.props.selectedDistributor == distributor.id}/>)
				}.bind(this))}
				<Input type="radio" name="distributors" value="newDistributor" label="Add new distributor" onChange={this.props.handleDistributorChange} checked={this.props.selectedDistributor == "newDistributor"}/>
				<Input value={this.props.newDistributorNameValue} onChange={this.props.handleNewDistributorNameChange} className={this.props.showNewDistributorInput
					? "show"
					: "hidden"} type="text" placeholder="Bob's Distribution Company"/>
			</div>
		)
	}

})

module.exports = DistributorSelect
