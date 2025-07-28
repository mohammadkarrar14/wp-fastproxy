/**
 * @fileoverview
 * Redis Client Setup for WP-FastProxy.
 *
 * Initializes a Redis client using the `redis` package with auto-connect
 * and error logging. This client is shared across all modules for caching.
 */

const { createClient } = require('redis');
const logger = require('./logger');

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => {
  logger.error(`Redis Error: ${err.message}`);
});

(async () => {
  try {
    await client.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error(`Redis connection failed: ${error.message}`);
  }
})();

module.exports = client;
