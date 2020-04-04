import React, { Component } from 'react';

import { Button } from '../../styles';


export default class DayPickerNavbar extends Component {
    render = () => {
        const { onPreviousClick, onNextClick, className } = this.props;
        const styleRight = {
            marginLeft: 'auto',
        };

        return (
            <div className={className}>
                <Button 
                    onClick={() => onPreviousClick()}
                    style={{ left: 0 }}
                >
                    Prev
                </Button>
                <Button
                    onClick={() => onNextClick()}
                    style={{ right: 0 }}
                >
                    Next
                </Button>
            </div>
        );
    };
}
