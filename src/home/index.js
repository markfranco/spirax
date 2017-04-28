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
  const { auth, offers, answer } = state;
  return { auth, offers, answer };
};

const auth = new AuthService();

class HomePage extends React.Component {

  // Fix propTypes properly
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
      term: '',
      money: 0,
    };
    // listen to profile_updated events to update internal state
    auth.on('profile_updated', (profile) => {
      this.props.dispatch(actions.updateProfile(profile));
      this.props.dispatch(actions.checkAuth(true, profile));
    });

    const config = {
      apiKey: 'AIzaSyCIP3g1UX3ToPJtglboEwY_ZXevi9WTvis',
      authDomain: 'seedvest-5e6c0.firebaseapp.com',
      databaseURL: 'https://seedvest-5e6c0.firebaseio.com',
      projectId: 'seedvest-5e6c0',
      storageBucket: 'seedvest-5e6c0.appspot.com',
      messagingSenderId: '838314676214',
    };
    window.firebase.initializeApp(config);

    this.props.dispatch(actions.checkAuth(auth.loggedIn(), auth.getProfile()));
  }

  componentDidMount() {
    document.title = title;
  }

  outputUpdate(vol) {
    document.querySelector('#volume').value = vol;
  }

  onChangeMoney(event) {
    document.querySelector('#volume').value = event.target.value;
    this.setState({
      money: event.target.value,
    });
  }

  onChangeTerm(event) {
    console.log('Term Value', event.target.value);
    this.setState({
      term: event.target.value,
    });
  }

  handleSubmit() {
    const userRef = window.firebase.database().ref(`users/${this.props.auth.user.fb_id}/answer`);

    const postData = {
      term: this.state.term,
      money: this.state.money,
    };

    userRef.transaction((response) => {
      console.log('This was the response', response);
      if (response === null) {
        return postData;
      } else {
        return;
      }
    }, (error, committed, snapshot) => {
      if (error) {
        console.log('Transaction failed abnormally!', error);
      } else if (!committed) {
        console.log('We aborted the transaction.');
      } else {
        console.log('This worked YAY!');
        console.log('committed', committed);
      }
      console.log('Data baby! ', snapshot.val());
    });

    console.log('Got through!');
  }

  logout() {
    this.props.dispatch(actions.userLogout());
    auth.logout();
    // Needs to go to the home page
  }

  render() {
    return (
      // This should have its own component
      <Layout className={s.content}>
        <div className={s.welcome}>
          <div className={s.contentContainer}>

            { !this.props.auth.userLoggedIn &&
              <div>
                <h1>Invest in your local farm</h1>
                <span>Help argiculture in the Philippines</span>

                <div className={s.buttons}>
                  <Button
                    primary accent ripple
                    className={s.register}
                    onClick={() => auth.login()}
                  >
                    Register
                  </Button>
                </div>

              </div>
            }

            { this.props.auth.userLoggedIn &&
              <div>
                <h3>Welcome {this.props.auth.user.name}</h3>
                <span>Thank you for registering your interest!</span>
                <br />
                <br />

                { this.props.answer.term && this.props.answer.money &&
                  <h3>
                    You have indicated you would like to invest ${this.props.answer.money} for {this.props.answer.term}
                  </h3>
                }

                { !this.props.answer.term && !this.props.answer.money &&
                  <div>
                    <p>How much would you be interesting in investing?</p>
                    <input
                      type="range" min="0" max="100000" id="fader" step="5000"
                      list="volsettings" onChange={e => this.onChangeMoney(e)}
                    />
                    <output htmlFor="fader" id="volume">0</output>

                    <br />
                    <br />

                    <label htmlFor="term">How long would you like to invest for?</label>
                    <select name="term" value={this.state.termValue} onChange={e => this.onChangeTerm(e)}>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="1 year">1 year</option>
                      <option value="2 years">2 years</option>
                    </select>

                    <button onClick={() => this.handleSubmit()}>Submit</button>
                  </div>
                }

              </div>
            }
          </div>
        </div>

      </Layout>
    );
  }

}

export default connect(
  mapStateToProps,
)(HomePage);
