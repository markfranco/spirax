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
import Link from '../Link';
// import AuthService from '../../src/utils/authService';
// import history from '../../src/history';

// const auth = new AuthService('PZRNubBes13c3ZlKIt700T7Cn2zdsHM7', 'markfranco.au.auth0.com');

// const requireAuth = (nextState, replace) => {
//   console.log('this was checked', auth.loggedIn());
//   if (!auth.loggedIn()) {
//     // replace({ pathname: '/login' });
//     history.push({ pathname: '/', search: '/' });
//   }
// };

class Navigation extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    return (
      <nav className="mdl-navigation" ref={node => (this.root = node)}>
        <Link className="mdl-navigation__link" to="/">Home</Link>
        <Link className="mdl-navigation__link" to="/about">About</Link>
      </nav>
    );
  }

}

export default Navigation;
