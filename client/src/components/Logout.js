import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sessionService } from 'redux-react-session';

import { actionRemoveAuth } from '../actions';


class Logout extends Component {
	// Logs out user and removes his data from session, then redirect to login
	componentDidMount = () => {
		this.props.actionRemoveAuth();
		sessionService.deleteUser()
			.then(() => {
				this.props.history.push('/user/login');
			});
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
