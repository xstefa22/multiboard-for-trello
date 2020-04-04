import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Redirect } from 'react-router-dom';
import { sessionService } from 'redux-react-session';
import socketIOClient from 'socket.io-client';
import jwt from 'jsonwebtoken';

import config from '../../config.js';
import List from '../List/List';
import AddList from '../List/AddList';
import NavBar from './NavBar';

import {
    actionFetchBoards, actionFetchLists, actionFetchCards, actionCreateCustomLists, actionCardMove, actionListMove, actionFetchLabels, actionSetAuth, actionRemoveAuth,
    actionUpdateReceived, actionFetchUserAndCreateWebhook, actionSetSelectedBoards, actionFetchChecklists
} from '../../actions';

import { BoardWrapper } from '../../styles';


class Board extends Component {
    // Checks if user is logged in or if his data are stored in session
    componentDidMount = () => {
        console.log(config);
        if (this.props.loggedIn) {
            this.props.actionFetchBoards();
            if (!config.onlyClient){
                this.props.actionFetchUserAndCreateWebhook();
            }
        } else {
            if (config.dev) {
                this.props.actionSetAuth(config.username, config.apiKey, config.token);
            } else {
                sessionService.loadUser()
                    .then(({ jwtToken, boardIds }) => {
                        const { username, apiKey, token } = jwt.decode(jwtToken);

                        this.props.actionSetSelectedBoards(boardIds);
                        this.props.actionSetAuth(username, apiKey, token);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
        }
        
        // Listens to server sending trello webhook updates
        if (!config.onlyClient && this.props.loggedIn) {
            const socket = socketIOClient(config.server);
            socket.on('update', (data) => {
                console.log(data);
                this.props.actionUpdateReceived(data);
            });
        }
    };

    // Checks if all data needed are fetched and then allow component to render
    shouldComponentRender = () => {
        if (!this.props.boardsReceived) {
            return false;
        }

        if (!this.props.listsReceived) {
            if (this.props.boardsReceived) {
                this.props.actionFetchLabels(this.props.boards);
                this.props.actionFetchChecklists(this.props.boards);
                this.props.actionFetchLists(this.props.boards);
            }
            return false;
        }
        if (!this.props.cardsReceived) {
            if (this.props.boardsReceived) {
                this.props.actionFetchCards(this.props.boards);
            }
            return false;
        }
        if (!this.props.customListsCreated) {
            this.props.actionCreateCustomLists();

            return false;
        }

        return true;
    };

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

        if (!this.shouldComponentRender()) return <div>Receiving Data...</div>;

        return (
            <BoardWrapper>
                { !config.dev && 
                    <NavBar />
                }
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
            </BoardWrapper>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        loggedIn: state.authReducer.loggedIn,
        boards: state.dataReducer.boards,
        boardsReceived: state.dataReducer.boardsReceived,
        cardsReceived: state.dataReducer.cardsReceived,
        lists: state.dataReducer.lists,
        listsReceived: state.dataReducer.listsReceived,
        customLists: state.dataReducer.customLists,
        customListsCreated: state.dataReducer.customListsCreated,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionFetchBoards, actionFetchLists, actionFetchCards, actionCreateCustomLists,
    actionCardMove, actionListMove, actionFetchLabels, actionSetAuth, actionRemoveAuth,
    actionFetchUserAndCreateWebhook, actionUpdateReceived, actionSetSelectedBoards,
    actionFetchChecklists,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Board);
