# 📚 Library API

> **Learning Project** — Mempelajari Prisma ORM dengan NestJS + TypeScript + MySQL

---

## 🧰 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | NestJS (TypeScript) |
| ORM | Prisma |
| Database | MySQL |
| Runtime | Node.js |

---

## 🗺️ Domain Model

```
User ──< Borrowing >── Book
```

- **User** — Anggota perpustakaan
- **Book** — Koleksi buku dengan stok
- **Borrowing** — Transaksi peminjaman & pengembalian

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd library-api
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env — isi DATABASE_URL dengan kredensial MySQL kamu
```

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/library_db"
```

### 3. Jalankan Migration & Generate Client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. (Opsional) Seed Database

```bash
npx prisma db seed
```

### 5. Jalankan Dev Server

```bash
npm run start:dev
```

Server berjalan di `http://localhost:3000`

---

## 📂 Struktur Project

```
src/
├── prisma/           ← PrismaModule & PrismaService (global)
├── books/            ← CRUD Book
├── users/            ← CRUD User
├── borrowings/       ← Borrow & Return (transactional)
└── app.module.ts

prisma/
├── schema.prisma     ← Data model & relasi
├── seed.ts           ← Data sample
└── migrations/       ← Auto-generated
```

---

## 🔧 Perintah Prisma

| Perintah | Deskripsi |
|---|---|
| `npx prisma migrate dev` | Buat & jalankan migration baru |
| `npx prisma db push` | Push schema tanpa migration file |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Buka GUI database browser |
| `npx prisma db seed` | Jalankan seed script |

---

## 📋 API Endpoints (Rencana)

### Books
```
GET    /books
GET    /books/:id
POST   /books
PATCH  /books/:id
DELETE /books/:id
```

### Users
```
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

### Borrowings
```
GET    /borrowings
GET    /borrowings/:id
POST   /borrowings              ← Borrow book (transactional)
PATCH  /borrowings/:id/return   ← Return book (transactional)
```

---

## 📚 Topik Prisma yang Dipelajari

- `model`, `@relation`, `enum` — schema definition
- `migrate dev` — database migration
- `findMany`, `findUnique`, `create`, `update`, `delete` — CRUD
- `include`, `select` — eager loading relasi
- `$transaction()` — atomic operations
- `where`, `skip`, `take`, `orderBy` — filtering & pagination
- `createMany`, `upsert` — bulk operations & seed

Lihat [issue.md](./issue.md) untuk detail planning pengembangan.
