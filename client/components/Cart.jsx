import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCart } from '../store';


/* --- Component --- */
class Cart extends Component {

  constructor(){
    super();
    this.state = {
      change: false
    };
  }

  componentDidMount(){
    this.props.fetchCart()
  }

  render () {
    const { lineItems } = this.props
    console.log('this is lineItems[0] from props: ', lineItems[0])
    return (
      <div id="cart">
        <h2> YOUR CART </h2>
        <div className="portfolioWrapper grid-container"> 
          {
            lineItems && lineItems.map(lineItem => (
              <LineItem lineItem={lineItem} />
            ))
          }
        </div>
      </div>
    );
  }
}


/* ---- Container ---- */
const mapState = state => ({lineItems: state.cart.cart})

const mapDispatch = dispatch => ({
  fetchCart() {
    dispatch(fetchCart())
  }
})

export default withRouter(connect(mapState, mapDispatch)(Cart))
