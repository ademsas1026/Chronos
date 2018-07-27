const router = require('express').Router();
const { Order, Product, LineItem } = require('../db/models');

module.exports = router;

router.use( async (req, res, next) => {
  //logged in user
  if (req.user){
    const [order, _] = await Order.findOrCreate({ where: { userId: req.user.id, status: 'cart'}})
    console.log('this is the order: ', order)
    req.cart = order
    req.session.cart = order
    next()
  }
  //not logged in
  else {
    const order = await Order.create({ where: { userId: 5, status: 'cart' }})
    req.cart = order
  }
})

router.get('/', (req, res, next) => {
  res.send(req.cart)
})

// add to cart
router.put('/add-to-cart/products/:productId', async (req, res, next) => {
  const quantityToAdd = +req.body.quantityToAdd;
  const newProduct = await Product.findById(req.params.productId).catch(next);
  const [lineItem, wasCreated] = await LineItem.findOrCreate({ 
    where: { productId: req.params.productId, orderId: req.cart.id },  
    defaults: { quantity: req.body.quantityToAdd, price: newProduct.price }
  })
  .catch(next)

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
