const mongoose = require('mongoose');

// Use the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mohamedhossamalkammar:mhmdalkmmr1M@cluster0.oz1jzke.mongodb.net/gazalla?retryWrites=true&w=majority&appName=Cluster0';

console.log('Connecting to MongoDB Atlas...');
console.log('URI:', MONGODB_URI);

// Test connection
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ Successfully connected to MongoDB Atlas');
  
  // Create a simple test model
  const testSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  const TestModel = mongoose.model('Test', testSchema);
  
  // Insert a test document
  const testDoc = new TestModel({ name: 'Test document' });
  await testDoc.save();
  console.log('✅ Successfully inserted test document');
  
  // Retrieve the document
  const retrievedDoc = await TestModel.findOne({ name: 'Test document' });
  console.log('✅ Successfully retrieved test document:', retrievedDoc.name);
  
  // Clean up - delete the test document
  await TestModel.deleteOne({ name: 'Test document' });
  console.log('✅ Successfully cleaned up test document');
  
  // Close connection
  await mongoose.connection.close();
  console.log('✅ Connection closed');
})
.catch((error) => {
  console.log('❌ Failed to connect to MongoDB Atlas');
  console.log('Error:', error.message);
});