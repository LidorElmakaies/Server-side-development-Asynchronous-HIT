# Minimal Single-Server Backend (Start Version)

This is a simple starter implementation that runs as one Express server on one port.
Routing is centralized in `src/server.js`, and each route delegates to a service in `src/services/`.

## Setup

1. Copy `.env.example` to `.env`
2. Fill your `MONGO_URI` (MongoDB Atlas)
3. Install dependencies:

```bash
npm install
```

## Run

```bash
npm run start
```

## Seed imaginary user

```bash
npm run seed:user
```

It will ensure this user exists:

- `id`: 123123
- `first_name`: mosh
- `last_name`: israeli
