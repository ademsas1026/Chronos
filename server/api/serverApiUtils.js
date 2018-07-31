const { Order, LineItem } = require('../db/models')

// to find cart and assign to user
const findCart = async (Order, req, next) => {
    req.cart = await Order.findById(req.session.cart.id).catch(next)
    //line below: assign cart to user if there is a logged in user
    if (req.cart && req.user) {
      req.cart.userId = req.user.id
      return req.cart
    }
    //line below: if there is no user, can still have a cart. the visitor (doesn't have an account) won't be able to access this cart after this one session, though it will persist in the database
    if (req.cart) return next()
}


const authorize = (req, res, next) => {
  if (req.user.isAdmin === true)
    return next()
  else
    res.sendStatus(401)
}

const userLineItem = async (userId, product, quantityToAdd) => {
  const [order, wasCreated] = await Order.findOrCreate({
    where: {
      userId,
      status: 'cart'
    },
    defaults: {
      userId,
      status: 'cart'
    }
  })
  let [newLineItem, created] = await LineItem.findOrCreate({
    where: {
      orderId: order.id,
      productId: product.id
    },
    defaults: {
      quantity: quantityToAdd,
      price: product.price,
      productId: product.id,
      orderId: order.id
    }
  })
  return [ newLineItem, created ]
}

const sessionLineItem = product => {
	return {
		productId: product.id,
		quantity: 1,
		price: product.price
	}
}

const updateLineItem = async (newLineItem, req) => {
  newLineItem = await newLineItem.update({
    quantity: newLineItem.quantity += +req.body.quantityToAdd
  })
  req.session.cart = req.session.cart
    ? req.session.cart.filter(entry => entry.productId !== newLineItem.productId)
    : req.session.cart
}

const updateCart = (newLineItem, req) => {
  req.session.cart
      ? req.session.cart.push(newLineItem, req)
      : req.session.cart = [newLineItem]
}

module.exports = {
  findCart,
  authorize,
  userLineItem,
  sessionLineItem,
  updateLineItem,
  updateCart
}

