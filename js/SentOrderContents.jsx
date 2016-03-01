var React = require('react')
var Grid = require('react-bootstrap').Grid
var ProductOrderSummaryItem = require('./ProductOrderSummaryItem.jsx')

var SentOrderContents = React.createClass({

	render: function() {
		return (
			<Grid>
				<h1>Sent Order Contents</h1>
				<ul>
					{this.props.productOrders.map(function(productOrder) {
						return (<ProductOrderSummaryItem key={productOrder.id} productOrder={productOrder}/>)
					})}
				</ul>
			</Grid>
		)
	}

})

module.exports = SentOrderContents
