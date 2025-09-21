const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gazalla';

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['men', 'women'], required: true },
  imageUrl: { type: String, required: false },
  stock: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    
    // Insert sample products
    const products = [
      {
        name: 'Luxury Watch',
        description: 'Elegant watch for formal occasions',
        price: 299.99,
        category: 'men',
        imageUrl: '/images/watch.jpg',
        stock: 15,
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish sunglasses with UV protection',
        price: 149.99,
        category: 'men',
        imageUrl: '/images/sunglasses.jpg',
        stock: 25,
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots',
        price: 89.99,
        category: 'men',
        imageUrl: '/images/wallet.jpg',
        stock: 30,
      },
      {
        name: 'Gold Necklace',
        description: 'Beautiful gold necklace for special occasions',
        price: 199.99,
        category: 'women',
        imageUrl: '/images/necklace.jpg',
        stock: 20,
      },
      {
        name: 'Diamond Earrings',
        description: 'Sparkling diamond earrings for evening wear',
        price: 399.99,
        category: 'women',
        imageUrl: '/images/earrings.jpg',
        stock: 10,
      },
      {
        name: 'Designer Handbag',
        description: 'Luxury handbag with premium materials',
        price: 249.99,
        category: 'women',
        imageUrl: '/images/handbag.jpg',
        stock: 12,
      },
    ];
    
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    
    // Insert sample users
    const users = [
      {
        email: 'admin@gazalla.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'user@gazalla.com',
        password: 'user123',
        name: 'Regular User',
        role: 'customer'
      }
    ];
    
    await User.insertMany(users);
    console.log('Users seeded successfully');
    
    console.log('Database seeding completed');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();