import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import config from '../../config';

import '../../css/NavBar.css';
import Settings from './Settings';

import {
    StyledBoardHeader, StyledButton, StyledMemberIcon,
} from '../../styles';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settingsOpen: false,
            anchorElement: null
        }
    }

    handleClick = (event) => {
        this.setState({ anchorElement: event.currentTarget });
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
                    <div className="member-popup">
                        <header className="member-popup-header">
                            <h1>{this.props.member.fullName + " (" + this.props.member.username + ")"}</h1>
                        </header>
                        <div className="member-popup-items">
                            <nav>
                                <ul>
                                    <li className="member-popup-item" onClick={() => this.setState({ settingsOpen: true })}><a href="/#">Settings</a></li>
                                    <li className="member-popup-item" onClick={() => this.props.history.push('/user/logout')}><a href="/#">Log Out</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
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
        member: state.dataReducer.member,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));
