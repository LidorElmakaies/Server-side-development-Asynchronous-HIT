# Minimal 4-Process Backend

This implementation runs as four separate Node processes (one port each), as required:

- users process
- costs process
- logs process
- about process

## Setup

1. Copy `.env.example` to `.env`
2. Fill your `MONGO_URI` (MongoDB Atlas)
3. Install dependencies:

```bash
npm install
```

## Run processes

```bash
npm run start:users
npm run start:costs
npm run start:logs
npm run start:about
```

## Seed imaginary user

```bash
npm run seed:user
```

It will ensure this user exists:

- `id`: 123123
- `first_name`: mosh
- `last_name`: israeli
