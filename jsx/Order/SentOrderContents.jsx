var React = require('react')
var ProductOrderSummaryItem = require("../_shared/ProductOrderSummaryItem.jsx");

var SentOrderContents = React.createClass({

	render: function() {
		return (
			<div>
				<ul>
					{this.props.productOrders.map(function(productOrder) {
						return (<ProductOrderSummaryItem key={productOrder.id} {...productOrder}/>)
					})}
				</ul>
			</div>
		)
	}

})

module.exports = SentOrderContents
