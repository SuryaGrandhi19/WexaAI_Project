# DevGraph

Graph-powered developer skill and project recommendations using React, Express, the official Neo4j JavaScript driver, and CognoDB Cloud.

## Architecture

React + Vite → Express API → neo4j-driver → CognoDB Cloud

## Features

- Developer selection
- Developer skill profile
- Graph-based project recommendations
- Matched and missing skills
- Learning path suggestions
- Multi-hop Cypher traversal
- Loading, empty, and error states
- Online CognoDB Cloud database
- Production deployment support

## Graph Model

Nodes: Developer, Skill, Project, Technology, Company

Relationships:
- Developer KNOWS Skill
- Developer WORKED_ON Project
- Developer WORKS_AT Company
- Project REQUIRES Skill
- Project BUILT_WITH Technology
- Skill RELATED_TO Skill
- Technology RELATED_TO Technology

## Requirements

- Node.js 18+
- Git
- CognoDB Cloud account
- GitHub account

No local graph database installation is required.

## Configure CognoDB

Create a free CognoDB Cloud instance and copy its Bolt URI, username, and password.

Create `server/.env`:

```env
PORT=5000
COGNODB_URI=bolt+s://YOUR_INSTANCE.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=YOUR_PASSWORD
```

Never commit this file.

## Install

```bash
npm install
npm run install:all
```

## Create schema

```bash
npm run schema
```

## Seed data

```bash
npm run seed
```

## Run

```bash
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:5000

Health: http://localhost:5000/api/health

## API

GET `/api/health`

GET `/api/developers`

GET `/api/developers/:id`

GET `/api/developers/:id/recommendations`

GET `/api/developers/:id/learning-path`

## Deployment

### Backend

Deploy `server` as a Render Web Service.

Root directory: `server`

Build command:
```bash
npm install
```

Start command:
```bash
npm start
```

Environment variables:
- COGNODB_URI
- COGNODB_USERNAME
- COGNODB_PASSWORD

### Frontend

Deploy `client` to Vercel.

Root directory: `client`

Build command:
```bash
npm run build
```

Output directory: `dist`

Environment variable:
```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

## Security

Credentials are stored only in environment variables. Cypher queries use parameters rather than string concatenation.
