# Deployment Document — Rock Paper Scissors (Coraline Challenge)

This document describes the full installation process on a fresh Ubuntu 20.04 server, from a clean machine to a fully working website.

## Table of Contents

- [Deployment Document — Rock Paper Scissors (Coraline Challenge)](#deployment-document--rock-paper-scissors-coraline-challenge)
  - [Table of Contents](#table-of-contents)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Install Docker and Docker Compose](#2-install-docker-and-docker-compose)
  - [3. Get the Project Code](#3-get-the-project-code)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Build and Run the System](#5-build-and-run-the-system)
  - [6. Run Database Migration](#6-run-database-migration)
    - [6.1 Confirm Postgres Is Ready](#61-confirm-postgres-is-ready)
    - [6.2 Run the Migration](#62-run-the-migration)
    - [6.3 Rolling Back a Migration (if needed)](#63-rolling-back-a-migration-if-needed)
    - [6.4 If Migration Fails Because the Database Doesn't Exist](#64-if-migration-fails-because-the-database-doesnt-exist)
  - [7. Verify the System Is Working](#7-verify-the-system-is-working)
    - [7.1 Open the Website](#71-open-the-website)
    - [7.2 Test the API Through Nginx (optional)](#72-test-the-api-through-nginx-optional)
    - [7.3 Test Nginx Config Syntax (if config was modified)](#73-test-nginx-config-syntax-if-config-was-modified)
    - [7.4 Verify WebSocket (Real-Time High Score)](#74-verify-websocket-real-time-high-score)
  - [8. Common Commands After Deployment](#8-common-commands-after-deployment)
  - [9. Troubleshooting](#9-troubleshooting)
  - [10. System Architecture Overview](#10-system-architecture-overview)

---

## 1. Prerequisites

- A fresh Ubuntu 20.04 server
- `sudo` privileges on the server
- The following port open on the firewall/security group:
  - `8080` — for accessing the website via Nginx (HTTP)
  - (No need to expose `5432`, `5672`, `15672`, or `3000`–`3002` externally — these are used internally within the Docker network only)
- Internet access on the server (for downloading Docker images and dependencies)

---

## 2. Install Docker and Docker Compose

```bash
# Update package list
sudo apt-get update

# Install required dependencies
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine + Docker Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow the current user to run docker without sudo (requires logout/login to take effect)
sudo usermod -aG docker $USER
```

**Verify the installation:**

```bash
docker --version
docker compose version
```

Both commands should print a version number with no errors.

---

## 3. Get the Project Code

```bash
git clone https://github.com/ckornchorkjatupat/Coraline-Challenge.git coraline-challenge
cd coraline-challenge
git checkout Development   # or the branch you want to deploy
```

---

## 4. Configure Environment Variables

This project uses a single `.env` file at the project root, which every service in `docker-compose.yml` reads from.

```bash
cp .env.example .env
```

Open `.env` and review/update the values as needed:

```env
# Postgres
DB_HOST=postgres
DB_NAME=rps_game
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_PORT=5432

# RabbitMQ
RABBIT_HOST=rabbitmq
RABBIT_USER=guest
RABBIT_PASS=guest
RABBIT_PORT=5672
RABBIT_MANAGEMENT_PORT=15672

# NGINX
NGINX_URL=http://localhost:8080
NGINX_PORT=8080

# FrontEnd
FRONTEND_URL=http://localhost:3000
FRONTEND_LOCATION=/
FRONTEND_PORT=3000

# Game Service
GAME_API_PUBLIC_URL=http://localhost:8080/api/game
GAME_API_LOCATION=/api/game/
GAME_SERVICE_PORT=3001

# Score Service
SCORE_API_PUBLIC_URL=http://localhost:8080/api/score
SCORE_API_LOCATION=/api/score/
WS_PUBLIC_URL=http://localhost:8080/socket.io
WS_LOCATION=/socket.io/
SCORE_SERVICE_PORT=3002
```

---

## 5. Build and Run the System

```bash
docker compose up --build -d
```

This command will:
1. Build the Docker image for every service (`frontend`, `game-service`, `score-service`, `nginx`)
2. Pull the prebuilt images for `postgres` and `rabbitmq`
3. Create an internal Docker network so all services can communicate
4. Start every container in the background (`-d`)

**Verify all containers started successfully:**

```bash
docker compose ps
```

Every service should show status `Up` (`postgres`/`rabbitmq` should show `Up (healthy)`).

**Check logs if any container fails to start:**

```bash
docker compose logs -f <service-name>
# e.g.
docker compose logs -f score-service
```

---

## 6. Run Database Migration

This project uses TypeORM migrations (not `synchronize: true`) to manage the database schema. Migrations must be run **after** the `postgres` container is ready, and **before** the website is used for the first time.

### 6.1 Confirm Postgres Is Ready

```bash
docker compose exec postgres pg_isready -U postgres
```

You should see `accepting connections`.

### 6.2 Run the Migration

The migration scripts live in `services/score-service`.

```bash
cd services/score-service
npx --node-options="--import tsx" typeorm migration:run -d src/data-source.ts
cd ../..
```

> **Note:** This command must be run from the host machine (Node.js and the `score-service` dependencies must already be installed there via `npm install`), not inside the production container — the production image is built with `npm ci --omit=dev`, so devDependencies like `ts-node`/`tsx` are not available inside it.

**Verify the migration succeeded — the required table should now exist:**

```bash
docker compose exec postgres psql -U postgres -d rps_game -c "\dt"
```

You should see the `player` table listed.

### 6.3 Rolling Back a Migration (if needed)

```bash
cd services/score-service
npx --node-options="--import tsx" typeorm migration:revert -d src/data-source.ts
```

### 6.4 If Migration Fails Because the Database Doesn't Exist

If you see the error `database "rps_game" does not exist`, create the database first:

```bash
docker compose exec postgres psql -U postgres -c "CREATE DATABASE rps_game;"
```

Then re-run the migration from step 6.2.

---

## 7. Verify the System Is Working

### 7.1 Open the Website

Open a browser and navigate to:

```
 http://<SERVER_IP>:8080
```

You should see the game screen with ROCK, PAPER, SCISSORS buttons, and Your Score / High Score both starting at 0.

### 7.2 Test the API Through Nginx (optional)

```bash
# Test session bootstrap
curl  http://<SERVER_IP>:8080/api/score/player/session

# Test playing a round
curl -i -X POST http://<SERVER_IP>:8080/api/game/play \
  -H "Content-Type: application/json" \
  -d '{"action": "ROCK"}'
```

### 7.3 Test Nginx Config Syntax (if config was modified)

```bash
docker compose exec nginx nginx -t
```

### 7.4 Verify WebSocket (Real-Time High Score)

Open the website in two tabs/devices at once. Win a round in one tab until a new High Score is set, then confirm the other tab updates automatically without a page refresh.

---

## 8. Common Commands After Deployment

```bash
# Follow logs for all services
docker compose logs -f

# Follow logs for a specific service
docker compose logs -f game-service

# Restart a single service (e.g. after changing .env)
docker compose restart score-service

# Rebuild all images (after pulling new code)
git pull
docker compose up --build -d

# Stop the whole system (data in volumes is preserved)
docker compose down

# Stop the system AND remove all data (use only when you want a full reset — this permanently deletes data)
docker compose down -v

# Backup the database
docker compose exec -T postgres pg_dump -U postgres rps_game > backup_$(date +%F).sql

# Restore the database from a backup
cat backup_2026-07-05.sql | docker compose exec -T postgres psql -U postgres -d rps_game
```

---

## 9. Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `role "postgres" does not exist` or `database "rps_game" does not exist` | An old volume from a previous run with different `.env` values is still present | `docker compose down -v` then `docker compose up --build -d` again (this will erase old data) |
| `relation "player" does not exist` | Migration has not been run yet | Follow the steps in Section 6 |
| A service won't start / keeps restarting | Check logs with `docker compose logs -f <service>` to see the real error | Usually caused by incomplete `.env` values, or a dependency service (postgres/rabbitmq) not being ready yet |
| Website is unreachable on port 8080 | The Nginx container isn't running, or a firewall is blocking the port | Check `docker compose ps`, and check `sudo ufw status` or your cloud provider's security group settings |
| Cookies not working / player gets a new playerId every time | Cookie path mismatch, or CORS `credentials` not enabled | Check that `FRONTEND_URL`/`NGINX_URL` in `.env` match the actual URL used to access the site |
| High Score doesn't update in real time | WebSocket connection failed | Check via Browser DevTools → Network → WS that the handshake succeeded (status 101) |

---

## 10. System Architecture Overview

```
                    [User / Browser]
                            │
                 http://<SERVER_IP>:8080
                            │
                     ┌──────▼──────┐
                     │    Nginx    │  (API Gateway + Reverse Proxy)
                     └──────┬──────┘
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        [Frontend]   [game-service]  [score-service]
        (Next.js)      (NestJS)        (NestJS)
                            │               │
                            └───RabbitMQ────┘
                          (events: game.won, game.lost)
                                            │
                                      [PostgreSQL]
                                            │
                          WebSocket → all clients (real-time High Score)
```

**Services and responsibilities:**

| Service | Responsibility | Internal Port |
| --- | --- | --- |
| `nginx` | API Gateway, reverse proxy, single entry point for the whole system | 80 (mapped to 8080) |
| `frontend` | The game website (Next.js) | 3000 |
| `game-service` | Game logic (random bot action, result resolution); prevents cheating by keeping all logic on the backend | 3001 |
| `score-service` | Player session management (cookie-based), score tracking, High Score, WebSocket broadcasting | 3002 |
| `postgres` | Database storing player and score data | 5432 |
| `rabbitmq` | Message broker connecting `game-service` and `score-service` asynchronously | 5672 (+ 15672 management UI) |

**Environment variable management:** Every service reads its configuration from a single root-level `.env` file via `docker-compose.yml`. This allows configuration changes (e.g. changing database credentials or URLs) to be made from a single location without modifying any code.

**Note for future development:** If the system needs to scale to support more users, the first areas to consider are increasing the replica count of `game-service` (stateless, easy to scale) and moving PostgreSQL to a managed database service separate from the container setup.
