import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import { AiOutlineTag, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import { FiArchive } from 'react-icons/fi';
import { IoMdArrowForward } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import Popover from '@material-ui/core/Popover';

import {
    actionCardActionMove, actionCardActionCopy, actionCardActionArchive, actionLabelCreate,
    actionLabelEdit, actionCardUpdate,
} from '../../actions';

import '../../css/CardEditor.css';


class CardEditor extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.setAction = this.setAction.bind(this);
        this.handleCardArchive =  this.handleCardArchive.bind(this);
        this.handleEditCardName = this.handleEditCardName.bind(this);
        this.handlePopOverClose = this.handlePopOverClose.bind(this);
        this.renderCardLabels = this.renderCardLabels.bind(this);

        this.state = {
            action: null,
            anchorElement: null,

            cardNameValue: this.props.data.name,
        }
    }

    // Handles hiding card editor modal
    handleClose = (event) => {
        if (event.target.className === "quick-card-editor") {
            if (this.state.cardNameValue !== this.props.data.name) {
                this.handleEditCardName();
            }
            this.props.onClose();
        }
    };

    // Handles archiving card
    handleCardArchive = () => {
        this.props.actionCardActionArchive(this.props.data, this.props.index);
    };


    // Handle editing card's name
    handleEditCardName = () => {
        if (this.state.cardNameValue !== this.props.data.name) {
            const { data } = this.props;
            const { cardNameValue } = this.state;

            this.props.actionCardUpdate(data, { name: cardNameValue }, true);
        }
    };

    setAction = (action) => {
        this.setState({ action });
    }

    handlePopOverClose = () => {
        this.setState({ anchorElement: null });
    }

    renderCardLabels = () => {
        return this.props.data.labels.map((label, index) => {
            return (
                <span className={"card-label card-label-" + label.color + " mod-card-front"} key={label.id}>
                    <span className="label-text">{label.name}</span>
                </span>
            );
        });
    }

    render = () => {
        return (
            <Dialog
                aria-labelledby="card-editor"
                open={this.props.isOpen}
                onClick={this.handleClose}
            >
                <div className="quick-card-editor">
                    <span className="icon-lg icon-close quick-card-editor-close-icon js-close-editor"></span>
                    <div className="quick-card-editor-card" style={{ position: 'fixed', top: this.props.offsetTop, left: this.props.offsetLeft, width: '256px' }}>
                        <div className="list-card list-card-quick-edit js-stop" style={{ width: '256px' }}>
                            <div className="list-card-cover js-card-cover"></div>
                            <div className="list-card-stickers-area js-stickers-area hide">
                                <div className="stickers js-card-stickers"></div>
                            </div>
                            <div className="list-card-details js-card-details">
                                { this.props.data.labels.length > 0 &&
                                    <div className="list-card-labels js-card-labels">
                                        {this.renderCardLabels()}
                                    </div>
                                }
                                <textarea
                                    className="list-card-edit-title js-edit-card-title"
                                    dir="auto" style={{ overflow: 'hidden', overflowWrap: 'break-word', resize: 'none', height: '90px' }}
                                    value={this.state.cardNameValue}
                                    onChange={(event) => this.setState({ cardNameValue: event.target.value })}
                                />
                                <div className="badges hidden">
                                    <span className="js-badges"></span>
                                    <span className="custom-field-front-badges js-custom-field-badges"></span>
                                    <span className="js-plugin-badges"></span>
                                </div>
                                <div className="list-card-members js-list-card-members"></div>
                            </div>
                        </div>
                        <input className="primary wide js-save-edits" type="submit" value="Save" onClick={() => { this.handleEditCardName(); this.props.onClose(); }} />
                        <div className="quick-card-editor-buttons fade-in">
                            <a className="quick-card-editor-buttons-item" href="/#" onClick={(e) => this.handleClick(e, 'labels')}>
                                <span className="icon-sm icon-label light"><AiOutlineTag color="white"/></span>
                                <span className="quick-card-editor-buttons-item-text">Edit Labels</span>
                            </a>
                            <a className="quick-card-editor-buttons-item" href="//#">
                                <span className="icon-sm icon-member light"><AiOutlineUser color="white"/></span>
                                <span className="quick-card-editor-buttons-item-text">Change Members</span>
                            </a>
                            <a className="quick-card-editor-buttons-item" href="/#" onClick={(e) => this.handleClick(e, 'move')}>
                                <span className="icon-sm icon-move light"><IoMdArrowForward color="white"/></span>
                                <span className="quick-card-editor-buttons-item-text">Move</span>
                            </a>
                            <a className="quick-card-editor-buttons-item" href="/#" onClick={(e) => this.handleClick(e, 'copy')}>
                                <span className="icon-sm icon-card light"><MdContentCopy color="white"/></span>
                                <span className="quick-card-editor-buttons-item-text">Copy</span>
                            </a>
                            <a className="quick-card-editor-buttons-item" href="/#" onClick={(e) => this.handleClick(e, 'dueDate')}>
                                <span className="icon-sm icon-clock light"><AiOutlineClockCircle color="white"/></span>
                                <span className="quick-card-editor-buttons-item-text">Change Due Date</span>
                            </a>
                            <a className="quick-card-editor-buttons-item" href="/#" onClick={this.handleCardArchive}>
                                <span className="icon-sm icon-archive light"><FiArchive color="white"/></span>
                                <span className="quick-card-editor-buttons-item-text">Archive</span>
                            </a>
                        </div>
                    </div>
                </div>
                <Popover
                    action={this.state.action}
                    anchorElement={this.state.anchorElement}
                    data={this.props.data}
                    onClose={this.handlePopOverClose}
                    setAction={this.setAction}
                />
            </Dialog>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        labels: state.dataReducer.labels,
        cards: state.dataReducer.cards,
        boards: state.dataReducer.boards,
        lists: state.dataReducer.lists,
        customLists: state.dataReducer.customLists,
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionCardActionMove, actionCardActionCopy, actionCardActionArchive, actionLabelCreate,
    actionLabelEdit, actionCardUpdate,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CardEditor);
