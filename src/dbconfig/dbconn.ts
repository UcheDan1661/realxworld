import mongoose from 'mongoose';

const isDev = process.env.NODE_ENV !== 'production';
const MONGODB_URI = isDev ? process.env.MONGODB_LOCAL_URL : process.env.MONGODB_ATLAS_URL;

// If MongoDb uri is not provided we will throw an error
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Cache the connection across hot reloads in development
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// creating an async function to connect to the db
async function connectMongo() {
  // If already connected, reuse
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Disable mongoose internal buffering so operations fail fast if not connected
    mongoose.set('bufferCommands', false)
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // fail fast if server not reachable
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    }
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectMongo;