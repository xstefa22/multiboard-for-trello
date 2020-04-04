import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from "react-dom";
import { bindActionCreators } from 'redux';
import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import CardDetail from './CardDetail';
import CardEditor from './CardEditor';

import { CardWrapper, Icon, CardLabels, CardTitle, CardLabel, CardBadges } from '../../styles';


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
                <CardLabel key={label.id} className={"label-" + (label.color) + " mod-card-front "} title={label.title} />
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
                            <CardWrapper ref={this.card}>
                                <div className="card-operations">
                                    <Icon 
                                        className="icon-sm"
                                        onClick={this.handleCardEditor}
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </Icon>
                                </div>
                                <div 
                                    className="card-details" 
                                    onClick={() => this.setState({ clickedOn: true })}
                                >   
                                    { this.props.card.labels.length > 0 &&
                                        <CardLabels>
                                            {this.renderLabels()}
                                        </CardLabels>
                                    }
                                    <CardTitle>{this.props.card.name}</CardTitle>
                                    <CardBadges>
                                        <span className="badge-board">{this.props.board.name}</span>
                                    </CardBadges>
                                </div>
                            </CardWrapper>
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
        customLists: state.dataReducer.customLists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Card);
