const User = require('./user');
const Category = require('./category');
const Product = require('./product');
const Order = require('./order');
const LineItems = require('./lineItems');

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

 Product.belongsToMany(Category, {through: 'product_category'});
 Category.belongsToMany(Product, {through: 'product_category'});

 User.hasMany(Order);
 Order.belongsTo(User);

 Product.belongsToMany(Order, { through: LineItems });
 Order.belongsToMany(Product, { through: LineItems });

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Product,
  Category,
  Order
};
