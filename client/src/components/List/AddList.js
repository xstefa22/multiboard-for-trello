import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconContext } from "react-icons";
import { MdClose } from 'react-icons/md';

import { actionListCreate } from '../../actions';

import { StyledListWrapper, StyledIcon, StyledInput, StyledSubmit } from '../../styles';


class AddList extends Component {
    constructor(props) {
        super(props);

        this.handleComposer = this.handleComposer.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleCreateNewList = this.handleCreateNewList.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

        this.state = {
            clickedOn: false,
            value: '',
        }
    };

    // Handles state for displaying/hiding form for adding new list
    handleComposer = () => {
        if (!this.state.clickedOn) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }

        this.setState(prevState => ({
            clickedOn: !prevState.clickedOn
        }));
    };

    // Handles hiding form for adding when clicked outside of form
    handleOutsideClick = (event) => {
        if (this.node.contains(event.target)) {
            return;
        }

        this.handleComposer();
    };

    // Handles creating new list
    handleCreateNewList = () => {
        if (this.state.value !== '') {
            this.props.actionListCreate(this.state.value);

            this.setState({ value: '' });
            this.handleComposer();
        }
    };

    // Handles creating new list when user pressed Enter while filling form
    handleOnKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleCreateNewList();
        }
    };

    render = () => {
        return (
            <StyledListWrapper
                className={"mod-add " + (this.state.clickedOn ? '' : 'is-idle')}
                ref={(node) => { this.node = node; }}
            >
                { this.state.clickedOn &&
                    <React.Fragment>
                        <StyledInput
                            autoComplete="off"
                            className="list-name-input"
                            dir="auto"
                            maxLength="512"
                            onChange={(event) => this.setState({ value: event.target.value })}
                            onKeyDown={this.handleOnKeyDown}
                            placeholder="Enter list title..."
                            value={this.state.value}
                        />
                        <div className="list-add-controls">
                            <StyledSubmit 
                                className="primary mod-list-add-button" 
                                value="Add a list"
                                onClick={this.handleCreateNewList}
                            />
                            <StyledIcon 
                                className="icon-lg" 
                                onClick={(this.handleComposer)}
                            >
                                <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                    <MdClose />
                                </IconContext.Provider>
                            </StyledIcon>
                        </div>
                    </React.Fragment>
                }
                { !this.state.clickedOn && 
                    <span className="list-placeholder" onClick={this.handleComposer}>
                        <FontAwesomeIcon icon={faPlus} />&nbsp; Add another list
                    </span>
                }
            </StyledListWrapper>
        );
    };
};

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionListCreate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddList);
