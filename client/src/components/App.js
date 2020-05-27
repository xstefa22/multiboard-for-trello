import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Board from './Board/Board';
import LoginForm from './LoginForm';


class App extends Component {
    render = () => {
        return (
            <Switch>
                <Route exact path="/" component={Board} />
                <Route path="/user/login" component={LoginForm} />
                <Route path="/" component={Board} />
            </Switch>
        );
    };
};

export default withRouter(App);
