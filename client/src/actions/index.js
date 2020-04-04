import trello from '../api/trello';
import axios from 'axios';
import store from '../store/index.js';
import _ from 'lodash';
import config from '../config.js';
import {
    FETCH_BOARDS_SUCCESS, FETCH_BOARDS_FAILURE, FETCH_LISTS_SUCCESS, FETCH_LISTS_FAILURE, FETCH_CARDS_SUCCESS,
    FETCH_CARDS_FAILURE, FETCH_LABELS_SUCCESS, FETCH_LABELS_FAILURE, CREATE_CUSTOM_LISTS, USER_RECEIVED_FAILURE,
    CARD_UPDATE, CARD_UPDATE_SUCCESS, CARD_UPDATE_FAILURE, CARD_CREATE, CARD_CREATE_SUCCESS, CARD_CREATE_FAILURE,
    CARD_ACTION_ARCHIVE, CARD_ACTION_ARCHIVE_SUCCESS, CARD_ACTION_ARCHIVE_FAILURE, CARD_ACTION_DELETE,
    CARD_ACTION_DELETE_SUCCESS, CARD_ACTION_DELETE_FAILURE, CARD_ACTION_COPY, CARD_ACTION_COPY_SUCCESS, CARD_ACTION_COPY_FAILURE,
    CUSTOM_LIST_MOVE, LIST_MOVE_SUCCESS, LIST_MOVE_FAILURE, LIST_CREATE, LIST_CREATE_SUCCESS, LIST_CREATE_FAILURE,
    LABEL_CREATE, LABEL_CREATE_SUCCESS, LABEL_CREATE_FAILURE, LABEL_EDIT, LABEL_EDIT_SUCCESS, LABEL_EDIT_FAILURE,
    SET_AUTH, REMOVE_AUTH, WEBHOOK_ADD_LABEL_TO_CARD, WEBHOOK_COPY_BOARD, WEBHOOK_COPY_CARD, WEBHOOK_CREATE_BOARD, WEBHOOK_CREATE_CARD,
    WEBHOOK_CREATE_LABEL, WEBHOOK_DELETE_CARD, WEBHOOK_DELETE_LABEL, WEBHOOK_MOVE_CARD_FROM_BOARD, WEBHOOK_MOVE_CARD_TO_BOARD,
    WEBHOOK_MOVE_LIST_FROM_BOARD, WEBHOOK_MOVE_LIST_TO_BOARD, FETCH_BOARD_SUCCESS,
    WEBHOOK_REMOVE_LABEL_FROM_CARD, WEBHOOK_UPDATE_BOARD, WEBHOOK_UPDATE_CARD, WEBHOOK_UPDATE_LABEL, WEBHOOK_UPDATE_LIST,
    USER_RECEIVED, SET_SELECTED_BOARDS, FETCH_CHECKLISTS_FAILURE, FETCH_CHECKLISTS_SUCCESS,
    CHECKLIST_UPDATE, CHECKLIST_UPDATE_SUCCESS, CHECKLIST_UPDATE_FAILURE,
} from './actionTypes';
import { findPosition, sortCards } from '../api/index.js';


// Action based around user, invoked once, when page is loaded
export const actionFetchBoards = _.once(() => {
    const { key, token, username } = store.getState().authReducer;
    const params = { key, token };

    return (dispatch) => {
        trello.get('/1/members/' + username + '/boards', { params })
            .then((response) => dispatch({ type: FETCH_BOARDS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_BOARDS_FAILURE, payload: { error } }));
    };
});

export const actionFetchLists = _.once(() => {
    const { key, token } = store.getState().authReducer;
    const params = { key, token };
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id));

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(trello.get('/1/boards/' + board.id + '/lists', { params }));
    });

    return (dispatch) => {
        axios.all(promises)
            .then((response) => dispatch({ type: FETCH_LISTS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_LISTS_FAILURE, payload: { error } }));
    };
});

export const actionSetSelectedBoards = (selectedBoardIds) => {
    return {
        type: SET_SELECTED_BOARDS,
        payload: {
            selectedBoardIds,
        }
    };
};

export const actionFetchCards = _.once(() => {
    const { key, token } = store.getState().authReducer;
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id));

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(trello.get('/1/boards/' + board.id + '/cards', {
            params: {
                checklists: 'all',
                stickers: 'true',
                key,
                token
            }
        }));
    });

    return (dispatch) => {
        axios.all(promises)
            .then((response) => dispatch({ type: FETCH_CARDS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_CARDS_FAILURE, payload: { error } }));
    };
});

export const actionFetchLabels = _.once(() => {
    const { key, token } = store.getState().authReducer;
    const params = { key, token };
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id));

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(trello.get('/1/boards/' + board.id + '/labels', { params }));
    });

    return (dispatch) => {
        axios.all(promises)
            .then((response) => dispatch({ type: FETCH_LABELS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_LABELS_FAILURE, payload: { error } }));
    }
});

export const actionFetchChecklists = _.once(() => {
    const { key, token } = store.getState().authReducer;
    const params = { key, token };

    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id));

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(trello.get('/1/boards/' + board.id + '/checklists', { params }));
    });

    return (dispatch) => {
        axios.all(promises)
            .then((response) => dispatch({ type: FETCH_CHECKLISTS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_CHECKLISTS_FAILURE, payload: { error } }));
    }
});

export const actionCreateCustomLists = _.once(() => {
    return {
        type: CREATE_CUSTOM_LISTS,
        payload: {}
    };
});

export const actionFetchUserAndCreateWebhook = _.once(() => {
    const { username } = store.getState().authReducer;

    return (dispatch) => {
        trello.get('/1/members/' + username)
            .then((response) => dispatch(actionFetchWebhooks(response.data)))
            .catch((error) => dispatch({ type: USER_RECEIVED_FAILURE, payload: { error } }));
    };
});

export const actionFetchWebhooks = _.once((data) => {
    const { key, token } = store.getState().authReducer;

    return (dispatch) => {
        store.dispatch({ type: USER_RECEIVED, payload: { user: data } });

        return trello.get('/1/tokens/' + token + '/webhooks', { params: { key, token } })
            .then((response) => dispatch(actionCheckAndCreateWebhook(response.data, data)))
            .catch((error) => dispatch({ type: USER_RECEIVED_FAILURE, payload: { error } }));
    };
});

export const actionCheckAndCreateWebhook = _.once((webhooks, userData) => {
    const { key, token } = store.getState().authReducer;
    const description = "Webhook for receiving updates Multiboard for Trello";
    const callbackURL = config.webhookCallbackURL;

    const exists = webhooks.find((webhook) => webhook.idModel === userData.id && webhook.callbackURL === callbackURL);

    return (dispatch) => {
        if (!exists) {
            return trello.post('/1/webhooks', null, { params: { key, token, idModel: userData.id, description, callbackURL } });
        }
    }
});

export const actionSaveSelectedBoards = (selectedBoardIds) => {
    store.dispatch({ type: SET_SELECTED_BOARDS, payload: { selectedBoardIds } });

    return (dispatch) => {
        return axios.post('/user/update', { username: store.getState().authReducer.username, selectedBoardIds },
        ).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        });
    }
};
//

// Action based around cards
export const actionCardMove = (result) => {
    const { key, token } = store.getState().authReducer;
    const { cards, lists } = store.getState().dataReducer;

    const { source, destination, draggableId } = result;

    const cardToMove = cards.find((card) => card.id === draggableId);
    const listIds = lists.filter((list) => list.name === destination.droppableId).map((list) => list.id);
    const cardsInList = cards.filter((card) => listIds.includes(card.idList));
    const sortedCards = sortCards(cardsInList);

    let pos;

    if (source.droppableId === destination.droppableId) {
        pos = findPosition(source.index, destination.index, sortedCards, false);

        return (dispatch) => {
            dispatch({ type: CARD_UPDATE, payload: { card: cardToMove, data: { pos } } });

            return dispatch(actionCardUpdate(cardToMove, { pos }));
        }
    }

    pos = findPosition(source.index, destination.index, sortedCards);
    const movingToList = lists.find((list) => list.idBoard === cardToMove.idBoard && list.name === destination.droppableId);

    return (dispatch) => {
        if (movingToList) {
            dispatch({ type: CARD_UPDATE, payload: { card: cardToMove, data: { pos, idList: movingToList.id } } });

            return dispatch(actionCardUpdate(cardToMove, { pos, idList: movingToList.id }));
        } else {
            const listsOnBoard = lists.filter((list) => list.idBoard === cardToMove.idBoard);
            const listPos = findPosition(source.index, destination.index, listsOnBoard);

            return trello.post('/1/lists', null, { params: { name: destination.droppableId, idBoard: cardToMove.idBoard, pos: listPos, key, token } })
                .then((response) => {
                    dispatch({ type: CARD_UPDATE, payload: { card: cardToMove, data: { pos, idList: response.data.id } } });

                    dispatch(actionCardUpdate(cardToMove, { pos, idList: response.data.id }))
                })
                .catch((error) => dispatch({ type: CARD_UPDATE_FAILURE, payload: { card: cardToMove, error } }));
        };
    };
};

export const actionCardUpdate = (card, data, updateLocally = false, dataToUpdateOnlyLocally = {}) => {
    const { key, token } = store.getState().authReducer;

    return (dispatch) => {
        if (updateLocally) {
            store.dispatch({ type: CARD_UPDATE, payload: { card, data: { ...data, ...dataToUpdateOnlyLocally } } });
        }

        console.log(data);

        return trello.put('/1/cards/' + card.id, null, { params: { ...data, key, token } })
            .then((response) => dispatch({ type: CARD_UPDATE_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: CARD_UPDATE_FAILURE, payload: { card, error } }));
    };
};

export const actionCardCreate = (name, listName, idBoard) => {
    const { key, token } = store.getState().authReducer;
    const { cards, lists } = store.getState().dataReducer;

    const list = lists.find((list) => list.name === listName && list.idBoard === idBoard);
    const cardsInList = cards.filter((card) => card.idList === list.id);

    const pos = findPosition(0, cardsInList.length, cardsInList);
    const id = Math.random().toString(36).substr(2, 9);

    return (dispatch) => {
        store.dispatch({ type: CARD_CREATE, payload: { data: { id, name, idList: list.id, idBoard, pos, labels: [] } } });

        return trello.post('/1/cards', null, { params: { name, pos, idList: list.id, key, token } })
            .then((response) => dispatch({ type: CARD_CREATE_SUCCESS, payload: { card: response.data, id } }))
            .catch((error) => dispatch({ type: CARD_CREATE_FAILURE, payload: { error, id } }));
    }
};

export const actionCardActionArchive = (card) => {
    const { key, token } = store.getState().authReducer;

    return (dispatch) => {
        store.dispatch({ type: CARD_ACTION_ARCHIVE, payload: { card } });

        return trello.put('/1/cards/' + card.id, null, { params: { closed: true, key, token } })
            .then((response) => dispatch({ type: CARD_ACTION_ARCHIVE_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: CARD_ACTION_ARCHIVE_FAILURE, payload: { error, card } }));
    }
};

export const actionCardActionDelete = (card) => {
    const { key, token } = store.getState().authReducer;

    return (dispatch) => {
        store.dispatch({ type: CARD_ACTION_DELETE, payload: { card } });

        return trello.delete('/1/cards/' + card.id, null, { params: { key, token } })
            .then((response) => dispatch({ type: CARD_ACTION_DELETE_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: CARD_ACTION_DELETE_FAILURE, payload: { error, card } }));
    };
};

export const actionCardActionMove = (card, idBoard, idList, index, sourceIndex) => {
    const { key, token } = store.getState().authReducer;
    const { cards, lists } = store.getState().dataReducer;

    const listName = lists.find((list) => list.id === idList).name;
    const listsIds = lists.filter((list) => list.name === listName).map((list) => list.id);
    const cardsInList = cards.filter((c) => listsIds.includes(c.idList));

    const pos = findPosition(sourceIndex, index - 1, cardsInList);

    return (dispatch) => {
        store.dispatch({ type: CARD_UPDATE, payload: { card, data: { idBoard, idList, pos } } });

        return trello.put('/1/cards/' + card.id, null, { params: { idBoard, idList, pos, key, token } })
            .then((response) => dispatch({ type: CARD_UPDATE_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: CARD_UPDATE_FAILURE, payload: { error, card } }));
    };
};

export const actionCardActionCopy = (card, name, idBoard, idList, index, sourceIndex) => {
    const { key, token } = store.getState().authReducer;
    const { cards, lists } = store.getState().dataReducer;

    if (name === '') {
        name = card.name;
    }

    const listName = lists.find((list) => list.name === idList).name;
    const listIds = lists.filter((list) => list.name === listName).map((list) => list.id);
    const cardsInList = cards.filter((c) => listIds.include(c.idList));

    const pos = findPosition(sourceIndex, index - 1, cardsInList);

    return (dispatch) => {
        store.dispatch({ type: CARD_ACTION_COPY, payload: { card, data: { name, idBoard, idList, pos } } });

        return trello.post('/1/cards', null, { params: { idList, name, desc: card.desc, pos, key, token } })
            .then((response) => dispatch({ type: CARD_ACTION_COPY_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: CARD_ACTION_COPY_FAILURE, payload: { error, card } }));
    };
};
// 

// Action based around lists
export const actionListMove = (result) => {
    const { source, destination, draggableId } = result;
    const { boards, customLists, lists } = store.getState().dataReducer;

    const customListToUpdate = customLists.find((list) => "list-" + list.name === draggableId);


    return (dispatch) => {
        store.dispatch({ type: CUSTOM_LIST_MOVE, payload: { list: customListToUpdate, result } });

        boards.forEach((board) => {
            const listsOnBoard = lists.filter((list) => list.idBoard === board.id);
            const listToUpdate = listsOnBoard.find((list) => list.name === customListToUpdate.name);

            const pos = findPosition(source.index, destination.index, listsOnBoard);

            store.dispatch(actionListUpdate(listToUpdate, { pos }));
        });
    };
};

export const actionListUpdate = (listToUpdate, data) => {
    const { key, token } = store.getState().authReducer;

    return (dispatch) => {
        trello.put('/1/lists/' + listToUpdate.id, null, { params: { ...data, key, token } })
            .then((response) => dispatch({ type: LIST_MOVE_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: LIST_MOVE_FAILURE, payload: { list: listToUpdate, error } }));
    };
};

export const actionListCreate = (name) => {
    const { key, token } = store.getState().authReducer;
    const { boards, lists } = store.getState().dataReducer;

    return (dispatch) => {
        store.dispatch({ type: LIST_CREATE, payload: { data: { name } } });

        boards.forEach((board) => {
            const listsOnBoard = lists.filter((list) => list.idBoard === board.id);
            const pos = findPosition(0, listsOnBoard.length, listsOnBoard);

            trello.post('/1/lists', null, { params: { name, idBoard: board.id, pos, key, token } })
                .then((response) => dispatch({ type: LIST_CREATE_SUCCESS, payload: { data: response.data } }))
                .catch((error) => dispatch({ type: LIST_CREATE_FAILURE, payload: { error, name } }));
        });
    };
};
//

// Actions based around labels
export const actionLabelCreate = (data) => {
    const { key, token } = store.getState().authReducer;

    const id = Math.random().toString(36).substr(2, 9);
    return (dispatch) => {
        store.dispatch({ type: LABEL_CREATE, payload: { data: { ...data, id } } });

        return trello.post('/1/labels', null, { params: { ...data, key, token } })
            .then((response) => dispatch({ type: LABEL_CREATE_SUCCESS, payload: { data: response.data, id } }))
            .catch((error) => dispatch({ type: LABEL_CREATE_FAILURE, payload: { error, id } }));
    };
};

export const actionLabelEdit = (label, data) => {
    const { key, token } = store.getState().authReducer;

    return (dispatch) => {
        store.dispatch({ type: LABEL_EDIT, payload: { label, data } });

        return trello.post('/1/labels/' + label.id, null, { params: { ...data, key, token } })
            .then((response) => dispatch({ type: LABEL_EDIT_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: LABEL_EDIT_FAILURE, payload: { error, label } }));
    }
};
//

// Actions based around checklists
export const actionChecklistUpdate = (checklist, data) => {
    const { key, token } = store.getState().authReducer;
    console.log(checklist);
    console.log(data);

    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_UPDATE, payload: { checklist, data } });

        return trello.put('/1/checklists/' + checklist.id, null, { params: { ...data, key, token } })
            .then((response) => dispatch({ type: CHECKLIST_UPDATE_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: CHECKLIST_UPDATE_FAILURE, payload: { error, checklist }}));
    }
};
//

// Actions based around authentication
export const actionSetAuth = (username, key, token) => {
    return {
        type: SET_AUTH,
        payload: {
            username,
            key,
            token
        }
    };
};

export const actionRemoveAuth = () => {
    return {
        type: REMOVE_AUTH,
        payload: {}
    };
};
//

export const actionUpdateReceived = (update) => {
    const data = update.action.data;

    switch (update.action.type) {
        case "addLabelToCard": {
            return {
                type: WEBHOOK_ADD_LABEL_TO_CARD,
                payload: {
                    card: data.card,
                    label: data.label,
                    board: data.board,
                }
            };
        }
        case "copyBoard": {
            // Same as creteeBoard
            return {
                type: WEBHOOK_COPY_BOARD,
                payload: {
                    board: data.board,
                    sourceBoard: data.boardSource,
                }
            };
        }
        case "copyCard": {
            return {
                type: WEBHOOK_COPY_CARD,
                payload: {
                    card: data.card,
                    sourceCard: data.cardSource,
                    list: data.list,
                    board: data.board,
                }
            };
        }
        case "createLabel": {
            return {
                type: WEBHOOK_CREATE_LABEL,
                payload: {
                    label: data.data,
                    board: data.board,
                }
            };
        }
        case "createBoard": {
            // dispatch action for receiving board, its list and cards,
            const { key, token } = store.getState().authReducer;

            const { board } = data;

            return (dispatch) => {
                store.dispatch(actionFetchLists([board.id]));
                store.dispatch(actionFetchCards([board.id]));
                store.dispatch(actionFetchLabels([board.id]));
                store.dispatch(actionFetchChecklists([board.id]));

                return trello.get('/1/boards/' + board.id, { params: { key, token } })
                    .then((response) => dispatch({ type: FETCH_BOARD_SUCCESS, payload: { board: response.data } }))
                    .catch((error) => dispatch({ type: FETCH_BOARDS_FAILURE, payload: { error } }));
            };
        }
        case "createCard": {
            return {
                type: WEBHOOK_CREATE_CARD,
                payload: {
                    card: data.card,
                    list: data.list,
                    board: data.board,
                }
            };
        }
        case "createList": {
            return {
                type: WEBHOOK_CREATE_BOARD,
                payload: {
                    list: data.list,
                    board: data.board,
                }
            };
        }
        case "deleteCard": {
            return {
                type: WEBHOOK_DELETE_CARD,
                payload: {
                    card: data.card,
                }
            };
        }
        case "deleteLabel": {
            return {
                type: WEBHOOK_DELETE_LABEL,
                payload: {
                    label: data.label,
                    board: data.board,
                }
            };
        }
        case "moveCardFromBoard": {
            return {
                type: WEBHOOK_MOVE_CARD_FROM_BOARD,
                payload: {
                    card: data.card,
                    board: data.board,
                    targetBoard: data.boardTarget,
                    list: data.list,
                    member: data.member,
                }
            };
        }
        case "moveCardToBoard": {
            return {
                type: WEBHOOK_MOVE_CARD_TO_BOARD,
                payload: {
                    card: data.card,
                    board: data.board,
                    sourceBoard: data.boardSource,
                    list: data.list,
                }
            };
        }
        case "moveListFromBoard": {
            return {
                type: WEBHOOK_MOVE_LIST_FROM_BOARD,
                payload: {
                    list: data.card,
                    board: data.board,
                    targetBoard: data.boardTarget,
                    member: data.member,
                }
            };
        }
        case "moveListToBoard": {
            return {
                type: WEBHOOK_MOVE_LIST_TO_BOARD,
                payload: {
                    board: data.board,
                    sourceBoard: data.boardSource,
                    list: data.list,
                    member: data.member
                }
            };
        }
        case "removeLabelFromCard": {
            return {
                type: WEBHOOK_REMOVE_LABEL_FROM_CARD,
                payload: {
                    card: data.card,
                    board: data.board,
                    label: data.label
                }
            };
        }
        case "updateBoard": {
            return {
                type: WEBHOOK_UPDATE_BOARD,
                payload: {
                    old: data.old,
                    board: data.board,
                }
            }
        }
        case "updateCard": {
            return {
                type: WEBHOOK_UPDATE_CARD,
                payload: {
                    old: data.old,
                    card: data.card,
                    board: data.board,
                    list: data.list,
                }
            };
        }
        case "updateLabel": {
            return {
                type: WEBHOOK_UPDATE_LABEL,
                payload: {
                    old: data.old,
                    label: data.label,
                    board: data.board,
                }
            };
        }
        case "updateList": {
            return {
                type: WEBHOOK_UPDATE_LIST,
                payload: {
                    old: data.old,
                    list: data.list,
                    board: data.board,
                }
            };
        }
        default: {
            alert("Currently unsupported webhook action received, try refreshing page. Thank you for your understanding.");
            break;
        }
    }
};
