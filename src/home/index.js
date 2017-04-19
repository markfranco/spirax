/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout';
import sGlobal from '../assets/global.css';
import s from './styles.css';
import { title, html } from './index.md';
import AuthService from '../utils/authService';
import Article from '../../components/Articles';
import Button from '../../components/Button';

import * as actions from '../actions';

const mapStateToProps = (state) => {
  const { auth, offers } = state;
  return { auth, offers };
};

const auth = new AuthService();

class HomePage extends React.Component {

  static propTypes = {
    articles: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    offers: PropTypes.object,
    // (PropTypes.shape({
    //   title: PropTypes.string.isRequired,
    //   author: PropTypes.string.isRequired,
    // }).isRequired),
    dispatch: PropTypes.func,
    user: PropTypes.object,
    auth: PropTypes.object,
    userLoggedIn: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      profile: auth.getProfile(),
    };
    // listen to profile_updated events to update internal state
    auth.on('profile_updated', (profile) => {
      this.props.dispatch(actions.updateProfile(profile));
    });
  }

  componentDidMount() {
    document.title = title;

    const { dispatch, offers } = this.props;

    // Should check JWT is user is authenticationed
    const isUserLoggedIn = auth.loggedIn();
    const profile = auth.getProfile();

    dispatch(actions.fetchOffersIfNeeded(offers));

    // This is not right
    dispatch(actions.checkAuth(isUserLoggedIn, profile));
  }

  logout() {
    this.props.dispatch(actions.userLogout());
    auth.logout();
  }

  render() {
    return (
      // This should have its own component
      <Layout className={s.content}>
        <div className={s.welcome}>
          <div>
            <span>Equity crowdfunding in Australia and New Zealand</span>
            <h2>Invest in Innovative and Disruptive Companies</h2>
          </div>
          <Button primary accent ripple className={s.invest}>Invest</Button>
          <Button primary accent ripple className={s.raise}>Raise</Button>
        </div>

        <button onClick={() => console.log(this)}>This</button>

        <Article />
        <ul>
          { this.props.offers.items &&
            this.props.offers.items.map(offer =>
              <li key={offer.id}>
                <span>{offer.title} by {offer.author}</span>
              </li>,
          )}
        </ul>
        <p>Last updated at:&nbsp;
          { this.props.offers.lastUpdated &&
            new Date(this.props.offers.lastUpdated).toString()
          }
        </p>

      </Layout>
    );
  }

}

export default connect(
  mapStateToProps,
)(HomePage);
