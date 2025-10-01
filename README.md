# E-Shop Microservices Demo

This is a project that demonstrates a simple **user authentication system**, a basic **course purchase flow**, and a **microservice API architecture** using **NestJS, RabbitMQ, and MongoDB**.  
The infrastructure is containerized with Docker for easy local setup.

---

## 🛠️ Tech Stack

- **NestJS 11** (controllers, services, modules)
- **TypeScript**
- **MongoDB 4.4** (Docker container)
- **RabbitMQ 3** with management UI (Docker container)
- **Nx Monorepo** for project organization
- **Jest** for unit and integration testing
- **Docker Compose** for local development environment

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd e-shop
```

### 2. Start infrastructure (MongoDB & RabbitMQ)
```bash
docker-compose up -d
```

This will start:
- **MongoDB** at `localhost:27017`
- **RabbitMQ** at:
  - AMQP: `amqp://localhost:5672`
  - Management UI: http://localhost:15672  (default: guest/guest)

### 3. Install dependencies
```bash
npm install
```

### 4. Run the services
Start all apps:
```bash
npm run start:all
```

Or run only the API:
```bash
npm run start:eShop
```

The API will be available at:  
👉 http://localhost:4000

---

## 📬 API Endpoints

### Auth
- **POST** `/auth/register`
  ```json
  {
    "email": "test@test.com",
    "password": "12345",
    "displayName": "John Doe"
  }
  ```

- **POST** `/auth/login`
  ```json
  {
    "email": "test@test.com",
    "password": "12345"
  }
  ```

- **GET** `/users/helthcheck`
  ```json
  { "rmq": "boolean", "db": "boolean" }
  ```

Response:
```json
{ "access_token": "<jwt-token>" }
```

### Courses
- `/account/buy-course` (via RMQ topic)
- `/account/change-profile` (via RMQ topic)
- `/account/user-info` (via RMQ topic)

Most requests (except register/login) require JWT in `Authorization: Bearer <token>`.

---

## 🧪 Running Tests

```bash
npm run jest:eShop
```

Tests use **mongodb-memory-server**, so no Docker DB is needed when running Jest.

---

## 🔗 RabbitMQ UI

Check queues, messages and topics at:  
👉 http://localhost:15672  
(default credentials: guest / guest)
