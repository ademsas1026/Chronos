'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

import { addProduct } from '../store';

/* ---- Component ---- */
class AddProduct extends Component {
  constructor(){
    super();
    this.state = {
      title: '', 
      price: '', 
      quantity: '', 
      imgUrl: '', 
      categories: '',
      description: '', 
      disabled: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    if(event.target.name === 'title' && event.target.value !== '') this.setState({ [event.target.name] : event.target.value, disabled: false })
    else this.setState({ [event.target.name] : event.target.value});
    
  }

  getValidationState() {
    let title = this.state.title;
    if (title !== '') return 'success';
    return 'error';
  }

  handleSubmit(event){
    event.preventDefault()
    let { title, price, quantity, imgUrl, categories, description } = this.state;
    this.props.addProduct({ title, price, quantity, imgUrl, categories, description });
    // this.setState({ title: '', price: '', quantity: '', imgUrl: '', categories: '', description: ''})
  }

  render() {
    let { title, price, quantity, imgUrl, categories, description, disabled } = this.state;
    return (
      <div>
        <h3>Add New Product</h3>
          <FormGroup validationState={this.getValidationState()} id="addProductForm">
            <div className="titlePrice">
            <ControlLabel className="col-xs-2 control-label"><h5><b>Name</b></h5>
              <FormControl value={title} name="title" type="text" placeholder="product name (required)" onChange={this.handleChange} />
              { this.state.disabled && <h5 id="warningName">Please enter a name</h5>}
            </ControlLabel>

            <ControlLabel className="col-xs-2 control-label"><h5><b>Price</b></h5>
              <FormControl value={price} name="price" type="text"  placeholder="product price (required)" onChange={this.handleChange}/>
            </ControlLabel>
            </div>
            <div className="quantityImg">
            <ControlLabel className="col-xs-2 control-label"><h5><b>Quantity</b></h5>
              <FormControl value={quantity} name="quantity" type="text"  placeholder="product quantity" onChange={this.handleChange} />
            </ControlLabel>


            <ControlLabel className="col-xs-2 control-label"><h5><b>Image</b></h5>
              <FormControl value={imgUrl} name="imgUrl" type="text"  placeholder="product image" onChange={this.handleChange} />
            </ControlLabel>
            </div>
            <div className="categoriesDesc">
            <ControlLabel className="col-xs-2 control-label"><h5><b>Categories</b></h5>
              <FormControl value={categories} name="categories" type="text" placeholder="product categories" onChange={this.handleChange}/>
            </ControlLabel>

            <ControlLabel className="col-xs-2 control-label"><h5><b>Description</b></h5>
              <FormControl value={description} className="desc" name="description" type="text"  componentClass="textarea" placeholder="product description" onChange={this.handleChange} />
            </ControlLabel>
            
           
            </div>
            <Button type="submit" className="addAndEditButton" disabled={disabled} onClick={this.handleSubmit}>Add Product to Catalog</Button>
          </FormGroup>
      </div>
      );
    }
}

/* ---- Container ---- */
const mapState = state => ({
    products: state.products
});

const mapDispatch = dispatch => ({
    addProduct(product) {
        const title = product.title;
        const price = product.price === '' ? 0.00 : product.price;
        const description = product.description;
        const quantity = product.quantity  === '' ? 0 : product.quantity;
        const imgUrl = product.imgUrl;
        const categories = product.categories;
        const action = addProduct({title, price, description, quantity, imgUrl, categories });
        dispatch(action);
    }
});

export default connect(mapState, mapDispatch)(AddProduct);

