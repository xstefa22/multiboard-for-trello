import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from "react-dom";
import { bindActionCreators } from 'redux';
import { Draggable } from 'react-beautiful-dnd';
import { TiPencil } from 'react-icons/ti';

import CardDetail from './CardDetail';
import CardEditor from './CardEditor';

import { StyledCardWrapper, StyledIcon, StyledCardLabels, StyledCardTitle, StyledCardLabel, StyledCardBadges } from '../../styles';


class Card extends React.Component {
    constructor(props) {
        super(props);

        this.handleCardEditor = this.handleCardEditor.bind(this);

        this.state = {
            clickedOn: false,
            clickedOnEdit: false,

            hover: false,

            cardEditorLeftOffset: 0,
            cardEditorTopOffset: 0,
        };

        this.card = React.createRef();
        this.buttonLabels = React.createRef();
        this.buttonMove = React.createRef();
        this.buttonCopy = React.createRef();
        this.popup = React.createRef();
    };

    // Handles state for displaying card editor modal and setting modal offset
    handleCardEditor = () => {
        const offset = ReactDOM.findDOMNode(this.card.current).getBoundingClientRect();

        this.setState({ cardEditorLeftOffset: offset.left, cardEditorTopOffset: offset.top, clickedOnEdit: true });
    };

    // Renders list of labels
    renderLabels = () => {
        return this.props.card.labels.map((label) => {
            return (
                <StyledCardLabel key={label.id} className={"label-" + (label.color) + " mod-card-front "} title={label.title} />
            );
        });
    };

    render = () => {
        return (
            <React.Fragment>
                <Draggable draggableId={this.props.card.id} index={this.props.index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <StyledCardWrapper ref={this.card}>
                                <div className="card-operations">
                                    <StyledIcon 
                                        className="icon-sm"
                                        onClick={this.handleCardEditor}
                                    >
                                        <TiPencil />
                                    </StyledIcon>
                                </div>
                                <div 
                                    className="card-details" 
                                    onClick={() => this.setState({ clickedOn: true })}
                                >   
                                    { this.props.card.labels.length > 0 &&
                                        <StyledCardLabels>
                                            {this.renderLabels()}
                                        </StyledCardLabels>
                                    }
                                    <StyledCardTitle>{this.props.card.name}</StyledCardTitle>
                                    <StyledCardBadges>
                                        <span className="badge-board">{this.props.board.name}</span>
                                    </StyledCardBadges>
                                </div>
                            </StyledCardWrapper>
                        </div>
                    )}
                </Draggable>
                <CardDetail
                    data={this.props.card}
                    {...this.props}
                    onClose={() => this.setState({ clickedOn: false })}
                    isOpen={this.state.clickedOn}
                />
                <CardEditor
                    data={this.props.card}
                    {...this.props}
                    offsetTop={this.state.cardEditorTopOffset}
                    offsetLeft={this.state.cardEditorLeftOffset}
                    onClose={() => this.setState({ clickedOnEdit: false })}
                    isOpen={this.state.clickedOnEdit}
                    style={{
                        backgroundColor: 'rgba(0,0,0,.6)',
                    }}
                />
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        boards: state.dataReducer.boards,
        cards: state.dataReducer.cards,
        customLists: state.dataReducer.customLists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Card);
