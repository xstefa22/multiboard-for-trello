import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { IconContext } from 'react-icons';
import { FaCheck } from 'react-icons/fa';

import { 
    StyledDialogOverlay, StyledDialogWrapper, StyledDialogHeader, StyledDialogContent, StyledDialogTitle,
    StyledH2, StyledSubmit, StyledUList, StyledBoardOption, StyledBoardTile, StyledBoardTileDetails, StyledBoardTileDetailsName,
    StyledIcon
} from '../../styles';

import { sessionService } from 'redux-react-session';


class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBoardIds: this.props.selectedBoardIds,
        };
    }

    handleClose = (event) => {
        if (event.target.classList.contains("window-overlay")) {
            this.props.onClose();
        }
    };

    handleSave = () => {
        sessionService.loadUser()
            .then(({ jwtToken, boardIds }) => {
                sessionService.saveUser({ jwtToken, boardIds: this.state.selectedBoardIds });
            }).catch((error) => {
                sessionService.saveUser({ jwtToken: '', boardIds: this.state.selectedBoardIds });
            });

        window.location.reload(false);
    }

    handleClickBoard = (board) => {
        const selectedBoardIds = [...this.state.selectedBoardIds];
        
        if (selectedBoardIds.includes(board.id)) {
            const index = selectedBoardIds.indexOf(board.id);
            selectedBoardIds.splice(index, 1);
        } else {
            selectedBoardIds.push(board.id);
        }

        this.setState({ selectedBoardIds });
    };

    renderBoardOptions = () => {
        return this.props.boards.map((board, index) => {
            let style = {};

            if (board.prefs.backgroundImage) {
                style = {
                    backgroundImage: `url(${board.prefs.backgroundImage})`
                }
            } else {
                style = {
                    backgroundColor: `${board.prefs.backgroundColor}`
                }
            }

            return (
                <StyledBoardOption
                    key={index}
                    onClick={() => this.handleClickBoard(board)}
                >
                    <StyledBoardTile style={style}>
                        <StyledBoardTileDetails>
                            <StyledBoardTileDetailsName>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', WebkitBoxOrient: 'vertical', display: '-webkit-box', WebkitLineClamp: 2 }}>{board.name}</div>
                            </StyledBoardTileDetailsName>
                            <div>
                                {   this.state.selectedBoardIds && this.state.selectedBoardIds.includes(board.id) &&
                                    <StyledIcon className="icon-sm board-selected-icon">
                                        <IconContext.Provider value={{ color: '#fff', size: '12px' }}>
                                            <FaCheck />
                                        </IconContext.Provider>
                                    </StyledIcon>
                                }
                            </div>
                        </StyledBoardTileDetails>
                    </StyledBoardTile>
                </StyledBoardOption>
            );
        })
    };

    render = () => {
        return (
            <Dialog 
                aria-labelledby="settings" 
                onClick={this.handleClose}
                open={this.props.isOpen}
            >
                <StyledDialogOverlay className="window-overlay">
                    <StyledDialogWrapper>
                        <StyledDialogHeader>
                            <StyledDialogTitle>
                                <StyledH2 className="detail-title">Settings</StyledH2>
                            </StyledDialogTitle>
                        </StyledDialogHeader>
                        <StyledDialogContent className="settings">
                            <StyledUList className="board-options">
                                {this.renderBoardOptions()}
                            </StyledUList>
                        <StyledSubmit
                            className="primary wide"
                            onClick={this.handleSave}
                            value="Save"
                        />
                        </StyledDialogContent>
                    </StyledDialogWrapper>
                </StyledDialogOverlay>
            </Dialog>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        selectedBoardIds: state.dataReducer.selectedBoardIds,
        member: state.dataReducer.member,
        boards: state.dataReducer.boards,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Settings));
