import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconContext } from "react-icons";
import { MdClose } from 'react-icons/md';
import { FiMoreHorizontal } from 'react-icons/fi'
import { IoIosCheckmark } from 'react-icons/io';

import { 
    actionChecklistItemUpdate
} from '../../../actions';

import {
    StyledIcon, StyledSubmit, StyledEditControls, StyledTextArea,
    StyledCheckListItem, StyledCheckListItemCheckbox, StyledCheckListItemRow, StyledCheckListItemTitleEdit,
    StyledCheckListItemTitle, StyledCheckListItemDetails, StyledCheckListItemTitleText, StyledCheckListItemOptions, 
} from '../../../styles';

class ChecklistItem extends Component {
    constructor(props) {
        super(props);

        this.handleComposer = this.handleComposer.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleClickChecklistItem = this.handleClickChecklistItem.bind(this);
        this.handleEditChecklistItem = this.handleEditChecklistItem.bind(this);

        this.state = {
            clickedOn: false,
            titleValue: this.props.data.name,
        }

        this.titleEditable = React.createRef();    
    }

    handleComposer = (any = false) => {
        this.setState(prevState => ({
            clickedOn: !prevState.clickedOn
        }));

        if (!any) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
    };

    handleOutsideClick = (event) => {
        if (this.titleEditable.current && this.titleEditable.current.contains(event.target)){
            return;
        }

        this.handleEditChecklist();
    };

    handleClickChecklistItem = () => {
        const checklist = this.props.checklists.find((l) => l.id === this.props.data.idChecklist);
        const state = (this.props.data.state === "complete" ? "incomplete" : "complete");
        this.props.actionChecklistItemUpdate(checklist, this.props.data, { state });
    };

    handleEditChecklistItem = () => {
        const { titleValue } = this.state

        if (this.props.data.name !== titleValue){
            const checklist = this.props.checklists.find((l) => l.id === this.props.data.idChecklist);
            this.props.actionChecklistItemUpdate(checklist, this.props.data, { name: titleValue });
        }

        this.handleComposer(true);
    };

    render = () => {
        const { data } = this.props;

        return (
            <StyledCheckListItem>
                <StyledCheckListItemCheckbox 
                    className={(data.state === "complete" ? 'checked' : '')}
                    onClick={this.handleClickChecklistItem}
                >
                    { data.state === "complete" &&
                        <IconContext.Provider value={{ color: "white", size: "28px"}}>
                            <StyledIcon className="icon-sm checklist-checkbox-icon">
                                <IoIosCheckmark/>
                            </StyledIcon>
                        </IconContext.Provider>
                    }
                </StyledCheckListItemCheckbox>
                <StyledCheckListItemDetails>
                    <StyledCheckListItemRow className="current">
                        { !this.state.clickedOn ? 
                            <StyledCheckListItemTitle>
                                <StyledCheckListItemTitleText 
                                    className={(data.state === "complete" ? "complete" : "")}
                                    onClick={this.handleComposer}
                                >
                                    {data.name}
                                </StyledCheckListItemTitleText>
                                <StyledCheckListItemOptions onClick={(e) => {
                                    this.props.handleClick(e, 'checklistOptions')
                                    this.props.setChecklistItem(data.id);
                                }}>
                                    <div className="checklist-item-menu">
                                        <StyledIcon className="icon-sm">
                                            <FiMoreHorizontal/>
                                        </StyledIcon>
                                    </div>
                                </StyledCheckListItemOptions>
                            </StyledCheckListItemTitle>
                        :
                            <StyledCheckListItemTitleEdit>
                                <StyledTextArea
                                    className="checklist-item-title-text"
                                    onChange={(event) => this.setState({ titleValue: event.target.value })}
                                    ref={this.titleEditable}
                                    value={this.state.titleValue}
                                />
                                <StyledEditControls>
                                    <StyledSubmit
                                        className="primary mod-submit-edit"
                                        value="Save"
                                        onClick={this.handleEditChecklistItem}
                                    />
                                    <StyledIcon 
                                        className="icon-lg" 
                                        onClick={() => this.handleComposer(true)}
                                    >
                                        <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                            <MdClose />
                                        </IconContext.Provider>
                                    </StyledIcon>
                                </StyledEditControls> 
                            </StyledCheckListItemTitleEdit>
                        }
                    </StyledCheckListItemRow>
                </StyledCheckListItemDetails>
            </StyledCheckListItem>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        checklists: state.dataReducer.checklists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionChecklistItemUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistItem);
