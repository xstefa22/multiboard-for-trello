import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import { AiOutlineTag, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import { FiCheckSquare, FiArchive, FiMinus, FiChevronDown, FiPlus } from 'react-icons/fi';
import { IoMdArrowForward, IoMdRefresh, IoIosCheckmark } from 'react-icons/io';
import { MdContentCopy, MdClose } from 'react-icons/md';
import { IconContext } from "react-icons";
import dateFnsFormat from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import Popover from '../Popover/CustomPopover';
import Checklist from './Custom/Checklist';

import {
    actionCardActionMove, actionCardActionCopy, actionCardActionArchive, actionLabelCreate,
    actionLabelEdit, actionCardUpdate, actionChecklistUpdate, actionChecklistItemUpdate, 
    actionCardActionDelete,
} from '../../actions';

import { 
    StyledDialogOverlay, StyledDialogWrapper, StyledDialogHeader, StyledDialogContent, StyledDialogTitle,
    StyledDialogHeaderInlineContent, StyledDialogBadges, StyledDialogDescription, StyledDialogModule, StyledDialogSidebar,    
    StyledDialogSidebarSection, StyledButtonLink, StyledIcon, StyledDialogModuleTitle, StyledDescription,
    StyledTextArea, StyledSubmit, StyledText, StyledEditControls, StyledDialogArchiveBanner, StyledH2,
    StyledCardDetailItem, StyledCardDetailItemHeader, StyledCardDetailItemAddButton, StyledCardLabel,
    StyledDueDateCompleteBox, StyledCardDetailItemContent,
} from '../../styles';


class CardDetail extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.handleComposer = this.handleComposer.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleEditCardName = this.handleEditCardName.bind(this);
        this.handleEditCardDesc = this.handleEditCardDesc.bind(this);
        this.handleCardMembers = this.handleCardMembers.bind(this);
        this.handleCardCustomization = this.handleCardCustomization.bind(this);
        this.handleCardRemove = this.handleCardRemove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.setAction = this.setAction.bind(this);
        this.handlePopOverClose = this.handlePopOverClose.bind(this);
        this.handleDueComplete = this.handleDueComplete.bind(this);

        this.state = {
            action: null,
            anchorElement: null,

            cardNameValue: this.props.data.name,
            clickedOnEditCardName: false,
            cardDescValue: this.props.data.desc,
            clickedOnEditCardDesc: false,

            dueComplete: this.props.data.dueComplete,
            idChecklists: this.props.data.idChecklists,
        };

        this.cardNameEditable = React.createRef();
        this.cardDescEditable = React.createRef();
    }

    // Setting focus on textarea when editing card's name or description
    componentDidUpdate = (prevProps, prevState) => {
        if (!prevState.clickedOnEditCardName && this.state.clickedOnEditCardName) {
            this.cardNameEditable.current.focus();
        }
        if (!prevState.clickedOnEditCardDesc && this.state.clickedOnEditCardDesc) {
            this.cardDescEditable.current.focus();
        }
    };

    // Handles closing card detail modal
    handleClose = (event) => {
        if (event.target.classList.contains("window-overlay")) {
            if (this.state.clickedOnArchive) {
                this.props.actionCardActionArchive(this.props.data, this.props.index);
            }
            this.props.onClose();
        }
    };

    // Handles state for displaying/hiding popup and setting popup offset
    handleComposer = (action = null, any = false) => {
        switch (action) {
            case 'editCardName': {
                this.setState(prevState => ({
                    clickedOnEditCardName: !prevState.clickedOnEditCardName
                }));
                break;
            }
            case 'editCardDesc': {
                this.setState(prevState => ({
                    clickedOnEditCardDesc: !prevState.clickedOnEditCardDesc
                }));
                break;
            }

            default: break;
        }

        if (!any) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
    };

    // Handles hiding popup if clicked outside of popup
    handleOutsideClick = (event) => {
        const { checklistToEditIndex, checklistItemToEditIndex } = this.state;

        if ((this.cardNameEditable && this.cardNameEditable.current && this.cardNameEditable.current.contains(event.target)) || 
            (this.cardDescEditable && this.cardDescEditable.current && this.cardDescEditable.current.contains(event.target))) {
            return;
        }
        
        if (this.state.clickedOnEditCardName) {
            if (this.props.data.name !== this.state.cardNameValue) {
                this.handleEditCardName();
            }
            this.handleComposer('editCardName', true);
        }

        if (this.state.clickedOnEditCardDesc) {
            if (this.props.data.desc !== this.state.cardDescValue) {
                this.handleEditCardDesc();
            }
            this.handleComposer('editCardDesc', true);
        }

        this.handleComposer(null, true);
    };

    // Handles editing card's name
    handleEditCardName = () => {
        const { data } = this.props;
        const { cardNameValue } = this.state;

        this.props.actionCardUpdate(data, { name: cardNameValue }, true);
    };

    // Handles editing card's description
    handleEditCardDesc = () => {
        const { data } = this.props;
        const { cardDescValue } = this.state;

        this.props.actionCardUpdate(data, { desc: cardDescValue }, true);
    };

    handleCardMembers = (event) => {
    };

    handleCardCustomization = (event) => {
    };

    handleCardRemove = (event) => {
        this.props.actionCardActionDelete();
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
    };

    handlePopOverClose = () => {
        this.setState({ anchorElement: null });
    };

    getCardDueText = () => {
        const { due } = this.props.data;
        
        let date = parseISO(due);
        date = dateFnsFormat(date, 'MMM d');

        return date;
    };

    handleDueComplete = () => {
        this.setState(prevState => ({
            dueComplete: !prevState.dueComplete
        }));
        this.props.actionCardUpdate(this.props.data, { dueComplete: !this.state.dueComplete }, true);
    };

    renderCardLabels = () => {
        return this.props.data.labels.map((label, index) => {
            return (
                <StyledCardLabel 
                    className={"mod-card-detail mod-clickable label-" + label.color} 
                    key={label.id} 
                    onClick={(e) => this.handleClick(e, 'labels')}
                    title={label.name} 
                >
                    {label.name}
                </StyledCardLabel>
            );
        });
    };

    renderCardChecklists = () => {
        const checklists = this.props.checklists.filter((l) => l.idCard === this.props.data.id);

        return checklists.map((checklist, index) => {
            return (
                <Checklist
                    card={this.props.data}
                    data={checklist}
                    index={index}
                    key={checklist.id}
                />
            );
        })
    };

    render = () => {
        return (
            <Dialog 
                aria-labelledby="card-detail" 
                disableEnforceFocus={true}
                open={this.props.isOpen} 
                onClick={this.handleClose}
            >
                <StyledDialogOverlay className="window-overlay">
                    <StyledDialogWrapper>
                        { this.state.clickedOnArchive && 
                            <StyledDialogArchiveBanner>
                                <StyledText className="archive">
                                    This card is archived.
                                </StyledText>
                            </StyledDialogArchiveBanner>
                        }
                        <StyledDialogHeader>
                            <StyledDialogTitle>
                                { !this.state.clickedOnEditCardName &&
                                    <StyledH2
                                        className="detail-title"
                                        onClick={() => this.handleComposer('editCardName')}
                                    >
                                        {this.state.cardNameValue}
                                    </StyledH2>
                                ||
                                    <StyledTextArea
                                        className="is-editing mod-card-back-title"
                                        onChange={(event) => this.setState({ cardNameValue: event.target.value })}
                                        ref={this.cardNameEditable}
                                        value={this.state.cardNameValue}
                                    />
                                }
                            </StyledDialogTitle>
                            <StyledDialogHeaderInlineContent>
                                in list <span>{this.props.listName}</span>
                            </StyledDialogHeaderInlineContent>
                        </StyledDialogHeader>
                        <StyledDialogContent>
                            <StyledDialogBadges>
                            { this.props.data.labels.length > 0 &&
                                <StyledCardDetailItem>
                                    <StyledCardDetailItemHeader>Labels</StyledCardDetailItemHeader>
                                    {this.renderCardLabels()}
                                    <StyledCardDetailItemAddButton onClick={(e) => this.handleClick(e, 'labels')}>
                                        <StyledIcon className="icon-sm">
                                            <IconContext.Provider value={{ color: '#42526e', size: '24px' }}>
                                                <FiPlus/>
                                            </IconContext.Provider>
                                        </StyledIcon>
                                    </StyledCardDetailItemAddButton>
                                </StyledCardDetailItem>
                            }
                            { this.props.data.due &&
                                <StyledCardDetailItem>
                                    <StyledCardDetailItemHeader>Due Date</StyledCardDetailItemHeader>
                                    <StyledCardDetailItemContent className="due-date-badge is-clickable">
                                        <StyledDueDateCompleteBox
                                            onClick={this.handleDueComplete}
                                            role="button"
                                        >
                                            { this.state.dueComplete &&
                                                <StyledIcon className="icon-sm due-date-complete-icon">
                                                    <IconContext.Provider value={{ color: "white", size: "24px"}}>
                                                        <IoIosCheckmark />
                                                    </IconContext.Provider>
                                                </StyledIcon>
                                            }
                                        </StyledDueDateCompleteBox>
                                        <StyledButtonLink
                                            className="due-date-button"
                                            onClick={(e) => this.handleClick(e, 'dueDate')}
                                        >
                                            <span>{this.getCardDueText()}</span>
                                            { this.state.dueComplete &&
                                                <span className="status-lozenge">complete</span>
                                            }
                                            <StyledIcon className="icon-sm due-date-arrow-icon">
                                                <FiChevronDown/>
                                            </StyledIcon>
                                        </StyledButtonLink>
                                    </StyledCardDetailItemContent>
                                </StyledCardDetailItem>
                            }
                            </StyledDialogBadges>
                            <StyledDialogDescription>
                                <StyledDialogModule>
                                    <StyledDialogModuleTitle>
                                        <h3>Description</h3>
                                    </StyledDialogModuleTitle>
                                    <StyledDescription>
                                        { !this.state.clickedOnEditCardDesc && 
                                            <StyledText
                                                className={"fake-text-area " + (this.props.data.desc ? '' : 'empty') + ""}
                                                onClick={() => this.handleComposer('editCardDesc')}
                                            >
                                                {this.props.data.desc ? this.props.data.desc : 'Add a more detailed description...'}
                                            </StyledText>
                                        ||
                                            <React.Fragment>
                                                <StyledTextArea
                                                    className="is-editing"
                                                    onChange={(event) => this.setState({ cardDescValue: event.target.value })}
                                                    placeholder="Add a more detailed description..."
                                                    ref={this.cardDescEditable}
                                                    value={this.state.cardDescValue}
                                                />
                                                <StyledEditControls>
                                                    <StyledSubmit
                                                        className="primary mod-submit-edit"
                                                        value="Save"
                                                    />
                                                    <StyledIcon 
                                                        className="icon-lg" 
                                                        onClick={() => this.handleComposer('editCardDesc')}
                                                    >
                                                        <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                                            <MdClose />
                                                        </IconContext.Provider>
                                                    </StyledIcon>
                                                </StyledEditControls>
                                            </React.Fragment>
                                        }
                                    </StyledDescription>
                                </StyledDialogModule>
                            </StyledDialogDescription>
                            { this.props.checklists.filter((l) => l.idCard === this.props.data.id).length > 0 &&
                                <StyledDialogModule className="no-ml ui-sortable">
                                    {this.renderCardChecklists()}
                                </StyledDialogModule>
                            }
                        </StyledDialogContent>
                        <StyledDialogSidebar>
                            <StyledDialogSidebarSection>
                                <h3>Add to card</h3>
                                <StyledButtonLink>
                                    <StyledIcon className="icon-sm"><AiOutlineUser/></StyledIcon>
                                    <span>Members</span>
                                </StyledButtonLink>
                                <StyledButtonLink onClick={(e) => this.handleClick(e, 'labels')}>
                                    <StyledIcon className="icon-sm"><AiOutlineTag/></StyledIcon>
                                    <span>Labels</span>
                                </StyledButtonLink>
                                <StyledButtonLink onClick={(e) => this.handleClick(e, 'checklist')}>
                                    <StyledIcon className="icon-sm"><FiCheckSquare/></StyledIcon>
                                    <span>Checklist</span>
                                </StyledButtonLink>
                                <StyledButtonLink onClick={(e) => this.handleClick(e, 'dueDate')}>
                                    <StyledIcon className="icon-sm"><AiOutlineClockCircle/></StyledIcon>
                                    <span>Due Date</span>
                                </StyledButtonLink>
                            </StyledDialogSidebarSection>
                            <StyledDialogSidebarSection>
                                <h3>Actions</h3>
                                <StyledButtonLink onClick={(e) => this.handleClick(e, 'move')}>
                                    <StyledIcon className="icon-sm"><IoMdArrowForward/></StyledIcon>
                                    <span>Move</span>
                                </StyledButtonLink>
                                <StyledButtonLink onClick={(e) => this.handleClick(e, 'copy')}>
                                    <StyledIcon className="icon-sm"><MdContentCopy/></StyledIcon>
                                    <span>Copy</span>
                                </StyledButtonLink>
                                { !this.state.clickedOnArchive &&
                                    <StyledButtonLink onClick={() => this.setState({ clickedOnArchive: true })}>
                                        <StyledIcon className="icon-sm"><FiArchive/></StyledIcon>
                                        <span>Archive</span>
                                    </StyledButtonLink>
                                ||
                                    <React.Fragment>
                                        <StyledButtonLink onClick={() => this.setState({ clickedOnArchive: false })}>
                                            <StyledIcon className="icon-sm"><IoMdRefresh/></StyledIcon>
                                            <span>Send to board</span>
                                        </StyledButtonLink>
                                        <StyledButtonLink className="negate" onClick={this.handleCardRemove}>
                                            <StyledIcon className="icon-sm"><FiMinus color="white"/></StyledIcon>
                                            <span>Delete</span>
                                        </StyledButtonLink>
                                    </React.Fragment>
                                }
                            </StyledDialogSidebarSection>
                        </StyledDialogSidebar>
                    </StyledDialogWrapper>
                </StyledDialogOverlay>
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
};


const mapStateToProps = (state) => {
    return {
        labels: state.dataReducer.labels,
        cards: state.dataReducer.cards,
        checklists: state.dataReducer.checklists,
        boards: state.dataReducer.boards,
        lists: state.dataReducer.lists,
        customLists: state.dataReducer.customLists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionCardActionArchive, actionCardActionMove, actionCardActionCopy,
    actionLabelCreate, actionLabelEdit, actionCardUpdate, actionChecklistUpdate,
    actionChecklistItemUpdate, actionCardActionDelete, 
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);
