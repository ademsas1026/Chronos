const router = require('express').Router();
const { Order, Product, LineItem } = require('../db/models');

module.exports = router;

router.use( async (req, res, next) => {
  if (req.cart || !req.user) return next();

  if (req.session.cartId) {
    req.cart = await Order.findById(req.session.cartId).catch(next);
    if (req.cart && req.user) req.cart.userId = req.user.id;
    if (req.cart) return next();
  }

  // below we check if there's already a cart associated with the userId
  // if not, we create a new instance of the cart with the userId if logged in, and null if not
  const currentCart = await Order.findOne({ where: { userId: req.user.id, status: 'cart' } }).catch(next);
  if (currentCart) req.cart = currentCart;
  else req.cart = await Order.create({ userId: req.user.id || null }).catch(next);

  req.session.cartId = req.cart.id;
  next();
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
  .catch(next);

  if (!wasCreated) lineItem.quantity += quantityToAdd;
  await lineItem.save();
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
