import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { sessionService } from 'redux-react-session';
import jwt from 'jsonwebtoken';

import { actionSetAuth, actionSetSelectedBoards } from '../actions';
import config from '../config.js';

import '../css/LoginForm.css';


class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            usernameVal: '',
            passwordVal: '',
            error: false,
        }
    }

    // Checks if user's data are store in session, if true, user is logged in and redirected to board
    componentDidMount = () => {
        if (config.dev) {
            this.props.actionSetAuth(config.username, config.apiKey, config.token);
            this.props.history.push('/');
        } else {
            sessionService.loadUser()
                .then(({ jwtToken }) => {
                    const { username, apiKey, token } = jwt.decode(jwtToken);

                    this.props.actionSetAuth(username, apiKey, token);

                    this.props.history.push('/');
                }).catch((error) => {
            });
        }        
    };

    // Handles submitting login form
    handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            username: this.state.usernameVal,
            password: this.state.passwordVal,
        }

        axios.post('/user/login', data,
        ).then((response) => {
            const { jwtToken } = response.data;
            const { username, apiKey, token } = jwt.decode(jwtToken);

            sessionService.saveUser({ jwtToken });
            this.props.actionSetAuth(username, apiKey, token);

            this.props.history.push('/');
        }).catch((error) => {
            console.error(error);
            this.setState({ error: true });
        });
    };

    render = () => {
        return (
            <React.Fragment>
                <section className="inner-section">
                    <div className="section-wrapper quick-switch">
                        <div className="layout-twothirds-center account-form">
                            <h1>Log in to Multiboard for Trello</h1>
                            <div className="login-password-container">
                                <form id="login-form" onSubmit={this.handleSubmit}>
                                    <div className="login-password-container-email">
                                        <div className="email-password">
                                            <div className="hide-when-two-factor">
                                                <input 
                                                    required 
                                                    type="text" 
                                                    name="username" 
                                                    id="username" 
                                                    className="form-field" 
                                                    autoCorrect="off" 
                                                    spellCheck="false" 
                                                    autoCapitalize="off" 
                                                    autoFocus="autofocus" 
                                                    placeholder="Enter username" 
                                                    onChange={(event) => this.setState({ usernameVal: event.target.value })} 
                                                    value={this.state.usernameVal}
                                                />
                                                <input 
                                                    required
                                                    type="password" 
                                                    name="password" 
                                                    id="password" 
                                                    className="form-field" 
                                                    placeholder="Enter password" 
                                                    onChange={(event) => this.setState({ passwordVal: event.target.value })} 
                                                    value={this.state.passwordVal} 
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="button account-button button-green btn btn-success btn-register">Log in</button>
                                    </div>
                                </form>
                            </div>
                            <hr />
                            <span className="bottom-form-link">
                                <a href="/user/register">Register and create your account</a>
                            </span>
                            <span className="bottom-form-link">
                            <a href="/user/one-time">Or use one-time login</a>
                        </span>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionSetAuth, actionSetSelectedBoards
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
