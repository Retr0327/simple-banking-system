# **simple-banking-system**

This project builds a simple banking system, allowing users to create an account, log in, check their balance, and transfer money to other accounts.

## **Setup**

### 1. Repository setup

```bash
git@github.com:Retr0327/simple-banking-system.git
```

### 2. Environment variables:

please create both `.env` and `.env.prod` files in the root directory of the project.

- `.env`:

  ```bash
  MYSQL_ROOT_PASSWORD=[mysql-root-password]
  MYSQL_USER=[mysql-user]
  MYSQL_PASSWORD=[mysql-password]
  MYSQL_DATABASE=[mysql-database-name]
  MYSQL_HOST="localhost"
  ```

- `.env.prod`:

  ```bash
  MYSQL_ROOT_PASSWORD=[mysql-root-password]
  MYSQL_USER=[mysql-user]
  MYSQL_PASSWORD=[mysql-password]
  MYSQL_DATABASE=[mysql-database-name]
  ```

### 3. Running Applications with Docker

> **Note**: The server will run on port 3000 (http://localhost:3000).

- in development mode:

  ```bash
  docker compose -f ./docker-compose.dev.yml up
  ```

- in production mode:

  ```bash
  docker compose up
  ```

### 4. Running MySQL migrations

```
pnpm run typeorm migration:run
```

## **Services**

### 1. Account management

1. POST `/api/v1/account`

   - description: create a new account
   - request body:

     ```json
     {
       "name": "test",
       "email": "1@mail.com",
       "password": "12345678",
       "balance": 100
     }
     ```

     > **Note**: the password must be at least 8 characters long.

   - response:

     > **Note** the `id` field is the account id.

     ```json
     {
       "status": "success",
       "data": {
         "id": "01HZW26D2WNTGYNZECS0SMS0KY",
         "name": "test",
         "email": "1@mail.com",
         "balance": 100
       }
     }
     ```

2. POST `/api/v1/account/detail`

   - description: get account detail
   - request body:

     ```json
     {
       "email": "1@mail.com",
       "password": "12345678"
     }
     ```

   - response:

     > **Note** the `id` field is the account id.

     ```json
     {
       "status": "success",
       "data": {
         "id": "01HZW26D2WNTGYNZECS0SMS0KY",
         "name": "test",
         "email": "1@mail.com",
         "balance": 100
       }
     }
     ```

### 2. Transaction operations

1. POST `/api/v1/transaction/deposit`

   - description: deposit money to the account
   - request body:

     ```json
     {
       "account": "01HZW26D2WNTGYNZECS0SMS0KY",
       "password": "12345678",
       "amount": 100
     }
     ```

   - response:

     ```json
     { "status": "success" }
     ```

2. POST `/api/v1/transaction/withdraw`

   - description: withdraw money from the account
   - request body:

     ```json
     {
       "account": "01HZW26D2WNTGYNZECS0SMS0KY",
       "password": "12345678",
       "amount": 100
     }
     ```

   - response:

     ```json
     { "status": "success" }
     ```

3. POST `/api/v1/transaction/transfer`

   - description: transfer money to another account
   - request body:

     ```json
     {
       "account": "01HZW26D2WNTGYNZECS0SMS0KY",
       "password": "12345678",
       "targetAccount": "01HZW0X7QR8KZJQEVAYJZ8XENK",
       "amount": 100
     }
     ```

   - response:

     ```json
     { "status": "success" }
     ```

# **Test**

### 1. Install dependencies:

```bash
pnpm i
```

### 2. Running tests:

- Unit test

  ```bash
  pnpm run test
  ```

- e2e test

  ```bash
  pnpm run test:e2e
  ```

## Contact Me

If you have any suggestion or question, please do not hesitate to email me at lixingyang.dev@gmail.com
