import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import Board from './Board/Board';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Logout from './Logout';
import OneTimeLogin from './OneTimeLogin';


class App extends Component {
    render = () => {
        return (
            <Switch>
                <Route exact path="/" component={Board} />
                <Route path="/user/register" component={RegisterForm} />
                <Route path="/user/one-time" component={OneTimeLogin} />
                <Route path="/user/login" component={LoginForm} />
                <Route path="/user/logout" component={Logout} />
                <Route path="/auth/callback" component={LoginForm} />
                <Redirect from='/auth/callback' to='/user/login' />
                <Route path="/" component={Board} />
            </Switch>
        );
    };
};

export default withRouter(App);
