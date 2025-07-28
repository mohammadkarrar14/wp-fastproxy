/**
 * @fileoverview
 * Proxy Routes for WordPress API.
 *
 * Proxies `/wp-json/*` requests to the WordPress REST API,
 * caching responses in Redis and using a circuit breaker for fault tolerance.
 */

const express = require('express');
const axios = require('axios');
const redisClient = require('../core/redisClient');
const createBreaker = require('../core/circuitBreaker');
const logger = require('../core/logger');

const router = express.Router();
const WP_API_BASE = process.env.WP_API_BASE;
const CACHE_TTL = 300; // 5 minutes

/**
 * Fetch data from WordPress API.
 * @param {string} path - The API path
 * @returns {Promise<Object>} - Fetched data
 */
async function fetchFromWordPress(path) {
  const response = await axios.get(`${WP_API_BASE}${path}`);
  return response.data;
}

const breaker = createBreaker(fetchFromWordPress);

// Catch all routes under /wp-json
router.use('/wp-json', async (req, res) => {
  const wpPath = req.url; // Just the relative path, not including domain
  const cacheKey = `wp:${wpPath}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`Cache HIT: ${wpPath}`);
      return res.json(JSON.parse(cached));
    }

    logger.info(`Cache MISS: ${wpPath}`);
    const data = await breaker.fire(wpPath);
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    logger.error(`Proxy Error: ${err.message}`);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

module.exports = router;
