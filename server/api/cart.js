const router = require('express').Router();
const { Order, Product, LineItem } = require('../db/models');
const { findCart } = require('./serverApiUtils')
module.exports = router;

router.use( async (req, res, next) => {
  if (req.cart || !req.user) return next()

  if (req.session.cart) {
      if (req.user) req.cart = findCart(Order, req, next)
      else return next()
      console.log('this is req.cart: ', req.cart)
    }
  
  // below we check if there's already a cart associated with the userId
  // if not, we create a new instance of the cart with the userId if logged in, and null if not
  const currentCart = await Order.findOne({ where: { userId: req.user.id, status: 'cart' } }).catch(next)
  if (currentCart) req.cart = currentCart
  else req.cart = await Order.create({ userId: req.user.id || null }).catch(next)

  req.session.cart = req.cart
  next()
});

router.get('/', (req, res, next) => {
  res.send(req.cart);
});

// add to cart
router.post('/add-to-cart/products/:productId', async (req, res, next) => {
  console.log('this is req.params.productId: ', req.params.productId)
  const quantityToAdd = +req.body.quantityToAdd;
  const newProduct = await Product.findById(req.params.productId).catch(next);
  const [lineItem, wasCreated] = await LineItem.findOrCreate({ 
    where: { productId: req.params.productId, orderId: req.cart.id },  
    defaults: { quantity: req.body.quantityToAdd, price: newProduct.price }
  })
  .catch(e => console.log('this is the error: ', e))
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
