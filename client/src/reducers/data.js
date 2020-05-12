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
    CHECKLIST_ITEM_UPDATE, CHECKLIST_ITEM_UPDATE_FAILURE, CHECKLIST_ITEM_UPDATE_SUCCESS, CHECKLIST_ITEM_ADD,
    CHECKLIST_ITEM_ADD_SUCCESS, CHECKLIST_ITEM_ADD_FAILURE, CHECKLIST_REMOVE, CHECKLIST_REMOVE_FAILURE, 
    CHECKLIST_REMOVE_SUCCESS, CHECKLIST_ITEM_REMOVE, CHECKLIST_ITEM_REMOVE_SUCCESS, CHECKLIST_ITEM_REMOVE_FAILURE,
    CHECKLIST_CREATE, CHECKLIST_CREATE_SUCCESS, CHECKLIST_CREATE_FAILURE, WEBHOOK_ADD_CHECKLIST_TO_CARD, WEBHOOK_CONVERT_CHECKITEM_TO_CARD,
    WEBHOOK_DELETE_CHECKITEM, WEBHOOK_COPY_CHECKLIST, WEBHOOK_REMOVE_CHECKLIST_FROM_CARD, 
    WEBHOOK_UPDATE_CHECKITEM, WEBHOOK_UPDATE_CHECKITEM_STATE_ON_CARD, WEBHOOK_UPDATE_CHECKLIST,
    FETCH_CHECKITEMS_FAILURE, FETCH_CHECKITEMS_SUCCESS, WEBHOOK_REMOVE_MEMBER_FROM_BOARD,
    LABEL_REMOVE, LABEL_REMOVE_SUCCESS, LABEL_REMOVE_FAILURE, WEBHOOK_CREATE_CHECKITEM,
    FETCH_CARD_SUCCESS, FETCH_CARD_FAILURE, UPDATE_CHECKITEMS_SUCCESS, UPDATE_CHECKITEMS_FAILURE,
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
    constructor(name) {
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
            let selectedBoardIds = [...state.selectedBoardIds];

            if (selectedBoardIds.length === 0) {
                selectedBoardIds = boards.map((board) => board.id);
            }

            return {
                ...state,
                boards,
                boardsReceived: true,
                selectedBoardIds,
            }
        }

        case SET_SELECTED_BOARDS: {
            const { selectedBoardIds } = payload;

            let boardIds = [...state.selectedBoardIds];
            const boards = [...state.boards];

            if (selectedBoardIds.length === 0){
                boardIds = boards.map((board) => board.id);
            }

            return {
                ...state,
                selectedBoardIds: boardIds,
            };
        }

        case FETCH_BOARDS_FAILURE: {
            const { error } = payload;
            console.log("Error ocurred while receiving user's boards: " + error);

            return state;
        }

        case FETCH_BOARD_SUCCESS: {
            const { board } = payload;

            let boards = [...state.boards];

            boards = boards.concat(board);

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

            listsNames.forEach((name) => {
                customLists.push(new customList(name));
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

            const index = cards.indexOf(card);
            cards.splice(index, 1);

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

            const index = cards.indexOf(card);
            cards.splice(index, 1);

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

        case LABEL_REMOVE: {
            const { label } = payload;

            const labels = [...state.labels];
            const cards = [...state.cards];

            let index = labels.indexOf(label);
            labels.splice(index, 1);

            cards.map((card) => {
                if (card.idLabels.includes(label.id)) {
                    index = card.idLabels.indexOf(label.id);
                    card.idLabels.splice(index, 1);
                }
                if (card.labels.includes(label)) {
                    index = card.labels.indexOf(label);
                    card.labels.splice(index, 1);
                }
            });

            return {
                ...state,
                cards,
                labels,
            }
        }

        case LABEL_REMOVE_SUCCESS: {
            return state;
        }

        case LABEL_REMOVE_FAILURE: {
            return state;
        }

        case CHECKLIST_UPDATE: {
            const { checklist, data } = payload;

            const checklists = [...state.checklists];

            const index = checklists.indexOf(checklist);
            checklists[index] = { ...checklist, ...data };


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

        case CHECKLIST_CREATE: {
            const { card, copyFrom, data } = payload;

            const checklists = [...state.checklists];

            let newList = { ...data };
            if (copyFrom !== 0){
                const sourceList = checklists.find((l) => l.id === copyFrom);
                const checkItems = [];
                sourceList.checkItems.forEach((item, index) => {
                    checkItems.push({ name: item.name, state: "incomplete", id: "item-" + index });
                });
                newList = { ...newList, checkItems };
            }
            checklists.push(newList);

            return {
                ...state,
                checklists
            }
        }
         
        case CHECKLIST_CREATE_SUCCESS: {
            const { data, id } = payload;

            const checklists = [...state.checklists];

            const listToUpdate = checklists.find((list) => list.id === id);
            if (listToUpdate) {
                const index = checklists.indexOf(listToUpdate);
                checklists[index] = { ...listToUpdate, ...data };
            }

            return {
                ...state,
                checklists
            }
        }
        
        case CHECKLIST_CREATE_FAILURE: {
            const { card, error, id } = payload;

            const checklists = [...state.checklists];

            return {
                ...state,
                checklists
            }
        }
        
        case CHECKLIST_ITEM_UPDATE: {
            const { checklist, item, data } = payload;

            const checklists = [...state.checklists];
            
            const list = checklists.find((list) => list.id === checklist.id);
            const index = list.checkItems.indexOf(item);
            list.checkItems[index] = { ...item, ...data };

            return { 
                ...state,
                checklists,
            }
        }

        case CHECKLIST_ITEM_UPDATE_SUCCESS: {
            return state;
        }

        case CHECKLIST_ITEM_UPDATE_FAILURE: {
            return state;
        }

        case CHECKLIST_ITEM_ADD: {
            const { data } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((list) => data.idChecklist === list.id);
            list.checkItems.push(data);

            return {
                ...state,
                checklists,
            }
        }

        case CHECKLIST_ITEM_ADD_SUCCESS: {
            const { data, id } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((list) => data.idChecklist === list.id);
            const itemToUpdate = list.checkItems.find((item) => item.id === id);
            if (itemToUpdate){
                const index = list.checkItems.indexOf(itemToUpdate);
                list.checkItems[index] = { ...itemToUpdate, ...data };
            }

            return {
                ...state,
                checklists,
            }
        }

        case CHECKLIST_ITEM_ADD_FAILURE: {
            const { error, id, idChecklist } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((list) => idChecklist === list.id);
            const item = list.checkItems.find((item) => item.id === id);
            if (item){
                const index = list.checkItems.indexOf(item);
                list.checkItems.splice(index, 1);
            }

            return {
                ...state,
                checklists,
            };
        }

        case CHECKLIST_REMOVE: {
            const { checklist } = payload;

            const checklists = [...state.checklists];
            const cards = [...state.cards];

            let index = checklists.indexOf(checklist);
            checklists.splice(index, 1);

            const card = cards.find((c) => c.id === checklist.idCard);
            index = card.idChecklists.indexOf(checklist.id);
            card.idChecklists.splice(index, 1);

            return {
                ...state,
                cards,
                checklists
            }
        }

        case CHECKLIST_REMOVE_SUCCESS: {
            return state;
        }

        case CHECKLIST_REMOVE_FAILURE: {
            const { error, checklist } = payload;

            const checklists = [...state.checklists];
            const cards = [...state.cards];

            checklists.push(checklist);
            const card = cards.find((c) => c.id === checklist.idCard);
            card.idChecklists.push(checklist.id);

            return {
                ...state,
                cards,
                checklists
            }
        }

        case CHECKLIST_ITEM_REMOVE: {
            const { checklist, item } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((l) => l.id === checklist.id);
            const index = list.checkItems.indexOf(item);
            list.checkItems.splice(index, 1);

            return {
                ...state,
                checklists
            }
        }

        case CHECKLIST_ITEM_REMOVE_SUCCESS: {
            return state;
        }

        case CHECKLIST_ITEM_REMOVE_FAILURE: {
            const { error, checklist, item } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((l) => l.id === checklist.id);
            list.checkItems.push(item);

            return {
                ...state,
                checklists
            }
        }

        case FETCH_CHECKITEMS_SUCCESS: {
            const { checklist, data } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((l) => l.id === checklist.id);
            list.checkItems = [...data];

            return {
                ...state,
                checklists
            }
        }

        case FETCH_CHECKITEMS_FAILURE: {
            return state;
        }

        case FETCH_CARD_SUCCESS: {
            const { data } = payload;

            const cards = [...state.cards];

            const exists = cards.find((c) => c.id === data.id);
            if (!exists) {
                cards.push(data);
            }

            return {
                ...state,
                cards,
            };
        }

        case FETCH_CARD_FAILURE: {
            return state;
        }

        case FETCH_CHECKITEMS_SUCCESS: {
            const { data } = payload;

            const checklists = [...state.checklists];

            checklists.map((l) => {
                if (l.id === data.id) {
                    l.checkItems = [...data.checkItems];
                }
            });

            return {
                ...state,
                checklists,
            };
        }

        case FETCH_CHECKITEMS_FAILURE: {
            return state;
        }

        // Webhook functions
        case WEBHOOK_ADD_CHECKLIST_TO_CARD: {
            const { card, checklist, board } = payload;

            const checklists = [...state.checklists];
            const cards = [...state.cards];

            const exists = checklists.find((l) => l.id === checklist.id);
            if (!exists) {
                checklists.push({ ...checklist, idBoard: board.id, idCard: card.id, checkItems: [] });
                const cardToUpdate = cards.find((c) => c.id === card.id);
                const index = cards.indexOf(cardToUpdate);
                cards[index].idChecklists.push(checklist.id);
            }

            return {
                ...state,
                cards,
                checklists
            }
        }

        case WEBHOOK_ADD_LABEL_TO_CARD: {
            const { card, label, board } = payload;

            const cards = [...state.cards];

            cards.map((c) => {
                if (c.id === card.id) {
                    let exists = c.labels.find((l) => l.id === label.id);
                    if (!exists) {
                        c.labels.push({ ...label, idBoard: board.id });
                    }
                    exists = c.idLabels.includes(label.id);
                    if (!exists) {
                        c.idLabels.push(label.id);
                    }
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
                if (c.id === sourceCard.id) {
                    const cardToCopy = { ...c, id: card.id, name: card.name };
                    const exists = cards.find((c) => c.id === card.id);
                    if (!exists) {
                        cards.push(cardToCopy);
                    }
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
            
            const exists = labels.find((l) => l.id === label.id);
            if (!exists) {
                labels.push({ ...label, idBoard: board.id });
            }

            return {
                ...state,
                labels
            };
        }

        case WEBHOOK_CREATE_LIST: {
            const { list, board } = payload;

            const lists = [...state.lists];
            const customLists = [...state.customLists];

            const exists = lists.find((l) => l.id === list.id);
            if (!exists) {
                lists.push({ ...list, idBoard: board.id });
            }

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

            const exists = cards.find((c) => c.id === card.id);
            if (!exists) { 
                cards.push({ id: card.id, name: card.name, idList: list.id, idBoard: board.id, labels: [], idLabels: [] });
            }

            return {
                ...state,
                cards
            };
        }

        case WEBHOOK_CREATE_CHECKITEM: {
            const { card, board, checklist, checkItem } = payload;

            const checklists = [...state.checklists];
            checklists.map((list) => {
                if (list.id === checklist.id) {
                    const exists = list.checkItems.find((i) => i.id === checkItem.id);
                    if (!exists) {
                        list.checkItems.push(checkItem);
                    }
                }
            });

            return {
                ...state,
                checklists,
            }
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

        case WEBHOOK_DELETE_CHECKITEM: {
            const { board, card, checklist, checkItem } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((l) => l.id === checklist.id);
            const item = list.checkItems.find((i) => i.id === checkItem.id);
            const index = list.checkItems.indexOf(item);
            list.checkItems.splice(index, 1);

            return {
                ...state,
                checklists
            }
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

            const c = cards.find((c) => c.id === card.id);
            if (c) {
                const index = cards.indexOf(c);
                cards[index] = { ...c, idBoard: board.id, idList: list.id };
            }

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
            const cards = [...state.cards];

            const l = lists.find((l) => l.id === list.id);
            if (l) {
                const index = lists.indexOf(l);
                lists[index] = { ...l, idBoard: board.id };

                const toUpdate = cards.filter((c) => c.idList === l.id);
                toUpdate.map((c) => {
                    c['idBoard'] = board.id;
                });
            }

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
                        if (index) {
                            c.labels.splice(index, 1);
                        }
                    }

                    const indexId = c.idLabels.indexOf(label.id);
                    if (indexId){
                        c.idLabels.splice(indexId, 1);
                    }
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
                    c.labels.map((l) => {
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
                    const index = customLists.indexOf(listToRemove);
                    customLists.splice(index, 1);
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
                        const index = customLists.indexOf(listToUpdate)
                        customLists[index] = { ...listToUpdate, name: list.name };
                    }
                } else {
                    // List with new name exits, removing custom list with old name
                    const listToRemove = customLists.find((l) => l.name === old.name);
                    const index = customLists.indexOf(listToRemove);
                    customLists.splice(index, 1);
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

        case WEBHOOK_REMOVE_CHECKLIST_FROM_CARD: {
            const { card, board, checklist } = payload;

            const checklists = [...state.checklists];
            const cards = [...state.cards];

            const list = checklists.find((l) => l.id === checklist.id);
            let index = checklists.indexOf(list);
            checklists.splice(index, 1);

            const cardToUpdate = cards.find((c) => c.id === card.id);
            index = cardToUpdate.idChecklists.indexOf(checklist.id);
            cardToUpdate.idChecklists.splice(index, 1);

            return {
                ...state,
                cards,
                checklists,
            };
        }

        case WEBHOOK_UPDATE_CHECKITEM: {
            const { board, card, checklist, checkItem, old } = payload;

            const checklists = [...state.checklists];

            const list = checklists.find((l) => l.id === checklist.id);
            list.checkItems.map((i)=> {
                if (i.id === checkItem.id) {
                    Object.keys(old).forEach((key) => {
                        i[key] = checkItem[key];
                    });
                }
            });

            return {
                ...state,
                checklists,
            };
        }

        case WEBHOOK_UPDATE_CHECKITEM_STATE_ON_CARD: {
            const { board, card, checklist, checkItem } = payload;
            
            const checklists = [...state.checklists];

            const list = checklists.find((l) => l.id === checklist.id);
            const item = list.checkItems.find((i) => i.id === checkItem.id);
            const index = list.checkItems.indexOf(item);
            list.checkItems[index] = { ...item, state: checkItem.state };

            return {
                ...state,
                checklists
            };
        }

        case WEBHOOK_UPDATE_CHECKLIST: {
            const { board, card, checklist, old } = payload;

            const checklists = [...state.checklists];

            checklists.map((l) => {
                if (l.id === checklist.id) {
                    Object.keys(old).forEach((key) => {
                        l[key] = checklist[key];
                    });
                }
            });

            return {
                ...state,
                checklists
            };
        }

        case WEBHOOK_REMOVE_MEMBER_FROM_BOARD: {
            const { board, memberCreator } = payload;

            let checklists = [...state.checklists];
            let cards = [...state.cards];
            let boards = [...state.boards];
            let lists = [...state.lists];
            let labels = [...state.labels];
            let customLists = [...state.customLists];

            const listsOnBoard = lists.filter((l) => l.idBoard === board.id);
            listsOnBoard.forEach((list) => {
                const exists = lists.find((l) => l.name === list.name && l.id !== list.id);
                if (!exists){
                    const customList = customLists.find((l) => l.name === list.name);
                    const index = customLists.indexOf(customList);
                    customLists.splice(index, 1);
                }
            });

            checklists = checklists.filter((l) => l.idBoard !== board.id);
            cards = cards.filter((c) => c.idBoard !== board.id);
            boards = boards.filter((b) => b.id !== board.id);
            lists = lists.filter((l) => l.idBoard !== board.id);
            labels = labels.filter((l) => l.idBoard !== board.id);


            return {
                ...state,
                boards,
                cards,
                lists,
                labels,
                checklists,
                customLists,
            };
        }

        default: {
            return state;
        }
    };
}

export default dataReducer;
