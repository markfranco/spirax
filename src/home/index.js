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

import Profile from '../profile';

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
        <div
          className={sGlobal.container}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <h4>Articles</h4>
        { this.props.auth.userLoggedIn &&
          <div>
            <h2>Hello there {this.props.auth.user.name}</h2>
            <button onClick={() => this.logout()}>Logout</button>
          </div>
        }
        {
          !this.props.auth.userLoggedIn &&
          <button onClick={() => auth.login()}>Login</button>
        }

        <button onClick={() => console.log(this)}>This</button>

        <ul>
          {this.props.articles.map(article =>
            <li key={article.url}>
              <a href={article.url}>{article.title}</a>
              by {article.author}
            </li>,
          )}
        </ul>
        <ul>
          { this.props.offers.items &&
            this.props.offers.items.map(offer =>
              <li key={offer.id}>
                <h4>{offer.title} by {offer.author}</h4>
              </li>,
          )}
        </ul>
        <p>Last updated at:&nbsp;
          { this.props.offers.lastUpdated &&
            new Date(this.props.offers.lastUpdated).toString()
          }
        </p>
        <p>
          <br />
          <br />
        </p>
        <br />

      </Layout>
    );
  }

}

export default connect(
  mapStateToProps,
)(HomePage);
