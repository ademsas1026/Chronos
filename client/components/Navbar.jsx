'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout, fetchCart, me } from '../store';
import { AllCategories, Searchbar } from './index';

/* ---- Component ---- */
class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      showCategories: false
    };
    this.showCategories = this.showCategories.bind(this);
  }

  componentDidMount(){
    this.props.fetchCart()
  }

  showCategories() {
    this.setState({ showCategories: !this.state.showCategories });
  }

  render() {
    const { handleClick, isLoggedIn, lineItems, user } = this.props
    const productQuantity =
      lineItems.length && lineItems.map(lineItem => lineItem.quantity)
                                    .reduce((acc, val) => (acc + val), 0);
    return (
      <nav id="navBar">
        <div id="leftNav">
          <Link to="/" id="navBarName">
            <div id="chronosName">
              <h1>Chronos</h1>
            </div>
          </Link>
            <div id="everythingButName">
              {isLoggedIn ? (
                <div id="loggedIn">
                  {/* The navbar will show these links after you log in */}
                  <Link to="/userhome" id="goHome">home</Link>
                  <a href="#" onClick={handleClick} id="logout">
                    logout
                  </a>
                </div>
              ) : (
                <div id="notLoggedIn">
                  {/* The navbar will show these links before you log in */}
                  <Link to="/login" id="login">login</Link>
                  <Link to="/signup" id="signUp">sign up</Link>
                </div>
              )}
              <div id="alwaysShow" onMouseLeave={this.showCategories}>
                <Link to="/products" onMouseOver={this.showCategories} id="catalogLink">
                  catalog
                </Link>
                <div id="categoriesInNav">
                  {this.state.showCategories && <AllCategories />}
                </div>
              </div>
              {isLoggedIn && user.isAdmin && (
                <Link to={'/orders/order-history/pending'} id="pendingOrders">pending orders</Link>
              )}
            </div>
          </div>
          <div id="rightNav">
            <span id="navBarCart">
              <Link to="/cart">
                <img
                  src="https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.newdesignfile.com%2Fpostpic%2F2010%2F03%2Fshopping-bag-icon-vector_392408.png&f=1"
                  id="shoppingBag"
                />
                <h3>{productQuantity}</h3>
              </Link>
            </span>
            <Searchbar />
          </div>
        </nav>
    );
  }
}

/* ---- Container ---- */
const mapState = state => ({
  isLoggedIn: !!state.user.id,
  categories: state.categories,
  lineItems: state.cart.cart,
  user: state.user
});

const mapDispatch = dispatch => ({
  handleClick() {
    dispatch(logout());
  },
  fetchCart() {
    dispatch(fetchCart());
  },
  loadUser() {
    dispatch(me());
  }
});

export default connect(mapState, mapDispatch)(Navbar);

/* ---- Prop Types ---- */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
