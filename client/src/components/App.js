import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import Board from './Board/Board';
import LoginForm from './LoginForm';
import Logout from './Logout';


class App extends Component {
    render = () => {
        return (
            <Switch>
                <Route exact path="/" component={Board} />
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
