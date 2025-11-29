# Implementation Notes

**Candidate:** Fauzan Adithya Zuchairul Mursalin
**Date:** 27 November 2025
**Time Spent:** 16 hours

## Main Bugs/Issues Found

### 1. Bad error handling / At TodoService.ts line 14, 20, 38, 52

**Issue:** Error messages has no context
**Fix:** Implement middleware to handle error, At middleware/errorHandler.ts with the help of error throw at common/httpErrors.ts.
**Impact:** Clean error message and flexible + middleware return a json.

### 2. Input validation on empty title & only whitespace input / At TodoService.ts line 22

**Issue:** Creating a todo with an empty title input allows invalid todos to be saved, since the Todo interface requires title.
**Fix:** At TodoService.ts line 12, check if a trim title input is empty or only contain whitespace.
```ts
if (!data.title.trim()) {
  throw new Error('title is required');
}
```
**Impact:** Throw error if title is not valid and continue if valid.

### 3. Create todo on non existing user / At TodoService.ts line 22

**Issue:** Creating a todo while userId is not an exist user is a bug.
**Fix:** At TodoService.ts line 17, find user by id and check if user exist.
**Impact:** Throw error if user not exist and continue if user is exist.

### 4. Reasonable ID generation / At InMemoryTodoRepository.ts line 12

**Issue:** Generate random number has a change to generate a duplicate id,
**Fix:** Initialize idCounter that increment every new data is insert.
**Impact:** Generate a guarantee unique id.

### 5. update should not silently create new entities on unknown IDs. / At InMemoryTodoRepository.ts line 31

**Issue:** Todo create userId without validation is user exist.
**Fix:** Validat todoId before updating At `TodoServices.ts` line 38. But also, update `InMemoryTodoRepository.ts` to just return null since null data after update is being handle at `TodoService.ts` line 55.
**Impact:** It will not create todo with unkown user and doing early error return if todo not exist.

### 6. findDueReminders should filter only PENDING todos with remindAt <= now. / At InMemoryTodoRepository.ts line 70

**Issues:** findDueReminders might get unnecessary todo that status already 'DONE' and also 'REMINDER_DUE'.
**Fix:** Add another condition `t.status === 'PENDING'`
**Impact:** Use less memory and resource since there's less data.

(Add more as needed)

---

## How I Fixed Them

### Type Safety Issues
1. Create DTO interfaces.
2. Revoke some of return types of a function

### Validation Issues
1. Null checking data before execute it or continue with it.
2. Use library [zod](https://zod.dev/).

### Data Integrity Issues


### Logic Errors
1. Add another condition.
2. Keep simplicity with just return null without needing to forcing the flow.

### Error Handling
1. Implement custom Error interface.
2. Create middleware that catch the custom interface.

---

## Framework/Database Choices

### HTTP Framework

**Choice:** ExpressJs
**Reasoning:** Simplicity and flexible.

### Database

**Choice:** PostgreSQL
**Reasoning:** No specific reason in coding. I never work on high scale apps the need me to write particular SQL. But I found a trend that currently many new projects use PostgreSQL.

### Other Libraries/Tools
1. `prisma`, for database interactions.
2. `nodemon`, commandline-tool to implement hot-reload during development.
3. `dotenv`, required a generated `prisma` file.
4. `tsconfig-paths`, enable runtime of module paths in `tsconfig.json` so we can implement import alias.
5. `zod`, validation library.
6. `bcrypt`, for hashing and comparing
7. `express-rate-limit`, for rate limit
8. `jsonwebtoken`, generate jwt for stateless authentication 
9. `morgan`, for logging

---

## Database Schema Design

(If applicable)

```sql
-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('PENDING', 'DONE', 'REMINDER_DUE');

-- User Table
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refreshToken TEXT,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- Todo Table
CREATE TABLE "Todo" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status "TodoStatus" NOT NULL DEFAULT 'PENDING',
    remindAt TIMESTAMPTZ,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    userId UUID NOT NULL,

    CONSTRAINT "Todo_userId_fkey"
      FOREIGN KEY ("userId")
      REFERENCES "User" (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

-- Index on userId
CREATE INDEX "Todo_userId_idx" ON "Todo" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Todo_userId_idx" ON "Todo"("userId");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## How to Run My Implementation

This guide explains how to set up and run the application using Docker or locally with Node.js.

---

### Prerequisites

1. **Docker** (required)
2. **Node.js v22.13.0** (optional, if running locally)
3. **NPM v11.0.0** (optional, if running locally)

---

### Running Using Docker (Recommended)

1. **Create `.env` file**

   ```bash
   cp .env.example .env
   ```

Update the POSTGRES_HOST value to:

```ini
  POSTGRES_HOST=postgres
```

2. **Start Docker containers**

```bash
  docker compose -f compose.dev.yaml up -d
```

Wait until all containers are fully up and running.

3. **Run database migrations**

```bash
  docker compose -f compose.dev.yaml run --rm api npx prisma migrate dev
```

4. **Generate Prisma client types**

```bash
  docker compose -f compose.dev.yaml run --rm api npx prisma generate
```

5. **All setup done 🙌. Check the application**
The app should now be running on [http://localhost:3000](http://localhost:3000).
Verify health on [http://localhost:3000/health](http://localhost:3000/health).

### Running Locally with Node.js

1. **Create `.env` file**

   ```bash
    cp .env.example .env
   ```

Update the POSTGRES_HOST value to:

```ini
  POSTGRES_HOST=localhost
```

2. **Start Docker containers**

```bash
  docker compose -f compose.local.yaml up -d
```

Wait until all containers are fully up and running.

3. **Install dependencies**

```bash
  npm install
```

4. **Run database migrations**

```bash
  npx prisma migrate dev
```

5. **Generate Prisma client types**

```bash
  npx prisma generate
```

6. **Start the application**

```bash
  npm run dev
```

7. **All setup done 🙌. Check the application**
The app should now be running on [http://localhost:3000](http://localhost:3000).
Verify health on [http://localhost:3000/health](http://localhost:3000/health).

### Notes
- Ensure Docker is running before starting the containers.
- The .env configuration differs slightly for Docker (POSTGRES_HOST=postgres) vs local (POSTGRES_HOST=localhost).
- Prisma migrations and client generation must be run after setting up the environment and starting the database.

### Running Tests

```bash
  npm test
```

---

## Optional Improvements Implemented

- [✅] Authentication/Authorization
- [✅] Pagination
- [✅] Filtering/Sorting
- [✅] Rate Limiting
- [✅] Logging
- [✅] Docker Setup
- [✅] Environment Configuration
- [✅] Integration Tests
- [✅] API Documentation,
  - Postman URL, https://documenter.getpostman.com/view/18176839/2sB3dLTrh5
  - I also include exported postman collection and environment on ./postman
- [✅] Health Check Endpoint
- [ ] Other: ******\_\_\_******

### Details

- Implement authentication with jwt.
- Generate pgaination, filtering, and sorting.
- 

---

## Future Improvements

If I had more time, I would add/improve:

1. Improve typing/interfaces
2. Improve clean code
3. Improve database managment refreshToken
4. Implement softDeletes
5. Improve folder/file structure
6. Implement batching on update todo i scheduler.
7. Improve error handling
8. Improve API Docs

---

## Assumptions Made

1. I'm in bad performance because, it took to long to finish the test. The OOP System Design bassicaly make me confuse.
2.
3.

---

## Challenges Faced

1. Working with complex OOP code base
2. I was overengineer on handling types / interfaces.
3.

---

## Additional Comments

I tried my best not to modify the test files or the core interface files, but I couldn’t find a the way to keep everything in sync with my implementation. For example, while implementing pagination, I had to update the core interface repository file and add mock query in the test file. I added inline comments in the test file to briefly explain these changes.

In the test files, I did not change any expected outputs, although I believe one of the unit tests—specifically, the one titled “should mark a pending todo as done”, Im pretty sure its written incorectly and will never pass the unit test.

Although I haven’t implemented API documentation yet, I plan to add it gradually as a future improvement after submitting this coding test.
