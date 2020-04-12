import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FiPlus } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { actionCardCreate } from '../../actions';

import { 
    StyledCardComposer, StyledIcon, StyledTextArea, StyledSubmit, StyledSelect, StyledCardWrapper, StyledFormGrid, StyledButtonLink, 
    StyledOptGroup, StyledSelectLabel, StyledSelectValue 
} from '../../styles';


class AddCard extends Component {
    constructor(props) {
        super(props);

        this.handleComposer = this.handleComposer.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleCreateNewCard = this.handleCreateNewCard.bind(this);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);

        this.state = {
            selectedBoardId: this.props.boards[0].id,
            clickedOn: false,
            value: '',
        };
    };

    styles = {
        overflow: 'hidden',
        overflowWrap: 'break-word',
        height: '40px',
    };

    // Handles state for displaying/hiding form for adding new card
    handleComposer = () => {
        if (this.state.value !== '') {
            this.handleCreateNewCard();
        }

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

    // Handles creating new card
    handleCreateNewCard = () => {
        if (this.state.value !== '') {
            this.props.actionCardCreate(this.state.value, this.props.name, this.state.selectedBoardId);

            this.setState({ value: '' });
        }
    };

    // Handles creating new card when user pressed Enter while filling form
    handleOnKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleCreateNewCard();
        }
    };

    // Renders options for board select when creating new card
    renderBoardOptions = () => {
        return this.props.boards.map((board) => {
            return <option key={board.id} value={board.id}> {board.name} </option>;
        });
    };

    render = () => {
        return (
            <div ref={(node) => { this.node = node; }}>
                { this.state.clickedOn && 
                    <StyledCardComposer>
                        <StyledCardWrapper>
                            <div className="card-details">
                                <StyledTextArea
                                    className="card-composer-textarea"
                                    dir="auto"
                                    onChange={(event) => this.setState({ value: event.target.value })}
                                    onKeyDown={this.handleOnKeyDown}
                                    placeholder="Enter a title for this card…"
                                    value={this.state.value}
                                />
                            </div>
                        </StyledCardWrapper>
                        <StyledFormGrid>
                            <StyledButtonLink className="setting form-grid-child form-grid-child-full">
                                <StyledSelectLabel>Board</StyledSelectLabel>
                                <StyledSelectValue>{this.props.boards.find((board) => board.id === this.state.selectedBoardId).name}</StyledSelectValue>
                                <StyledSelect
                                    onChange={(event) => this.setState({ selectedBoardId: event.target.value })}
                                    value={this.state.selectedBoardId} 
                                >
                                    <StyledOptGroup label="Boards">
                                        {this.renderBoardOptions()}
                                    </StyledOptGroup>
                                </StyledSelect>
                            </StyledButtonLink>
                        </StyledFormGrid>
                        <StyledFormGrid>
                            <StyledSubmit
                                className="primary mod-compact"
                                value="Add a card"
                                onClick={this.handleComposer}
                            />
                            <StyledIcon 
                                className="icon-lg" 
                                onClick={(this.handleComposer)}
                            >
                                <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                    <MdClose />
                                </IconContext.Provider>
                            </StyledIcon>
                        </StyledFormGrid>
                    </StyledCardComposer>
                }
                { !this.state.clickedOn && 
                    <StyledCardComposer className="open" onClick={this.handleComposer}>
                        <StyledIcon className="icon-sm mr-2">
                            <IconContext.Provider value={{ size: '16px', color: '#6b778c', }}>
                                <FiPlus />
                            </IconContext.Provider>
                        </StyledIcon>
                        { this.props.listCards.length === 0 && 
                            <React.Fragment>
                                Add a card
                            </React.Fragment>
                        }
                        { this.props.listCards.length > 0 &&
                            <React.Fragment>
                                Add another card
                            </React.Fragment>
                        }
                    </StyledCardComposer>
                }
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionCardCreate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddCard);
