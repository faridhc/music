# SonicWave - Music Streaming Platform

A modern full-stack music streaming platform built with Next.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas)

### Frontend (Client)
```bash
cd client
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (Server)
```bash
cd server
npm install
# Copy .env.example to .env and configure
cp .env.example .env
npm run dev
# API running on http://localhost:5000
```

### Seed Sample Data
```bash
cd server
npm run seed
```

## 🔑 Demo Accounts (after seeding)
| Role   | Email                 | Password     |
|--------|-----------------------|--------------|
| Admin  | admin@sonicwave.com   | password123  |
| Artist | synth@sonicwave.com   | password123  |
| User   | user@sonicwave.com    | password123  |

## 📁 Project Structure
```
music/
├── client/          # Next.js Frontend
│   └── src/
│       ├── app/         # Pages (App Router)
│       ├── components/  # Reusable UI
│       ├── context/     # Auth & Audio providers
│       ├── lib/         # API client & demo data
│       └── types/       # TypeScript interfaces
├── server/          # Express Backend
│   ├── config/      # Database config
│   ├── middleware/   # Auth, upload middleware
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   └── seed/        # Sample data seeder
└── README.md
```

## 🎵 Features
- Streaming with Howler.js audio engine
- JWT authentication with role-based access
- Instant search with genre filtering
- Animated UI with Framer Motion
- Responsive mobile-first design

## ⚖️ Legal
All demo audio is royalty-free from Pixabay. All images via Unsplash.
