# Spent Tracker - Backend

NestJS API for the Spent Tracker application.

## 🏗️ Tech Stack

- NestJS 11
- Prisma + PostgreSQL
- Passport JWT

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** - Create `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/spent_tracker"
   JWT_SECRET="your-secret-key"
   ```

3. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Start server**
   ```bash
   npm run dev
   ```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start in watch mode |
| `npm run build` | Build for production |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run test` | Run tests |

## 📝 API Endpoints

- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET/POST/PATCH/DELETE /expenses` - Manage expenses
- `GET/POST/PATCH/DELETE /credit-cards` - Manage credit cards
