/* eslint-disable max-len, no-console, class-methods-use-this, react/button-has-type, jsx-a11y/no-redundant-roles, import/no-extraneous-dependencies */
import React from 'react';
import { hot } from 'react-hot-loader';
import { cachet as methodCachet } from 'react-async-cachet';

const someAsyncAction = () => new Promise(res => setTimeout(res, 3e3, 'Aha!'));
const someAsyncAction2 = () => new Promise((res, rej) => setTimeout(rej, 3e3, 'Oops, It\'s an error'));

class MsgDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: 'Hello'
    };
  }

  @methodCachet
  async handleClick() {
    this.setState({
      msg: await someAsyncAction()
    });
  }

  render() {
    const { msg } = this.state;
    return (
      <div>
        <div>{msg}</div>
        <button onClick={() => this.handleClick()}>Click me!</button>
      </div>
    );
  }
}

export default hot(module)(MsgDisplayer);
