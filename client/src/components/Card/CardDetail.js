import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import { AiOutlineTag, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import { FiCheckSquare, FiArchive, FiMinus, FiChevronDown, FiPlus, FiMoreHorizontal } from 'react-icons/fi';
import { IoMdArrowForward, IoMdRefresh, IoIosCheckmark } from 'react-icons/io';
import { MdContentCopy, MdClose } from 'react-icons/md';
import { IconContext } from "react-icons";
import dateFnsFormat from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import Popover from '../Popover/CustomPopover';
 
import {
    actionCardActionMove, actionCardActionCopy, actionCardActionArchive, actionLabelCreate,
    actionLabelEdit, actionCardUpdate, actionChecklistUpdate,
} from '../../actions';

import { 
    DialogOverlay, DialogWrapper, DialogHeader, DialogContent, DialogTitle,
    DialogHeaderInlineContent, DialogBadges, DialogDescription, DialogModule, DialogSidebar,    
    DialogSidebarSection, ButtonLink, Icon, DialogModuleTitle, Description,
    TextArea, Submit, Text, EditControls, DialogArchiveBanner, H2,
    CardDetailItem, CardDetailItemHeader, CardDetailItemAddButton, CardLabel,
    DueDateCompleteBox, CardDetailItemContent, CheckList, CheckListContent,
    H3, CheckListOptions, CheckListTitle, CheckListTitleEdit, CheckListWarnings,
    CheckListItem, CheckListItemCheckbox, CheckListItemRow, CheckListItemTitleEdit,
    CheckListItemTitle, CheckListItemDetails, CheckListItemTitleText, CheckListItemOptions,
    Button, CheckListAddItem, 
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
        this.handleChecklistItemClick = this.handleChecklistItemClick.bind(this);
        this.handleChecklistItemEdit = this.handleChecklistItemEdit.bind(this);
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

            checklistToEdit: {},
            checklistToEditIndex: null,
            clickedOnEditChecklistTitle: false,
            checklistItemToEdit: {},
            clickedOnEditChecklistItemTitle: false,
        };

        this.cardNameEditable = React.createRef();
        this.cardDescEditable = React.createRef();
        this.checklistTitleEditable = [];
        this.checklistItemTitleEditable = [];
    }

    // Setting focus on textarea when editing card's name or description
    componentDidUpdate = (prevProps, prevState) => {
        if (!prevState.clickedOnEditCardName && this.state.clickedOnEditCardName) {
            this.cardNameEditable.current.focus();
        }
        if (!prevState.clickedOnEditCardDesc && this.state.clickedOnEditCardDesc) {
            this.cardDescEditable.current.focus();
        }
        if (!prevState.clickedOnEditChecklistTitle && this.state.clickedOnEditChecklistTitle) {
            this.checklistTitleEditable[this.state.checklistToEditIndex].focus();
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
            case 'editChecklistTitle': {
                this.setState(prevState => ({
                    clickedOnEditChecklistTitle: !prevState.clickedOnEditChecklistTitle
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
        const { checklistToEditIndex } = this.state;

        if ((this.cardNameEditable && this.cardNameEditable.current && this.cardNameEditable.current.contains(event.target)) || 
            (this.cardDescEditable && this.cardDescEditable.current && this.cardDescEditable.current.contains(event.target)) ||
            (this.checklistTitleEditable[checklistToEditIndex] && this.checklistTitleEditable[checklistToEditIndex].contains(event.target))) {
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

        if (this.state.clickedOnEditChecklistTitle){
            const { checklistToEdit } = this.state;
            const origin = this.props.checklists.find((c) => c.id === checklistToEdit.id);
            if (origin.name !== checklistToEdit.name){
                this.handleEditChecklistTitle();
            }
            this.handleComposer('editChecklistTitle', true);
            this.setState({ checklistToEdit: null, checklistToEditIndex: null })
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
    };

    handleClick = (event, action) => {
        let { anchorElement } = this.state;

        if (action !== 'addLabel' || action !== 'editLabel'){
            anchorElement = event.currentTarget;
        }

        this.setState({ anchorElement, action });
    };

    handleEditChecklistTitle = () => {
        const { checklistToEdit } = this.state; 
        const checklist = this.props.checklists.find((c) => c.id === checklistToEdit.id);

        this.props.actionChecklistUpdate(checklist, { name: checklistToEdit.name });
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


    handleChecklistItemClick = (event, item) => {
    };

    handleChecklistItemEdit = (event, item) => {
    };

    renderCardLabels = () => {
        return this.props.data.labels.map((label, index) => {
            return (
                <CardLabel 
                    className={"mod-card-detail mod-clickable label-" + label.color} 
                    key={label.id} 
                    onClick={(e) => this.handleClick(e, 'labels')}
                    title={label.name} 
                >
                    {label.name}
                </CardLabel>
            );
        });
    };

    renderCardChecklists = () => {
        const checklists = this.props.checklists.filter((l) => l.idCard === this.props.data.id);

        return checklists.map((checklist, index, ) => {
            return (
                <CheckList key={checklist.id}>
                    <DialogModuleTitle className="ml-40">
                        <Icon className="icon-lg icon-checklist">
                            <IconContext.Provider value={{ size: "20px"}}>
                                <FiCheckSquare/>
                            </IconContext.Provider>
                        </Icon>
                        <CheckListTitle>
                            { !this.state.clickedOnEditChecklistTitle &&
                                <React.Fragment>
                                    <H3 
                                        className="current"
                                        onClick={() => {
                                            this.setState({ checklistToEdit: { ...checklist }, checklistToEditIndex: index })
                                            this.handleComposer('editChecklistTitle');
                                        }}
                                    >
                                        {checklist.name}
                                    </H3>
                                    <CheckListOptions>
                                        { this.state.completedItemHidden && 
                                            <Button className="subtle">
                                                Show completedItems
                                            </Button>
                                        ||
                                            <Button className="subtle">
                                                Hide completed items
                                            </Button>
                                        }
                                        <Button className="subtle">
                                            Delete
                                        </Button>
                                    </CheckListOptions>
                                    <CheckListWarnings></CheckListWarnings>
                                </React.Fragment>
                            ||
                                <CheckListTitleEdit>
                                    <TextArea
                                        className="checklist-title-text"
                                        onChange={(event) => { 
                                            let { checklistToEdit } = this.state;
                                            checklistToEdit.name = event.target.value;
                                            this.setState({ checklistToEdit });
                                        }}
                                        ref={(ref) => this.checklistTitleEditable.push(ref)}
                                        value={this.state.checklistToEdit.name}
                                    />
                                    <EditControls>
                                        <Submit
                                            className="primary mod-submit-edit"
                                            value="Save"
                                        />
                                        <Icon 
                                            className="icon-lg" 
                                            onClick={() => this.handleComposer('editChecklistTitle')}
                                        >
                                            <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                                <MdClose />
                                            </IconContext.Provider>
                                        </Icon>
                                    </EditControls>    
                                </CheckListTitleEdit>
                            }
                        </CheckListTitle>
                    </DialogModuleTitle>
                    <CheckListContent className="ui-sortable">
                        {this.renderCardChecklistsItems(checklist.checkItems, index)}
                    </CheckListContent>
                    <CheckListAddItem>
                        { !this.state.checklistNewItemEditing &&
                            <Button className="subtle">
                                Add item
                            </Button>
                        ||
                            <React.Fragment>
                                <TextArea
                                    className="checklist-new-item-text"
                                    onChange={(event) => this.setState({ newChecklistItemValue: event.target.value })}
                                    placeholder="Add an item"
                                    ref={this.newChecklistItemEditable}
                                    value={this.state.newChecklistItemValue}
                                />
                                <EditControls>
                                    <Submit
                                        className="primary mod-submit-edit"
                                        value="Add"
                                    />
                                    <Icon 
                                        className="icon-lg" 
                                        onClick={() => this.handleComposer('editNewChecklistItem')}
                                    >
                                        <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                            <MdClose />
                                        </IconContext.Provider>
                                    </Icon>
                                </EditControls>
                            </React.Fragment>
                        }
                    </CheckListAddItem>
                </CheckList>
            );
        })
    };

    renderCardChecklistsItems = (items, checkListIndex) => {
        return items.map((item, index) => {
            return (
                <CheckListItem key={item.id}>
                    <CheckListItemCheckbox 
                        className={(item.state === "complete" ? 'checked' : '')}
                        onClick={(e) => this.handleChecklistItemClick(e, item)}
                    >
                        { item.state === "complete" &&
                            <IconContext.Provider value={{ color: "white", size: "28px"}}>
                                <Icon className="icon-sm checklist-checkbox-icon">
                                    <IoIosCheckmark/>
                                </Icon>
                            </IconContext.Provider>
                        }
                    </CheckListItemCheckbox>
                    <CheckListItemDetails>
                        <CheckListItemRow className="current">
                            { !this.state.clickedOnEditChecklistItemTitle && 
                                <CheckListItemTitle>
                                    <CheckListItemTitleText className={(item.state === "complete" ? "complete" : "")}>{item.name}</CheckListItemTitleText>
                                    <CheckListItemOptions>
                                        <div className="checklist-item-menu">
                                            <Icon className="icon-sm">
                                                <FiMoreHorizontal/>
                                            </Icon>
                                        </div>
                                    </CheckListItemOptions>
                                </CheckListItemTitle>
                            ||
                                <CheckListItemTitleEdit>
                                    <TextArea
                                        className="checklist-item-title-text"
                                        onChange={(event) => this.setState({ checklistItemTitleValue: event.target.value })}
                                        ref={(ref) => this.checkListItemTitleEditable[checkListIndex].push(ref)}
                                        value={this.state.checklistItemTitleValue }
                                    />
                                    <EditControls>
                                        <Submit
                                            className="primary mod-submit-edit"
                                            value="Save"
                                        />
                                        <Icon 
                                            className="icon-lg" 
                                            onClick={() => this.handleComposer('editCheckListItemTitle')}
                                        >
                                            <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                                <MdClose />
                                            </IconContext.Provider>
                                        </Icon>
                                    </EditControls> 
                                </CheckListItemTitleEdit>
                            }
                        </CheckListItemRow>
                    </CheckListItemDetails>
                </CheckListItem>
            );
        });
    };


    render = () => {
        return (
            <Dialog aria-labelledby="card-detail" open={this.props.isOpen} onClick={this.handleClose}>
                <DialogOverlay className="window-overlay">
                    <DialogWrapper>
                        { this.state.clickedOnArchive && 
                            <DialogArchiveBanner>
                                <Text className="archive">
                                    This card is archived.
                                </Text>
                            </DialogArchiveBanner>
                        }
                        <DialogHeader>
                            <DialogTitle>
                                { !this.state.clickedOnEditCardName &&
                                    <H2
                                        className="detail-title"
                                        onClick={() => this.handleComposer('editCardName')}
                                    >
                                        {this.state.cardNameValue}
                                    </H2>
                                ||
                                    <TextArea
                                        className="is-editing mod-card-back-title"
                                        onChange={(event) => this.setState({ cardNameValue: event.target.value })}
                                        ref={this.cardNameEditable}
                                        value={this.state.cardNameValue}
                                    />
                                }
                            </DialogTitle>
                            <DialogHeaderInlineContent>
                                in list <span>{this.props.listName}</span>
                            </DialogHeaderInlineContent>
                        </DialogHeader>
                        <DialogContent>
                            <DialogBadges>
                            { this.props.data.labels.length > 0 &&
                                <CardDetailItem>
                                    <CardDetailItemHeader>Labels</CardDetailItemHeader>
                                    {this.renderCardLabels()}
                                    <CardDetailItemAddButton onClick={(e) => this.handleClick(e, 'labels')}>
                                        <Icon className="icon-sm">
                                            <IconContext.Provider value={{ color: '#42526e', size: '24px' }}>
                                                <FiPlus/>
                                            </IconContext.Provider>
                                        </Icon>
                                    </CardDetailItemAddButton>
                                </CardDetailItem>
                            }
                            { this.props.data.due &&
                                <CardDetailItem>
                                    <CardDetailItemHeader>Due Date</CardDetailItemHeader>
                                    <CardDetailItemContent className="due-date-badge is-clickable">
                                        <DueDateCompleteBox
                                            onClick={this.handleDueComplete}
                                            role="button"
                                        >
                                            { this.state.dueComplete &&
                                                <Icon className="icon-sm due-date-complete-icon">
                                                    <IconContext.Provider value={{ color: "white", size: "24px"}}>
                                                        <IoIosCheckmark />
                                                    </IconContext.Provider>
                                                </Icon>
                                            }
                                        </DueDateCompleteBox>
                                        <ButtonLink
                                            className="due-date-button"
                                            onClick={(e) => this.handleClick(e, 'dueDate')}
                                        >
                                            <span>{this.getCardDueText()}</span>
                                            { this.state.dueComplete &&
                                                <span className="status-lozenge">complete</span>
                                            }
                                            <Icon className="icon-sm due-date-arrow-icon">
                                                <FiChevronDown/>
                                            </Icon>
                                        </ButtonLink>
                                    </CardDetailItemContent>
                                </CardDetailItem>
                            }
                            </DialogBadges>
                            <DialogDescription>
                                <DialogModule>
                                    <DialogModuleTitle>
                                        <h3>Description</h3>
                                    </DialogModuleTitle>
                                    <Description>
                                        { !this.state.clickedOnEditCardDesc && 
                                            <Text
                                                className={"fake-text-area " + (this.props.data.desc ? '' : 'empty') + ""}
                                                onClick={() => this.handleComposer('editCardDesc')}
                                            >
                                                {this.props.data.desc ? this.props.data.desc : 'Add a more detailed description...'}
                                            </Text>
                                        ||
                                            <React.Fragment>
                                                <TextArea
                                                    className="is-editing"
                                                    onChange={(event) => this.setState({ cardDescValue: event.target.value })}
                                                    placeholder="Add a more detailed description..."
                                                    ref={this.cardDescEditable}
                                                    value={this.state.cardDescValue}
                                                />
                                                <EditControls>
                                                    <Submit
                                                        className="primary mod-submit-edit"
                                                        value="Save"
                                                    />
                                                    <Icon 
                                                        className="icon-lg" 
                                                        onClick={() => this.handleComposer('editCardDesc')}
                                                    >
                                                        <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                                            <MdClose />
                                                        </IconContext.Provider>
                                                    </Icon>
                                                </EditControls>
                                            </React.Fragment>
                                        }
                                    </Description>
                                </DialogModule>
                            </DialogDescription>
                            { this.props.data.idChecklists.length > 0 &&
                                <DialogModule className="no-ml ui-sortable">
                                    {this.renderCardChecklists()}
                                </DialogModule>
                            }
                        </DialogContent>
                        <DialogSidebar>
                            <DialogSidebarSection>
                                <h3>Add to card</h3>
                                <ButtonLink>
                                    <Icon className="icon-sm"><AiOutlineUser/></Icon>
                                    <span>Members</span>
                                </ButtonLink>
                                <ButtonLink onClick={(e) => this.handleClick(e, 'labels')}>
                                    <Icon className="icon-sm"><AiOutlineTag/></Icon>
                                    <span>Labels</span>
                                </ButtonLink>
                                <ButtonLink onClick={(e) => this.handleClick(e, 'checklist')}>
                                    <Icon className="icon-sm"><FiCheckSquare/></Icon>
                                    <span>Checklist</span>
                                </ButtonLink>
                                <ButtonLink onClick={(e) => this.handleClick(e, 'dueDate')}>
                                    <Icon className="icon-sm"><AiOutlineClockCircle/></Icon>
                                    <span>Due Date</span>
                                </ButtonLink>
                            </DialogSidebarSection>
                            <DialogSidebarSection>
                                <h3>Actions</h3>
                                <ButtonLink onClick={(e) => this.handleClick(e, 'move')}>
                                    <Icon className="icon-sm"><IoMdArrowForward/></Icon>
                                    <span>Move</span>
                                </ButtonLink>
                                <ButtonLink onClick={(e) => this.handleClick(e, 'copy')}>
                                    <Icon className="icon-sm"><MdContentCopy/></Icon>
                                    <span>Copy</span>
                                </ButtonLink>
                                { !this.state.clickedOnArchive &&
                                    <ButtonLink onClick={() => this.setState({ clickedOnArchive: true })}>
                                        <Icon className="icon-sm"><FiArchive/></Icon>
                                        <span>Archive</span>
                                    </ButtonLink>
                                ||
                                    <React.Fragment>
                                        <ButtonLink onClick={() => this.setState({ clickedOnArchive: false })}>
                                            <Icon className="icon-sm"><IoMdRefresh/></Icon>
                                            <span>Send to board</span>
                                        </ButtonLink>
                                        <ButtonLink className="negate" onClick={this.handleCardRemove}>
                                            <Icon className="icon-sm"><FiMinus color="white"/></Icon>
                                            <span>Delete</span>
                                        </ButtonLink>
                                    </React.Fragment>
                                }
                            </DialogSidebarSection>
                        </DialogSidebar>
                    </DialogWrapper>
                </DialogOverlay>
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
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);
