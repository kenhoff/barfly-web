module.exports = function(state = {}, action) {
	switch (action.type) {
		case "UPDATE_PHONE":
			return (Object.assign({}, state, {
				phone: action.phone,
				phoneDraft: action.phone
			}));
		case "UPDATE_PHONE_DRAFT":
			return (Object.assign({}, state, {phoneDraft: action.phoneDraft}));
		case "UPDATE_PRODUCT":
			if ("products" in state) {
				var allProducts = state.products;
			} else {
				allProducts = {};
			}
			var newProducts = Object.assign({}, allProducts, {
				[action.product.id]: action.product
			});
			return (Object.assign({}, state, {products: newProducts}));
		case "UPDATE_COLLECTION":
			if ([action.collection] in state) {
				var currentCollection = state[action.collection];
			} else {
				currentCollection = {};
			}
			var newCollection = Object.assign({}, currentCollection, {
				[action.object.id]: action.object
			});
			return Object.assign({}, state, {
				[action.collection]: newCollection
			});
	}
	return state;
};
