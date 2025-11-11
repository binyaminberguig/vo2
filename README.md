# VO2 Project

## Description

VO2 is a RESTful API to manage **users, projects, tasks, and comments**.
It uses **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **JWT** for authentication.
Unit tests are written with **Jest** and cover the main controllers.

---

## Table of Contents

- [Technologies](#technologies)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Running the Server](#running-the-server)  
- [API Endpoints](#api-endpoints)  
- [Tests](#tests)  
- [Project Structure](#project-structure)  
- [Commit Guidelines](#commit-guidelines)  
- [Notes](#notes)  

---

## Technologies

- Node.js v20+  
- TypeScript  
- Express  
- MongoDB / Mongoose  
- JWT for authentication  
- Jest for unit testing  
- UUID (optional) for IDs  

---

## Installation

```bash
# Clone the repository
git clone https://github.com/binyaminberguig/vo2.git
cd vo2

# Install dependencies
npm install
```

---

## Environment Variables

A develelopment environment is user in the project root with the following variables:

---

## Running the Server

```bash
# Development mode
npm run dev

# Build + start
npm run build
npm start
```

> By default, the server runs on `http://localhost:8080`.

---

## API Endpoints

### Auth

| Method | Route             | Description                  |
|--------|-----------------|-----------------------------|
| POST   | /api/auth/register | Register a new user         |
| POST   | /api/auth/login    | User login                  |

### Users

| Method | Route       | Description                   |
|--------|------------|-------------------------------|
| GET    | /api/users | Get all users                 |

### Projects

| Method | Route                | Description                                         |
|--------|--------------------|---------------------------------------------------|
| POST   | /api/projects       | Create a project (auth required)                 |
| GET    | /api/projects/:id   | Get a project with its tasks and comments (auth) |

### Tasks

| Method | Route                           | Description                                    |
|--------|--------------------------------|-----------------------------------------------|
| POST   | /api/projects/:projectId/tasks | Create a task in a project (auth required)    |
| PATCH  | /api/tasks/:id/status          | Update a task status (auth required)          |

### Comments

| Method | Route                  | Description                            |
|--------|------------------------|----------------------------------------|
| POST   | /api/tasks/:id/comments | Add a comment to a task (auth required)|

> All routes except `/register` and `/login` require a **JWT Bearer Token**.

---

## Tests

Unit tests are written with **Jest** and cover:  

- Controllers: `authController`, `userController`, `projectController`, `taskController`, `commentController`  
- Positive and negative test cases for each route  
- Mocking Mongoose and Express `Response` / `NextFunction` objects  

```bash
# Run all tests
npm run test
```

---

## Project Structure

```
vo2/
├─ src/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ middlewares/
│  └─ app.ts
├─ tests/
│  ├─ auth.test.ts
│  ├─ task.test.ts
│  └─ ...
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## Commit Guidelines

All commits must follow the following naming convention:

```bash
git commit -m '[ticket-5]: comment module + unit test'
```

- `[ticket-#]`: reference the issue or task number  
- Message should briefly describe the change  

---

## Notes

- IDs are **MongoDB ObjectIds** (ORM equivalent of UUIDs).  
- Two logical migrations are respected:  
  1. `User`, `Project`, `Task`  
  2. `Comment`  
- JWT is used to secure endpoints and authenticate users.
- Use the prettier, eslint and Error Lens extensions in order to format your code