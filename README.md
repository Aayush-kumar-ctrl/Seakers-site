# Seakers-site / sneakers-store

A fully functional sneakers e-commerce store (backend) built with Node.js, Express and MongoDB. This repository contains a simple API for products and user carts, with authentication protection via Clerk.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Install & Run](#install--run)
- [API Endpoints](#api-endpoints)
- [Data models](#data-models)
- [Seeding / Testing](#seeding--testing)
- [Contributing](#contributing)
- [License & Author](#license--author)

## Features

- REST API for sneakers products
- Simple cart model per user stored in MongoDB
- Protected routes using Clerk middleware
- Lightweight, easy to run locally (dev via nodemon)

## Tech stack

- Node.js
- Express
- MongoDB (Mongoose)
- Clerk (authentication)
- cors, dotenv
- nodemon (dev)

## Repository layout

- sneakers-store/
  - backend/
    - server.js            — main Express server and routes
    - models/
      - Product.js         — Product mongoose model
      - Cart.js            — Cart mongoose model
  - package.json
  - package-lock.json
  - .gitignore

## Prerequisites

- Node.js (v16+ recommended)
- npm
- A running MongoDB instance (local or cloud)
- Clerk account / API keys configured if you plan to use protected endpoints

## Environment variables

Create a `.env` file in `sneakers-store` (or set environment variables in your environment):

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
# Clerk configuration (follow Clerk docs for the exact variables required by @clerk/clerk-sdk-node)
# e.g. CLERK_API_KEY=... or CLERK_JWK=...
```

Note: The repository uses `@clerk/clerk-sdk-node` and the server calls `ClerkExpressRequireAuth()` for protected endpoints. Follow Clerk documentation to configure the server-side keys required for your setup.

## Install & Run

1. Navigate to the backend folder:
   cd sneakers-store

2. Install dependencies:
   npm install

3. Run in development mode (uses nodemon):
   npm run dev

4. Or run production:
   npm start

The server defaults to port `5000` (or whatever you set in `PORT`).

## API Endpoints

- GET /  
  - Description: Basic health route  
  - Response: "Old Skool Sneakers API is running"

- GET /api/products  
  - Description: Get all products  
  - Auth: none

- POST /api/products  
  - Description: Create a product (useful for seeding/testing)  
  - Body (JSON): { name, image, price, description }  
  - Auth: none (current implementation is open — secure in production)

- GET /api/profile  
  - Description: Example protected route that returns basic profile info  
  - Auth: Clerk (ClerkExpressRequireAuth)

- POST /api/cart  
  - Description: Add an item to a user's cart (or increase quantity if exists)  
  - Body (JSON): { productId, name, price, quantity }  
  - Auth: Clerk

- GET /api/cart  
  - Description: Get the authenticated user's cart  
  - Auth: Clerk

Example curl (public product fetch):
```bash
curl http://localhost:5000/api/products
```

Example curl to add a product (for seeding):
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Classic Sneaker","image":"https://example.com/sneaker.jpg","price":89.99,"description":"Retro style."}'
```

Protected endpoints require a valid Clerk-authenticated request (bearer token/session as required by Clerk middleware). Consult Clerk docs for how to call protected endpoints from a client.

## Data models (summary)

- Product
  - name: String (required)
  - image: String (required)
  - price: Number (required)
  - description: String
  - createdAt: Date (default now)

- Cart
  - clerkId: String (required) — links cart to Clerk user id
  - items: [ { productId, name, price, quantity } ]
  - updatedAt: Date

Files:
- sneakers-store/backend/models/Product.js
- sneakers-store/backend/models/Cart.js

## Seeding / Testing

- Use the POST /api/products endpoint to create sample products.
- Use a client configured with Clerk to test protected cart endpoints.
- For quick local testing without Clerk, you can temporarily comment out `ClerkExpressRequireAuth()` in `server.js` for the cart endpoints — but do NOT keep this in production.

## Contributing

Contributions are welcome. If you'd like help:
- Open an issue describing the change or improvement
- Fork & create a PR with tests / description

If you'd like, I can add:
- Basic seed script to populate sample products
- Postman collection or OpenAPI spec
- Frontend example to consume this API

Tell me which one you prefer and I can add it.

## License & Author

- Author: Aayush Kumar
