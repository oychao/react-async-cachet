/* eslint-disable max-len, no-console, class-methods-use-this, react/button-has-type, jsx-a11y/no-redundant-roles, import/no-extraneous-dependencies */
import React from 'react';
import { hot } from 'react-hot-loader';
import { cachet } from 'react-async-cachet';

const someAsyncAction = () => new Promise(res => setTimeout(res, 3e3, 'Aha!'));

class MsgDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: 'Hello'
    };
  }

  @cachet
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

console.log(MsgDisplayer.prototype.handleClick);

export default hot(module)(MsgDisplayer);
