# WP-FastProxy 🚀

A blazing-fast Node.js proxy server that sits between your frontend and WordPress REST API.  
It enhances performance by caching responses in **Redis** and adds resilience using a **circuit breaker pattern** with [`opossum`](https://www.npmjs.com/package/opossum).

---

## 📦 Features

- ✅ Reverse proxy for `/wp-json/*` routes  
- ⚡ Fast response with Redis-based caching  
- 🛡️ Circuit breaker for WordPress API failure protection  
- 📝 Structured logging using Winston  
- 🌱 Simple `.env` config  
- ♻️ Extensible architecture (perfect for scaling or adding rate limiting)  

---

## 📁 Project Structure

```
wp-fastproxy/
├── src/core/
│   ├── circuitBreaker.js        # Circuit breaker configuration
│   ├── logger.js                # Winston logger setup
│   └── redisClient.js           # Redis client connection
├── src/routes/
│   └── proxyRoutes.js           # Main proxy handler for /wp-json/*
├── src/index.js                 # Main entry point for Express app
├── .env.example                 # Template for environment config
├── .gitignore                   # Ignore files/folders from Git
├── package.json                 # Project dependencies and metadata
└── README.md                    # You're reading it 😉
```

---

## 🧰 Tech Stack

```bash
| Component       | Technology                         |
|-----------------|------------------------------------|
| Backend         | Node.js, Express.js                |
| Caching         | Redis                              |
| Circuit Breaker | Opossum                            |
| Logging         | Winston                            |
| Proxy Engine    | http-proxy-middleware / Native     |
| Config          | Dotenv                             |
| API Layer       | WordPress REST API                 |
| HTTP Client     | Axios (optional if extending)      |
```

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/wp-fastproxy.git
cd wp-fastproxy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Duplicate `.env.example` and fill in your actual values:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
WP_API_BASE=https://tabeerai.com
REDIS_URL=redis://localhost:6379
```

### 4. Start the Server

```bash
npm start
```

Visit:

```
http://localhost:5000/wp-json/wp/v2/posts
```

---

## 🧠 How It Works

When your frontend hits `/wp-json/...` on this server:

1. It checks if the response is cached in Redis.
2. ✅ If yes → returns cached response (super fast!)
3. ❌ If no → forwards request to WordPress API
4. The response is then cached for 5 minutes.
5. If the WordPress API is down or slow, a circuit breaker prevents overloads.

---

## 🔧 Environment Variables

| Variable     | Description                                | Default                |
|--------------|--------------------------------------------|------------------------|
| `PORT`       | Port for the Express server                | `5000`                 |
| `WP_API_BASE`| Full URL to your WordPress REST API base   | *(required)*           |
| `REDIS_URL`  | Redis connection string                    | `redis://localhost:6379` |

---

## 📑 Example Request

```bash
GET http://localhost:5000/wp-json/wp/v2/posts
```

**Logs:**

```bash
[timestamp] INFO: Redis connected successfully
[timestamp] INFO: Cache MISS: /wp-json/wp/v2/posts
[timestamp] INFO: Cache HIT: /wp-json/wp/v2/posts
```

---

## 🧪 Testing the Proxy

Use curl, Postman, or a browser:

```bash
curl http://localhost:5000/wp-json/wp/v2/posts
```