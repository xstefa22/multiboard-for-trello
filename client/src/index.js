import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import store from './store/index.js';

import { GlobalStyle } from './styles';


const history = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <GlobalStyle />
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
