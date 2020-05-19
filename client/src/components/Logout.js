import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actionRemoveAuth } from '../actions';


class Logout extends Component {
	// Logs out user and removes his data from session, then redirect to login
	componentDidMount = () => {
		window.Trello.deauthorize()
		this.props.actionRemoveAuth();

		this.props.history.push('/');
	};

	render = () => {
		return <div></div>;
	};
};

const mapStateToProps = (state) => {
	return {
	};
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	actionRemoveAuth
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
