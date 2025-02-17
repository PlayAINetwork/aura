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
- You can view the API documentation at the `/docs` endpoint.

## Aura Setup

1. Create an Aura service:

   To create an Aura service, you need to make an API request to the `/aura/create` endpoint. The request should be a
   POST request with the following JSON payload:

    - `name`: The designated name of the service.
    - `description`: A brief description of the service.
    - `headers`: HTTP headers that are automatically injected from the backend during the API call.
    - `input`: Input fields expected from the user and it's type.
    - `hiddenInput`: Sensitive input fields required for the API call but not visible to the user.
    - `endpoint`: The API endpoint URL.
    - `requestType`: The HTTP request method, which can be either POST or GET.
    - `payment`: An optional value representing the amount of SOL tokens the user must transfer to utilize the service.
      If not set, no payment is required.

   Example:

   ```sh
   curl http://localhost:3000/aura/create \
   --request POST \
   --header 'Content-Type: application/json' \
   --data '{
   "name": "Rogue Video Generation",
   "description": "Create a video by agent Rogue based on the given topic",
   "headers": {
   "Authorization": "Bearer ${YOUR_BEARER_TOKEN}"
   },
   "input": {
   "message": "string",
   },
   "hiddenInput": {},
   "endpoint": "http://example.com/api",
   "requestType": "POST",
   "payment": 0.05
   }'
      ```

> [!NOTE]
> The payment will be sent to the associated wallet with the agent to which this service is linked. This is not shown
> here since it's a minimal implementation.

2. Retrieve all Aura services:

   To retrieve a paginated list of all Aura services, make a GET request to the `/aura/services` endpoint. You can use
   the optional `page` and `limit` query parameters to control pagination.

   Example:
   ```sh
   curl http://localhost:3000/aura/services?page=1&limit=10
   ```

   ```json
   {
     "total": 1,
     "page": 1,
     "limit": 10,
     "result": [
       {
         "id": "5086985c-9fa5-4eb3-b0d5-347880609c3f",
         "name": "Rogue Video Generation",
         "description": "Create a video by agent Rogue based on the given topic",
         "input": {
           "message": "string"
         },
         "payment": 0.05
       }
     ]
   }
   ```
   The frontend will use this to render all the services with the relevant input fields such as string, number, or file.

3. Delete an Aura service:

   To delete an Aura service, make a DELETE request to the `/aura/service/{id}` endpoint. Replace `{id}` with the ID of
   the service you want to delete.

   Example:
   ```sh
   curl 'http://localhost:3000/aura/service/{id}' \
   --request DELETE
   ```

4. Call an Aura service:

   To call an Aura service, make a POST request to the `/aura/service/{id}` endpoint. Replace `{id}` with the ID of the
   service you want to call. The request should include the necessary data in the body.

   Example:

   ```sh
   curl 'http://localhost:3000/aura/service/{id}' \
     --request POST \
     --header 'Content-Type: application/json' \
     --data '{
     "message": "Talk about the rug pull by Javier Milei & Hayden Davis",
     "signature": "4pfgaYWuKLTUNKBmrra4vzXCWvAMCH4K6YrbQEMHos3ArAqoreARgqGWVBzxr5VL65ZiPxeVk7t65fp3n2ZGRi8z"
   }'
   ```

   ```json
   {
     "video": "http://example.com/rogue.mp4"
   }
   ```

> [!NOTE]
> The `signature` field is optional and only required if the service requires payment.

> [!NOTE]
> Currently, this API returns the raw results from the endpoint to the frontend. To ensure consistent presentation of
> results, developers should adhere to a standardized response format in future implementations.
