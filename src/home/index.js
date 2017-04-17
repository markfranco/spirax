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
import Layout from '../../components/Layout';
import sGlobal from '../assets/global.css';
import s from './styles.css';
import { title, html } from './index.md';
import AuthService from '../utils/authService';

const auth = new AuthService('PZRNubBes13c3ZlKIt700T7Cn2zdsHM7', 'markfranco.au.auth0.com');

class HomePage extends React.Component {

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    articles: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    profile: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      profile: auth.getProfile(),
    };
    // listen to profile_updated events to update internal state
    auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile });
    });
  }

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout className={s.content}>
        <div
          className={sGlobal.container}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <h4>Articles</h4>
        <button onClick={() => auth.login()}>Login</button>
        <button onClick={() => auth.logout()}>Logout</button>
        <button onClick={() => console.log(this)}>This</button>
        <ul>
          {this.props.articles.map(article =>
            <li key={article.url}>
              <a href={article.url}>{article.title}</a>
              by {article.author}
            </li>,
          )}
        </ul>
        <p>
          <br /><br />
        </p>
        <br />
        <h3>Profile</h3>

      </Layout>
    );
  }

}

export default HomePage;
