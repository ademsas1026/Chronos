'use strict';

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'

import { loadOneCategory } from '../store'

/* ---- Component ---- */
class SingleCategory extends Component {

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.categoryId !== this.props.match.params.categoryId){
      nextProps.loadOneCategory(nextProps.match.params.categoryId)
    }
  }

  componentDidMount () {
    const categoryId = this.props.match.params.categoryId
    this.props.loadOneCategory(categoryId)
  }

  render () {
    const { selectedCategory } = this.props
    const productArr = this.props.selectedCategory.products
    return (
      <div className="container" id="allProductsView">
        <div id="buffer" />
        <Grid id="products">
          <Row className="show-grid">
            { selectedCategory
              ? <h1 id="category-title">{selectedCategory.name}</h1>
              : null
            }
            {
              productArr && productArr.map((product) => (
                    <Col sm={10} md={4}  key={product.id} id="singleProduct">
                      <Link to={`/products/${product.id}`}>
                      <img id="productImg" src={product.imgUrl} />
                      <h3>{product.title}</h3>
                      <h4>$ {product.price}</h4>
                      <span><Button id="addToCartBtn">Add</Button></span>
                      <span><Button id="removeFromCartBtn">Remove</Button></span>
                      </Link>
                    </Col>
                  ))
            }
          </Row>
        </Grid>
      </div>
    );
  }
}

/* ---- Container ---- */
const mapState = state => ({
  selectedCategory: state.selectedCategory
});

const mapDispatch = dispatch => ({
  loadOneCategory(categoryId) {
    const thunkAction = loadOneCategory(categoryId);
    dispatch(thunkAction);
  }
});


export default connect(mapState, mapDispatch)(SingleCategory);

