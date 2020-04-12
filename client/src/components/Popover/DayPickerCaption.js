import React, { Component } from 'react';
import { StyledDatePickerCaption, StyledDatePickerCaptionLabel, StyledSelect } from '../../styles';


export default class DayPickerCaption extends Component {
    renderYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const fromMonth = new Date(currentYear, 0);
        const toMonth = new Date(currentYear + 10, 11);

        const years = [];
        for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
            years.push(i);
        }

        return years.map((year) => {
            return <option key={year} value={year}>{year}</option>;
        });
    };

    renderMonthOptions = () => {
        const { localeUtils } = this.props;

        return localeUtils.getMonths().map((month, index) => {
            return <option key={month} value={index}>{month}</option>;
        });
    };

    handleChange = (event, type) => {
        const { onChange, date } = this.props;

        switch(type) {
            case 'month':
                onChange(new Date(date.getFullYear(), event.target.value));
                break;
            case 'year':
                onChange(new Date(event.target.value, date.getMonth()));
                break;
            default:
                break;
        }
    };

    render = () => {
        const { date, localeUtils } = this.props;
        const currentMonth = localeUtils.getMonths()[date.getMonth()];

        return (
            <StyledDatePickerCaption>
                <StyledDatePickerCaptionLabel>
                    {currentMonth}
                    <StyledSelect
                        onChange={(e) => this.handleChange(e, 'month')}
                        value={date.getMonth()}
                        tabIndex="-1"  
                    >
                        {this.renderMonthOptions()}
                    </StyledSelect>
                </StyledDatePickerCaptionLabel>
                <StyledDatePickerCaptionLabel>
                    {date.getFullYear()}
                    <StyledSelect
                        onChange={(e) => this.handleChange(e, 'year')}
                        value={date.getFullYear()}
                        tabIndex="-1"  
                    >
                        {this.renderYearOptions()}
                    </StyledSelect>
                </StyledDatePickerCaptionLabel>
            </StyledDatePickerCaption>
        );
    };
}
