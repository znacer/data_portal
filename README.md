# Data Portal

This monorepo contains a modern data portal application split into three main components:

## Components

### Frontend ([frontend/](frontend/))
A SvelteKit web application with:
- TypeScript support
- Storybook for component development
- TailwindCSS + DaisyUI for styling
- Drizzle ORM for database operations
- Internationalization with Paraglide

### OpenIMS ([openims/](openims/)) (Work In Progress)
A FastAPI-based backend service using:
- Python 3.12+
- SQLAlchemy for database operations
- Pydantic for data validation
- Polars for data processing
- PostgreSQL database

### Analyzer ([analyzer/](analyzer/)) (Work in Progress)
A Python-based data analysis service

## Prerequisites

- Node.js 16+ or Bun
- Python 3.12+
- Docker and Docker Compose

## Quick Start

1. Start the infrastructure services:
```sh
docker compose up -d
```
2. Install and start the frontend:
```bash
cd frontend
bun install
bun run dev
```
3. Install and start the OpenIMS backend:
```bash
cd openims
python -m venv .venv
source .venv/bin/activate  # or `.venv/Scripts/activate` on Windows
pip install -e .
fastapi dev
```
or with `uv`:
```bash
cd openims
uv sync
uv run fastapi dev
```
## Development
Each component has its own README with specific development instructions:

- Frontend Documentation
- OpenIMS Documentation

## Infrastructure
The project uses Docker Compose to manage:

- PostgreSQL 17.4 (port 5433)
- TimescaleDB for time-series data (port 5432)
- Grafana for visualization (port 3000)
