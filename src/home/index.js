import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout';
import sGlobal from '../assets/global.css';
import s from './styles.css';
import { title } from './index.md';
import AuthService from '../utils/authService';
import Button from '../../components/Button';
import FindInterestForm from '../../components/FindInterestForm';

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

    const { dispatch } = this.props;

    this.state = {
      profile: auth.getProfile(),
      term: '',
      money: '',
      submitted: false,
    };

    if (auth.loggedIn()) {
      auth.setProfile(auth.getProfile(), dispatch);
    }
  }

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      // This should have its own component
      <Layout className={s.content}>
        <div className={s.welcome}>
          <div className={s.contentContainer}>

            { !this.props.auth.userLoggedIn &&
              <div className={s.banner}>
                <h1>Invest in your local farm</h1>
                <span>Help argiculture in the Philippines</span>
                <div className={s.buttons}>
                  <Button
                    primary accent ripple
                    className={s.register}
                    onClick={() => auth.login()}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            }

            { this.props.auth.userLoggedIn &&
              <FindInterestForm />
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
