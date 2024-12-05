const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  url: 'redis://localhost:6379',
});

// Connect to Redis
redisClient
  .connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

module.exports = redisClient;
