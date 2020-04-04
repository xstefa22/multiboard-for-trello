import React, { Component } from 'react';
import axios from 'axios';
import config from '../config.js';
import { sessionService } from 'redux-react-session';
import jwt from 'jsonwebtoken';

import '../css/LoginForm.css';


const { authorizeURL, appName, scope, expiration } = config;


export default class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            usernameVal: '',
            passwordVal: '',
            keyVal: '',
            secretVal: '',
            redirect: false,
        };
    }
    // Checks if user's data are stored in session, if true, user is logged in and redirected to board
    componentDidMount = () => {
        sessionService.loadUser()
            .then(({ jwtToken }) => {
                const { username, apiKey, token } = jwt.decode(jwtToken);
                this.props.actionSetAuth(username, apiKey, token);

                this.props.history.push('/');
            }).catch((error) => { });
    };

    // Handles submitting register form
    handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            username: this.state.usernameVal,
            key: this.state.keyVal,
            password: this.state.passwordVal,
            secret: this.state.secretVal,
        };

        axios.post('/user/register', data,
        ).then((response) => {
            if (response.status === 200) {
                const token = response.data;
                if (!token) {
                    alert('Invalid API key or OAuth secret provided');
                } else {
                    const url = `${authorizeURL}?oauth_token=${token}&name=${appName}&scope=${scope}&expiration=${expiration}`;

                    window.location.href = url;
                }
            }
        }).catch((error) => {

        });
    };

    render = () => {
        return (
            <React.Fragment>
                <section className="inner-section">
                    <div className="section-wrapper quick-switch">
                        <div className="layout-twothirds-center account-form">
                            <h1>Register to Trello Multiboard</h1>
                            <div className="login-password-container">
                                <form id="register-form" onSubmit={this.handleSubmit}>
                                    <div className="login-password-container-email">
                                        <div className="email-password">
                                            <div className="hide-when-two-factor">
                                                <input required type="text" name="username" id="username" className="form-field" autoCorrect="off" spellCheck="false" autoCapitalize="off" autoFocus="autofocus" placeholder="Enter username (same as your Trello username)" onChange={(event) => this.setState({ usernameVal: event.target.value })} value={this.state.usernameVal} />
                                                <input required type="text" name="key" id="key" className="form-field" autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="off" placeholder="Enter your API key" onChange={(event) => this.setState({ keyVal: event.target.value })} value={this.state.keyVal} />
                                                <input required type="text" name="secret" id="secret" className="form-field" autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="off" placeholder="Enter your OAuth Secret" onChange={(event) => this.setState({ secretVal: event.target.value })} value={this.state.secretVal} />
                                                <input required type="password" name="password" id="password" className="form-field" placeholder="Enter password" onChange={(event) => this.setState({ passwordVal: event.target.value })} value={this.state.passwordVal} />
                                            </div>
                                        </div>
                                        <button type="submit" className='button account-button button-green btn btn-success btn-register'>Register</button>
                                    </div>
                                </form>
                            </div>
                            <hr />
                            <span className="bottom-form-link">
                                <a href="/user/login">Already have an account? Log In</a>
                            </span>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    };
}
