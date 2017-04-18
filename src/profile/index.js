import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout';
import RequireAuth from '../utils/requireAuth';

import AuthService from '../utils/authService';
import * as actions from '../actions';

const auth = new AuthService();

const mapStateToProps = (state) => {
  const { auth, offers } = state;
  return { auth, offers };
};

class Profile extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

    const { dispatch } = this.props;

    // Should check JWT is user is authenticationed
    const isUserLoggedIn = auth.loggedIn();
    const profile = auth.getProfile();

    // This is not right
    dispatch(actions.checkAuth(isUserLoggedIn, profile));
  }

  render() {
    return (
      <Layout>
        <h1>Profile</h1>
        <div>
          {
            this.props.auth.userLoggedIn &&
            <p>Name: {this.props.auth.user.name}</p>
          }
        </div>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(RequireAuth(Profile));
