import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import { addToCart } from '../store'

class AddToCartButton extends Component {
  constructor(){
    super()
    this.state = { 
      clicked: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick(product, quantity){
    await this.props.addToCart(product, quantity)
    this.setState({
      clicked: true
    })
  }

  render() {
    return (
      <div>
        <Button
          disabled={!this.props.quantity}
          onClick={() => this.handleClick(this.props.product, this.props.quantity)}
        >Add To Cart
        </Button>
        { this.state.clicked && <h3>Added To Cart!</h3>}
      </div>
    )
  }
}


const mapDispatch = dispatch => ({
  addToCart(product, quantity){
    product = {
      quantityToAdd: quantity,
      id: product.id
    }
    dispatch(addToCart(product));
  }
})

export default connect(null, mapDispatch)(AddToCartButton);
