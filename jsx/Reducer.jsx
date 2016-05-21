module.exports = function(state = {}, action) {
	switch (action.type) {
		case "UPDATE_PHONE":
			return (Object.assign({}, state, {
				phone: action.phone,
				phoneDraft: action.phone
			}));
		case "UPDATE_PHONE_DRAFT":
			return (Object.assign({}, state, {phoneDraft: action.phoneDraft}));
		case "ADD_BAR_MEMBERSHIP":
			if (!("bar_memberships" in state)) {
				var bar_memberships = [];
			} else {
				bar_memberships = [...state.bar_memberships];
			}
			bar_memberships.push(action.barID);
			return Object.assign({}, state, {bar_memberships: bar_memberships});
		case "INITIALIZE_CURRENT_BAR":
			if (state.bar_memberships.length != 0) {
				var currentBar = state.bar_memberships[0];
			} else {
				currentBar = null;
			}
			if ("ui" in state) {
				var currentUI = state.ui;
			} else {
				currentUI = {};
			}
			var ui = Object.assign({}, currentUI, {currentBar: currentBar});
			return (Object.assign({}, state, {ui: ui}));
		case "CHANGE_CURRENT_BAR":
			if ("ui" in state) {
				currentUI = state.ui;
			} else {
				currentUI = {};
			}
			ui = Object.assign({}, currentUI, {currentBar: action.barID});
			return (Object.assign({}, state, {ui: ui}));
		case "UPDATE_COLLECTION":
			if ("object" in action) {
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
			} else {
				return (Object.assign({}, state, {
					[action.collection]: action.newCollection
				}));
			}
		case "OPEN_NEW_BAR_MODAL":
			if ("ui" in state) {
				currentUI = state.ui;
			} else {
				currentUI = {};
			}
			ui = Object.assign({}, currentUI, {newBarModal: true});
			return (Object.assign({}, state, {ui: ui}));
		case "CLOSE_NEW_BAR_MODAL":
			if ("ui" in state) {
				currentUI = state.ui;
			} else {
				currentUI = {};
			}
			ui = Object.assign({}, currentUI, {newBarModal: false});
			return (Object.assign({}, state, {ui: ui}));
		case "PUSH_NEW_ORDER":
			// barID, orderID
			if ("bar_orders" in state) {
				var newBarOrders = Object.assign({}, state.bar_orders);
			} else {
				newBarOrders = {};
			}
			if (action.barID in newBarOrders) {
				newBarOrders[action.barID].push(action.orderID);
			} else {
				newBarOrders[action.barID] = [action.orderID];
			}
			return Object.assign({}, state, {bar_orders: newBarOrders});
		case "UPDATE_ORDER":
			if (("orders" in state) && (action.orderID in state.orders)) {
				var newProductOrders = [...state.orders[action.orderID].productOrders];
				for (var newProductOrder of newProductOrders) {
					if ((newProductOrder.productID == action.productID) && (newProductOrder.productSizeID == action.productSizeID)) {
						newProductOrder.productQuantity = action.productQuantity;
					}
				}
				return Object.assign({}, state, {orders: Object.assign({}, state.orders, {
						[action.orderID]: Object.assign({}, state.orders[action.orderID], {productOrders: newProductOrders}) // eslint-disable-line indent
					})}); // eslint-disable-line indent
			} else {
				return state;
			}
		case "SEND_ORDER":
			if (("orders" in state) && (action.id in state.orders)) {
				var newOrder = Object.assign({}, state.orders[action.id], {
					sent: true,
					sentAt: action.sentAt
				});
				var newState = Object.assign({}, state, {orders: Object.assign({}, state.orders, {
						[action.id]: newOrder // eslint-disable-line indent
					})}); // eslint-disable-line indent
				return newState;
			} else {
				return state;
			}
	}
	return state;
};
