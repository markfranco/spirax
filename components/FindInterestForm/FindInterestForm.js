import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../src/actions';
import s from './styles.css';

const mapStateToProps = (state) => {
  const { auth, answer } = state;
  return { auth, answer };
};

const validate = (values) => {
  const errors = {};
  if (!values.money) {
    errors.money = 'Required';
  } else if (isNaN(Number(values.money))) {
    errors.money = 'Please enter how much money as a number';
  }

  if (!values.term) {
    errors.term = 'Required';
  } else if (isNaN(Number(values.term))) {
    errors.money = 'Please enter how many months';
  }
  return errors;
};

const renderField = ({ input, label, type, className, meta: { touched, error, warning } }) => (
  <div>
    <label>{label}</label>
    <div className={className}>
      <input {...input} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  </div>
);

let SyncValidationForm = (props) => {

  const { dispatch, handleSubmit, pristine, reset, submitting } = props;

  // Implement these in the future
  function formatMoney(money) {
    return money.lastIndexOf('P', 0) === 0 ? money : `P${money}`;
  }

  function formatTerm(term) {
    // this needs fixing
    // term = term.replace(/[^\d.-]/g, '');
    console.log('term', term);
    const suffix = term === 1 ? 'month' : 'months';
    return `${term} ${suffix}`;
  }

  function onFocusMoney(money) {
    console.log('money', money);
    return money.replace(/[^\d.-]/g, '');
  }

  return (
    <form onSubmit={handleSubmit} className={s.formGroup}>
      <Field
        name="money"
        className={s.field}
        type="text"
        // format={value => formatMoney(value)}
        // onFocus={v => onFocusMoney(v.target.value)}
        component={renderField}
        label="How much money would you like to invest?"
      />
      <Field
        name="term"
        className={s.field}
        type="text"
        // format={value => formatTerm(value)}
        component={renderField}
        label="How many months would you like to invest for?"
      />
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
      </div>
    </form>
  );
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
      <div className={s.welcome}>
        <h3>Welcome {name}</h3>
        <span>Thank you for registering your interest!</span>

        {thankYouMessage}

        { !hasAnswered &&
          <div className={s.formGroup}>
            <p>How much would you be interesting in investing?</p>
            <input
              type="range" min="0" max="100000" id="fader" step="5000"
              list="volsettings"
              onChange={e => this.onChangeMoney(e)}
              required
            />
            <output htmlFor="fader" id="volume">0</output>
            <br />
            <label htmlFor="term">
              How long would you like to invest for?
            </label>
            <select
              name="term"
              value={this.state.termValue} 
              onChange={e => this.onChangeTerm(e)}
              required
            >
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
            <br />
            <button onClick={() => this.handleSubmit()}>Submit</button>
          </div>
        }
      </div>
    );
  }

}

// export default connect(mapStateToProps)(FindInterestForm);
// export default reduxForm({
//   form: 'enquiryForm',
//   validate,
//   // warn Note: could have warning if we like
// })(SyncValidationForm);

SyncValidationForm = reduxForm({
  form: 'enquiryForm',
  enableReinitialize: true,
  validate,
})(SyncValidationForm);

SyncValidationForm = connect(
  props => ({
    initialValues: props.answer,
  }),
)(SyncValidationForm);

export default SyncValidationForm;
