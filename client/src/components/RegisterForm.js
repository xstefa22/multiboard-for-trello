import React, { Component } from 'react';
import axios from 'axios';
import config from '../config.js';
import { sessionService } from 'redux-react-session';
import jwt from 'jsonwebtoken';

import {
    StyledInnerSection, StyledSectionWrapper, StyledAccountForm, StyledH1, StyledInput,
    StyledSubmit, StyledForm, StyledDivider, StyledFormLink, StyledLink
} from '../styles';


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
                <StyledInnerSection>
                    <StyledSectionWrapper>
                        <StyledAccountForm>
                            <StyledH1>Register to Multiboard for Trello</StyledH1>
                            <StyledForm 
                                id="registerForm" 
                                onSubmit={this.handleSubmit}
                            >
                                <StyledInput
                                    required
                                    name="username"
                                    id="username"
                                    className="form-field"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    autoCapitalize="off"
                                    autoFocus="autofocus"
                                    placeholder="Enter username (same as your Trello username)" 
                                    onChange={(event) => this.setState({ usernameVal: event.target.value })} 
                                    value={this.state.usernameVal}
                                />
                                <StyledInput 
                                    required
                                    name="key"
                                    id="key"
                                    className="form-field"
                                    autoComplete="off" 
                                    autoCorrect="off" 
                                    spellCheck="false" 
                                    autoCapitalize="off" 
                                    placeholder="Enter your API key" 
                                    onChange={(event) => this.setState({ keyVal: event.target.value })} 
                                    value={this.state.keyVal} 
                                />
                                <StyledInput 
                                    required 
                                    name="secret" 
                                    id="secret" 
                                    className="form-field" 
                                    autoComplete="off" 
                                    autoCorrect="off" 
                                    spellCheck="false" 
                                    autoCapitalize="off" 
                                    placeholder="Enter your OAuth Secret" 
                                    onChange={(event) => this.setState({ secretVal: event.target.value })} 
                                    value={this.state.secretVal} 
                                />
                                <StyledInput 
                                    required 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    className="form-field" 
                                    placeholder="Enter password" 
                                    onChange={(event) => this.setState({ passwordVal: event.target.value })} 
                                    value={this.state.passwordVal} 
                                />
                                <StyledSubmit
                                    className="primary full mod-account"
                                    value="Create an account"
                                />
                            </StyledForm>
                            <StyledDivider />
                            <StyledFormLink className="bottom-form-link">
                                <StyledLink href="/user/login">Already have an account? Log In</StyledLink>
                            </StyledFormLink>
                            </StyledAccountForm>
                    </StyledSectionWrapper>
                </StyledInnerSection>
            </React.Fragment>
        );
    };
}
