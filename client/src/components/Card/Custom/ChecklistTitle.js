import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconContext } from "react-icons";
import { MdClose } from 'react-icons/md';

import { 
    actionChecklistUpdate
} from '../../../actions';

import {
    StyledCheckListTitle, StyledH3, StyledCheckListOptions, StyledButton, StyledCheckListWarnings,
    StyledCheckListTitleEdit, StyledTextArea, StyledEditControls, StyledSubmit, StyledIcon, 
} from '../../../styles';

class ChecklistTitle extends Component {
    constructor(props) {
        super(props);

        this.handleComposer = this.handleComposer.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleEditChecklist = this.handleEditChecklist.bind(this);

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

    handleEditChecklist = () => {
        const { titleValue } = this.state

        if (this.props.data.name !== titleValue){
            this.props.actionChecklistUpdate(this.props.data, { name: titleValue });
        }

        this.handleComposer(true);
    };

    render = () => {
        return (
            <StyledCheckListTitle>
                { !this.state.clickedOn ?
                    <React.Fragment>
                        <StyledH3 
                            className="current"
                            onClick={this.handleComposer}
                        >
                            {this.props.data.name}
                        </StyledH3>
                        <StyledCheckListOptions>
                            { this.props.completedItemsHidden ? 
                                <StyledButton 
                                    className="subtle"
                                    onClick={this.props.handleHideItems}
                                >
                                    Show completed items
                                </StyledButton>
                            :
                                <StyledButton
                                    className="subtle"
                                    onClick={this.props.handleHideItems}
                                >
                                    Hide completed items
                                </StyledButton>
                            }
                            <StyledButton
                                className="subtle"
                                onClick={(e) => this.props.handleClick(e, 'checklistDelete')}
                            >
                                Delete
                            </StyledButton>
                        </StyledCheckListOptions>
                        <StyledCheckListWarnings></StyledCheckListWarnings>
                    </React.Fragment>
                :
                    <StyledCheckListTitleEdit>
                        <StyledTextArea
                            className="checklist-title-text"
                            onChange={(event) => this.setState({ titleValue: event.target.value })}
                            ref={this.titleEditable}
                            value={this.state.titleValue}
                        />
                        <StyledEditControls>
                            <StyledSubmit
                                className="primary mod-submit-edit"
                                onClick={this.handleEditChecklist}
                                value="Save"
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
                    </StyledCheckListTitleEdit>
                }
            </StyledCheckListTitle>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        checklists: state.dataReducer.checklists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionChecklistUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistTitle);
