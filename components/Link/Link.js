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
import history from '../../src/history';
import AuthService from '../../src/utils/authService';

const auth = new AuthService('PZRNubBes13c3ZlKIt700T7Cn2zdsHM7', 'markfranco.au.auth0.com');

class Link extends React.Component {

  static propTypes = {
    checkAuth: PropTypes.bool,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onClick: PropTypes.func,
  };

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (this.props.checkAuth) {
      if (!auth.loggedIn()) {
        auth.login();
      }
    }

    if (event.button !== 0 /* left click */) {
      return;
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();

    if (this.props.to) {
      history.push(this.props.to);
    } else {
      history.push({
        pathname: event.currentTarget.pathname,
        search: event.currentTarget.search,
      });
    }
  };

  render() {
    const { to, ...props } = this.props; // eslint-disable-line no-use-before-define
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={typeof to === 'string' ? to : history.createHref(to)} {...props} onClick={this.handleClick} />;
  }

}

export default Link;
