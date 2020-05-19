import axios from 'axios';
import store from '../store/index.js';
import _ from 'lodash';
import config from '../config.js';
import {
    FETCH_BOARDS_SUCCESS, FETCH_BOARDS_FAILURE, FETCH_LISTS_SUCCESS, FETCH_LISTS_FAILURE, FETCH_CARDS_SUCCESS,
    FETCH_CARDS_FAILURE, FETCH_LABELS_SUCCESS, FETCH_LABELS_FAILURE, CREATE_CUSTOM_LISTS,
    CARD_UPDATE, CARD_UPDATE_SUCCESS, CARD_UPDATE_FAILURE, CARD_CREATE, CARD_CREATE_SUCCESS, CARD_CREATE_FAILURE,
    CARD_ACTION_ARCHIVE, CARD_ACTION_ARCHIVE_SUCCESS, CARD_ACTION_ARCHIVE_FAILURE, CARD_ACTION_DELETE,
    CARD_ACTION_DELETE_SUCCESS, CARD_ACTION_DELETE_FAILURE, CARD_ACTION_COPY, CARD_ACTION_COPY_SUCCESS, CARD_ACTION_COPY_FAILURE,
    CUSTOM_LIST_MOVE, LIST_MOVE_SUCCESS, LIST_MOVE_FAILURE, LIST_CREATE, LIST_CREATE_SUCCESS, LIST_CREATE_FAILURE,
    LABEL_CREATE, LABEL_CREATE_SUCCESS, LABEL_CREATE_FAILURE, LABEL_EDIT, LABEL_EDIT_SUCCESS, LABEL_EDIT_FAILURE,
    SET_AUTH, REMOVE_AUTH, WEBHOOK_ADD_LABEL_TO_CARD, WEBHOOK_COPY_BOARD, WEBHOOK_COPY_CARD, WEBHOOK_CREATE_CARD,
    WEBHOOK_CREATE_LABEL, WEBHOOK_DELETE_CARD, WEBHOOK_DELETE_LABEL, WEBHOOK_MOVE_CARD_FROM_BOARD, WEBHOOK_MOVE_CARD_TO_BOARD,
    WEBHOOK_MOVE_LIST_FROM_BOARD, WEBHOOK_MOVE_LIST_TO_BOARD, FETCH_BOARD_SUCCESS,
    WEBHOOK_REMOVE_LABEL_FROM_CARD, WEBHOOK_UPDATE_BOARD, WEBHOOK_UPDATE_CARD, WEBHOOK_UPDATE_LABEL, WEBHOOK_UPDATE_LIST,
    SET_SELECTED_BOARDS, FETCH_CHECKLISTS_FAILURE, FETCH_CHECKLISTS_SUCCESS,
    CHECKLIST_UPDATE, CHECKLIST_UPDATE_SUCCESS, CHECKLIST_UPDATE_FAILURE, CHECKLIST_ITEM_UPDATE, CHECKLIST_ITEM_UPDATE_FAILURE, 
    CHECKLIST_ITEM_UPDATE_SUCCESS, CHECKLIST_ITEM_ADD, CHECKLIST_ITEM_ADD_SUCCESS, CHECKLIST_ITEM_ADD_FAILURE,
    CHECKLIST_REMOVE, CHECKLIST_REMOVE_FAILURE, CHECKLIST_REMOVE_SUCCESS, CHECKLIST_ITEM_REMOVE, CHECKLIST_ITEM_REMOVE_SUCCESS,
    CHECKLIST_ITEM_REMOVE_FAILURE, CHECKLIST_CREATE, CHECKLIST_CREATE_SUCCESS, CHECKLIST_CREATE_FAILURE,
    WEBHOOK_ADD_CHECKLIST_TO_CARD, WEBHOOK_DELETE_CHECKITEM,
    WEBHOOK_REMOVE_CHECKLIST_FROM_CARD, WEBHOOK_UPDATE_CHECKITEM, WEBHOOK_UPDATE_CHECKITEM_STATE_ON_CARD, WEBHOOK_UPDATE_CHECKLIST,
    FETCH_CHECKITEMS_FAILURE, FETCH_CHECKITEMS_SUCCESS, WEBHOOK_REMOVE_MEMBER_FROM_BOARD, LABEL_REMOVE, 
    LABEL_REMOVE_SUCCESS, LABEL_REMOVE_FAILURE, WEBHOOK_CREATE_CHECKITEM, WEBHOOK_CREATE_LIST,
    FETCH_CARD_SUCCESS, UPDATE_CHECKITEMS_SUCCESS, UPDATE_CHECKITEMS_FAILURE,
} from './actionTypes';
import { findPosition, sortCards } from '../api/index.js';


// Action based around user, invoked once, when page is loaded
export const actionFetchBoards = _.once(() => {
    const { member } = store.getState().authReducer;

    return (dispatch) => {
        window.Trello.get('/members/' + member.username + '/boards',
            (response) => dispatch({ type: FETCH_BOARDS_SUCCESS, payload: { response } })
            ,(error) => dispatch({ type: FETCH_BOARDS_FAILURE, payload: { error } }));
    };
});

export const actionFetchLists = _.once(() => {
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id) && !board.closed);

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(window.Trello.get('/boards/' + board.id + '/lists', {}));
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
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id) && !board.closed);

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(window.Trello.get('/boards/' + board.id + '/cards', {
            checklists: 'all',
            stickers: 'true',
        }));
    });

    return (dispatch) => {
        axios.all(promises)
            .then((response) => dispatch({ type: FETCH_CARDS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_CARDS_FAILURE, payload: { error } }));
    };
});

export const actionFetchLabels = _.once(() => {
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id) && !board.closed);

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(window.Trello.get('/boards/' + board.id + '/labels'));
    });

    return (dispatch) => {
        axios.all(promises)
            .then((response) => dispatch({ type: FETCH_LABELS_SUCCESS, payload: { response } }))
            .catch((error) => dispatch({ type: FETCH_LABELS_FAILURE, payload: { error } }));
    }
});

export const actionFetchChecklists = _.once(() => {
    const { boards, selectedBoardIds } = store.getState().dataReducer;
    const toFetch = boards.filter((board) => selectedBoardIds.includes(board.id) && !board.closed);

    let promises = [];

    toFetch.forEach((board) => {
        promises.push(window.Trello.get('/boards/' + board.id + '/checklists'));
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

export const actionCheckAndCreateWebhook = _.once(() => {
    const token = localStorage.getItem('trello_token');
    const { member } = store.getState().authReducer;
    const options = {
        callbackURL: config.webhookCallbackURL,
        description: 'Webhook for receiving updates - Multiboard for Trello',
        idModel: member.id,
    };

    return (dispatch) => {
        window.Trello.get('/tokens/' + token + '/webhooks',
            (response) => {
                const exists = response.find((webhook) => webhook.idModel === options.idModel && webhook.description === options.description && webhook.callbackURL === options.callbackURL);

                if (!exists) {
                    return window.Trello.post('/tokens/' + token + '/webhooks', options);
                }
            }, 
            (error) => {});
        }
});
//

// ABOVE IS DONE AND REWORKED

// Action based around cards
export const actionCardMove = (result) => {
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

            return window.Trello.post('/lists', { name: destination.droppableId, idBoard: cardToMove.idBoard, pos: listPos },
                (response) => {
                    dispatch({ type: CARD_UPDATE, payload: { card: cardToMove, data: { pos, idList: response.id } } });

                    dispatch(actionCardUpdate(cardToMove, { pos, idList: response.id }))
                },
                (error) => dispatch({ type: CARD_UPDATE_FAILURE, payload: { card: cardToMove, error } }));
        };
    };
};

export const actionCardUpdate = (card, data, updateLocally = false, dataToUpdateOnlyLocally = {}) => {
    return (dispatch) => {
        if (updateLocally) {
            store.dispatch({ type: CARD_UPDATE, payload: { card, data: { ...data, ...dataToUpdateOnlyLocally } } });
        }

        return window.Trello.put('/cards/' + card.id, { ...data },
            (response) => dispatch({ type: CARD_UPDATE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CARD_UPDATE_FAILURE, payload: { card, error } }));
    };
};

export const actionCardCreate = (name, listName, idBoard, recursive = false) => {
    const { cards, lists } = store.getState().dataReducer;

    const list = lists.find((list) => list.name === listName && list.idBoard === idBoard);
    if (!list) {
        if (!recursive) {
            return (dispatch) => {
                const listsOnBoard = lists.filter((list) => list.idBoard === idBoard);
                const pos = findPosition(0, listsOnBoard.length, listsOnBoard);

                return window.Trello.post('/lists', { name: listName, idBoard, pos },
                    (response) => { dispatch({ type: LIST_CREATE_SUCCESS, payload: { data: response } }); dispatch(actionCardCreate(name, listName, idBoard, true)); },
                    (error) => dispatch({ type: LIST_CREATE_FAILURE, payload: { error, listName } }));
            }
        } else {
            return;
        }
    }
    const cardsInList = cards.filter((card) => card.idList === list.id);

    const pos = findPosition(0, cardsInList.length, cardsInList);
    const id = Math.random().toString(36).substr(2, 9);

    return (dispatch) => {
        store.dispatch({ type: CARD_CREATE, payload: { data: { id, name, idList: list.id, idBoard, pos, labels: [] } } });

        return window.Trello.post('/cards', { name, pos, idList: list.id },
            (response) => dispatch({ type: CARD_CREATE_SUCCESS, payload: { card: response, id } }),
            (error) => dispatch({ type: CARD_CREATE_FAILURE, payload: { error, id } }));
    }
};

export const actionCardActionArchive = (card) => {
    return (dispatch) => {
        store.dispatch({ type: CARD_ACTION_ARCHIVE, payload: { card } });

        return window.Trello.put('/cards/' + card.id, { closed: true },
            (response) => dispatch({ type: CARD_ACTION_ARCHIVE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CARD_ACTION_ARCHIVE_FAILURE, payload: { error, card } }));
    }
};

export const actionCardActionDelete = (card) => {
    return (dispatch) => {
        store.dispatch({ type: CARD_ACTION_DELETE, payload: { card } });

        return window.Trello.delete('/cards/' + card.id,
            (response) => dispatch({ type: CARD_ACTION_DELETE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CARD_ACTION_DELETE_FAILURE, payload: { error, card } }));
    };
};

export const actionCardActionMove = (card, idBoard, idList, index, sourceIndex) => {
    const { cards, lists } = store.getState().dataReducer;

    const listName = lists.find((list) => list.id === idList).name;
    const listsIds = lists.filter((list) => list.name === listName).map((list) => list.id);
    const cardsInList = cards.filter((c) => listsIds.includes(c.idList));

    const pos = findPosition(sourceIndex, index - 1, cardsInList);

    return (dispatch) => {
        store.dispatch({ type: CARD_UPDATE, payload: { card, data: { idBoard, idList, pos } } });

        return window.Trello.put('/cards/' + card.id, { idBoard, idList, pos },
            (response) => dispatch({ type: CARD_UPDATE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CARD_UPDATE_FAILURE, payload: { error, card } }));
    };
};

export const actionCardActionCopy = (card, name, idBoard, idList, index, sourceIndex) => {
    const { cards, lists } = store.getState().dataReducer;

    if (name === '') {
        name = card.name;
    }

    const listName = lists.find((list) => list.id === idList).name;
    const listIds = lists.filter((list) => list.name === listName).map((list) => list.id);
    const cardsInList = cards.filter((c) => listIds.includes(c.idList));

    const pos = findPosition(sourceIndex, index - 1, cardsInList);

    return (dispatch) => {
        store.dispatch({ type: CARD_ACTION_COPY, payload: { card, data: { name, idBoard, idList, pos } } });

        return window.Trello.post('/cards', { idList, name, desc: card.desc, pos, idCardSource: card.id },
            (response) => dispatch({ type: CARD_ACTION_COPY_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CARD_ACTION_COPY_FAILURE, payload: { error, card } }));
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
            if (listToUpdate) {
                const pos = findPosition(source.index, destination.index, listsOnBoard);
                store.dispatch(actionListUpdate(listToUpdate, { pos }));
            }
        });
    };
};

export const actionListUpdate = (listToUpdate, data) => {
    return (dispatch) => {
        window.Trello.put('/lists/' + listToUpdate.id, { ...data },
            (response) => dispatch({ type: LIST_MOVE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: LIST_MOVE_FAILURE, payload: { list: listToUpdate, error } }));
    };
};

export const actionListCreate = (name) => {
    let { boards, lists } = store.getState().dataReducer;

    return (dispatch) => {
        store.dispatch({ type: LIST_CREATE, payload: { data: { name } } });

        boards.forEach((board) => {
            const listsOnBoard = lists.filter((list) => list.idBoard === board.id);
            const pos = findPosition(0, listsOnBoard.length, listsOnBoard);

            window.Trello.post('/lists', { name, idBoard: board.id, pos },
                (response) => dispatch({ type: LIST_CREATE_SUCCESS, payload: { data: response } }),
                (error) => dispatch({ type: LIST_CREATE_FAILURE, payload: { error, name } }));
        });
    };
};
//

// Actions based around labels
export const actionLabelCreate = (data) => {
    const id = Math.random().toString(36).substr(2, 9);
    return (dispatch) => {
        store.dispatch({ type: LABEL_CREATE, payload: { data: { ...data, id } } });

        return window.Trello.post('/labels',  { ...data },
            (response) => dispatch({ type: LABEL_CREATE_SUCCESS, payload: { data: response, id } }),
            (error) => dispatch({ type: LABEL_CREATE_FAILURE, payload: { error, id } }));
    };
};

export const actionLabelEdit = (label, data) => {
    return (dispatch) => {
        store.dispatch({ type: LABEL_EDIT, payload: { label, data } });

        return window.Trello.put('/labels/' + label.id, { ...data },
            (response) => dispatch({ type: LABEL_EDIT_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: LABEL_EDIT_FAILURE, payload: { error, label } }));
    }
};

export const actionLabelRemove = (label) => {
    return (dispatch) => {
        store.dispatch({ type: LABEL_REMOVE, payload: { label } });

        return window.Trello.delete('/labels/' + label.id,
            (response) => dispatch({ type: LABEL_REMOVE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: LABEL_REMOVE_FAILURE, payload: { error, label } }));
    }
}
//

// Actions based around checklists
export const actionChecklistCreate = (card, name, copyFrom) => {
    const id = Math.random().toString(36).substr(2, 9);
    const params = { name };

    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_CREATE, payload: { card, copyFrom, data: { id, name, idCard: card.id, idBoard: card.idBoard, checkItems: [] }  }});
        if (copyFrom !== 0){
            params.idChecklistSource = copyFrom;
        }

        return window.Trello.post('/cards/' + card.id + '/checklists', params,
            (response) => dispatch({ type: CHECKLIST_CREATE_SUCCESS, payload: { data: response, id } }),
            (error) => dispatch({ type: CHECKLIST_CREATE_FAILURE, payload: { error, card, id } }));
    };
};


export const actionChecklistUpdate = (checklist, data) => {
    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_UPDATE, payload: { checklist, data } });

        return window.Trello.put('/checklists/' + checklist.id, { ...data },
            (response) => dispatch({ type: CHECKLIST_UPDATE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CHECKLIST_UPDATE_FAILURE, payload: { error, checklist } }));
    }
};

export const actionChecklistItemUpdate = (checklist, item, data) => {
    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_ITEM_UPDATE, payload: { checklist, item, data } });

        return window.Trello.put('/cards/' + checklist.idCard + '/checkItem/' + item.id, { ...data },
            (response) => dispatch({ type: CHECKLIST_ITEM_UPDATE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CHECKLIST_ITEM_UPDATE_FAILURE, payload: { error, checklist, item } }));
    }
};

export const actionChecklistItemAdd = (checklist, name) => {
    const id = Math.random().toString(36).substr(2, 9);

    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_ITEM_ADD, payload: { data: { id, name, idChecklist: checklist.id } } });

        return window.Trello.post('/checklists/' + checklist.id + '/checkItems', { name },
            (response) => dispatch({ type: CHECKLIST_ITEM_ADD_SUCCESS, payload: { data: response, id } }),
            (error) => dispatch({ type: CHECKLIST_ITEM_ADD_FAILURE, payload: { error, id, idChecklist: checklist.id } }));
    };
};

export const actionChecklistRemove = (checklist) => {
    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_REMOVE, payload: { checklist }});

        return window.Trello.delete('/checklists/' + checklist.id,
            (response) => dispatch({ type: CHECKLIST_REMOVE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CHECKLIST_REMOVE_FAILURE, payload: { error, checklist } }));
    };
};

export const actionChecklistItemConvert = (checklist, item) => {
    const { cards, lists } = store.getState().dataReducer;

    const card = cards.find((c) => c.id === checklist.idCard);
    const list = lists.find((l) => l.id === card.idList);
    
    return (dispatch) => {
        dispatch(actionChecklistItemRemove(checklist, item));

        return dispatch(actionCardCreate(item.name, list.name, checklist.idBoard));
    };
};

export const actionChecklistItemRemove = (checklist, item) => {
    return (dispatch) => {
        store.dispatch({ type: CHECKLIST_ITEM_REMOVE, payload: { checklist, item }});

        return window.Trello.delete('/checklists/' + checklist.id + '/checkItems/' + item.id,
            (response) => dispatch({ type: CHECKLIST_ITEM_REMOVE_SUCCESS, payload: { response } }),
            (error) => dispatch({ type: CHECKLIST_ITEM_REMOVE_FAILURE, payload: { error, checklist, item } }));
    }
};
//

// Actions based around authentication
export const actionSetAuth = (member) => {
    return {
        type: SET_AUTH,
        payload: {
            member
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
        case "addChecklistToCard": {
            return {
                type: WEBHOOK_ADD_CHECKLIST_TO_CARD,
                payload: {
                    card: data.card,
                    checklist: data.checklist,
                    board: data.board,
                }
            }
        }
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
        case "convertToCardFromCheckItem": {
            const { card, checklist } = data;
            
            
            return (dispatch) => {
                window.Trello.get('/cards/' + card.id,
                    (response) => dispatch({ type: FETCH_CARD_SUCCESS, payload: { data: response } }),
                    (error) => dispatch({ type: FETCH_CARDS_FAILURE, payload: { error } }));

                return window.Trello.get('/checklists/' + checklist.id,
                    (response) => dispatch({ type: UPDATE_CHECKITEMS_SUCCESS, payload: { data: response } }),
                    (error) => dispatch({ type: UPDATE_CHECKITEMS_FAILURE, payload: { error } }));
            }
            
        }
        case "copyBoard": {
            // Same as createBoard
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
        case "copyChecklist": {
            const { checklist } = data;
            
            
            return (dispatch) => {
                return window.Trello.get('/checklists/' + checklist.id + '/checkItems',
                    (response) => dispatch({ type: FETCH_CHECKITEMS_SUCCESS, payload: { checklist, data: response } }),
                    (error) => dispatch({ type: FETCH_CHECKITEMS_FAILURE, payload: { error } }));
            }
        }
        case "createLabel": {
            return {
                type: WEBHOOK_CREATE_LABEL,
                payload: {
                    label: data.label,
                    board: data.board,
                }
            };
        }
        case "createBoard": {
            // dispatch action for receiving board, its list and cards,
            const { board } = data;

            return (dispatch) => {
                store.dispatch(actionFetchLists([board.id]));
                store.dispatch(actionFetchCards([board.id]));
                store.dispatch(actionFetchLabels([board.id]));
                store.dispatch(actionFetchChecklists([board.id]));

                return window.Trello.get('/boards/' + board.id,
                    (response) => dispatch({ type: FETCH_BOARD_SUCCESS, payload: { board: response } }),
                    (error) => dispatch({ type: FETCH_BOARDS_FAILURE, payload: { error } }));
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
        case "createCheckItem": {
            return {
                type: WEBHOOK_CREATE_CHECKITEM,
                payload: {
                    card: data.card,
                    board: data.board,
                    checklist: data.checklist,
                    checkItem: data.checkItem 
                }
            }
        }
        case "createList": {
            return {
                type: WEBHOOK_CREATE_LIST,
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
        case "deleteCheckItem": {
            return {
                type: WEBHOOK_DELETE_CHECKITEM,
                payload: {
                    board: data.board,
                    card: data.card,
                    checklist: data.checklist,
                    checkItem: data.checkItem
                }
            }
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
        case "removeChecklistFromCard": {
            return {
                type: WEBHOOK_REMOVE_CHECKLIST_FROM_CARD,
                payload: {
                    card: data.card,
                    board: data.board,
                    checklist: data.checklist
                }
            }
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
        case "removeMemberFromBoard": {
            return {
                type: WEBHOOK_REMOVE_MEMBER_FROM_BOARD,
                payload: {
                    board: data.board,
                    memberCreator: data.memberCreator
                }
            }
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
        case "updateCheckItem": {
            return {
                type: WEBHOOK_UPDATE_CHECKITEM,
                payload: {
                    board: data.board,
                    card: data.card,
                    checklist: data.checklist,
                    checkItem: data.checkItem,
                    old: data.old
                }
            }
        }
        case "updateCheckItemStateOnCard": {
            return {
                type: WEBHOOK_UPDATE_CHECKITEM_STATE_ON_CARD,
                payload: {
                    board: data.board,
                    card: data.card,
                    checklist: data.checklist,
                    checkItem: data.checkItem 
                }
            }
        }
        case "updateChecklist": {
            return {
                type: WEBHOOK_UPDATE_CHECKLIST,
                payload: {
                    board: data.board,
                    card: data.card,
                    checklist: data.checklist,
                    old: data.old
                }
            }
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
