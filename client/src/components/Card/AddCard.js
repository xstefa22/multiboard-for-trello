import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FiPlus } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { actionCardCreate } from '../../actions';

import { CardComposer, Icon, TextArea, Submit, Select, CardWrapper, FormGrid, ButtonLink, OptGroup, SelectLabel, SelectValue } from '../../styles';


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
                    <CardComposer>
                        <CardWrapper>
                            <div className="card-details">
                                <TextArea
                                    className="card-composer-textarea"
                                    dir="auto"
                                    onChange={(event) => this.setState({ value: event.target.value })}
                                    onKeyDown={this.handleOnKeyDown}
                                    placeholder="Enter a title for this card…"
                                    value={this.state.value}
                                />
                            </div>
                        </CardWrapper>
                        <FormGrid>
                            <ButtonLink className="setting form-grid-child form-grid-child-full">
                                <SelectLabel>Board</SelectLabel>
                                <SelectValue>{this.props.boards.find((board) => board.id === this.state.selectedBoardId).name}</SelectValue>
                                <Select
                                    onChange={(event) => this.setState({ selectedBoardId: event.target.value })}
                                    value={this.state.selectedBoardId} 
                                >
                                    <OptGroup label="Boards">
                                        {this.renderBoardOptions()}
                                    </OptGroup>
                                </Select>
                            </ButtonLink>
                        </FormGrid>
                        <FormGrid>
                            <Submit
                                className="primary mod-compact"
                                value="Add a card"
                                onClick={this.handleComposer}
                            />
                            <Icon 
                                className="icon-lg" 
                                onClick={(this.handleComposer)}
                            >
                                <IconContext.Provider value={{ size: '24px', color: '#42526e' }}>
                                    <MdClose />
                                </IconContext.Provider>
                            </Icon>
                        </FormGrid>
                    </CardComposer>
                }
                { !this.state.clickedOn && 
                    <CardComposer className="open" onClick={this.handleComposer}>
                        <Icon className="icon-sm mr-2">
                            <IconContext.Provider value={{ size: '16px', color: '#6b778c', }}>
                                <FiPlus />
                            </IconContext.Provider>
                        </Icon>
                        { this.props.listCards.length == 0 && 
                            <React.Fragment>
                                Add a card
                            </React.Fragment>
                        }
                        { this.props.listCards.length > 0 &&
                            <React.Fragment>
                                Add another card
                            </React.Fragment>
                        }
                    </CardComposer>
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
