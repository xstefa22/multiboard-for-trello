import { SET_AUTH, REMOVE_AUTH, ONE_TIME_AUTH } from '../actions/actionTypes';

const initialState = {
	loggedIn: false,
	oneTime: false,

	username: null,
	key: null,
	token: null,
}

const authReducer = (state = initialState, action) => {
	const payload = action.payload;

	switch (action.type) {
		case SET_AUTH: {
			const { username, key, token } = payload;

			return {
				...state,
				loggedIn: true,
				username,
				key,
				token,
			};
		}

		case REMOVE_AUTH: {
			return initialState;
		}

		case ONE_TIME_AUTH: {
			return {
				...state,
				oneTime: true,
			}
		}

		default: {
			return state;
		}
	}

};

export default authReducer;
