#!/usr/bin/env bash
set -euo pipefail

SERVER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${SERVER_DIR}"

# Ensure Postgres container is running so drizzle push has a target to diff against.
docker compose up -d db >/dev/null

# Wait until the database accepts connections before running drizzle.
until docker exec chatbot-ai pg_isready -U user -d mydatabase >/dev/null 2>&1; do
  sleep 1
done

bunx drizzle-kit push
