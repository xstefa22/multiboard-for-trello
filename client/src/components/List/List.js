import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Card from '../Card/Card';
import AddCard from '../Card/AddCard';
import { sortCards } from '../../api/index.js';

import { ListWrapper, ListContent, ListHeader, ListCards } from '../../styles';


class List extends Component {
    constructor(props) {
        super(props);

        this.filterCardsForList = this.filterCardsForList.bind(this);
    }

    filterCardsForList = () => {
        const listIds = this.props.lists.filter((list) => list.name === this.props.name && !list.closed).map(list => list.id);
        const cards = this.props.cards.filter((card) => listIds.includes(card.idList) && !card.closed);

        return sortCards(cards);
    }

    // Renders cards in list
    renderCards = (cards) => {
        return cards.map((card, index) => {
            return (
                <Card
                    index={index}
                    key={card.id}
                    card={card}
                    listName={this.props.name}
                    board={this.props.boards.find((board) => board.id === card.idBoard)}
                />
            );
        });
    };

    render = () => {
        const cards = this.filterCardsForList();

        return (
            <Draggable draggableId={"list-" + this.props.name} index={this.props.index}>
                {(provided, snapshot) => (
                    <ListWrapper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Droppable droppableId={this.props.name} type="droppableCards">
                            {(provided, snapshot) => (
                                <ListContent
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <ListHeader>
                                        <span className="list-header-name">{this.props.name}</span>
                                    </ListHeader>
                                    <ListCards className="droppable">
                                        {this.renderCards(cards)}
                                        {provided.placeholder}
                                    </ListCards>
                                    <AddCard 
                                        {...this.props} 
                                        listCards={cards}
                                    />
                                </ListContent>
                            )}
                        </Droppable>
                    </ListWrapper>
                )}
            </Draggable>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        boards: state.dataReducer.boards,
        customLists: state.dataReducer.customLists,
        cards: state.dataReducer.cards,
        lists: state.dataReducer.lists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(List);
