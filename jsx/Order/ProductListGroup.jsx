var React = require('react');
var connect = require('react-redux').connect;
var ProductListItem = require('./ProductListItem.jsx');
var NewSizeForm = require('./NewSizeForm.jsx');
var bartender = require('../Bartender.jsx');
var ProductName = require('./ProductName.jsx');

var PresentationalProductListGroup = React.createClass({
	render: function() {
		// if there's no sizes, render a "add size" button
		if (this.props.sizes.length == 0) {
			// productName={this.props.productName} productID={this.props.productID} refreshSizes={this.getSizesForProduct}
			return (
				<div>
					<ProductName productID={this.props.productID}></ProductName>
					<button>{"add new size"}</button>
				</div>
			);
		} else {
			// for each size in product, render a ProductListItem
			return (
				<div>
					{this.props.sizes.map((sizeID) => {
						return (
							<ProductListItem key={this.props.productID + "_" + sizeID} productID={parseInt(this.props.productID)} sizeID={parseInt(sizeID)}></ProductListItem>
						);
					})}
				</div>
			);
		}
	}
});

var mapStateToProps = function(state, ownProps) {
	// check to see if product has sizes listed in state
	if ((ownProps.productID in state.products) && ("productSizes" in state.products[ownProps.productID])) {
		return {
			sizes: state.products[ownProps.productID].productSizes
		};
	} else {
		// if not, get bartender to resolve
		bartender.resolve({collection: "products", id: ownProps.productID, force: true});
		return {sizes: []};
	}
};

var ContainerProductListGroup = connect(mapStateToProps)(PresentationalProductListGroup);

module.exports = ContainerProductListGroup;
