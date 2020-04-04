import { combineReducers } from 'redux';

import dataReducer from './data';
import authReducer from './auth';


const allReducers = combineReducers({ dataReducer, authReducer });

export default allReducers;
