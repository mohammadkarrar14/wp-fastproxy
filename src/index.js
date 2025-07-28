/**
 * @fileoverview
 * Application Entry Point.
 *
 * Initializes the Express app, loads environment variables,
 * and registers all routes and middlewares for WP-FastProxy.
 */

require('dotenv').config();
const express = require('express');
const proxyRoutes = require('./routes/proxyRoutes');
const logger = require('./core/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Register routes
app.use(proxyRoutes);

// Start server
app.listen(PORT, () => {
  logger.info(`WP-FastProxy running on http://localhost:${PORT}`);
});
