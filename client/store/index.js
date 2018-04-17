import {createStore, combineReducers, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import user from './user';
import products from './products';

const fakeUsers = [
  {
    email: 'wow@gmail.com',
    password: '1234',
    isAdmin: true
  }, 
  {
    email: '1234@aol.com',
    password: 'wow',
    isAdmin: false
  }
];

const reducer = combineReducers({ user, products, users: fakeUsers });
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
));
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './products';
