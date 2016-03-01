var React = require('react')
var Grid = require('react-bootstrap').Grid

var SentOrderContents = React.createClass({

	render: function() {
		return (
			<Grid>
				<h1>Sent Order Contents</h1>
				<ul>
					{this.props.productOrders.map(function(productOrder) {
						return (
							<li key={productOrder.id}>{productOrder.productID}</li>
						)
					})}
				</ul>
			</Grid>
		)
	}

})

module.exports = SentOrderContents
