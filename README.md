# 💰 Spent Tracker

A full-stack expense tracking application to manage your personal finances.

## ✨ Features

- 📊 Dashboard with monthly income, expenses, and balance
- 💳 Credit card management with custom colors
- 📈 Income & expense tracking
- 🔐 JWT authentication
- 📱 Responsive design

## 🏗️ Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: React, TanStack Router, TanStack Query, Tailwind CSS

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment** - Create `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/spent_tracker"
   JWT_SECRET="your-secret-key"
   ```

3. **Run migrations**
   ```bash
   cd backend && npm run prisma:migrate
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

   - API: http://localhost:3000
   - App: http://localhost:5173

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run dev:backend` | Start only backend |
| `npm run dev:frontend` | Start only frontend |
