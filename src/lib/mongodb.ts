import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Flag to track if MongoDB is available
let isMongoDBAvailable = true;

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose: MongooseConnection;
}

let cached: MongooseConnection = (global as unknown as GlobalWithMongoose).mongoose;

if (!cached) {
  cached = (global as unknown as GlobalWithMongoose).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  // If MongoDB is not available, return early
  if (!isMongoDBAvailable) {
    throw new Error('MongoDB is not available');
  }

  if (!MONGODB_URI) {
    isMongoDBAvailable = false;
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).catch((error) => {
      isMongoDBAvailable = false;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    isMongoDBAvailable = false;
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Export function to check if MongoDB is available
export const isDatabaseAvailable = () => isMongoDBAvailable;