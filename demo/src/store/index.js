import {
  createBrowserHistory
} from 'history';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import {
  connectRouter,
  routerMiddleware
} from 'connected-react-router';

import global from './modules/global';

const history = createBrowserHistory();

// do not use this enhancer when in production environment
/* eslint-disable */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
  combineReducers({
    router: connectRouter(history),
    app: global.reducer
  }),
  composeEnhancers(applyMiddleware(routerMiddleware(history)))
);

export default store;
