import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';


export const GlobalStyle = createGlobalStyle`
    h2 {
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
    }
    
    h3 {
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
    }
    
    p {
        margin: 0 0 8px;
    }
    
    textarea {
        resize: vertical;
        width: 100%;
    }

    ul, ol {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    button, select, input, textarea, div {
        outline: none;
    }

    #root {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    body, button, html, input, select, textarea {
        color: #172b4d;
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
    }

    a {
        color: #172b4d;
    }
`

export const StyledBoardWrapper = styled.div`
    background-color: rgb(0, 121, 191);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 8px;
    position: relative;
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;

    .content {
        position: relative;
        overflow-y: auto;
        outline: none;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
`

export const StyledBoardHeader = styled.div`
    background: rgba(0, 0, 0, 0.15);
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	height: 32px;
	min-height: 40px;
	overflow: hidden;
	padding: 4px;
	position: relative;
    z-index: 10;
    
    .header-right {
        display: flex;
        justify-content: flex-end;
        flex-grow: 1;
    }
`

export const StyledMemberIcon = styled.div`
    position: relative;
    line-height: 10px;
    overflow: hidden;
    white-space: nowrap;
    
    span {
        height: 32px;
        width: 32px;
        line-height: 32px;
        font-size: 14px;
        align-items: center;
        background-color: #dfe1e6;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        border: 0;
        border-radius: 100%;
        box-sizing: border-box;
        color: #172b4d;
        display: inline-flex;
        font-weight: 700;
        justify-content: center;
        opacity: 1;
        overflow: hidden;
        white-space: nowrap;
    }
`

export const StyledListWrapper = styled.div`
    width: 272px;
    margin: 0 4px;
    box-sizing: border-box;
    display: inline-block;
    margin-top: 8px;
    vertical-align: top;
    white-space: nowrap;

    &:first-child {
        margin-left: 8px;
    }

    &:last-child {
        margin-right: 8px;
    }

    &.mod-add {
        background-color: #ebecf0;
        border-radius: 3px;
        min-height: 32px;
        padding: 4px;
        transition: background 85ms ease-in,opacity 40ms ease-in,border-color  
    }

    &.is-idle {
        background-color: hsla(0,0%,100%,.24);
        cursor: pointer;

        &:hover {
            background-color: hsla(0,0%,100%,.32);
        }
    }

    .list-placeholder {
        color: #fff;
        display: block;
        padding: 6px 8px;
        text-decoration: none;
        transition: color 85ms ease-in;
    }
    
    .list-add-controls {
        height: 32px;
        margin: 4px 0 0;
        overflow: hidden;
        transition: margin 85ms ease-in,height 85ms ease-in;
    }
`

export const StyledListContent = styled.div`
    background-color: #dfe1e6;
    border-radius: 3px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    position: relative;
    white-space: normal;
`

export const StyledListHeader = styled.div`
    flex: 0 0 auto;
    min-height: 20px;
    padding: 10px 8px;
    padding-right: 36px;
    position: relative;

    .list-header-name {
        font-weight: 600;
        height: 28px;
        margin: -4px 0;
        overflow: hidden;
        overflow-wrap: break-word;
        padding: 4px 8px;
    }
`

export const StyledListCards = styled.div`
    flex: 1 1 auto;
    margin: 0 4px;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 4px;
    z-index: 1;
`

export const StyledCardWrapper = styled.div`
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,30,66,.25);
    cursor: pointer;
    display: block;
    margin-bottom: 8px;
    max-width: 300px;
    min-height: 20px;
    position: relative;
    text-decoration: none;
    z-index: 0;

    .card-details {
        overflow: hidden;
        padding: 6px 8px 2px;
        position: relative;
        z-index: 10;
    }

    .card-operations {
        background-color: #f4f5f7;
        background-clip: padding-box;
        background-origin: padding-box;
        border-radius: 3px;
        opacity: .8;
        padding: 4px;
        position: absolute;
        right: 2px;
        top: 2px;
        visibility: hidden;
        z-index: 40;

        &:hover {
            background-color: #ebecf0;
            opacity: 1;
        }
    }

    &:hover {
        color: #091e42;
        background-color: #f4f5f7;
        border-bottom-color: rgba(9,30,66,.25);

        .card-operations {
            visibility: visible;
        }
    }
`

export const StyledCardComposer = styled.div`
    padding: 0px 6px;
    padding-bottom: 8px;

    &.open {
        border-radius: 3px;
        color: #5e6c84;
        cursor: pointer;
        display: flex;
        flex: 1 0 auto;
        margin: 2px 8px 8px 8px;
        padding: 4px 8px;
        position: relative;
        text-decoration: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    &.open:hover {
        background-color: rgba(9,30,66,.08);
        color: #172b4d;
    }
`

export const StyledInput = styled.input.attrs({ type: props => props.type || 'text' })`
    background-color: #fafbfc;
    border: none;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    color: #172b4d;
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 3px;
    display: block;
    line-height: 20px;
    margin-bottom: 12px;
    padding: 8px 12px;
    transition-property: background-color,border-color,box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;

    &.list-name-input {
        background: #fff;
        box-shadow: inset 0 0 0 2px #0079bf;
        margin: 0;
        transition: margin 85ms ease-in,background 85ms ease-in;
        width: 100%;
    }

    &.popover-input {
        background-color: #fafbfc;
        border: none;
        box-shadow: inset 0 0 0 2px #dfe1e6;
        color: #172b4d;
        box-sizing: border-box;
        -webkit-appearance: none;
        border-radius: 3px;
        display: block;
        line-height: 20px;
        margin-bottom: 12px;
        padding: 8px 12px;
        transition-property: background-color,border-color,box-shadow;
        transition-duration: 85ms;
        transition-timing-function: ease;
        width: 100%;

        &:hover {
            background-color: #ebecf0;
            border: none;
            box-shadow: inset 0 0 0 2px #dfe1e6;
        }

        &:focus {
            background: #fff;
            border: none;
            box-shadow: inset 0 0 0 2px #0079bf;
        }
    }

    &.form-field {
        font-size: 14px;
        background: #EDEFF0;
        background-color: #FAFBFC;
        border: 2px solid #DFE1E6;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 3px;
        height: 44px;
        -webkit-transition: background-color .2s ease-in-out 0s,border-color .2s ease-in-out 0s;
        transition: background-color .2s ease-in-out 0s,border-color .2s ease-in-out 0s;
        padding: .5em;
        max-width: 400px;
        width: 100%;
        margin: 0 0 1.2em;
        box-shadow: none;
        line-height: normal;

        &:focus {
            background-color: white;
            border: 2px solid #4C9AFF;
            box-shadow: 0 0 0;
        }
    }
`

export const StyledTextArea = styled.textarea`
    background-color: #fafbfc;
    border: none;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    color: #172b4d;
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 3px;
    display: block;
    line-height: 20px;
    margin-bottom: 12px;
    padding: 8px 12px;
    resize: none;
    transition-property: background-color,border-color,box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;
    width: 100%;

    &.card-composer-textarea {
        background: none;
        border: none;
        box-shadow: none;
        margin-bottom: 4px;
        max-height: 162px;
        min-height: 54px;
        overflow-y: auto;
        padding: 0;
        overflow: hidden;
        overflow-wrap: break-word;
        height: 54px;
    }

    &.is-editing {
        background: #fff;
        box-shadow: inset 0 0 0 2px #0079bf;
        height: 108px;
        margin-bottom: 4px;
        overflow: hidden;
        overflow-wrap: break-word;
        position: relative;
        resize: none;
    }

    &.mod-card-back-title {
        border-radius: 3px;
        font-size: 20px;
        font-weight: 600;
        height: 32px;
        line-height: 24px;
        margin: -4px -8px;
        min-height: 32px;
        padding: 4px 8px;
    }

    &.checklist-new-item-text {
        background: #fff;
        border: none;
        box-shadow: inset 0 0 0 2px #0079bf;
        color: #172b4d;
        cursor: text;
        resize: vertical;
        height: 56px;
        cursor: pointer;
        min-height: 32px;
        margin: 4px 0 0;
        display: block;
        padding-bottom: 9px;
        z-index: 50;
        width: 100%;
        overflow: hidden;
        text-align: initial;
        text-decoration: none;
    }

    &.checklist-title-text {
        height: 54px;
        background: rgba(9,30,66,.04);
        border-color: rgba(9,30,66,.13);
        box-shadow: inset 0 0 0 1px rgba(9,30,66,.13);
        margin-bottom: 4px;
        font-size: 16px;
        line-height: 19px;
        font-weight: 700;
    }

    &.checklist-item-title-text {
        background: rgba(9,30,66,.04);
        border-color: rgba(9,30,66,.13);
        box-shadow: inset 0 0 0 1px rgba(9,30,66,.13);
        margin-bottom: 4px;
        height: 56px
    }

    &.list-card-edit-title {
        background-color: #fff;
        border: 1px solid transparent;
        box-shadow: none;
        height: 90px;
        padding: 0;
        margin: -1px;
    }
`

export const StyledSelect = styled.select`
    max-height: 300px;
    width: 256px;
    margin-bottom: 8px;

    &.popover-select {
        margin-bottom: 14px;
        width: 100%;
    }
`

export const StyledSelectLabel = styled.span`
    color: #5e6c84;
    display: block;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 0;
`

export const StyledSelectValue = styled.span`
    display: block;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const StyledOptGroup = styled.optgroup`
    font-weight: 700;
    color: inherit;
    font: inherit;
    margin: 0;
`

export const StyledSubmit = styled.input.attrs({ type: 'submit' })`
    background-color: rgba(9,30,66,.04);
    border-radius: 3px;
    box-shadow: none;
    box-sizing: border-box;
    -webkit-appearance: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    font-weight: 400;
    line-height: 20px;
    margin: 8px 4px 0 0;
    padding: 6px 12px;
    text-align: center;
    transition-property: background-color,border-color,box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;

    &.primary {
        background-color: #5aac44;
        color: #fff;

        &:hover {
            background-color: #61bd4f;
        }
    }

    &.negate {
        background-color: #cf513d;
        color: #fff;

        &:hover {
            background-color: #eb5a46;
        }
    }

    &.wide {
        padding-left: 24px;
        padding-right: 24px;
    }

    &.full {
        width: 100%;
    }

    &.mod-list-add-button {
        float: left;
        min-height: 32px;
        height: 32px;
        margin-top: 0;
        padding-top: 4px;
        padding-bottom: 4px;
    }

    &.mod-compact {
        margin-top: 0;
        margin-bottom: 0;
        vertical-align: top;
    }

    &.mod-submit-edit {
        border: none;
        margin-top: 0;
        margin-bottom: 0;
    }

    &.mod-float-right {
        float: right;
    }

    &.mod-account {
        padding: .6em 1.3em;
        font-weight: bold;
        border-radius: .3em;
        margin-top: 0;
    }
`

export const StyledIcon = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;

    &:hover {
        color: #172b4d;
        text-decoration: none;
    }

    &.icon-lg, &.icon-md {
        height: 32px;
        line-height: 32px;
        width: 32px;
    }

    &.icon-sm {
        height: 20px;
        font-size: 16px;
        line-height: 20px;
        width: 20px;
    }

    &.mr-2 {
        margin-right: 2px;
    }

    &.due-date-complete-icon {
        height: 18px;
        line-height: 18px;
        width: 18px;
        background-color: #0079bf;
        box-shadow: inset 0 0 0 2px #0079bf;
    }

    &.due-date-complete-icon:hover {
        background-color: #5ba4cf;
        box-shadow: inset 0 0 0 2px #5ba4cf;
    }

    &.due-date-arrow-icon {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        margin: 0 !important;
        text-align: center;
        text-decoration: none;
        vertical-align: bottom;
        color: #42526e;
        padding: 0 6px;
    }

    &.checklist-checkbox-icon {
        height: 18px;
        line-height: 18px;
        width: 18px;
        opacity: 1;
    }

    &.popover-close-icon {
        color: #6b778c;
        padding: 10px 12px 10px 8px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
    }

    &.label-edit-icon {
        border-radius: 3px;
        padding: 6px;
        position: absolute;
        top: 0;
        right: 0;

        &:hover {
            background-color: rgba(9,30,66,.08);
        }
    }

    &.label-selected-icon {
        position: absolute;
        top: 6px;
        right: 6px;
    }

    &.label-color-selected-icon {
        left: 14px;
        position: absolute;
        top: 6px;
    }

    &.popover-back-icon {
        color: #6b778c;
        padding: 10px 8px 10px 12px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }

    &.board-selected-icon {
        position: absolute;
        bottom: 0;
        right: 0;
    }
`

export const StyledFormGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .form-grid-child-full {
        flex: 1 1 100%;
        max-width: 100%;
    }
    
    .form-grid-child {
        flex: 1;
        margin: 0 0 8px;
    }

    .form-grid-child-threequarters {
        flex: 3;
        margin-right: 8px;      
    }
`

export const StyledButtonLink = styled.div`
    background-color: rgba(9,30,66,.04);
    box-shadow: none;
    border: none;
    border-radius: 3px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: 100%;
    margin-top: 8px;
    max-width: 300px;
    overflow: hidden;
    padding: 6px 12px;
    position: relative;
    text-decoration: none;
    text-overflow: ellipsis;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    white-space: nowrap;
    transition-property: background-color,border-color,box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;

    &.setting {
        flex-direction: column;
        float: left;
        height: 48px;
        margin-top: 0;
        position: relative;
    }

    &.negate {
        background-color: #cf513d;
        box-shadow: none;
        border: none;
        color: #fff;
    }

    &.negate:hover{
        background-color: #eb5a46;
        box-shadow: none;
        border: none;
        color: #fff;
    }

    ${StyledSelect} {
        border: none;
        cursor: pointer;
        height: 50px;
        left: 0;
        margin: 0;
        opacity: 0;
        position: absolute;
        top: 0;
        z-index: 2;
        width: 100%;
    }

    .icon-sm {
        margin: 0 6px 0 -6px;
    }

    &.due-date-button {
        margin: auto;
        padding-right: 0;

        .status-lozenge {
            background-color: #5aac44;
            color: #fff;
            font-size: 12px;
            line-height: 16px;
            padding: 0 4px;
            text-transform: uppercase;
            border-radius: 2px;
            margin: auto 0 auto 8px;
        }
    }
`

export const StyledCardLabels = styled.div`
    overflow: auto;
    position: relative;
`

export const StyledCardTitle = styled.span`
    clear: both;
    display: block;
    margin: 0 0 4px;
    overflow: hidden;
    text-decoration: none;
    word-wrap: break-word;
`

export const StyledCardLabel = styled.div`
    background-color: #b3bac5;
    border-radius: 4px;
    color: #fff;
    display: block;
    margin-right: 4px;
    max-width: 100%;
    overflow: hidden;
    padding: 4px 6px;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &.mod-card-front {
        float: left;
        font-size: 12px;
        font-weight: 700;
        height: 8px;
        line-height: 100px;
        margin: 0 4px 4px 0;
        max-width: 40px;
        min-width: 40px;
        padding: 0;
        text-shadow: none;
        width: auto;
    }

    &.mod-card-detail {
        border-radius: 3px;
        box-sizing: border-box;
        display: block;
        float: left;
        font-weight: 600;
        height: 32px;
        line-height: 32px;
        margin: 0 4px 4px 0;
        min-width: 40px;
        padding: 0 12px;
        width: auto;
    }

    &.mod-edit-label {
        float: left;
        height: 32px;
        margin: 0 8px 8px 0;
        padding: 0;
        width: 48px;
    }

    &.mod-clickable {
        cursor: pointer;

        &:hover {
            opacity: .8;
        }
    }

    &.mod-selectable {
        border-radius: 3px;
        cursor: pointer;
        font-weight: 700;
        margin: 0 0 4px;
        min-height: 20px;
        padding: 6px 12px;
        position: relative;
        transition: padding 85ms,margin 85ms,box-shadow 85ms;

        &:hover {
            margin-left: 4px;
        }
    }

    &.label-green {
        background-color: #61bd4f;
    }
    
    &.label-yellow {
        background-color: #f2d600;
    }
    
    &.label-orange {
        background-color: #ff9f1a;
    }
    
    &.label-red {
        background-color: #eb5a46;
    }
    
    &.label-purple {
        background-color: #c377e0;
    }
    
    &.label-blue {
        background-color: #0079bf;
    }
    
    &.label-sky {
        background-color: #00c2e0;
    }
    
    &.label-lime {
        background-color: #51e898;
    }
    
    &.label-pink {
        background-color: #ff78cb;
    }
    
    &.label-black {
        background-color: #344563;
    }
`

export const StyledCardBadges = styled.div`
    float: left;
    width: 100%;
    margin-left: -2px;

    .badge {
        color: #5e6c84;
        display: inline-block;
        margin: 0 4px 4px 0;
        max-width: 100%;
        min-height: 20px;
        overflow: hidden;
        position: relative;
        padding: 2px;
        text-decoration: none;
        text-overflow: ellipsis;
        vertical-align: top;
    }

    .badge-board {
        color: #6b778c;
        float: right;
    }
`

export const StyledDialogOverlay = styled.div`
    color: #172b4d;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    
    align-items: flex-start;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    overflow-y: auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 20;

    a {
        color: #172b4d;
    }
`

export const StyledDialogWrapper = styled.div`
    background-color: #f4f5f7;
    border-radius: 2px;
    display: block;
    margin: 48px 0 80px;
    min-height: 600px;
    overflow: hidden;
    position: relative;
    width: 768px;
    z-index: 25;
`

export const StyledDialogHeader = styled.div`
    margin: 12px 40px 8px 56px;
    min-height: 32px;
    position: relative;
    z-index: 1;
`

export const StyledDialogContent = styled.div`
    float: left;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 24px;
    padding: 0 8px 8px 16px;
    position: relative;
    width: 552px;
    z-index: 0;

    &.settings {
        padding: 0;
        margin: 16px 8px 8px 16px;
        width: 100%;
    }
`

export const StyledDialogTitle = styled.div`
    margin: 4px 0 0;
    padding: 8px 0 0;

    .card-detail-title {
        margin-right: 4px;
        margin-bottom: 0;
    }
`

export const StyledDialogHeaderInlineContent = styled.div`
    cursor: default;
    display: inline-block;
    margin: 4px 8px 4px 2px;

    .quiet {
        color: #5e6c84; 
    }
`

export const StyledDialogBadges = styled.div`
    margin-top: 8px;
    margin-left: 40px;
`

export const StyledDialogDescription = styled.div`
`

export const StyledDialogModule = styled.div`
    clear: both;
    margin-left: 40px;
    margin-bottom: 24px;
    position: relative;

    &.no-ml {
        margin-left: 0;
    }
`

export const StyledDialogModuleTitle = styled.div`
    border-bottom: none;
    display: flex;
    align-items: center;
    margin: 0 0 4px 0;
    min-height: 32px;
    padding: 8px 0;
    position: relative;

    h3 {
        width: auto;
        margin: 0;
        min-height: 18px;
        min-width: 40px;
    }

    .icon-checklist {
        left: -40px;
        position: absolute;
        top: 8px;
        cursor: default;
    }

    &.ml-40 {
        margin-left: 40px;
    }
`

export const StyledDialogSidebar = styled.div`
    float: right;
    padding: 0 16px 8px 8px;
    width: 168px;
    overflow: hidden;
    z-index: 10;
`

export const StyledDialogSidebarSection = styled.div`
    clear: both;
    margin-bottom: 24px;
    position: relative;

    h3 {
        color: #5e6c84;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: .04em;
        line-height: 16px;
        text-transform: uppercase;
        line-height: 20px;
        margin-bottom: -4px;
    }
`

export const StyledDialogArchiveBanner = styled.div`
    background-color: #fdfae5;
    background-image: linear-gradient(to bottom right,rgba(0,0,0,.05) 25%,transparent 0,transparent 50%,rgba(0,0,0,.05) 0,rgba(0,0,0,.05) 75%,transparent 0,transparent);
    background-size: 14px 14px;
    min-height: 30px;
    padding: 12px 12px 12px 50px;
    position: relative;
`

export const StyledDescription = styled.div`
    cursor: pointer;
    position: relative;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word; 
`

export const StyledText = styled.p`
    &.fake-text-area {
        box-shadow: none;
        border: none;
        border-radius: 3px;
        display: block;
        min-height: 40px;
        padding: 8px 12px;
        text-decoration: none;
    }

    &.empty {
        background-color: rgba(9,30,66,.04);
    }

    &.archive {
        font-size: 16px;
        line-height: 30px;
        margin: 0;
    }
`

export const StyledEditControls = styled.div`
    clear: both;
    display: flex;
    flex-direction: row;
    margin-top: 8px;
`

export const StyledH2 = styled.h2`
    &.detail-title {
        margin-right: 4px;
        margin-bottom: 0;
    }
`

export const StyledCardDetailItem = styled.div`
    display: block;
    float: left;
    margin: 0 8px 8px 0;
    max-width: 100%;
`

export const StyledCardDetailItemHeader = styled.h3`
    color: #5e6c84;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .04em;
    line-height: 16px;
    margin-top: 16px;
    text-transform: uppercase;
    display: block;
    line-height: 20px;
    margin: 0 8px 4px 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

export const StyledCardDetailItemAddButton = styled.div`
    background-color: rgba(9,30,66,.04);
    box-shadow: none;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    float: left;
    margin: 0 4px 4px 0;
    transition-property: background-color,border-color,box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    width: 32px;

    &:hover {
        background-color: rgba(9,30,66,.08);
    }
`

export const StyledCardDetailItemContent = styled.div`
    &.due-date-badge {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0 8px 8px 0;
    }

    &.is-clickable {
        cursor: pointer;
    }
`

export const StyledDueDateCompleteBox = styled.div`
    border-radius: 2px;
    box-sizing: border-box;
    line-height: 18px;
    overflow: hidden;
    text-indent: 100%;
    height: 18px;
    width: 18px;
    white-space: nowrap;
    background-color: #fafbfc;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    margin: auto 4px auto 0;

    &:hover {
        background: #ebecf0;
        box-shadow: inset 0 0 0 2px #dfe1e6;
    }
`

export const StyledCheckList = styled.div`
    margin-bottom: 24px;
`

export const StyledCheckListContent = styled.div`
    min-height: 8px;
`

export const StyledCheckListTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row wrap;
    width: 100%;

    h3 {
        margin: 6px 0;
    }
`

export const StyledH3 = styled.h3`
    &.current { 
        cursor: pointer;
    }
`

export const StyledButton = styled.a.attrs({ href: '/#' })`
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
    color: #172b4d;
    font-size: 14px;
    background-color: rgba(9,30,66,.04);
    box-shadow: none;
    display: inline-block;
    font-weight: 400;
    line-height: 20px;
    margin: 8px 4px 0 0;
    padding: 6px 12px;
    text-align: center;
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 3px;
    margin-bottom: 8px;
    text-decoration: none;
    position: relative;
    border-radius: 3px;
    border: 0;
    cursor: pointer;

    &:hover {
        background-color: rgba(9,30,66,.08);
    }

    &.subtle{
        background-color: rgba(9,30,66,.04);
        border: none;
    }

    &.full {
        width: 100%;
    }

    &.header-member-menu-button {
        border: none;
        border-radius: 3px;
        box-shadow: none;
        color: #172b4d;
        cursor: pointer;
        background-color: transparent;
        display: block;
        height: 32px;
        margin: 0;
        position: relative;
        text-decoration: none;
        width: 32px;
        line-height: 32px;
        padding: 0;
        transition: 0.1s ease;
        white-space: nowrap;
	    outline: 0;
    }
`

export const StyledCheckListOptions = styled.div`
    float: right;
    margin: 0 2px 0 auto;

    ${StyledButton} {
        margin: 0 8px 0 0;

        &:last-child {
            margin: 0;
        }
    }
`

export const StyledCheckListTitleEdit = styled.div`
    display: block;
    float: left;
    padding-bottom: 9px;
    position: relative;
    z-index: 50;
    width: 100%;
`

export const StyledCheckListWarnings = styled.p`
`

export const StyledCheckListItemOptions = styled.div`
    display: inline-flex;
    flex-direction: row;
    float: right;
    visibility: hidden;

    .checklist-item-menu {
        box-sizing: border-box;
        padding: 2px;
        height: 24px;
        min-width: 24px;
        margin-left: 4px;
        width: 24px;
        border-radius: 3px;
        cursor: pointer;

        &:hover {
            background-color: rgba(9,30,66,.08);
        }
    }
`

export const StyledCheckListItem = styled.div`
    clear: both;
    padding-left: 40px;
    position: relative;
    border-radius: 3px;
    transform-origin: left bottom;
    transition-property: transform,opacity,height,padding,margin;
    transition-duration: .14s;
    transition-timing-function: ease-in;

    &:hover {
        background-color: rgba(9,30,66,.04);
    }

    &:hover ${StyledCheckListItemOptions} {
        visibility: visible;
    }
`

export const StyledCheckListItemCheckbox = styled.div`
    border-radius: 2px;
    box-sizing: border-box;
    line-height: 18px;
    overflow: hidden;
    text-indent: 100%;
    height: 18px;
    width: 18px;
    white-space: nowrap;
    background-color: #fafbfc;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    position: absolute;
    left: 0;
    margin: 6px;
    text-align: center;
    top: 2px;
    cursor: pointer;

    &.checked { 
        background-color: #0079bf;
        box-shadow: inset 0 0 0 2px #0079bf;

        &:hover {
            background: #ebecf0;
            box-shadow: inset 0 0 0 2px #dfe1e6;
            cursor: pointer;
            text-indent: 0;
            background-color: #5ba4cf;
            box-shadow: inset 0 0 0 2px #5ba4cf;
            }
    }
`

export const StyledCheckListItemDetails = styled.div`
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;
`

export const StyledCheckListItemRow = styled.div`
    display: flex;
    flex-direction: row;

    &.current {
        cursor: pointer;
    }
`

export const StyledCheckListItemTitle = styled.div`
    padding: 6px 0;
    width: 100%;
    display: inline-flex;
`

export const StyledCheckListItemTitleEdit = styled.div`
    display: block;
    float: left;
    padding-bottom: 9px;
    position: relative;
    z-index: 50;
    width: 100%;
`

export const StyledCheckListItemTitleText = styled.span`
    min-height: 20px;
    margin-bottom: 0;
    align-self: center;
    flex: 1;

    &.complete {
        color: #5e6c84;
        text-decoration: line-through;
    }
`

export const StyledCheckListAddItem = styled.div`
    margin-left: 40px;
`

export const StyledPopoverWrapper = styled.div`
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08);
    overflow: hidden;
    width: 304px;
    z-index: 70;
`

export const StyledPopoverHeader = styled.div`
    height: 40px;
    position: relative;
    margin-bottom: 8px;
    text-align: center;
`

export const StyledPopoverContent = styled.div`
    max-height: 868px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 12px 12px;

`

export const StyledPopoverTitle = styled.span`
    box-sizing: border-box;
    color: #5e6c84;
    display: block;
    line-height: 40px;
    border-bottom: 1px solid rgba(9,30,66,.13);
    margin: 0 12px;
    overflow: hidden;
    padding: 0 32px;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export const StyledH4 = styled.h4`
`

export const StyledPopoverSection = styled.div`
    margin-top: 12px;

    ${StyledH4} {
        font-weight: 700;
        color: #5e6c84;
        font-size: 12px;
        line-height: 16px;
        margin-top: 12px;
        margin-bottom: 4px;
        display: block;

        &:first-child {
            margin-top: 4px;
        }
    }
`

export const StyledUList = styled.ul`
    &.edit-labels {
        margin-bottom: 8px;
    }

    &.board-options { 
        display: flex;
        flex-wrap: wrap;
    }
`

export const StyledUListItem = styled.li`
    padding-right: 36px;
    position: relative;

    &.member-popup-item {
        cursor: pointer;
        background-color: transparent;
        border: none;
        background: #fff;
        border-radius: 0;
        box-shadow: none;
        color: #172b4d;
        display: block;
        height: 100%;
        padding: 6px 12px;
        text-align: left;
        text-decoration: none;
        width: 100%;
        transition: none;
        margin: 0;
        outline: 0;

        &:hover {
            background-color: transparent;
            border: none;
            box-shadow: none;
            color: #172b4d;
            background: rgba(9,30,66,.04);
        }
    }
`

export const StyledDatePicker = styled.div`
    &::after {
        clear: both;
        content: "";
        display: table;
    }
`

export const StyledDatePickerSelect = styled.div`
    box-sizing: border-box;
    float: left;
    width: 50%;

    &:first-child {
        padding-right: 12px;
    }
`

export const StyledDatePickerLabel = styled.label`
    font-weight: 700;
    color: #5e6c84;
    font-size: 12px;
    line-height: 16px;
    margin-top: 12px;
    margin-bottom: 4px;
    display: block;

    input {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
        font-size: 14px;
        font-weight: 400;
        margin: 4px 0 12px;
        width: 100%;
        background-color: #fafbfc;
        border: none;
        box-shadow: inset 0 0 0 2px #dfe1e6;
        color: #172b4d;
        box-sizing: border-box;
        -webkit-appearance: none;
        border-radius: 3px;
        display: block;
        line-height: 20px;
        padding: 8px 12px;
        transition-property: background-color,border-color,box-shadow;
        transition-duration: 85ms;
        transition-timing-function: ease;

        &:hover {
            background-color: #ebecf0;
            border: none;
            box-shadow: inset 0 0 0 2px #dfe1e6;
        }

        &:focus {
            background: #fff;
            border: none;
            box-shadow: inset 0 0 0 2px #0079bf;
        }
    }

    .DayPickerInput {
        .DayPickerInput-OverlayWrapper {
            display: none !important;
        }
    }
`

export const StyledPickers = styled.div`
    display: block;
    background: #fff;

    .DayPicker {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
        font-size: 14px;
        font-weight: 400;
        width: 100%;
    }

    .DayPicker-Caption {
        visibility: hidden;
    }

    .DayPicker-Day {
        border: 1px solid #c1c7d0;
        background: #fff;
        width: 40px;
        padding: 0;
        text-align: center;
        cursor: pointer;
        outline: none;
        margin: 0;
        padding: 4px;
        line-height: 20px;
        border-radius: 0;

        &:not(.DayPicker-Day--outside):hover {
            background-color: rgba(9,30,66,.08) !important;
        }

        &.DayPicker-Day--today {
            color: #0079bf;
            font-weight: 700;
        }

        &.DayPicker-Day--selected {
            color: #fff;
            background: #0079bf;

            &:hover {
                background: #298fca !important;
            }
        }

        &.DayPicker-Day--outside {
            cursor: default;
            background-color: #f4f5f7;
        }
    }

    .DayPicker-Weekday {
        color: #172b4d;
        background: #ebecf0;
        border: 1px solid #c1c7d0;
        border-bottom: none;
        line-height: 25px;
        font-weight: 700;
        height: 26px;
        width: 40px;
        padding: 0;
        text-align: center;
    }


    .DayPicker-Month {
        margin: 0;
    }

    .DayPicker-Months { 
        width: 100%;
    }

    .DayPicker-NavBar {
        display: flex;
        height: 44px;
        width: 100%;
    }

    .DayPicker-NavBar button {
        color: #5e6c84;
        cursor: pointer;
        text-decoration: underline;
        z-index: 999;
    }


    ${StyledButton} {
        float: left;
        display: block;
        position: absolute;
        outline: none;
        white-space: nowrap;
        border-radius: 3px;
        cursor: pointer;
        padding: 6px 10px;
        color: #5e6c84;
        text-decoration: underline;
        margin: 6px 0;
        line-height: 20px;
        border: none;
        background: none;
        font-weight: 400;
        box-shadow: none;
        top: 0;
        z-index: 999;

        &:hover {
            background-color: rgba(9,30,66,.08);
            color: #172b4d;
        }
    }
`

export const StyledDatePickerCaption = styled.div`
    color: #5e6c84;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
`

export const StyledDatePickerCaptionLabel = styled.label`
    display: inline-block;
    position: relative;
    z-index: 9999;
    border-radius: 3px;
    cursor: pointer;
    padding: 6px 10px;
    color: #5e6c84;
    text-decoration: underline;
    margin: 6px 0;
    line-height: 20px;
    margin-left: 0;
    margin-right: 0;
    padding-left: 4px;
    padding-right: 4px;
    transition-property: background-color,border-color,box-shadow;
    transition-duration: 85ms;
    transition-timing-function: ease;

    &:hover {
        background-color: rgba(9,30,66,.08);
        color: #172b4d;
    }

    ${StyledSelect} { 
        display: inline-block;
        cursor: pointer;
        position: absolute;
        z-index: 9998;
        margin: 0;
        left: 0;
        top: 5px;
        filter: alpha(opacity=0);
        opacity: 0; 
        width: 100%;
    }
`

export const StyledItemAction = styled.a.attrs({ href: "/#" })`
    cursor: pointer;
    display: block;
    font-weight: 400;
    padding: 6px 12px;
    position: relative;
    margin: 0 -12px;
    text-decoration: none;
`

export const StyledH1 = styled.h1`
`

export const StyledInnerSection = styled.section`
    margin-top: 100px;
    width: 100%;
    padding: 0px;
    overflow: visible;
    margin-bottom: 30px;

    ${StyledH1} {
        text-align: center;
        color: 
        #5E6C84;
        font-size: 16px;
        letter-spacing: -0.01em;
        line-height: 28px;
        margin-top: 10px;
        margin-bottom: 25px;
    }
`

export const StyledSectionWrapper = styled.div`
    max-width: 400px;
    margin: 0 auto;
`

export const StyledAccountForm = styled.div`
    display: block;
    max-width: 585px;
    margin: 0 auto;
    position: relative;
    background-color: #FFFFFF;
    border-radius: 3px;
    padding: 25px 40px;
    box-shadow: rgba(0,0,0,0.1) 0 0 10px;
`

export const StyledDivider = styled.hr`
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid hsl(0,0%,80%);
    margin: 25px 0 1em 0;
    padding: 0;
`

export const StyledForm = styled.form`
`

export const StyledFormLink = styled.span`
    text-align: center;
    font-size: 14px;
    display: block;
    padding: 0;
`

export const StyledLink = styled.a`
    background: transparent;
    text-decoration: none;
    color: #0052CC;
`

export const StyledBoardOption = styled.li`
    width: 22.5%;
	padding: 0;
    margin: 0 2% 2% 0;
	transform: translate(0);
	box-sizing: border-box;
    position: relative;
    cursor: pointer;
`

export const StyledBoardTile = styled.button`
    border-radius: 3px;
    border: none;
	display: block;
	background-color: #97a0af;
    background-size: cover;
    background-position: 50%;
    color: #fff;
    line-height: 20px;
    padding: 8px;
    position: relative;
    text-decoration: none;
    width: 100%;
    outline: none;
`

export const StyledBoardTileDetails = styled.div`
    display: flex;
    height: 80px;
    position: relative;
    flex-direction: column;
    justify-content: space-between;
`

export const StyledBoardTileDetailsName = styled.div`
    flex: 0 0 auto;
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    overflow: hidden;
    max-height: 40px;
    width: 100%;
    word-wrap: break-word;
    text-align: left;
`

export const StyledMemberPopover = styled.div`
    z-index: 70;
	width: 304px;
	font-size: 14px;
	line-height: 20px;
	font-weight: 400;
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.08);
	box-sizing: border-box;
	outline: 0;
	overflow: hidden;
`

export const StyledMemberPopoverHeader = styled.header`
    margin-bottom: 8px;
	padding: 0 12px;
	position: relative;
	text-align: center;
	display: grid;
    grid-template-columns: 12px 1fr 12px;
    
    ${StyledH1} {
        font-size: 14px;
        line-height: 20px;
        font-weight: 400;
        border-bottom: 1px solid rgba(9, 30, 66, 0.13);
        color: #5e6c84;
        height: 40px;
        display: block;
        line-height: 40px;
        margin: 0;
        overflow: hidden;
        padding: 0 32px;
        position: relative;
        text-overflow: ellipsis;
        white-space: nowrap;
        grid-column: 1 / span 3;
        grid-row: 1;
    }
`

export const StyledMemberPopoverContent = styled.div`
    padding: 0 0 12px 0;
	overflow: hidden;
	max-height: 672px;
`

export const StyledCardEditor = styled.div`
    bottom: 0;
    color: #fff;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 10;
`

export const StyledCardEditorContent = styled.div`
    position: absolute;
    z-index: 1;
`

export const StyledCardEditorCard = styled.div`
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(9,30,66,.25);
    cursor: default;
    display: block;
    margin-bottom: 8px;
    max-width: 300px;
    min-height: 20px;
    position: relative;
    text-decoration: none;
    z-index: 1;
`

export const StyledCardEditorCover = styled.div`
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`

export const StyledCardEditorDetails = styled.div`
    overflow: hidden;
    padding: 6px 8px 2px;
    position: relative;
    z-index: 10;
`

export const StyledCardEditorButtons = styled.div`
    left: 100%;
    position: absolute;
    top: 0;
    width: 240px;
    z-index: 0;
    opacity: 1;
    transform: translateX(0);
    transition: opacity 85ms ease-in,transform 85ms ease-in;
`

export const StyledCardEditorButtonsItem = styled.a.attrs({ href: '/#' })`
    background: rgba(0,0,0,.6);
    border-radius: 3px;
    clear: both;
    color: #e6e6e6;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    margin: 0 0 4px 8px;
    padding: 6px 12px 6px 8px;
    text-decoration: none;
    transition: transform 85ms ease-in;

    &:hover {
        margin-left: 12px;
    }

    span {
        margin-left: 4px;
    }
`

