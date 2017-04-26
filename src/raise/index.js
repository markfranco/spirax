import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout';

import AuthService from '../utils/authService';
import * as actions from '../actions';

const auth = new AuthService();

const mapStateToProps = (state) => {
  const { auth, offers } = state;
  return { auth, offers };
};

class Raise extends React.Component {
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

  handleChange(event) {
    console.log('event in handleChange', event);
  }

  // This should have a form component
  render() {
    return (
      <Layout>
        <h1>Initial Questionnaire</h1>
        <p>Please complete the below questionnaire and one of our team will be in touch.</p>
        <form>
          <label htmlFor="name">Name:
            <input type="text" name="name" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(Raise);
