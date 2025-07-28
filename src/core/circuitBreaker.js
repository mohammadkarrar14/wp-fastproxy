/**
 * @fileoverview
 * Circuit Breaker using Opossum.
 *
 * Wraps API call logic in a fault-tolerant circuit breaker pattern to
 * prevent cascading failures during external API downtime.
 */

const CircuitBreaker = require('opossum');
const logger = require('./logger');

const defaultOptions = {
  timeout: 3000, // if function takes > 3s, trigger failure
  errorThresholdPercentage: 50,
  resetTimeout: 10000, // retry after 10s
};

/**
 * @param {Function} action - The async function to wrap
 * @param {Object} options - Circuit breaker options
 * @returns {CircuitBreaker} circuitBreaker instance
 */
function createBreaker(action, options = {}) {
  const breaker = new CircuitBreaker(action, { ...defaultOptions, ...options });

  breaker.on('open', () => logger.warn('Circuit breaker: OPEN'));
  breaker.on('halfOpen', () => logger.info('Circuit breaker: HALF-OPEN'));
  breaker.on('close', () => logger.info('Circuit breaker: CLOSED'));
  breaker.on('fallback', (data) => logger.warn(`Fallback triggered: ${data}`));

  return breaker;
}

module.exports = createBreaker;
