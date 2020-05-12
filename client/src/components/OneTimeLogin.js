import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sessionService } from 'redux-react-session';
import jwt from 'jsonwebtoken';

import { actionSetAuth, actionSetOneTime } from '../actions';

import {
    StyledInnerSection, StyledSectionWrapper, StyledAccountForm, StyledH1, StyledInput,
    StyledSubmit, StyledForm, StyledDivider, StyledFormLink, StyledLink
} from '../styles';

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
            .then(({ jwtToken, boardIds }) => {
                const { username, apiKey, token, oneTime } = jwt.decode(jwtToken);
                this.props.actionSetSelectedBoards(boardIds);
                this.props.actionSetAuth(username, apiKey, token);
                if (oneTime) {
                    this.props.actionSetOneTime();
                }

                this.props.history.push('/');
            }).catch((error) => { });
    };
    
    handleSubmit = (event) => {
        event.preventDefault();

        const { usernameVal, apiKeyVal, tokenVal } = this.state;
        this.props.actionSetAuth(usernameVal, apiKeyVal, tokenVal);
        this.props.actionSetOneTime();
        const payload = { username: usernameVal, apiKey: apiKeyVal, token: tokenVal, oneTime: true };
        const secret = usernameVal;
        const jwtToken = jwt.sign(payload, secret, { expiresIn: '2h' });
        sessionService.saveUser({ jwtToken });

        this.props.history.push('/');
    }

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
                                    name="apiKey" 
                                    id="apiKey" 
                                    autoCorrect="off" 
                                    autoComplete="off" 
                                    spellCheck="false" 
                                    autoCapitalize="off" 
                                    className="form-field" 
                                    placeholder="Enter your API key" 
                                    onChange={(event) => this.setState({ apiKeyVal: event.target.value })} 
                                    value={this.state.apiKeyVal}
                                />
                                <StyledInput 
                                    required
                                    name="token" 
                                    id="token" 
                                    autoCorrect="off" 
                                    autoComplete="off" 
                                    spellCheck="false" 
                                    autoCapitalize="off" 
                                    className="form-field" 
                                    placeholder="Enter token" 
                                    onChange={(event) => this.setState({ tokenVal: event.target.value })} 
                                    value={this.state.tokenVal}
                                />
                                <StyledSubmit
                                    className="primary full mod-account"
                                    value="Log In"
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
    }
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionSetAuth, actionSetOneTime,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OneTimeLogin);
