# JIP Assessment - Backend

## Overview

REST API for managing companies and their services.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- MySQL
- express-validator

## Prerequisites

- Node.js and npm
- MySQL
- Git

## Installation

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root using `.env.example`
as a template. Configure DATABASE_URL for your local MySQL
database and set PORT.

## Database Setup

Create the database in MySQL, then run:

```bash
npx prisma generate
npx prisma migrate dev
```

## Run in Development

```bash
npm run dev
```

## Build and Run

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| POST   | /companies    | Create a company             |
| GET    | /companies    | List companies with services |
| POST   | /services     | Create a service             |
| GET    | /services/:id | Get service details          |

## API Testing

Import the Postman collection from the `postman/` directory.
