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
import domPurify from 'dompurify';
import Layout from '../../components/Layout';
import s from './styles.css';
import { title } from './index.md';
import html from './about.html';
import RequireAuth from '../utils/requireAuth';

class AboutPage extends React.Component {

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout className={s.content}>
        <h1>{title}</h1>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: domPurify.sanitize(html) }}
        />
      </Layout>
    );
  }

}

export default RequireAuth(AboutPage);
