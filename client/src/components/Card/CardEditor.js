import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import { AiOutlineTag, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import { FiArchive } from 'react-icons/fi';
import { IoMdArrowForward } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { IconContext } from "react-icons";

import CustomPopover from '../Popover/CustomPopover';

import {
    actionCardActionMove, actionCardActionCopy, actionCardActionArchive, actionLabelCreate,
    actionLabelEdit, actionCardUpdate,
} from '../../actions';

import {
    StyledCardEditor, StyledCardEditorContent, StyledCardEditorCard, StyledCardEditorCover, StyledCardEditorDetails,
    StyledSubmit, StyledCardEditorButtonsItem, StyledIcon, StyledCardEditorButtons, StyledTextArea,
    StyledCardLabels, StyledCardLabel,
} from '../../styles';


class CardEditor extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.setAction = this.setAction.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        if (event.target.classList.contains("window-overlay")) {
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

    handleClick = (event, action) => {
        let { anchorElement } = this.state;

        if (action !== 'addLabel' || action !== 'editLabel'){
            anchorElement = event.currentTarget;
        }

        this.setState({ anchorElement, action });
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
                <StyledCardLabel key={label.id} className={"label-" + (label.color) + " mod-card-front "} title={label.title} />
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
                <StyledCardEditor className="window-overlay">
                    <StyledCardEditorContent style={{ position: 'fixed', top: this.props.offsetTop, left: this.props.offsetLeft, width: '256px' }}>
                        <StyledCardEditorCard style={{ width: '256px' }}>
                            <StyledCardEditorCover></StyledCardEditorCover>
                            <StyledCardEditorDetails>
                                { this.props.data.labels.length > 0 &&
                                    <StyledCardLabels>
                                        {this.renderCardLabels()}
                                    </StyledCardLabels>
                                }
                                <StyledTextArea
                                    className="list-card-edit-title"
                                    dir="auto" style={{ overflow: 'hidden', overflowWrap: 'break-word', resize: 'none', height: '90px' }}
                                    value={this.state.cardNameValue}
                                    onChange={(event) => this.setState({ cardNameValue: event.target.value })}
                                />
                            </StyledCardEditorDetails>
                        </StyledCardEditorCard>
                        <StyledSubmit 
                            className="primary wide"
                            onClick={() => { this.handleEditCardName(); this.props.onClose(); }}
                            value="Save"
                        />
                        <StyledCardEditorButtons>
                            <StyledCardEditorButtonsItem onClick={(e) => this.handleClick(e, 'labels')}>
                                <StyledIcon className="icon-sm"><AiOutlineTag/></StyledIcon>
                                <span>Edit Labels</span>
                            </StyledCardEditorButtonsItem>
                            <StyledCardEditorButtonsItem>
                                <StyledIcon className="icon-sm"><AiOutlineUser/></StyledIcon>
                                <span>Change Members</span>
                            </StyledCardEditorButtonsItem>
                            <StyledCardEditorButtonsItem onClick={(e) => this.handleClick(e, 'move')}>
                                <StyledIcon className="icon-sm"><IoMdArrowForward/></StyledIcon>
                                <span>Move</span>
                            </StyledCardEditorButtonsItem>
                            <StyledCardEditorButtonsItem onClick={(e) => this.handleClick(e, 'copy')}>
                                <StyledIcon className="icon-sm"><MdContentCopy/></StyledIcon>
                                <span>Copy</span>
                            </StyledCardEditorButtonsItem>
                            <StyledCardEditorButtonsItem onClick={(e) => this.handleClick(e, 'dueDate')}>
                                <StyledIcon className="icon-sm"><AiOutlineClockCircle/></StyledIcon>
                                <span>Change Due Date</span>
                            </StyledCardEditorButtonsItem>
                            <StyledCardEditorButtonsItem onClick={this.handleCardArchive}>
                                <StyledIcon className="icon-sm"><FiArchive/></StyledIcon>
                                <span>Archive</span>
                            </StyledCardEditorButtonsItem>
                        </StyledCardEditorButtons>
                    </StyledCardEditorContent>
                </StyledCardEditor>
                <CustomPopover
                    action={this.state.action}
                    anchorElement={this.state.anchorElement}
                    data={this.props.data}
                    onClose={this.handlePopOverClose}
                    open={Boolean(this.state.anchorElement)}
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
