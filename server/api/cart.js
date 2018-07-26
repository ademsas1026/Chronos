const router = require('express').Router();
const { Order, Product, LineItem } = require('../db/models');
const { findCart } = require('./serverApiUtils')
module.exports = router;

router.use( async (req, res, next) => {
  console.log('this is req.session: ', req.session)
  if (req.cart) return next()
  
  if (req.session.cart) {
      if (req.user) req.cart = findCart(Order, req, next)
      else req.cart = await Order.findById(req.session.cart.id)
      // else return next()
    }
  // below we check if there's already a cart associated with the userId
  // if not, we create a new instance of the cart with the userId if logged in, and null if not
  if (req.user){
    const currentCart = await Order.findOne({ where: { userId: req.user.id, status: 'cart' } }).catch(next)
    if (currentCart) req.cart = currentCart
    else req.cart = await Order.create({ userId: req.user.id || null }).catch(next)
  } else {
    const currentCart = await Order.findById(req.session.cart.id)
    if (currentCart){
      req.cart = currentCart
      console.log('REQ CART AHHHH: ', req.cart)
    }
    else {
      req.cart = await Order.create({ userId: null }).catch(next)
      console.log('REQ CART AH: ', req.cart)
    }
  }
  

  req.session.cart = req.cart
  console.log('this is req.session after adding cart to session: ', req.session)
  next()
});

router.get('/', (req, res, next) => {
  res.send(req.cart);
});

// add to cart
router.post('/add-to-cart/products/:productId', async (req, res, next) => {
  const quantityToAdd = +req.body.quantityToAdd;
  const newProduct = await Product.findById(req.params.productId).catch(next);
  const [lineItem, wasCreated] = await LineItem.findOrCreate({ 
    where: { productId: req.params.productId, orderId: req.cart.id },  
    defaults: { quantity: req.body.quantityToAdd, price: newProduct.price }
  })
  .catch(next)
  console.log('this is the line item being created: ', lineItem)
  if (!wasCreated) lineItem.quantity += quantityToAdd;
  await lineItem.save().then(newLineItem => console.log('this is the line item that was created or updated: ', newLineItem)).catch(next)
  await req.cart.reload();

  res.json(req.cart);
});

// remove from cart
router.post('/remove-from-cart/products/:productId', async (req, res, next) => {
  const quantityToRemove = +req.body.quantityToRemove;
  const lineItem = await LineItem.findOne({ where: { productId: req.params.productId, orderId: req.cart.id }});
  const currentQuantity = +lineItem.quantity;
  const newQuantity = currentQuantity - quantityToRemove;
  const newPrice = newQuantity * req.body.price;
  await lineItem.update({ quantity: newQuantity, price: newPrice});
  if (lineItem.quantity <= 0) await lineItem.destroy();
  res.json(req.cart);
});
