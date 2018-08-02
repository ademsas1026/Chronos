import axios from 'axios';

/* ---- Action Types ---- */
const GET_ORDER_HISTORY = 'GET_ORDER_HISTORY';

/* ---- Action Creators ---- */
const getOrderHistory = orderHistory => ({ type: GET_ORDER_HISTORY, orderHistory });

/* ---- Thunks ---- */
export const getOrders = user => {
  return function thunk(dispatch) {
    axios.get(`/api/users/${user.id}/order-history`)
      .then(res => res.data)
      .then(orders => dispatch(getOrderHistory(orders)))
      .catch(err => console.error(err));
  };
};

export const getPendingOrders = () => {
  return function thunk(dispatch) {
    axios.get(`/api/orders/order-history/pending`)
    .then(res => res.data)
    .then(orders => dispatch(getOrderHistory(orders)))
    .catch(err => console.error(err));
  }
}

/* ---- Reducer ---- */
export default function (state = [], action){
  switch (action.type){
    case GET_ORDER_HISTORY:
      return action.orderHistory;
    default:
      return state;
  }
}
