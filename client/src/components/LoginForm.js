import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sessionService } from 'redux-react-session';

import { actionSetAuth, actionSetSelectedBoards } from '../actions';
import config from '../config.js';

import {
    StyledInnerSection, StyledSectionWrapper, StyledAccountForm, StyledH1,
    StyledSubmit, StyledForm
} from '../styles';


class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);

        this.state = {
            error: false,
        }
    }

    // Checks if user's data are store in session, if true, user is logged in and redirected to board
    componentDidMount = () => {
        sessionService.loadUser()
            .then(({ boardIds }) => {
                this.props.actionSetSelectedBoards(boardIds ? boardIds : null);
            }).catch((error) => {});

        window.Trello.authorize({
            type: "popup",
            name: config.appName,
            scope: {
                read: config.read,
                write: config.write
            },
            expiration: config.expiration,
            interactive: false,
            success: this.onSuccess,
            error: () => {},
        });
    };

    onSuccess = () => {
        window.Trello.get('/members/me', {}, (response) => {
            this.props.actionSetAuth(response);

            this.props.history.push('/');
        }, (error) => {});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        window.Trello.authorize({
            type: "popup",
            name: config.appName,
            scope: {
                read: config.read,
                write: config.write
            },
            expiration: config.expiration,
            success: this.onSuccess,
            error: () => {},
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
                                <StyledSubmit
                                    className="primary full mod-account"
                                    value="Sign in with Trello"
                                />
                            </StyledForm>
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
    actionSetAuth, actionSetSelectedBoards
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
