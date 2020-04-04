import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaTimes, FaPencilAlt, FaCheck, FaChevronLeft } from 'react-icons/fa';
import { TiPencil } from 'react-icons/ti';
import { IconContext } from 'react-icons';
import Popover from '@material-ui/core/Popover';
import { DateUtils } from 'react-day-picker';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';

import DayPickerNavbar from './DayPickerNavbar';
import DayPickerCaption from './DayPickerCaption';

import {
    actionCardActionMove, actionCardActionCopy, actionCardActionArchive, actionLabelCreate,
    actionLabelEdit, actionCardUpdate
} from '../../actions';

import {
    PopoverWrapper, PopoverHeader, PopoverContent, PopoverTitle, PopoverSection,
    H4, Icon, FormGrid, TextArea, Input, ButtonLink, Select, OptGroup, 
    SelectLabel, SelectValue, UList, Button, Submit, CardLabel, UListItem, DatePickerLabel,
    DatePicker, DatePickerSelect, Pickers
} from '../../styles';


class CustomPopover extends Component {
    constructor(props){
        super(props);

        this.handleCardLabels = this.handleCardLabels.bind(this);
        this.handleCardLists = this.handleCardLists.bind(this);
        this.handleCardDueDate = this.handleCardDueDate.bind(this);
        this.handleClickLabel = this.handleClickLabel.bind(this);
        this.handleCreateLabel = this.handleCreateLabel.bind(this);
        this.handleEditLabel = this.handleEditLabel.bind(this);
        this.handleCardMove = this.handleCardMove.bind(this);
        this.handleCardCopy = this.handleCardCopy.bind(this);

        this.state = {
            selectedBoardId: this.props.data.idBoard,
            selectedListId: this.props.data.idList,
            selectedPos: this.props.index + 1,
            selectedLabels: [...this.props.data.labels],
            selectedLabelColor: null,

            copyNameValue: '',
            labelNameValue: '',

            labelToEdit: null,

            selectedDay: (this.props.data.due ? parseISO(this.props.data.due) : new Date()),
            selectedMonth: new Date(new Date().getFullYear(), new Date().getMonth()),
        }
    };

    // Handles updating labels
    handleCardLabels = () => {
        if (JSON.stringify(this.state.selectedLabels) !== JSON.stringify(this.props.data.labels)) {
            this.props.actionCardUpdate(this.props.data, { idLabels: this.state.selectedLabels.map((label) => label.id).toString() }, true, { labels: this.state.selectedLabels });
        }
    };

    handleCardLists = (event) => {
    };

    handleCardDueDate = () => {
        const { selectedDay } = this.state;

        const due = dateFnsFormat(selectedDay, 'yyyy-MM-dd') + 'T00:00:00.000Z';
        this.props.actionCardUpdate(this.props.data, { due }, true);
    };

    // Handles selecting which label is being edited
    handleClickLabel = (label) => {
        const selectedLabels = [...this.state.selectedLabels];
        const ids = selectedLabels.map((l) => l.id);

        if (ids.includes(label.id)) {
            const index = ids.indexOf(label.id);
            selectedLabels.splice(index, 1);
        } else {
            selectedLabels.push(label);
        }

        this.setState({ selectedLabels });
    };

    // Handles creating new label
    handleCreateLabel = () => {
        const { labelNameValue, selectedLabelColor } = this.state;

        this.props.actionLabelCreate({ name: labelNameValue, color: selectedLabelColor, idBoard: this.props.data.idBoard });

        this.setState({
            selectedLabelColor: null,
            labelNameValue: '',
        });
    };

    // Handles editing existing label
    handleEditLabel = () => {
        const { labelNameValue, selectedLabelColor, labelToEdit } = this.state;

        this.props.actionLabelEdit(labelToEdit, { name: labelNameValue, color: selectedLabelColor });

        this.setState({
            selectedLabelColor: null,
            labelNameValue: '',
            labelToEdit: null,
            selectedLabels: [...this.props.data.labels],
        });
    };

    // Handles moving card
    handleCardMove = () => {
        this.props.actionCardActionMove(this.props.data, this.state.selectedBoardId, this.state.selectedListId, this.state.selectedPos, this.props.index);
    };

    // Handles copying card
    handleCardCopy = () => {
        this.props.actionCardActionCopy(this.props.data, this.state.copyNameValue, this.state.selectedBoardId, this.state.selectedListId, this.state.selectedPos, this.props.index);
    };

   

    handlePopOverClose = () => {
        const { action } = this.props;

        switch (action) {
            case 'labels': {
                this.handleCardLabels();
                break;
            }
            default: break;
        }

        this.props.onClose();
    };

    handlePopupSubmitClick = () => {
        const { action } = this.props;

        switch (action) {
            case 'copy': {
                this.handleCardCopy();
                break;
            }
            case 'labels': {
                this.handleCardLabels();
                break;
            }
            case 'addLabel': {
                this.handleCreateLabel()
                break;
            }
            case 'editLabel': {
                this.handleEditLabel();
                break;
            }
            case 'move': {
                this.handleCardMove();
                break;
            }
            case 'dueDate': {
                this.handleCardDueDate();
                break;
            }
            default: break;
        }
    };

    handlePopupRemoveClick = () => {
        const { action } = this.props;

        switch (action) {
            case 'dueDate': {
                this.props.actionCardUpdate(this.props.data, { due: "" }, true);
                this.props.onClose();
                break;
            }
            default: break;
        }
    };

    mapActionToTitle = () => {
        return {
            checklist: 'Add Checklist',
            copy: 'Copy Card',
            dueDate: 'Change Due Date',
            labels: 'Labels',
            addLabel: 'Create Label',
            editLabel: 'Change Label',
            move: 'Move Card',
            null: '',
        }[this.props.action];
    };

    mapActionToComponents = () => {
        return {
            checklist: ['title', 'submit'],
            copy: ['title', 'select', 'textarea', 'submit'],
            dueDate: ['date', 'submit', 'remove'],
            labels: ['labels'],
            addLabel: ['title', 'color', 'submit'],
            editLabel: ['title', 'color', 'submit', 'remove'],
            move: ['select', 'submit'],
            null: [],
        }[this.props.action];
    };

    mapActionToSectionTitle = (type = null) => {
        switch (type) {
            case 'title': {
                return 'Title';
            }
            case 'colors': {
                return 'Select a color';
            }
            default: break;
        }
        
        return {
            checklist: 'Title',
            copy: 'Copy to...',
            dueDate: '',
            labels: 'Labels',
            addLabel: 'Name',
            editLabel: 'Name',
            move: 'Select destination',
            null: '',
        }[this.props.action];
    };
    
    mapActionToSubmit = () => {
        return {
            checklist: 'Add',
            copy: 'Create Card',
            dueDate: 'Save',
            labels: '',
            addLabel: 'Create',
            editLabel: 'Save',
            move: 'Move',
            null: '',
        }[this.props.action];
    }

    getInputValue = () => {
        const { copyNameValue, labelNameValue } = this.state;
        const { action } = this.props;

        switch (action) {
            case 'copy': {
                return copyNameValue;
            }

            case 'addLabel':
            case 'editLabel': {
                return labelNameValue;
            }

            default: break;
        }

        return '';
    };

    handleOnChange = (e) => {
        const { action } = this.props;
        const value = e.target.value;
        
        switch (action) {
            case 'copy': {
                this.setState({ copyNameValue: value });
                break;
            }

            case 'addLabel':
            case 'editLabel': {
                this.setState({ labelNameValue: value });
                break;
            }

            default: break;
        }
    };

    handleClick = (event, action) => {
        if (action !== 'addLabel' || action !== 'editLabel'){
            this.props.setAnchorEl();
        }
    };

    handleDayClick = (day, { selected }) => {
        this.setState({ selectedDay: day });
    };

    handleYearMonthChange = (selectedMonth) => {
        this.setState({ selectedMonth });
    }

    parseDate = (str, format, locale) => {
        const parsed = dateFnsParse(str, format, new Date(), { locale });

        if (DateUtils.isDate(parsed)) {
          return parsed;
        }

        return undefined;
    };
      
    formatDate = (date, format, locale) => {
        return dateFnsFormat(date, format, { locale });
    };

     // Renders option for board select when moving/copying card
     renderBoardOptions = () => {
        return this.props.boards.map((board) => {
            return <option key={board.id} value={board.id} >{board.name}</option>;
        });
    };

    // Renders option for list select when moving/copying card
    renderListOptions = () => {
        const lists = this.props.lists.filter((list) => list.idBoard === this.state.selectedBoardId);

        return lists.map((list) => {
            return <option key={list.id} value={list.id}>{list.name}</option>;
        });
    };

    // Renders option for position select when moving/copying card
    renderPosOptions = () => {
        const listName = this.props.lists.find((list) => list.id === this.state.selectedListId).name;
        const listIds = this.props.lists.filter((list) => list.name === listName).map(list => list.id);
        const cardsToRender = this.props.cards.filter((card) => listIds.includes(card.idList));

        return cardsToRender.map((c, index) => {
            return <option key={index + 1} value={index + 1}>{index + 1}</option>;
        })
    };

    // Renders list of labels
    renderLabelList = () => {
        const labels = this.props.labels.filter((label) => label.idBoard === this.props.data.idBoard);

        return labels.map((label) => {
            return (
                <UListItem key={label.id}>
                    <Icon 
                        className="icon-sm label-edit-icon"
                        data-idlabel={label.id}
                        onClick={(e) => { this.setState({ selectedLabelColor: label.color, labelToEdit: label, labelNameValue: label.name }); this.props.setAction('editLabel'); }}
                    >
                        <TiPencil />
                    </Icon>
                    <CardLabel
                        className={"mod-selectable label-" + label.color + ""}
                        data-idlabel={label.id}
                        data-color={label.color}
                        onClick={() => this.handleClickLabel(label)}
                    >
                        {label.name}
                        { this.state.selectedLabels.map((l) => l.id).includes(label.id) && 
                            <Icon className="icon-sm label-selected-icon">
                                <IconContext.Provider value={{ color: '#fff', size: '12px' }}>
                                    <FaCheck />
                                </IconContext.Provider>
                            </Icon>
                        }
                    </CardLabel>
                </UListItem>
            );
        });
    };

    // Renders list of colors for label
    renderLabelColors = () => {
        const colors = ['green', 'yellow', 'orange', 'red', 'purple', 'blue', 'sky', 'lime', 'pink', 'black'];

        return colors.map((color) => {
            return (
                <CardLabel
                    className={"mod-edit-label mod-clickable label-" + color + ""}
                    data-color={color}
                    key={color}
                    onClick={() => this.setState({ selectedLabelColor: color })}
                >
                    { this.state.selectedLabelColor === color &&
                        <IconContext.Provider value={{ color: '#fff', size: '12px' }}>
                            <Icon className="icon-sm label-color-selected-icon">
                                <FaCheck/>
                            </Icon>
                        </IconContext.Provider>
                    }
                </CardLabel>
            );
        })
    };

    render = () => {
        const componentsToRender = this.mapActionToComponents();
        const currentYear = new Date().getFullYear();
        const fromMonth = new Date(currentYear, 0);
        const toMonth = new Date(currentYear + 10, 11);
        const FORMAT = 'yyyy/MM/dd';

        return (
            <Popover
                anchorEl={this.props.anchorElement}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={this.handlePopOverClose}    
                open={Boolean(this.props.anchorElement)}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                style={{
                    marginTop: '6px',
                }}
            >
                <PopoverWrapper>
                    <PopoverHeader>
                        { (this.props.action === 'editLabel' || this.props.action === 'addLabel') && 
                            <Icon
                                className="icon-sm popover-back-icon"
                                onClick={() => this.props.setAction('labels') }
                            >
                                <FaChevronLeft/>
                            </Icon>
                        }
                        <PopoverTitle>{this.mapActionToTitle()}</PopoverTitle>
                        <Icon
                            className="icon-sm popover-close-icon"
                            onClick={this.handlePopOverClose}
                        >
                            <FaTimes/>
                        </Icon>
                    </PopoverHeader>
                    <PopoverContent>
                        <PopoverSection>
                            { componentsToRender && componentsToRender.includes('title') && 
                                <React.Fragment>
                                    <H4>{this.mapActionToSectionTitle('title')}</H4>
                                    {componentsToRender.includes('textarea') ?
                                        <TextArea
                                            name="name"
                                            autoComplete="off"
                                            maxLength="512"
                                            value={this.getInputValue()}
                                            onChange={(e) => this.handleOnChange(e)}
                                        /> :
                                        <Input
                                            name="name"
                                            className="popover-input"
                                            value={this.getInputValue()}
                                            onChange={(e) => this.handleOnChange(e)}
                                        />
                                    } 
                                </React.Fragment>
                            }
                            { componentsToRender && componentsToRender.includes('date') &&
                                <React.Fragment>
                                    <DatePicker>
                                        <DatePickerSelect>
                                            <DatePickerLabel>
                                                Date
                                                <DayPickerInput
                                                    value={this.state.selectedDay}
                                                    onDayChange={this.handleDayChange}
                                                    formatDate={this.formatDate}
                                                    format={FORMAT}
                                                    placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
                                                    parseDate={this.parseDate}
                                                    dayPickerProps={{
                                                        selectedDays: this.state.selectedDay,
                                                    }}
                                                />
                                            </DatePickerLabel>
                                        </DatePickerSelect>
                                        <DatePickerSelect>
                                            <DatePickerLabel>
                                                Time
                                                <input 
                                                    placeholder="Enter time"
                                                    tabIndex="102"
                                                />
                                            </DatePickerLabel>
                                        </DatePickerSelect>
                                    </DatePicker>
                                    <Pickers>
                                        <DayPicker
                                            month={this.state.selectedMonth}
                                            fromMonth={fromMonth}
                                            toMonth={toMonth}
                                            navbarElement={<DayPickerNavbar />}
                                            captionElement={({ date, localeUtils }) => (
                                                <DayPickerCaption
                                                    date={date}
                                                    localeUtils={localeUtils}
                                                    onChange={this.handleYearMonthChange}
                                                />
                                            )}
                                            onDayClick={this.handleDayClick}
                                            selectedDays={this.state.selectedDay}
                                        />
                                    </Pickers>
                                </React.Fragment>
                            }
                            { componentsToRender && componentsToRender.includes('select') &&
                                <React.Fragment>
                                    <H4>{this.mapActionToSectionTitle('select')}</H4>
                                    <FormGrid>
                                        <ButtonLink className="setting form-grid-child form-grid-child-full">
                                            <SelectLabel>Board</SelectLabel>
                                            <SelectValue>{this.props.boards.find((b) => b.id === this.state.selectedBoardId).name}</SelectValue>
                                            <Select
                                                onChange={(e) => this.setState({ selectedBoardId: e.target.value })}
                                                value={this.state.selectedBoardId} 
                                            >
                                                <OptGroup label="Boards">
                                                    {this.renderBoardOptions()}
                                                </OptGroup>
                                            </Select>
                                        </ButtonLink>
                                    </FormGrid>
                                    <FormGrid>
                                        <ButtonLink className="setting form-grid-child form-grid-child-threequarters">
                                            <SelectLabel>List</SelectLabel>
                                            <SelectValue>{this.props.boards.find((b) => b.id === this.state.selectedBoardId).name}</SelectValue>
                                            <Select
                                            onChange={(e) => {
                                                const cardsInList = this.props.cards.filter((l) => l.idList === e.target.value);
                                                this.setState({ selectedListId: e.target.value, selectedPos: cardsInList.length + 1 });
                                            }}
                                            value={this.state.selectedListId} 
                                        >
                                            <OptGroup label="Lists">
                                                {this.renderListOptions()}
                                            </OptGroup>
                                        </Select>
                                        </ButtonLink>
                                        <ButtonLink className="setting form-grid-child">
                                            <SelectLabel>Position</SelectLabel>
                                            <SelectValue>{this.state.selectedPos}</SelectValue>
                                            <Select
                                                onChange={(e) => this.setState({ selectedPos: e.target.value })}>
                                                value={this.state.selectedPos} 
                                            >
                                                <OptGroup label="Position">
                                                    {this.renderPosOptions()}
                                                </OptGroup>
                                            </Select>
                                        </ButtonLink>
                                    </FormGrid>
                                </React.Fragment>
                            }
                            { componentsToRender && componentsToRender.includes('labels') &&
                                <React.Fragment>
                                    <H4>Labels</H4>
                                    <UList className="edit-labels">
                                        {this.renderLabelList()}
                                    </UList>
                                    <Button
                                        className="full"
                                        onClick={() => this.props.setAction('addLabel')}
                                    >
                                        Create a new label
                                    </Button>
                                </React.Fragment>
                            }
                            { componentsToRender && componentsToRender.includes('color') &&
                                <React.Fragment>
                                    <H4>Select a color</H4>
                                    {this.renderLabelColors()}
                                </React.Fragment>
                            }
                            { componentsToRender && componentsToRender.includes('submit') &&
                                <React.Fragment>
                                    <Submit
                                        className="primary"
                                        onClick={this.handlePopupSubmitClick}
                                        value={this.mapActionToSubmit()}
                                    />
                                    { componentsToRender.includes('remove') &&
                                        <Submit 
                                            className="negate mod-float-right"
                                            onClick={this.handlePopupRemoveClick}
                                            value="Remove"
                                        />
                                    }
                                </React.Fragment>
                            }
                        </PopoverSection>
                    </PopoverContent>
                </PopoverWrapper>
            </Popover>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        labels: state.dataReducer.labels,
        cards: state.dataReducer.cards,
        boards: state.dataReducer.boards,
        lists: state.dataReducer.lists,
        customLists: state.dataReducer.customLists,
    };
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    actionCardActionArchive, actionCardActionMove, actionCardActionCopy,
    actionLabelCreate, actionLabelEdit, actionCardUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CustomPopover);
