import {
    FETCH_BOARDS_SUCCESS, FETCH_BOARDS_FAILURE, FETCH_BOARD_SUCCESS, FETCH_BOARD_FAILURE, FETCH_LISTS_SUCCESS,
    FETCH_LISTS_FAILURE, FETCH_CARDS_SUCCESS,
    FETCH_CARDS_FAILURE, FETCH_LABELS_SUCCESS, FETCH_LABELS_FAILURE, CREATE_CUSTOM_LISTS, USER_RECEIVED_FAILURE,
    CARD_UPDATE, CARD_UPDATE_SUCCESS, CARD_UPDATE_FAILURE, CARD_CREATE, CARD_CREATE_SUCCESS, CARD_CREATE_FAILURE,
    CARD_ACTION_ARCHIVE, CARD_ACTION_ARCHIVE_SUCCESS, CARD_ACTION_ARCHIVE_FAILURE, CARD_ACTION_DELETE,
    CARD_ACTION_DELETE_SUCCESS, CARD_ACTION_DELETE_FAILURE, CARD_ACTION_COPY, CARD_ACTION_COPY_SUCCESS,
    CARD_ACTION_COPY_FAILURE, CUSTOM_LIST_MOVE, LIST_MOVE_SUCCESS, LIST_MOVE_FAILURE, LIST_CREATE, LIST_CREATE_SUCCESS,
    LIST_CREATE_FAILURE, LABEL_CREATE, LABEL_CREATE_SUCCESS, LABEL_CREATE_FAILURE, LABEL_EDIT, LABEL_EDIT_SUCCESS,
    LABEL_EDIT_FAILURE, WEBHOOK_ADD_LABEL_TO_CARD, WEBHOOK_COPY_BOARD, WEBHOOK_COPY_CARD, WEBHOOK_CREATE_BOARD, WEBHOOK_CREATE_CARD,
    WEBHOOK_CREATE_LABEL, WEBHOOK_DELETE_CARD, WEBHOOK_DELETE_LABEL, WEBHOOK_MOVE_CARD_FROM_BOARD, WEBHOOK_MOVE_CARD_TO_BOARD,
    WEBHOOK_MOVE_LIST_FROM_BOARD, WEBHOOK_MOVE_LIST_TO_BOARD, WEBHOOK_REMOVE_LABEL_FROM_CARD, WEBHOOK_UPDATE_BOARD,
    WEBHOOK_UPDATE_CARD, WEBHOOK_UPDATE_LABEL, WEBHOOK_UPDATE_LIST, WEBHOOK_CREATE_LIST, USER_RECEIVED, SET_SELECTED_BOARDS,
    FETCH_CHECKLISTS_SUCCESS, FETCH_CHECKLISTS_FAILURE, CHECKLIST_UPDATE, CHECKLIST_UPDATE_FAILURE, CHECKLIST_UPDATE_SUCCESS,
} from '../actions/actionTypes';


const initialState = {
    boardsReceived: false,
    cardsReceived: false,
    listsReceived: false,
    customListsCreated: false,

    fetchFailed: false,

    member: null,

    boards: [],
    cards: [],
    checklists: [],
    customLists: [],
    labels: [],
    lists: [],

    archivedCards: [],
    archivedLists: [],
    archivedCustomLists: [],

    selectedBoardIds: [],
};

class customList {
    constructor(name, index) {
        this.index = index;
        this.name = name;
    }
};

const getUniqueListsNames = (lists) => {
    return [...new Set(lists.map(list => list.name))];
};


const dataReducer = (state = initialState, action) => {
    const payload = action.payload;

    switch (action.type) {
        case FETCH_BOARDS_SUCCESS: {
            const { response } = payload;

            const boards = [...response.data];
            const selectedBoardIds = boards.map((board) => board.id);
            
            return {
                ...state,
                boards,
                selectedBoardIds,
                boardsReceived: true
            }
        }

        case SET_SELECTED_BOARDS: {
            const { selectedBoardIds } = payload;
            
            return {
                ...state,
                selectedBoardIds,
            };
        }

        case FETCH_BOARDS_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's boards: " + error);

            return state;
        }

        case FETCH_BOARD_SUCCESS: {
            const { board } = payload;

            const boards = [...state.boards];

            boards = board.concat(board);

            return {
                ...state,
                boards
            };
        }

        case FETCH_BOARD_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's board: " + error);

            return state;
        }

        case FETCH_LISTS_SUCCESS: {
            const { response } = payload;
            let lists = [...state.lists];
            // Putting all lists from different boards to one array
            response.forEach(({ data }) => {
                lists = lists.concat(data);
            });

            return {
                ...state,
                lists,
                listsReceived: true,
            };
        }

        case FETCH_LISTS_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's lists: " + error);

            return {
                ...state,
                fetchFailed: true,
            };
        }

        case FETCH_CARDS_SUCCESS: {
            const { response } = payload;
            let cards = [...state.cards];
            // Putting all cards from different boards to one array
            response.forEach(({ data }) => {
                cards = cards.concat(data);
            });

            return {
                ...state,
                cards,
                cardsReceived: true,
            }
        }

        case FETCH_CARDS_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's cards: " + error);

            return {
                ...state,
                fetchFailed: true,
            };
        }

        case FETCH_LABELS_SUCCESS: {
            const { response } = payload;
            let labels = [...state.labels];
            // Putting all labels from different boards to one array
            response.forEach(({ data }) => {
                labels = labels.concat(data);
            });

            return {
                ...state,
                labels
            };
        }

        case FETCH_LABELS_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's labels: " + error);

            return {
                ...state,
                fetchFailed: true,
            };
        }

        case FETCH_CHECKLISTS_SUCCESS: {
            const { response } = payload;
            let checklists = [...state.checklists];

            response.forEach(({ data }) => {
                checklists = checklists.concat(data);
            });
            
            return {
                ...state,
                checklists,
            };
        }

        case FETCH_CHECKLISTS_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's checklists: " + error);

            return {
                ...state,
                fetchFailed: true,
            };
        }

        case CREATE_CUSTOM_LISTS: {
            const customLists = [...state.customLists];
            const lists = state.lists.filter((l) => !l.closed);
            const listsNames = getUniqueListsNames(lists);

            listsNames.forEach((name, index) => {
                customLists.push(new customList(name, index));
            });

            return {
                ...state,
                customLists,
                customListsCreated: true,
            };
        }

        case USER_RECEIVED: {
            const { user } = payload;

            return {
                ...state,
                member: user,
            };
        }

        case USER_RECEIVED_FAILURE: {
            const { error } = payload;
            console.log("Error occurred while receiving user's data: " + error);

            return {
                ...state,
                fetchFailed: true,
            };
        }

        case CARD_UPDATE: {
            const { card, data } = payload;

            const cards = [...state.cards];

            const cardToUpdate = cards.find((c) => c.id === card.id);
            if (cardToUpdate) {
                const index = cards.indexOf(cardToUpdate);
                cards[index] = { ...cardToUpdate, ...data };
            }

            return {
                ...state,
                cards,
            };
        }

        case CARD_UPDATE_SUCCESS: {
            return state;
        }

        case CARD_UPDATE_FAILURE: {
            const { card, error } = payload;

            const cards = [...state.cards];

            cards.map((c) => (c.id === card.id) ? card : c);

            return {
                ...state,
                cards,
            };
        }

        case CARD_CREATE: {
            const { data } = payload;

            const cards = [...state.cards];

            const newCard = { ...data }

            cards.push(newCard);

            return {
                ...state,
                cards,
            };
        }

        case CARD_CREATE_SUCCESS: {
            const { card, id } = payload;

            const cards = [...state.cards];

            const cardToUpdate = cards.find((c) => c.id === id);
            if (cardToUpdate) {
                const index = cards.indexOf(cardToUpdate);
                cards[index] = { ...cardToUpdate, ...card };
            }

            return {
                ...state,
                cards
            };
        }

        case CARD_CREATE_FAILURE: {
            const { error, id } = payload;

            const cards = [...state.cards];

            const card = cards.find((c) => c.id === id);
            const index = cards.indexOf(card);

            cards.splice(index, 1);

            return {
                ...state,
                cards,
            };
        }

        case CUSTOM_LIST_MOVE: {
            const { list, result } = payload;
            const { source, destination } = result;

            const customLists = [...state.customLists];

            customLists.splice(source.index, 1);
            customLists.splice(destination.index, 0, list);

            return {
                ...state,
                customLists
            };
        }

        case LIST_MOVE_SUCCESS: {
            return state;
        }

        case LIST_MOVE_FAILURE: {
            return state;
        }

        case CARD_ACTION_ARCHIVE: {
            const { card } = payload;

            const archivedCards = [...state.archivedCards];
            const cards = [...state.cards];

            cards.filter((c) => c.id !== card.id);

            archivedCards.push(card);

            return {
                ...state,
                archivedCards,
                cards,
            };
        }

        case CARD_ACTION_ARCHIVE_SUCCESS: {
            return state;
        }

        case CARD_ACTION_ARCHIVE_FAILURE: {
            return state;
        }

        case CARD_ACTION_DELETE: {
            const { card } = payload;

            const cards = [...state.cards];

            cards.filter((c) => c.id !== card.id);

            return {
                ...state,
                cards,
            };
        }

        case CARD_ACTION_DELETE_SUCCESS: {
            return state;
        }

        case CARD_ACTION_DELETE_FAILURE: {
            return state;
        }


        case CARD_ACTION_COPY: {
            const { card, data } = payload;

            const cards = [...state.cards];

            const newCard = { ...card, ...data };
            newCard.id = Math.random().toString(36).substr(2, 9);

            cards.push(newCard);

            return {
                ...state,
                cards,
            };
        }

        case CARD_ACTION_COPY_SUCCESS: {
            return state;
        }

        case CARD_ACTION_COPY_FAILURE: {
            return state;
        }

        case LIST_CREATE: {
            const { data } = payload;

            const customLists = [...state.customLists];

            const newList = new customList(data.name, customLists.length);
            customLists.push(newList);

            return {
                ...state,
                customLists,
            };
        }

        case LIST_CREATE_SUCCESS: {
            const { data } = payload;

            const lists = [...state.lists];

            lists.push(data);

            return {
                ...state,
                lists,
            };
        }

        case LIST_CREATE_FAILURE: {
            return state;
        }

        case LABEL_CREATE: {
            const { data } = payload;

            const labels = [...state.labels];

            const newLabel = { ...data };
            labels.push(newLabel);

            return {
                ...state,
                labels,
            };
        }

        case LABEL_CREATE_SUCCESS: {
            const { data, id } = payload;

            const labels = [...state.labels];

            const labelToUpdate = labels.find((label) => label.id === id);
            if (labelToUpdate) {
                const index = labels.indexOf(labelToUpdate);
                labels[index] = { ...labelToUpdate, ...data };
            }

            return {
                ...state,
                labels,
            };
        }

        case LABEL_CREATE_FAILURE: {
            const { error, id } = payload;

            const labels = [...state.labels];

            const label = labels.find((l) => l.id === id);
            if (label) {
                const index = labels.indexOf(label);
                labels.splice(index, 1);
            }

            return {
                ...state,
                labels,
            };
        }

        case LABEL_EDIT: {
            const { label, data } = payload;

            const labels = [...state.labels];

            const index = labels.indexOf(label);
            labels[index] = { ...label, ...data };

            return {
                ...state,
                labels,
            };
        }

        case LABEL_EDIT_SUCCESS: {
            return state;
        }

        case LABEL_EDIT_FAILURE: {
            return state;
        }

        case CHECKLIST_UPDATE: {
            const { checklist, data } = payload;

            const checklists = [...state.checklists];

            const index = checklists.indexOf(checklist);
            checklists[index] = { ...checklist, ...data };

            console.log(checklists[index]);

            return {
                ...state,
                checklists,
            };
        }

        case CHECKLIST_UPDATE_SUCCESS: {
            return state;
        }

        case CHECKLIST_UPDATE_FAILURE: {
            return state;
        }

        // Webhook functions
        case WEBHOOK_ADD_LABEL_TO_CARD: {
            const { card, label, board } = payload;

            const cards = [...state.cards];

            cards.map((c) => {
                if (c.id === card.id) {
                    c.labels.push({ ...label, idBoard: board.id });
                    c.idLabels.push(label.id);
                }
            });

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_COPY_CARD: {
            const { card, board, list, sourceCard } = payload;

            const cards = [...state.cards];

            cards.map((c) => {
                if (c.id === card.id) {
                    const cardToCopy = { ...c, id: card.id, name: card.name };
                    cards.push(cardToCopy);
                }
            });

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_CREATE_LABEL: {
            const { label, board } = payload;

            const labels = [...state.labels];

            labels.push({ ...label, idBoard: board.id });

            return {
                ...state,
                labels
            };
        }

        case WEBHOOK_CREATE_LIST: {
            const { list, board } = payload;

            const lists = [...state.lists];
            const customLists = [...state.customLists];

            lists.push({ ...list, idBoard: board.id });

            const listExist = customLists.find((l) => l.name === list.name);
            if (!listExist) {
                customLists.push(new customList(list.name, customLists.length));
            }

            return {
                ...state,
                lists,
                customLists
            };
        }

        case WEBHOOK_CREATE_CARD: {
            const { card, list, board } = payload;

            const cards = [...state.cards];

            cards.push({ id: card.id, name: card.name, idList: list.id, idBoard: board.id, labels: [], idLabels: [] });

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_UPDATE_CARD: {
            const { old, card, list, board } = payload;

            const cards = [...state.cards];

            cards.map((c) => {
                if (c.id === card.id) {
                    Object.keys(old).forEach((key) => {
                        c[key] = card[key];
                    });
                }
            });

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_DELETE_CARD: {
            const { card, list, board } = payload;

            const cards = [...state.cards];

            const cardToRemove = cards.find((c) => c.id === card.id);
            if (cardToRemove) {
                const index = cards.indexOf(cardToRemove);
                cards.splice(index, 1);
            }

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_DELETE_LABEL: {
            const { label, board } = payload;

            const labels = [...state.labels];

            const labelToRemove = labels.find((l) => l.id === label.id);
            if (labelToRemove) {
                const index = labels.indexOf(labelToRemove);
                labels.splice(index, 1);
            }

            return {
                ...state,
                labels
            };
        }

        case WEBHOOK_MOVE_CARD_TO_BOARD: {
            const { card, board, sourceBoard, list } = payload;

            const cards = [...state.cards];

            cards.map((c) => {
                if (c.id === card.id) {
                    c = { ...c, idBoard: board.id };
                }
            });

            return {
                ...state,
                cards
            }
        }

        case WEBHOOK_MOVE_CARD_FROM_BOARD: {
            return state;
        }

        case WEBHOOK_MOVE_LIST_TO_BOARD: {
            const { list, board, sourceBoard, member } = payload;

            const lists = [...state.lists];

            lists.map((l) => {
                if (l.id === list.id) {
                    l = { ...l, idBoard: board.id };
                }
            });

            return {
                ...state,
                lists
            };
        }

        case WEBHOOK_MOVE_LIST_FROM_BOARD: {
            return state;
        }

        case WEBHOOK_REMOVE_LABEL_FROM_CARD: {
            const { card, board, label } = payload;

            const cards = [...state.cards];

            cards.map((c) => {
                if (c.id === card.id) {
                    const labelToRemove = c.labels.find((l) => l.id === label.id);
                    if (labelToRemove) {
                        const index = c.labels.indexOf(labelToRemove);
                        c.labels.splice(index, 1);
                    }

                    const indexId = c.idLabels.indexOf(label.id);
                    c.idLabels.splice(indexId, 1);
                }
            });

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_UPDATE_BOARD: {
            const { old, board } = payload;

            const boards = [...state.boards];

            boards.map((b) => {
                if (b.id === board.id) {
                    Object.keys(old).forEach((key) => {
                        b[key] = board[key];
                    });
                }
            });

            return {
                ...state,
                boards
            };
        }

        case WEBHOOK_UPDATE_LABEL: {
            const { old, label, board } = payload;

            const cards = [...state.cards];
            const labels = [...state.labels];

            labels.map((l) => {
                if (l.id === label.id) {
                    Object.keys(old).forEach((key) => {
                        l[key] = label[key];
                    });
                }
            });

            cards.map((c) => {
                if (c.idLabels.includes(label.id)) {
                    c.label.map((l) => {
                        if (l.id === label.id) {
                            Object.keys(old).forEach((key) => {
                                l[key] = label[key];
                            });
                        }
                    });
                }
            })

            return {
                ...state,
                cards,
                labels
            };
        }

        case WEBHOOK_UPDATE_LIST: {
            const { old, list, board } = payload;

            const lists = [...state.lists];
            const customLists = [...state.customLists];

            // Archiving list
            if (Object.keys(old).includes('closed')) {
                const listWithSameName = lists.find((l) => l.name === list.name);
                if (!listWithSameName) {
                    const listToRemove = customLists.find((l) => l.name === list.name);
                    customLists.splice(listToRemove.index, 1);
                }
                // Renaming list
            } else if (Object.keys(old).includes('name')) {
                const listWithNewName = lists.find((l) => l.name === list.name);
                if (!listWithNewName) {
                    // List with new name doesn't exits
                    const listWithOldName = lists.find((l) => l.name === old.name && l.id !== list.id);
                    if (listWithOldName) {
                        // List with old name other than one being renamed exists, creating new custom list with new name
                        customLists.push(new customList(list.name, customLists.length));
                    } else {
                        // List with old name other than one being renamed doesn't exist, renaming existing custom list
                        const listToUpdate = customLists.find((l) => l.name === old.name);
                        customLists[listToUpdate.index] = { ...listToUpdate, name: list.name };
                    }
                } else {
                    // List with new name exits, removing custom list with old name
                    const listToRemove = customLists.find((l) => l.name === old.name);
                    customLists.splice(listToRemove.index, 1);
                }
            }

            lists.map((l) => {
                if (l.id === list.id) {
                    Object.keys(old).forEach((key) => {
                        l[key] = list[key];
                    });
                }
            });

            return {
                ...state,
                customLists,
                lists
            };
        }

        case WEBHOOK_CREATE_BOARD: {
            return state;
        }

        case WEBHOOK_COPY_BOARD: {
            return state;
        }

        default: {
            return state;
        }
    };
}

export default dataReducer;
