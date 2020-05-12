import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { sessionService } from 'redux-react-session';
import jwt from 'jsonwebtoken';

import { actionSetAuth, actionSetSelectedBoards, actionSetOneTime } from '../actions';
import config from '../config.js';

import {
    StyledInnerSection, StyledSectionWrapper, StyledAccountForm, StyledH1, StyledInput,
    StyledSubmit, StyledForm, StyledDivider, StyledFormLink, StyledLink
} from '../styles';


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
                .then(({ jwtToken, boardIds }) => {
                    const { username, apiKey, token, oneTime } = jwt.decode(jwtToken);
                    this.props.actionSetSelectedBoards(boardIds ? boardIds : null);
                    this.props.actionSetAuth(username, apiKey, token);
                    if (oneTime) {
                        this.props.actionSetOneTime();
                    }
                    
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
                <StyledInnerSection>
                    <StyledSectionWrapper>
                        <StyledAccountForm>
                            <StyledH1>Log in to Multiboard for Trello</StyledH1>
                            <StyledForm 
                                id="loginForm" 
                                onSubmit={this.handleSubmit}
                            >
                                <StyledInput 
                                    required 
                                    name="username" 
                                    id="username" 
                                    className="form-field" 
                                    autoCorrect="off"
                                    autoComplete="off" 
                                    spellCheck="false" 
                                    autoCapitalize="off" 
                                    autoFocus="autofocus" 
                                    placeholder="Enter username" 
                                    onChange={(event) => this.setState({ usernameVal: event.target.value })} 
                                    value={this.state.usernameVal}
                                />
                                <StyledInput 
                                    required
                                    type="password"
                                    name="password" 
                                    id="password" 
                                    className="form-field" 
                                    autoComplete="off"
                                    placeholder="Enter password" 
                                    onChange={(event) => this.setState({ passwordVal: event.target.value })} 
                                    value={this.state.passwordVal} 
                                />
                                <StyledSubmit
                                    className="primary full mod-account"
                                    value="Log In"
                                />
                            </StyledForm>
                            <StyledDivider />
                            <StyledFormLink className="bottom-form-link">
                                <StyledLink href="/user/register">Register and create your account</StyledLink>
                            </StyledFormLink>
                            <StyledFormLink className="bottom-form-link">
                                <StyledLink href="/user/one-time">Or use one-time login</StyledLink>
                            </StyledFormLink>
                        </StyledAccountForm>
                    </StyledSectionWrapper>
                </StyledInnerSection>
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionSetAuth, actionSetSelectedBoards, actionSetOneTime
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
