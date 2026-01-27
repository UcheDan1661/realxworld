import mongoose from 'mongoose';

// Function to get MongoDB URI - check at runtime, not at module load time
// This prevents build-time errors when env vars aren't available
function getMongoUri(): string {
  const uri = process.env.MONGODB_ATLAS_URL || process.env.MONGODB_LOCAL_URL;
  
  if (!uri) {
    throw new Error(
      'Please define MONGODB_ATLAS_URL or MONGODB_LOCAL_URL environment variable inside .env.local'
    );
  }
  
  return uri;
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
    
    // Get URI at runtime (not at module load time)
    const MONGODB_URI = getMongoUri();
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB connected successfully');
      console.log('Database name:', mongooseInstance.connection.name);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ MongoDB connection error:', e);
    throw e
  }

  return cached.conn
}

export default connectMongo;