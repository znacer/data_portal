# Data Portal Frontend

This project is a SvelteKit frontend for a data portal. It uses Vite for development and building, and includes Storybook for component development.

## Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (version >= 16)
-   npm, or bun

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2.  Install the dependencies using your preferred package manager:

    ```bash
    npm install
    # or
    bun install
    ```

## Development

To start the development server, run:

```bash
bun run dev
```

This will start the server and open the app in your default browser. You can then access the application at the address provided in the console (usually http://localhost:5173).

## Storybook
This project uses Storybook for developing and showcasing UI components.

To start the Storybook development server, run:
```bash
bun run storybook
```
This will start the Storybook server and open it in your default browser, usually at http://localhost:6006.

Building
To create a production build of the application, run:
```bash
bun run build
```
This will generate optimized static assets in the build directory.

Previewing
You can preview the production build locally using:
```bash
bun run preview
```
Database
This project uses Drizzle ORM for database interactions. The following commands are available for managing the database:

`bun run db:push`: Push database schema changes.
`bun run db:migrate`: Run database migrations.
`bun run db:studio`: Open Drizzle Studio to visualize the database.
Linting and Formatting
To ensure code quality and consistency, the following commands are available:


Deployment  
TODO