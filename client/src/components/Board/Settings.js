import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import '../../css/Settings.css';

import {
    actionSaveSelectedBoards,
} from '../../actions';
import { sessionService } from 'redux-react-session';


class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBoardIds: this.props.selectedBoardIds,
        };
    }

    handleClose = (event) => {
        if (event.target.className === "window-overlay") {
            this.props.onClose();
        }
    };

    handleSave = () => {
    sessionService.loadUser()
        .then(({ jwtToken, boardIds }) => {
            sessionService.saveUser({ jwtToken, boardIds: this.state.selectedBoardIds });
        }).catch((error) => {
            console.error(error);
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
                <li className="board-option" key={index} onClick={() => this.handleClickBoard(board)}>
                    <button className="board-tile" style={ style } >
                        <div className="board-tile-details">
                            <div className="board-tile-details-name">
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', WebkitBoxOrient: 'vertical', display: '-webkit-box', WebkitLineClamp: 2 }}>{board.name}</div>
                            </div>
                            <div className="board-tile-details-sub-container">
                                <span className="board-tile-options">
                                    <span className={"icon-sm icon-check board-selectable-icon " + (this.state.selectedBoardIds && this.state.selectedBoardIds.includes(board.id) ? ' ' : 'hidden')}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </span>
                            </div>
                        </div>
                    </button>    
                </li>
            );
        })
    };

    render = () => {
        return (
            <Dialog aria-labelledby="settings" open={this.props.isOpen} onClick={this.handleClose}>
                <div className="window-overlay">
                    <div className="window">
                        <div className="card-detail-window">
                            <div className="window-header">
                                <div className="window-title">
                                    <h2 className="card-detail-title">Settings</h2>
                                </div>
                            </div>
                            <div className="window-main-col full-width padding-0">
                                <div className="u-gutter">
                                    <ul className="board-options">
                                        {this.renderBoardOptions()}
                                    </ul>
                                    <input className="primary wide js-submit" type="submit" value="Save" onClick={this.handleSave}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    actionSaveSelectedBoards,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Settings));
