const { MongoClient } = require('mongodb');

// Replace the following with your MongoDB deployment's connection string.
const uri = "mongodb://adminUser:123abc,.;@140.210.73.250:27017/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

module.exports = { connectToMongoDB };
