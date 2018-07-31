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
    console.log('this.props in cart: ', this.props)

    return (
      <div id="cart">
        <h2> YOUR CART </h2>
      {
        lineItems && lineItems.map(lineItem => (
          <Col sm={10} md={4} key={lineItem.id} id="singlelineItem">
            <Link to={`/products/${lineItem.productId}`}>
              <img id="shrink" src={lineItem.imgUrl} />
              <h5>{lineItem.title}</h5>
              <h5>$ {lineItem.price}</h5>
              <h1>{ lineItem.quantity }</h1>
            </Link>
          </Col>
        ))
      }
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
