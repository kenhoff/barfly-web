module.exports = function(state = {}, action) {
	switch (action.type) {
		case "UPDATE_PHONE":
			return (Object.assign({}, state, {phone: action.phone, phoneDraft: action.phone}));
		case "UPDATE_PHONE_DRAFT":
			return (Object.assign({}, state, {phoneDraft: action.phoneDraft}));
	}
	return state;
};
