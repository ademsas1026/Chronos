'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

import { editProduct, fetchOneProduct } from '../store';

/* ---- Component ---- */
class EditProduct extends Component {
  constructor(){
    super();
    this.state = {
      title: '', 
      price: '', 
      quantity: '', 
      description: '', 
      imgUrl: '', 
      categories: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    const pathname = this.props.location.pathname;
    const productId = pathname.slice(pathname.length - 1);

    if (!this.props.product) this.props.fetchOneProduct(productId);
  }
  handleChange(event){
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event){
    event.preventDefault();
    const oldProduct = this.props.product;
    const { title, price, quantity, description, imgUrl, categories } = this.state;
    
    this.props.editProduct({ title, price, quantity, description, imgUrl, categories }, oldProduct); 

  }

  render() {
    const { product } = this.props;
    const { title, price, quantity, description, imgUrl, categories } = this.state;
    return (
      <div>
        <h3>Edit Product Information</h3>
        <FormGroup id="editProductForm">
        
        <div className="titlePrice">
          <ControlLabel className="col-xs-2 control-label">
            <h5>
              <b>Name</b>
            </h5>
            <FormControl name="title" type="text" placeholder="update product name" onChange={this.handleChange} value={title} />
          </ControlLabel>
          <ControlLabel className="col-xs-2 control-label">
            <h5>
              <b>Price</b>
            </h5>
            <FormControl name="price" type="text" placeholder="update product price" onChange={this.handleChange} value={price} />
          </ControlLabel>
          </div>

          <div className="quantityImg">
          <ControlLabel className="col-xs-2 control-label">
            <h5>
              <b>Quantity</b>
            </h5>
            <FormControl name="quantity" type="text" placeholder="update product quantity" onChange={this.handleChange} value={quantity} />
          </ControlLabel>
          <ControlLabel className="col-xs-2 control-label">
            <h5>
              <b>Image</b>
            </h5>
            <FormControl name="imgUrl" type="text" placeholder="update product image" onChange={this.handleChange} value={imgUrl} />
          </ControlLabel>
          </div>
          
          <div className="categoriesDesc">
            <ControlLabel className="col-xs-2 control-label"><h5><b>Categories</b></h5>
              <FormControl value={categories} name="categories" type="text" placeholder="product categories" onChange={this.handleChange}/>
            </ControlLabel>

            <ControlLabel className="col-xs-2 control-label"><h5><b>Description</b></h5>
              <FormControl value={description} className="desc" name="description" type="text"  componentClass="textarea" placeholder="product description" onChange={this.handleChange}/>
            </ControlLabel>
            </div>
            <Button type="submit" className="addAndEditButton" onClick={this.handleSubmit}>Add Product to Catalog</Button>
        </FormGroup>
      </div>
    );
  }
}

/* ---- Container ---- */
const mapState = state => ({product: state.product});

const mapDispatch = dispatch => ({
  editProduct: (newProduct, oldProduct) => {
    newProduct.title = newProduct.title === '' ? oldProduct.title : newProduct.title;
    newProduct.price = newProduct.price === '' ? oldProduct.price : newProduct.price;
    newProduct.imgUrl = newProduct.imgUrl === '' ? oldProduct.imgUrl : newProduct.imgUrl;
    newProduct.quantity = newProduct.quantity === '' ? oldProduct.quantity : oldProduct.quantity;
    newProduct.description = newProduct.description === '' ? oldProduct.description : newProduct.description;
    newProduct.id = oldProduct.id;
    const action = editProduct(newProduct);
    dispatch(action);
  },
  fetchOneProduct: productId => {
    const thunkAction = fetchOneProduct(productId);
    dispatch(thunkAction);
  }
});

export default connect(mapState, mapDispatch)(EditProduct);
