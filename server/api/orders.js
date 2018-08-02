'use strict';

const router = require('express').Router()

const { User, Order, Product } = require('../db/models')
const { authorize, userLineItem, sessionLineItem, updateLineItem, updateCart } = require('./serverApiUtils')

module.exports = router
// this route is for admins to see all orders
router.get('/', authorize, async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: 'cart'
      },
      include: [{
        model: Product,
      }, {
        model: User,
        attributes: ['firstName', 'email']
      }]
    })
    if (!orders) {
      const err = new Error('Orders Not Found')
      err.status = 404
      return next(err)
    }
    res.json(orders)
  } catch (err){
    next(err)
  }
})
// this route is for admins to see pending orders
router.get('/order-history/pending', authorize, async (req, res, next) => {
  const pendingOrders = await Order.findAll({
    where: { 
      status: 'pending' 
    },
    include: [{model: User}]
  }).catch(next)

  res.json(pendingOrders)
})

router.get('/cart', async (req, res, next) => {
  try {
    if (req.user) {
      const cart = await Order.findOne({
        where: {
          userId: req.user.id,
          status: 'cart'
        },
        include: [{
          model: Product
        }]
      })
      if (!cart) return res.json([])
      req.session.cart = cart.products.map(product => product.lineItem)
      return res.json(req.session.cart)
    }
  } catch (err){
    next(err)
  }
})

router.post('/cart/add', async (req, res, next) => {
  try {
    if (req.user){
      const product = await Product.findById(req.body.id)
      let [newLineItem, created] = await userLineItem(req.user.id, product, req.body.quantityToAdd)
      if (!created) await updateLineItem(newLineItem, req)
      updateCart(newLineItem, req)
    } else {
      let lineItem
      if (req.session.cart) {
        lineItem = req.session.cart.find(entry => entry.productId === req.body.id)
        if (lineItem) lineItem.quantity += +req.body.quantityToAdd
      }
      if (!lineItem) lineItem = sessionLineItem(req.body)
    }
  } catch (err){
      next(err)
  }
})

router.delete('/cart/remove', async (req, res, next) => {
  console.log('deleting')
})

