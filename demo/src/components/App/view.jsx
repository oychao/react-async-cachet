import React from 'react';
import {
  HashRouter, Route, Redirect, Link
} from 'react-router-dom';
import { hot } from 'react-hot-loader';

import MsgDisplayer from '../MsgDisplayer';
import Field from '../Field';

// import './style.less';

const App = () => (
  <div className="app">
    <HashRouter>
      <div>
        <ul className="app__router">
          <li>
            <Link to="/msg">Message</Link>
          </li>
          <li>
            <Link to="/field">Other Route</Link>
          </li>
        </ul>
        <hr />
        <Route exact path="/" render={() => <Redirect to="/msg" />} />
        <Route exact path="/msg" component={MsgDisplayer.view} />
        <Route exact path="/field" component={Field.view} />
      </div>
    </HashRouter>
  </div>
);

export default hot(module)(App);
