import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import allReducers from '../reducers';
import { sessionService } from 'redux-react-session';

// Allows react devtools to be used in browser
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(allReducers, composeEnhancers(applyMiddleware(thunk)));


// Session expiration is set to 30 minutes (1/48 of a day)
sessionService.initSessionService(store, { refreshOnCheckAuth: true, redirectPath: '/login', driver: 'LOCALSTORAGE', expires: 1 / 48 });

export default store;
