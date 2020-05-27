import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import config from '../../config.js';

import Settings from './Settings';

import {
    StyledBoardHeader, StyledButton, StyledMemberIcon, StyledMemberPopover, StyledMemberPopoverHeader,
    StyledMemberPopoverContent, StyledUList, StyledUListItem, StyledH1
} from '../../styles';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handlePopOverClose = this.handlePopOverClose.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            settingsOpen: false,
            anchorElement: null
        }
    }

    handleClick = (event) => {
        this.setState({ anchorElement: event.currentTarget });
    }

    handleLogout = () => {
        window.Trello.deauthorize()
		this.props.actionRemoveAuth();

		this.props.history.push('/');
    }

    handlePopOverClose = () => {
        this.setState({ anchorElement: null });
    } 

    render = () => {
        return (
            <React.Fragment>
                <StyledBoardHeader>
                    <div className="header-right">
                        <StyledButton 
                            className="header-member-menu-button"
                            onClick={this.handleClick}
                        >
                            <StyledMemberIcon>
                                <span>
                                { config.dev ?
                                    'MI'
                                    :
                                    this.props.member.initials
                                }
                                </span>
                            </StyledMemberIcon>
                        </StyledButton>
                    </div>
                </StyledBoardHeader>
                <Popover
                    anchorEl={this.state.anchorElement}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    onClose={this.handlePopOverClose}    
                    open={Boolean(this.state.anchorElement)}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    style={{
                        marginTop: '10px',
                        marginLeft: '10px',
                    }}
                >
                    <StyledMemberPopover>
                        <StyledMemberPopoverHeader>
                            { this.props.member &&
                                <StyledH1>
                                    { this.props.member.fullName + " (" + this.props.member.username + ")"}
                                </StyledH1>
                            }
                        </StyledMemberPopoverHeader>
                        <StyledMemberPopoverContent>
                            <StyledUList>
                                <StyledUListItem
                                    className="member-popup-item" 
                                    onClick={() => this.setState({ settingsOpen: true })}
                                >
                                    Settings
                                </StyledUListItem>
                                <StyledUListItem
                                    className="member-popup-item" 
                                    onClick={this.handleLogout}
                                >
                                    Log Out
                                </StyledUListItem>
                            </StyledUList>
                        </StyledMemberPopoverContent>
                    </StyledMemberPopover>
                </Popover>
                <Settings
                    onClose={() => this.setState({ settingsOpen: false })}
                    isOpen={this.state.settingsOpen}
                />
            </React.Fragment>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        member: state.authReducer.member,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
