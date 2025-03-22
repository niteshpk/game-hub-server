# Game Hub Server

A Node.js server application that provides game-related APIs and services, built with Express.js, TypeScript, and Redis.

## Features

- Game search and details API
- Redis caching for improved performance
- Kubernetes deployment support
- Error logging and monitoring
- Security features with Helmet.js
- Rate limiting and request validation
- TypeScript support
- Docker containerization

## Prerequisites

- Node.js (v14 or higher)
- Redis server
- RAWG API key
- Docker (optional, for containerization)
- Kubernetes cluster (optional, for deployment)
- TypeScript

## Project Structure

```
game-hub-server/
├── src/
│   ├── config/
│   │   ├── logger.ts
│   │   ├── redis.ts
│   │   └── routes.ts
│   ├── routes/
│   │   ├── gamesRoutes.ts
│   │   ├── genresRoutes.ts
│   │   ├── platformsRoutes.ts
│   │   ├── redisRoutes.ts
│   │   ├── healthRoutes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── rawgApiService.ts
│   ├── middlewares/
│   │   ├── common.ts
│   │   ├── compression.ts
│   │   ├── index.ts
│   │   ├── performance.ts
│   │   ├── sanitization.ts
│   │   ├── security.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── k8s/
│   ├── app.yaml
│   └── secret.yaml
├── dist/           # Compiled JavaScript files
├── logs/           # Error logs
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env.example
├── .eslintrc.json
├── tsconfig.json
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/niteshpk/game-hub-server
   cd game-hub-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:

   ```
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_USERNAME=default
   REDIS_PASSWORD=your_redis_password
   RAWG_API_KEY=your_rawg_api_key
   ```

4. Start Redis server:

   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d redis

   # Or using Docker directly
   docker run --name game-hub-redis -p 6379:6379 -d redis

   # Or start your local Redis server
   redis-server
   ```

5. Build the TypeScript code:

   ```bash
   npm run build
   ```

6. Start the application:

   ```bash
   # Production
   npm start

   # Development with hot-reload
   npm run dev
   ```

## Docker Deployment

1. Build the Docker image:

   ```bash
   docker build -t game-hub-server .
   ```

2. Run the container:

   ```bash
   docker run -p 3000:3000 --env-file .env game-hub-server
   ```

3. Or use Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Kubernetes Deployment

1. Create the secret:

   ```bash
   kubectl apply -f k8s/secret.yaml
   ```

2. Deploy the application:

   ```bash
   kubectl apply -f k8s/app.yaml
   ```

3. Verify the deployment:
   ```bash
   kubectl get pods
   kubectl get services
   ```

## API Endpoints

- `GET /api/v1/games/search?query=<search_term>`: Search for games
- `GET /api/v1/games/:id`: Get detailed information about a specific game
- `GET /api/v1/genres`: Get all genres
- `GET /api/v1/:slug/movies`: Get all movies for a specific game
- `GET /api/v1/:slug/screenshots`: Get all screenshots for a specific game
- `GET /api/v1/platforms`: Get all platforms
- `GET /api/v1/health`: Get health status

## Development

- Build TypeScript: `npm run build`
- Run for production: `npm run start`
- Run for development: `npm run dev`
- Lint code: `npm run lint`

## Environment Variables

| Variable       | Description    | Required |
| -------------- | -------------- | -------- |
| PORT           | Server port    | Yes      |
| REDIS_HOST     | Redis host     | Yes      |
| REDIS_PORT     | Redis port     | Yes      |
| REDIS_USERNAME | Redis username | Yes      |
| REDIS_PASSWORD | Redis password | Yes      |
| RAWG_API_KEY   | RAWG API key   | Yes      |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
