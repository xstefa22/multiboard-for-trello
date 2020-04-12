import React, { Component } from 'react';

import { StyledButton } from '../../styles';


export default class DayPickerNavbar extends Component {
    render = () => {
        const { onPreviousClick, onNextClick, className } = this.props;

        return (
            <div className={className}>
                <StyledButton 
                    onClick={() => onPreviousClick()}
                    style={{ left: 0 }}
                >
                    Prev
                </StyledButton>
                <StyledButton
                    onClick={() => onNextClick()}
                    style={{ right: 0 }}
                >
                    Next
                </StyledButton>
            </div>
        );
    };
}
