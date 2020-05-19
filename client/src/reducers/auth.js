import { SET_AUTH, REMOVE_AUTH } from '../actions/actionTypes';

const initialState = {
	loggedIn: false,
	member: undefined,
}

const authReducer = (state = initialState, action) => {
	const payload = action.payload;

	switch (action.type) {
		case SET_AUTH: {
			const { member } = payload;
			
			return {
				...state,
				loggedIn: true,
				member,
			};
		}

		case REMOVE_AUTH: {
			return initialState;
		}

		default: {
			return state;
		}
	}

};

export default authReducer;
