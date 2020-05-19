import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Redirect } from 'react-router-dom';
import { sessionService } from 'redux-react-session';
import socketIOClient from 'socket.io-client';

import config from '../../config.js';
import List from '../List/List';
import AddList from '../List/AddList';
import NavBar from './NavBar';

import {
    actionFetchBoards, actionFetchLists, actionFetchCards, actionCreateCustomLists, actionCardMove, actionListMove, actionFetchLabels, actionSetAuth, actionRemoveAuth,
    actionUpdateReceived, actionCheckAndCreateWebhook, actionSetSelectedBoards, actionFetchChecklists,
} from '../../actions';

import { StyledBoardWrapper } from '../../styles';


class Board extends Component {
    constructor(props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);

        this.state = {
            ready: false,
        }
    }

    // Checks if user is logged in or if his data are stored in session
    componentDidMount = () => {
        if (this.props.loggedIn) {
            sessionService.loadUser()
            .then(({ boardIds }) => {
                this.props.actionSetSelectedBoards(boardIds ? boardIds : null);
            }).catch((error) => {
            });

            this.props.actionFetchBoards();
            if (!config.onlyClient) {
                this.props.actionCheckAndCreateWebhook();
            
                // Listens to server sending trello webhook updates
                const socket = socketIOClient(config.server);
                const data = { idMember: this.props.member.id };
                
                socket.on('connect', () => {
                    socket.emit('authorization', data, () => {
                    });
                });

                socket.on('update', (data) => {
                    if (data.model.id === this.props.member.id) {
                        this.props.actionUpdateReceived(data);
                    }
                });

                socket.on('disconnect', () => {
                    socket.emit('deauthorization', data, () => {
                    });
                });
            }
        }
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (!prevProps.boardsReceived && this.props.boardsReceived) {
            this.props.actionFetchLists();
            this.props.actionFetchCards();
            this.props.actionFetchLabels();
            this.props.actionFetchChecklists();
        } else if (!prevProps.listsReceived && this.props.listsReceived) {
            this.props.actionCreateCustomLists();
        } else if (!prevProps.customListsCreated && this.props.customListsCreated) {
            this.setState({ ready: !prevState.ready });
        }
    }

    // Handles moving list or card event
    onDragEnd = (result) => {
        const { destination, source, type } = result;

        //Moving outside list
        if (!destination) {
            return;
        }

        //Moving to same place as before
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        switch (type) {
            case "droppableCards": {
                this.props.actionCardMove(result);

                break;
            }

            case "droppableLists": {
                this.props.actionListMove(result);
                break;
            }

            default: {
                return;
            }
        }
    };

    // Renders lists on board
    renderLists = () => {
        return this.props.customLists.map((list, index) => {
            return (
                <List
                    key={list.name}
                    index={index}
                    {...list}
                />
            );
        })
    };

    render = () => {
        if (!this.props.loggedIn) {
            return <Redirect to="/user/login" />;
        }

        if (!this.state.ready) return <div></div>;

        return (
            <StyledBoardWrapper>
                <NavBar />
                <div className="content">
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable
                            droppableId="board"
                            direction="horizontal"
                            type="droppableLists"
                        >
                            {(provided, snapshot) => (
                                <div
                                    className="ui-sortable"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {this.renderLists()}
                                    {provided.placeholder}
                                    <AddList />
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </StyledBoardWrapper>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        boards: state.dataReducer.boards,
        boardsReceived: state.dataReducer.boardsReceived,
        cardsReceived: state.dataReducer.cardsReceived,
        cards: state.dataReducer.cards,
        lists: state.dataReducer.lists,
        listsReceived: state.dataReducer.listsReceived,
        customLists: state.dataReducer.customLists,
        customListsCreated: state.dataReducer.customListsCreated,

        loggedIn: state.authReducer.loggedIn,
        member: state.authReducer.member,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionFetchBoards, actionFetchLists, actionFetchCards, actionCreateCustomLists,
    actionCardMove, actionListMove, actionFetchLabels, actionSetAuth, actionRemoveAuth,
    actionCheckAndCreateWebhook, actionUpdateReceived, actionSetSelectedBoards,
    actionFetchChecklists
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Board);
