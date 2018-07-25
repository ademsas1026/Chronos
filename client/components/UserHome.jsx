'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getOrders } from '../store'

/* ---- Component ---- */
export class UserHome extends Component {
  componentDidMount() {
    this.props.fetchOrders(this.props.user)
  }

  render() {
  const { user, orders } = this.props

  return (
      <div id="userHome">
        <h3 id="welcomeMessage">Welcome, {user.firstName}</h3>

      </div>
    )
  }
}

/* ---- Container ---- */
const mapState = state => ({
  user: state.user,
  email: state.user.email,
  orders: state.orderHistory
})

const mapDispatch = dispatch => ({
  fetchOrders(user) {
    dispatch(getOrders(user))
  }
})

export default connect(mapState, mapDispatch)(UserHome);

/* ---- Prop Types ---- */
UserHome.propTypes = {
  email: PropTypes.string
}

// {
//   orders && orders.map(order => (
//   <div id="viewOrder" key={order.id}>
//     <h3>
//       {`Your order status: ${order.status}`}
//     </h3>
//     <ul>
//     {
//       order.products.map(product => (
//        <li key={product.id}>
//         {`Product: ${product.title}, Unit Price: ${product.price}, Quantity: ${product.lineItem.quantity}`}
//        </li>
//      ))
//     }
//      </ul>
//     </div>
//   ))
//   }
