import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../src/actions';

const mapStateToProps = (state) => {
  const { auth, answer } = state;
  return { auth, answer };
};

class FindInterestForm extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      term: '',
      money: '',
      submitted: false,
    };
  }

  onChangeMoney(event) {
    document.querySelector('#volume').value = event.target.value;
    this.setState({ money: event.target.value });
  }

  onChangeTerm(event) {
    this.setState({ term: event.target.value });
  }

  handleSubmit() {
    const { dispatch,
      auth: { user: { name, email, fb_id } },
      answer: { hasAnswered } } 
    = this.props;
    const { term, money } = this.state;
    const postData = { term, money, name, email, updated: new Date().toString() };

    dispatch(actions.submitAnswer(postData, fb_id));
  }

  render() {
    const { auth: { user: { name } }, answer: { money, term, hasAnswered } } = this.props;
    if (hasAnswered) {
      var thankYouMessage = (<div>
        <h3>Thank you!</h3>
        <p>
          You have indicated you would like to invest ${money} for {term}
        </p>
      </div>);
    }

    return (
      <div>
        <h3>Welcome {name}</h3>
        <span>Thank you for registering your interest!</span>

        {thankYouMessage}

        { !hasAnswered &&
          <div>
            <p>How much would you be interesting in investing?</p>
            <input
              type="range" min="0" max="100000" id="fader" step="5000"
              list="volsettings"
              onChange={e => this.onChangeMoney(e)}
            />
            <output htmlFor="fader" id="volume">0</output>
            <label htmlFor="term">
              How long would you like to invest for?
            </label>
            <select
              name="term"
              value={this.state.termValue} 
              onChange={e => this.onChangeTerm(e)}
            >
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
            <button onClick={() => this.handleSubmit()}>Submit</button>
          </div>
        }
      </div>
    );
  }

}

export default connect(mapStateToProps)(FindInterestForm);
