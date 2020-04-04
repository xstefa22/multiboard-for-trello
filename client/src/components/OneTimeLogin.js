import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sessionService } from 'redux-react-session';
import jwt from 'jsonwebtoken';

import { actionSetAuth } from '../actions';

import '../css/LoginForm.css';


class OneTimeLogin extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            usernameVal: '',
            apiKeyVal: '',
            tokenVal: '',
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
    
    handleSubmit = (event) => {
        event.preventDefault();

        const { usernameVal, apiKeyVal, tokenVal } = this.state;
        this.props.actionSetAuth(usernameVal, apiKeyVal, tokenVal); 
        const payload = { username: usernameVal, apiKey: apiKeyVal, token: tokenVal };
        const secret = usernameVal;
        const jwtToken = jwt.sign(payload, secret, { expiresIn: '2h' });
        sessionService.saveUser({ jwtToken });

        this.props.history.push('/');
    }

    render = () => {
        return (
            <React.Fragment>
                <section className="inner-section">
                    <div className="section-wrapper quick-switch">
                        <div className="layout-twothirds-center account-form">
                            <h1>Log in to Multiboard for Trello using your Trello API credentials</h1>
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
                                                    type="text" 
                                                    name="apiKey" 
                                                    id="apiKey" 
                                                    className="form-field" 
                                                    autoCorrect="off" 
                                                    spellCheck="false" 
                                                    autoCapitalize="off" 
                                                    autoFocus="autofocus" 
                                                    placeholder="Enter your API key" 
                                                    onChange={(event) => this.setState({ apiKeyVal: event.target.value })} 
                                                    value={this.state.apiKeyVal}
                                                />
                                                <input 
                                                    required 
                                                    type="text" 
                                                    name="token" 
                                                    id="token" 
                                                    className="form-field" 
                                                    autoCorrect="off" 
                                                    spellCheck="false" 
                                                    autoCapitalize="off" 
                                                    autoFocus="autofocus" 
                                                    placeholder="Enter token" 
                                                    onChange={(event) => this.setState({ tokenVal: event.target.value })} 
                                                    value={this.state.tokenVal}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="button account-button button-green btn btn-success btn-register">Log in</button>
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
    }
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionSetAuth,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OneTimeLogin);
