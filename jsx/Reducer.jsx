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

	}
	return state;
};
