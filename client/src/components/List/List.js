import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Card from '../Card/Card';
import AddCard from '../Card/AddCard';
import { sortCards } from '../../api/index.js';

import { StyledListWrapper, StyledListContent, StyledListHeader, StyledListCards } from '../../styles';


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
                    <StyledListWrapper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Droppable droppableId={this.props.name} type="droppableCards">
                            {(provided, snapshot) => (
                                <StyledListContent
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <StyledListHeader>
                                        <span className="list-header-name">{this.props.name}</span>
                                    </StyledListHeader>
                                    <StyledListCards className="droppable">
                                        {this.renderCards(cards)}
                                        {provided.placeholder}
                                    </StyledListCards>
                                    <AddCard 
                                        {...this.props} 
                                        listCards={cards}
                                    />
                                </StyledListContent>
                            )}
                        </Droppable>
                    </StyledListWrapper>
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
