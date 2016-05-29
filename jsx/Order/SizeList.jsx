var React = require('react');
import {ListGroup} from 'react-bootstrap';
var QuantityInputWithSize = require('./QuantityInputWithSize.jsx');
var NewSizeForm = require('./NewSizeForm.jsx');
var bartender = require('../Bartender.jsx');

import {connect} from 'react-redux';

var SizeList = React.createClass({
	propTypes: {
		productID: React.PropTypes.number.isRequired,
		productSizes: React.PropTypes.arrayOf(React.PropTypes.number)
	},
	getDefaultProps: function() {
		return {productSizes: []};
	},
	render: function() {
		return (
			<div>
				<ListGroup>
					{this.props.productSizes.map(function(sizeID) {
						return (<QuantityInputWithSize key={sizeID} sizeID={sizeID} quantity={this.getQuantityForSizeID(sizeID)} changeQuantity={this.props.changeQuantity.bind(this, sizeID)} disabled={this.props.disabled} starred={this.getStarred(sizeID)} changeStarred={this.handleStarredChange} inStarredProductsList={this.props.inStarredProductsList} inOrderList={this.props.inOrderList}/>);
					}.bind(this))}
				</ListGroup>
				{(this.props.inStarredProductsList || this.props.inOrderList)
					? null
					: <NewSizeForm productName={this.props.productName} productID={this.props.productID} refreshSizes={this.getSizesForProduct}/>}
			</div>
		);
	},
	getStarred: function(sizeID) {
		for (var starredSize of this.props.starredSizes) {
			if (starredSize == sizeID) {
				return true;
			}
		}
		return false;
	},
	getQuantityForSizeID: function(sizeID) {
		for (var quantity of this.props.quantities) {
			if (quantity.productSizeID == sizeID) {
				return quantity.productQuantity;
			}
		}
	},
	handleStarredChange: function(starChange) {
		this.props.changeStarred(starChange);
	}
});

var mapStateToProps = function(state, ownProps) {
	let props = {};
	if (("products" in state) && (ownProps.productID in state.products)) {
		props.productSizes = state.products[ownProps.productID].productSizes;
	} else {
		bartender.resolve({collection: "products", id: ownProps.productID});
	}
	return props;
};

var ConnectedSizeList = connect(mapStateToProps)(SizeList);

module.exports = ConnectedSizeList;
