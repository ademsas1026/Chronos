import axios from 'axios'

/* ---- Initial State ---- */

const initialState = {
  cart: [],
  isLoading: false,
  gotError: false
}

/* ---- Action Types ---- */

const GET_CART_ITEMS = 'GET_CART_ITEMS'
const UPDATE_CART = 'UPDATE_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const CART_ERROR = 'CART_ERROR'
const LOADING_CART = 'LOADING_CART'

/* ---- Action Creators --- */

const getCartItems = cart => ({
    type: GET_CART_ITEMS,
    cart
  })


export const loadingCart = () => ({
	type: LOADING_CART
})

const cartError = () => ({
	type: CART_ERROR
})

const updateCart = cart => ({
  type: UPDATE_CART,
  cart
})

const remove = productId => ({
  type: REMOVE_FROM_CART,
  productId
})


/* --- Thunks --- */
export const fetchCart = () => async dispatch => {
  try {
    dispatch(loadingCart())
    const res = await axios.get('/api/orders/cart')
    dispatch(getCartItems(res.data))
  } catch (err) {
    dispatch(cartError())
    console.log(err)
  }
}


export const addToCart = product => async dispatch => {
  try {
    const res = await axios.post(`/api/orders/cart/add`, product)
    dispatch(updateCart(res.data))
  } catch (err) {
    dispatch(cartError())
    console.log(err)
  }
}


export const removeFromCart = product => async dispatch => {
  try {
    await axios.delete(`/api/orders/cart/remove`, product)
    dispatch(remove(product.id))
  } catch (err) {
    dispatch(cartError())
  }
}


/* --- Reducer --- */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CART_ITEMS:
      //action.cart here is an array of line items
      return {...state, cart: action.cart, isLoading: false, gotError: false}
    case UPDATE_CART:
      return {...state, cart: action.cart, isLoading: false, gotError: false}
    case REMOVE_FROM_CART:
      return {...state, cart: state.cart.filter(product => product.id !== action.productId)}
    case CART_ERROR:
      return {...state, gotError: true}
    case LOADING_CART:
      return {...state, isLoading: true}
    default:
      return state
  }
}
