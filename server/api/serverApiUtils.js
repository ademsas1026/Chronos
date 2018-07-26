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

module.exports = {
  findCart
}

