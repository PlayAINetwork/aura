# @playai/aura

## Getting Started

This project is initialized with [Bun](https://bun.sh/).

### Installation

#### Linux & macOS

```sh
curl -fsSL https://bun.sh/install | bash
```

#### Windows

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Setup

1. Install dependencies:
    ```sh
    bun install
    ```

2. Setup the database:
    ```sh
    bun run migrate
    ```
   This initializes a persistent [pglite](https://pglite.dev/) database with local storage. PgLite is a lightweight,
   embedded PostgreSQL-compatible database designed for local development and testing.

3. Open database explorer using [Drizzle](https://orm.drizzle.team/):
    ```sh
    bun run studio
    ```

### Running the Server

- To start the development server:
    ```sh
    bun run dev
    ```

- To start the server:
    ```sh
    bun run start
    ```