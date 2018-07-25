'use strict';

const db = require('../server/db');
const { User, Product, Category } = require('../server/db/models');

async function seed () {
  await db.sync({ force: true });
  console.log('db synced!');

  const productsCatalog = [
    {
      title: 'One Week (Future)',
      price: 15.00,
      description: "Have plans you just don't want to wait for? Buy yourself a week!",
      quantity: 2,
      imgUrl: 'https://dummyimage.com/400x400/e2ffdb/000000.jpg&text=One+Week+(2018)'
    },
    {
      title: 'Tomorrow',
      price: 5.00,
      description: "You're always a day awaaaaay",
      quantity: 100,
      imgUrl: 'https://dummyimage.com/400x400/fdebff/000000.jpg&text=Tomorrow'
    },
    {
      title: 'Your 21st Birthday (Past)',
      price: 1000.00,
      description: 'Whether you remember or not, now you have the opportunity to go back to this (presumably) debaucherous night!',
      quantity: 16,
      imgUrl: 'https://dummyimage.com/400x400/ffecdb/000000.jpg&text=21st+Birthday'
    },
    {
      title: 'Your 21st Birthday (Future)',
      price: 15000.00,
      description: 'Enjoy a special day of pure, legal fun (We do not condone underage consumption of any alcoholic beverages)!',
      quantity: 9,
      imgUrl: 'https://dummyimage.com/400x400/ffecdb/000000.jpg&text=21st+Birthday'
    },
    {
      title: 'Any Week in the Year 2050',
      price: 750.00,
      description: 'If the Earth still exists ...',
      quantity: 11,
      imgUrl: 'https://dummyimage.com/400x400/dbf6ff/000000.jpg&text=2050+(One+Week)'
    },
    {
      title: "Trump's Last Day In Office",
      price: 1500000.00,
      description: 'Price only applies if you are a (regretful) registered Republican',
      quantity: 1,
      imgUrl: "https://dummyimage.com/400x400/ffecdb/000000.jpg&text=Trump's+Last+Day+In+Office"
    },
    {
      title: 'Yesterday',
      price: 100.50,
      description: 'All my troubles seemed so far away ...',
      quantity: 4,
      imgUrl: 'https://dummyimage.com/400x400/ffecff/000000.jpg&text=Yesterday'
    },
    {
      title: 'Your First Day of High School',
      price: 2.00,
      description: 'Why would you want to go back to this day?!',
      quantity: 5,
      imgUrl: 'https://dummyimage.com/400x400/d1cfd1/000000&text=First+Day+of+High+School'
    },
    {
      title: 'First Date (Good)',
      price: 3000.50,
      description: 'End the night with something magical',
      quantity: 8,
      imgUrl: 'https://dummyimage.com/400x400/edf0c9/000000&text=First+Date'
    },
    {
      title: 'First Date (Bad)',
      price: 15.00,
      description: 'Perhaps a gag gift for a friend or an actual present for an enemy',
      quantity: 100,
      imgUrl: 'https://dummyimage.com/400x400/edf0c9/000000&text=First+Date'
    }
  ];

  const products = await Promise.all(
    productsCatalog.map(product => Product.create(product))
  );

  console.log(`seeded ${products.length} products`);
  console.log(`seeded successfully`);

  const categoriesCatalog = [
    {
      name: 'nostalgia',
      productId: 1
    },
    {
      name: 'future',
      productId: 2
    },
    {
      name: 'renaissance',
      productId: 2
    }
  ];

  const categories = await Promise.all(
    categoriesCatalog.map(category => Category.create(category))
  );

  console.log(`seeded ${categories.length} categories`);
  console.log(`seeded successfully`);

  const usersCatalog = [
    {
      firstName: 'The Doctor',
      email: 'the.doctor@who.com',
      password: 'knockKnock',
      salt: 'pepper',
      googleId: 'blahblahblah',
      isAdmin: true
    },
    {
      firstName: 'River Song',
      email: 'river.song@who.com',
      password: 'spoilers',
      salt: 'pepper',
      googleId: 'blahblahblah',
      isAdmin: true
    },
    {
      firstName: 'Amy',
      email: 'amy.pond@who.com',
      password: 'ginger',
      salt: 'pepper',
      googleId: 'blahblahblah',
      isAdmin: false
    },
    {
      firstName: 'Clara',
      email: 'clara.oswald@who.com',
      password: 'theImpossibleGirl',
      salt: 'pepper',
      googleId: 'blahblahblah',
      isAdmin: false
    }
  ];

  const users = await Promise.all(
    usersCatalog.map(user => User.create(user))
  );

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

seed()
  .catch(err => {
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log('closing db connection');
    db.close();
    console.log('db connection closed');
  });

console.log('seeding...');
