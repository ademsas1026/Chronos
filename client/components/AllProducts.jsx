import React, { Component } from 'react';
import {fetchProducts} from '../store/products';
// import AddProduct from './AddProduct.jsx'

export default class AllProducts extends Component {

    componentDidMount(){
        this.props.fetchProducts();
    }

    render() {
        let { products } = this.props;
        return (
            <div>
                {
                    products.length > 0 ? products.map((product, index) => (
                        <div key={product.id} product={product}>
                            <h3>{product.title}</h3>
                            <img src={product.imgUrl} />
                            <li>{product.price}</li>
                            <p>{product.description}</p>
                        </div>
                    )) : null
                }
            </div>
        );
    }
}
