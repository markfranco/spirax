/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import Link from '../Link';
// import authService from '../../src/utils/authService';
import s from './Layout.css';
import * as actions from '../../src/actions';
import history from '../../src/history';

// const authService = new AuthService();

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

class Navigation extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  login() {
    this.props.dispatch(actions.requestLogin());
  }

  logout() {
    this.props.dispatch(actions.logoutUser());
    history.push('/');
  }

  render() {
    return (
      <nav className="mdl-navigation" ref={node => (this.root = node)}>
        <Link className={`${s.link}`} to="/about">About</Link>
        {
          this.props.auth.userLoggedIn &&
          <a className={`${s.link}`} onClick={() => this.logout()}>Logout</a>
        }
        {
          !this.props.auth.userLoggedIn &&
          <a className={`${s.link}`} onClick={() => this.login()}>Login</a>
        }
      </nav>
    );
  }

}

export default connect(mapStateToProps)(Navigation);
