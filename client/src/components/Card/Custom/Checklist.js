import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdClose } from 'react-icons/md';
import { FiCheckSquare } from 'react-icons/fi';
import { IconContext } from "react-icons";

import ChecklistTitle from './ChecklistTitle';
import ChecklistItem from './ChecklistItem';
import Popover from '../../Popover/CustomPopover';

import {
    actionChecklistItemAdd
} from '../../../actions';

import { 
    StyledIcon, StyledDialogModuleTitle, StyledTextArea, StyledSubmit, StyledEditControls, 
    StyledCheckList, StyledCheckListContent, StyledButton, StyledCheckListAddItem, 
} from '../../../styles';


class Checklist extends Component {
    constructor(props) {
        super(props);

        this.renderCardChecklistsItems = this.renderCardChecklistsItems.bind(this);
        this.handleComposer = this.handleComposer.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handlePopOverClose = this.handlePopOverClose.bind(this);
        
        this.state = {
            action: null,
            anchorElement: null,

            clickedOnAdd: false,
            completedItemsHidden: false,

            checklistItemId: null,

            titleValue: '',
        };

        this.titleEditable = React.createRef();
    }

    handleComposer = (any = false) => {
        this.setState(prevState => ({
            clickedOnAdd: !prevState.clickedOnAdd
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

        this.handleAddItem();
    };

    handleAddItem = () => {
        const { titleValue } = this.state;

        if (titleValue !== ''){
            this.props.actionChecklistItemAdd(this.props.data, titleValue);
        }

        this.handleComposer(true);
    };
    
    handleHideItems = () => {
        this.setState(prevState => ({
            completedItemsHidden: !prevState.completedItemsHidden
        }));
    };

    handleClick = (event, action) => {
        this.setState({ anchorElement: event.currentTarget, action });
    };

    handlePopOverClose = () => {
        this.setState({ anchorElement: null });
    };

    setChecklistItem = (id) => {
        this.setState({ checklistItemId: id });
    };

    renderCardChecklistsItems = () => {
        const items = this.props.data.checkItems;

        return items.map((item, index) => {
            const shown = this.state.completedItemsHidden && item.state === "complete";

            return (
                <React.Fragment key={item.id}>
                    { !shown &&
                        <ChecklistItem
                            data={item}
                            handleClick={this.handleClick}
                            index={index}
                            setChecklistItem={this.setChecklistItem}
                        />
                    }
                </React.Fragment>
            );
        });
    };

    render = () => {
        const { data, index } = this.props;

        return (
            <React.Fragment>
                <StyledCheckList>
                    <StyledDialogModuleTitle className="ml-40">
                        <StyledIcon className="icon-lg icon-checklist">
                            <IconContext.Provider value={{ size: "20px"}}>
                                <FiCheckSquare/>
                            </IconContext.Provider>
                        </StyledIcon>
                        <ChecklistTitle
                            completedItemsHidden={this.state.completedItemsHidden}
                            data={data}
                            handleHideItems={this.handleHideItems}
                            handleClick={this.handleClick}
                            index={index}
                        />
                    </StyledDialogModuleTitle>
                    <StyledCheckListContent className="ui-sortable">
                        {this.renderCardChecklistsItems()}
                    </StyledCheckListContent>
                    <StyledCheckListAddItem>
                        { !this.state.clickedOnAdd ?
                            <StyledButton 
                                className="subtle"
                                onClick={this.handleComposer}
                            >
                                Add item
                            </StyledButton>
                        :
                            <React.Fragment>
                                <StyledTextArea
                                    className="checklist-new-item-text"
                                    onChange={(event) => this.setState({ titleValue: event.target.value })}
                                    placeholder="Add an item"
                                    ref={this.titleEditable}
                                    value={this.state.titleEditable}
                                />
                                <StyledEditControls>
                                    <StyledSubmit
                                        className="primary mod-submit-edit"
                                        onClick={this.handleAddItem}
                                        value="Add"
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
                            </React.Fragment>
                        }
                    </StyledCheckListAddItem>
                </StyledCheckList>
                <Popover
                    action={this.state.action}
                    anchorElement={this.state.anchorElement}
                    checklist={this.props.data}
                    checklistItemId={this.state.checklistItemId}
                    data={this.props.card}
                    onClose={this.handlePopOverClose}
                />
            </React.Fragment>
        );
    };
};


const mapStateToProps = (state) => {
    return {
        checklists: state.dataReducer.checklists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionChecklistItemAdd,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Checklist);
