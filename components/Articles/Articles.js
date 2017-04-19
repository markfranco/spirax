import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import cx from 'classnames';
import * as actions from '../../src/actions';

const mapStateToProps = (state) => {
  const { auth, articles } = state;
  return { auth, articles };
};

class Articles extends React.Component {

  static propTypes = {
    // component: PropTypes.oneOf([
    //   PropTypes.string,
    //   PropTypes.element,
    //   PropTypes.func,
    // ]),
    type: PropTypes.oneOf(['raised', 'fab', 'mini-fab', 'icon']),
    // to: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
    // href: PropTypes.string,
    // className: PropTypes.string,
    // colored: PropTypes.bool,
    // primary: PropTypes.bool,
    // accent: PropTypes.bool,
    // ripple: PropTypes.bool,
    // children: PropTypes.node,
  };

  componentDidMount() {
    // window.componentHandler.upgradeElement(this.root);
    const { dispatch, articles } = this.props;

    dispatch(actions.fetchArticlesIfNeeded(articles));
  }

  componentWillUnmount() {
    // window.componentHandler.downgradeElements(this.root);
  }

  render() {
    console.log('this.props', this.props);

    return (
      <div>
        <h4>Articles boo</h4>
        <ul>
          {this.props.articles.items.map(article =>
            <li key={article.url}>
              <a href={article.url}>{article.title}</a>
              by {article.author}
            </li>,
          )}
        </ul>

        <p>Last updated at:&nbsp;
          { this.props.articles.lastUpdated &&
            new Date(this.props.articles.lastUpdated).toString()
          }
        </p>
      </div>

    );
  }

}

export default connect(mapStateToProps)(Articles);
