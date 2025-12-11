# Bun React Template Starter

This template is a starting point for building modern full-stack web applications using Bun, React, ElysiaJS, and Prisma. This project is designed to provide a fast, efficient, and structured development experience with a cutting-edge technology stack.

## Key Features

- **Super-Fast Runtime**: Built on top of [Bun](https://bun.sh/), a high-performance JavaScript runtime.
- **End-to-End Typesafe Backend**: Utilizes [ElysiaJS](https://elysiajs.com/) for a type-safe API from the backend to the frontend.
- **Automatic API Documentation**: Comes with [Elysia Swagger](https://elysiajs.com/plugins/swagger) to automatically generate interactive API documentation.
- **Modern Frontend**: A feature-rich and customizable user interface using [React](https://react.dev/) and [Mantine UI](https://mantine.dev/).
- **Easy Database Access**: Integrated with [Prisma](https://www.prisma.io/) as an ORM for intuitive and secure database interactions.
- **Clear Project Structure**: Logical file and folder organization to facilitate easy navigation and development.

## Tech Stack

- **Runtime**: Bun
- **Backend**:
  - **Framework**: ElysiaJS
  - **ElysiaJS Modules**:
    - `@elysiajs/cors`: Manages Cross-Origin Resource Sharing policies.
    - `@elysiajs/jwt`: JSON Web Token-based authentication.
    - `@elysiajs/swagger`: Creates API documentation (Swagger/OpenAPI).
    - `@elysiajs/eden`: A typesafe RPC-like client to connect the frontend with the Elysia API.
- **Frontend**:
  - **Library**: React
  - **UI Framework**: Mantine
  - **Routing**: React Router
  - **Data Fetching**: SWR
- **Database**:
  - **ORM**: Prisma
  - **Supported Databases**: PostgreSQL (default), MySQL, SQLite, etc.
- **Language**: TypeScript

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bun-react-template-starter.git
cd bun-react-template-starter
```

### 2. Install Dependencies

Ensure you have [Bun](https://bun.sh/docs/installation) installed. Then, run the following command:

```bash
bun install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and customize the values.

```bash
cp .env.example .env
```

Fill in your `.env` file similar to the example below:

```
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
JWT_SECRET=a_super_long_and_secure_secret
BUN_PUBLIC_BASE_URL=http://localhost:3000
PORT=3000
```

After that, create TypeScript type declarations for your environment variables with the provided script:

```bash
bun run generate:env
```

This command will generate a `types/env.d.ts` file based on your `.env`.

### 4. Database Preparation

Make sure your PostgreSQL database server is running. Then, apply the Prisma schema to your database:

```bash
bunx prisma db push
```

You can also seed the database with initial data using the following script:

```bash
bun run seed
```

### 5. Running the Development Server

```bash
bun run dev
```

The application will be running at `http://localhost:3000`. The server supports hot-reloading, so changes in the code will be reflected instantly without needing a manual restart.

### 6. Accessing API Documentation (Swagger)

Once the server is running, you can access the automatically generated API documentation at:

`http://localhost:3000/swagger`

## Available Scripts

- `bun run dev`: Runs the development server with hot-reloading.
- `bun run build`: Builds the frontend application for production into the `dist` directory.
- `bun run start`: Runs the application in production mode.
- `bun run seed`: Executes the database seeding script located in `prisma/seed.ts`.
- `bun run generate:route`: A utility to create new route files in the backend.
- `bun run generate:env`: Generates a type definition file (`.d.ts`) from the variables in `.env`.

## Project Structure

```
/
├── bin/              # Utility scripts (generators)
├── prisma/           # Database schema, migrations, and seed
├── src/              # Main source code
│   ├── App.tsx       # Root application component
│   ├── clientRoutes.ts # Route definitions for the frontend
│   ├── frontend.tsx  # Entry point for client-side rendering (React)
│   ├── index.css     # Global CSS file
│   ├── index.html    # Main HTML template
│   ├── index.tsx     # Main entry point for the app (server and client)
│   ├── components/   # Reusable React components
│   ├── lib/          # Shared libraries/helpers (e.g., apiFetch)
│   ├── pages/        # React page components
│   └── server/       # Backend code (ElysiaJS)
│       ├── lib/      # Server-specific libraries (e.g., prisma client)
│       ├── middlewares/ # Middleware for the API
│       └── routes/   # API route files
└── types/            # TypeScript type definitions
```

## Contributing

Contributions are highly welcome! Please feel free to create a pull request to add features, fix bugs, or improve the documentation.
