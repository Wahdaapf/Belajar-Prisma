# 📚 Library API — Issue Planning

> **Project**: Library API (Learning Project — Prisma ORM)  
> **Stack**: NestJS · TypeScript · Prisma ORM · MySQL  
> **Tujuan**: Mempelajari konsep-konsep inti Prisma melalui project nyata

---

## 🗺️ Overview Domain

```
User ──< Borrowing >── Book
```

| Entity     | Deskripsi                                      |
|------------|------------------------------------------------|
| `User`     | Anggota perpustakaan yang bisa meminjam buku   |
| `Book`     | Koleksi buku dengan informasi stok             |
| `Borrowing`| Rekaman transaksi peminjaman dan pengembalian  |

---

## 📦 Issues

---

### Issue #1 — Setup Prisma & Database Connection

**Konsep Prisma**: `datasource`, `generator`, `prisma init`, `db push`

**Deskripsi**:  
Setup awal Prisma ke project NestJS. Koneksikan ke MySQL dan pastikan database bisa diakses.

**Tasks**:
- [ ] Install `prisma` (devDependency) dan `@prisma/client`
- [ ] Jalankan `npx prisma init --datasource-provider mysql`
- [ ] Konfigurasi `DATABASE_URL` di `.env`
- [ ] Verifikasi koneksi dengan `npx prisma db push`
- [ ] Verifikasi `PrismaService` bisa di-inject dan melakukan query sederhana (`prisma.$queryRaw`)

**Output yang diharapkan**: Server bisa start dan `PrismaService` terhubung ke MySQL.

---

### Issue #2 — Prisma Schema: Model & Migration

**Konsep Prisma**: `model`, `@id`, `@unique`, `@default`, `@relation`, `enum`, `migrate dev`

**Deskripsi**:  
Definisikan schema lengkap di `prisma/schema.prisma` dan jalankan migration pertama.

**Schema yang sudah tersedia** di `prisma/schema.prisma`:
- `User` — id, name, email (unique), timestamps
- `Book` — id, title, author, isbn (unique), stock, timestamps  
- `Borrowing` — id, userId, bookId, borrowedAt, returnedAt, status (enum)
- Relasi: `User` 1→N `Borrowing`, `Book` 1→N `Borrowing`

**Tasks**:
- [ ] Review schema yang sudah ada di `prisma/schema.prisma`
- [ ] Jalankan `npx prisma migrate dev --name init` untuk membuat migration pertama
- [ ] Jalankan `npx prisma generate` untuk generate Prisma Client
- [ ] Pastikan tabel terbuat di MySQL dengan `npx prisma studio`

**Output yang diharapkan**: Migration berhasil, tabel tersedia di DB, Prisma Studio bisa diakses.

---

### Issue #3 — CRUD: Books

**Konsep Prisma**: `findMany`, `findUnique`, `create`, `update`, `delete`, `prisma.book`

**Deskripsi**:  
Implementasi CRUD lengkap untuk entity `Book` menggunakan Prisma Client.

**Endpoints**:
```
POST   /books           prisma.book.create()
GET    /books           prisma.book.findMany()
GET    /books/:id       prisma.book.findUnique()
PATCH  /books/:id       prisma.book.update()
DELETE /books/:id       prisma.book.delete()
```

**Tasks**:
- [ ] Buat `CreateBookDto` dan `UpdateBookDto` (gunakan `PartialType`)
- [ ] Implementasi semua method di `BooksService` menggunakan Prisma
- [ ] Implementasi semua route handler di `BooksController`
- [ ] Handle error 404 ketika buku tidak ditemukan (`NotFoundException`)

**Output yang diharapkan**: Semua endpoint CRUD book berfungsi dan bisa ditest via REST client.

---

### Issue #4 — CRUD: Users

**Konsep Prisma**: `findMany`, `findUnique`, `create`, `update`, `delete`, `prisma.user`

**Deskripsi**:  
Implementasi CRUD untuk entity `User`. Mirip dengan Issue #3 namun untuk User.

**Endpoints**:
```
POST   /users           prisma.user.create()
GET    /users           prisma.user.findMany()
GET    /users/:id       prisma.user.findUnique()
PATCH  /users/:id       prisma.user.update()
DELETE /users/:id       prisma.user.delete()
```

**Tasks**:
- [ ] Buat `CreateUserDto` dan `UpdateUserDto`
- [ ] Implementasi semua method di `UsersService`
- [ ] Implementasi semua route handler di `UsersController`
- [ ] Handle error 404 dan duplicate email (409 Conflict)

**Output yang diharapkan**: Semua endpoint CRUD user berfungsi.

---

### Issue #5 — Relasi & Include: Borrowing

**Konsep Prisma**: `include`, `select`, `@relation`, one-to-many, nested query

**Deskripsi**:  
Implementasi endpoint borrowing yang melibatkan relasi antar model. Fokus pada penggunaan `include` untuk eager loading relasi.

**Endpoints**:
```
GET  /borrowings        findMany + include user & book
GET  /borrowings/:id    findUnique + include user & book
```

**Tasks**:
- [ ] Implementasi `findMany` dengan `include: { user: true, book: true }`
- [ ] Implementasi `findUnique` dengan `include` relasi lengkap
- [ ] Tambahkan `GET /users/:id` dengan include `borrowings` (history peminjaman user)
- [ ] Eksplorasi perbedaan `include` vs `select` dalam Prisma

**Output yang diharapkan**: Response API menyertakan data relasi (nested object), bukan hanya foreign key.

---

### Issue #6 — Transaksi: Borrow & Return Book

**Konsep Prisma**: `prisma.$transaction()`, atomic operations, rollback

**Deskripsi**:  
Implementasi fitur meminjam dan mengembalikan buku menggunakan Prisma Transaction untuk memastikan operasi atomik (cek stok, buat record, update stok harus terjadi sekaligus atau tidak sama sekali).

**Endpoints**:
```
POST   /borrowings              borrow book (transactional)
PATCH  /borrowings/:id/return   return book (transactional)
```

**Logika Borrow** (dalam satu transaksi):
1. Cek apakah buku ada dan stok > 0
2. Buat record `Borrowing` dengan status `ACTIVE`
3. Decrement `book.stock` sebesar 1

**Logika Return** (dalam satu transaksi):
1. Cek apakah borrowing ada dan status `ACTIVE`
2. Update `Borrowing.status` = `RETURNED`, set `returnedAt`
3. Increment `book.stock` sebesar 1

**Tasks**:
- [ ] Buat `CreateBorrowingDto` (userId, bookId)
- [ ] Implementasi `prisma.$transaction([...])` untuk borrow
- [ ] Implementasi `prisma.$transaction([...])` untuk return
- [ ] Handle error: stok habis (400), borrowing sudah dikembalikan (400)

**Output yang diharapkan**: Transaksi berjalan atomik — jika satu operasi gagal, semua di-rollback.

---

### Issue #7 — Filtering & Pagination

**Konsep Prisma**: `where`, `skip`, `take`, `orderBy`, `contains`, query params

**Deskripsi**:  
Tambahkan kemampuan filtering dan pagination ke endpoint list yang sudah ada.

**Fitur yang ditambahkan**:

`GET /books?title=harry&author=rowling&page=1&limit=10`
- Filter by `title` (contains, case-insensitive)
- Filter by `author` (contains)
- Pagination dengan `skip` dan `take`
- Response menyertakan `total`, `page`, `limit`, `data`

`GET /borrowings?status=ACTIVE&userId=1`
- Filter by `status` (ACTIVE / RETURNED)
- Filter by `userId`

**Tasks**:
- [ ] Buat `PaginationDto` (page, limit) yang bisa direuse
- [ ] Update `BooksService.findMany()` dengan `where` + `skip/take` + `orderBy`
- [ ] Update `BorrowingsService.findMany()` dengan filter `status` dan `userId`
- [ ] Return response dengan metadata pagination

**Output yang diharapkan**: Endpoint list mendukung filtering dan pagination.

---

### Issue #8 — Seed Database

**Konsep Prisma**: `prisma db seed`, `createMany`, bulk insert, idempotent seed

**Deskripsi**:  
Isi `prisma/seed.ts` dengan data sample yang cukup untuk testing dan demonstrasi.

**Data yang di-seed**:
- 5 Users (nama dan email berbeda)
- 10 Books (berbagai judul dan penulis)
- 5 Borrowings (mix status ACTIVE dan RETURNED)

**Tasks**:
- [ ] Implementasi seed di `prisma/seed.ts`
- [ ] Gunakan `prisma.user.createMany()` dan `prisma.book.createMany()`
- [ ] Gunakan `upsert` atau `deleteMany` untuk membuat seed idempoten (bisa dijalankan ulang)
- [ ] Daftarkan seed script di `package.json`: `"prisma": { "seed": "ts-node prisma/seed.ts" }`
- [ ] Jalankan dengan `npx prisma db seed`

**Output yang diharapkan**: Database terisi data sample dan seed bisa dijalankan berulang kali tanpa error.

---

## 🧱 Struktur Project

```
src/
├── prisma/
│   ├── prisma.module.ts      <- Global module
│   └── prisma.service.ts     <- PrismaClient wrapper
├── books/
│   ├── books.module.ts
│   ├── books.controller.ts
│   ├── books.service.ts
│   └── dto/                  <- (dibuat saat implementasi)
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── borrowings/
│   ├── borrowings.module.ts
│   ├── borrowings.controller.ts
│   ├── borrowings.service.ts
│   └── dto/
└── app.module.ts             <- Wire semua module di sini

prisma/
├── schema.prisma             <- Data model
├── seed.ts                   <- Seed script
└── migrations/               <- Auto-generated oleh Prisma
```

---

## 🔧 Perintah Penting

| Perintah | Deskripsi |
|---|---|
| `npm run start:dev` | Jalankan dev server |
| `npx prisma migrate dev` | Buat migration baru |
| `npx prisma db push` | Push schema tanpa migration (dev only) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Buka GUI database browser |
| `npx prisma db seed` | Jalankan seed script |

---

## 📚 Urutan Pengerjaan

```
Issue #1 -> #2 -> #3 -> #4 -> #5 -> #6 -> #7 -> #8
Setup   Schema  CRUD  CRUD  Relasi  Transaksi Filter  Seed
        Migrate Book  User  Include
```

Setiap issue dapat dikerjakan secara independen setelah prerequisite-nya selesai.
