# 🚀 Modern Portfolio & CMS Platform

<div align="center">

  <p><strong>Website Portofolio Interaktif & Content Management System (CMS) Full-Stack Berkinerja Tinggi</strong></p>

  <p>
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-panduan-instalasi">Instalasi</a> •
    <a href="#-konfigurasi-environment">Environment</a> •
    <a href="#-struktur-proyek">Struktur Proyek</a> •
    <a href="#-deployment">Deployment</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

---

## 📖 Tentang Proyek

**Personal Portfolio & CMS** adalah aplikasi web portofolio modern yang dirancang untuk menampilkan profil profesional, keahlian teknis, riwayat pengalaman, dan showcase proyek secara dinamis. 

Dilengkapi dengan **Dashboard Admin (CMS)** yang komprehensif, seluruh konten pada website publik dapat dikelola secara mandiri secara *real-time* tanpa perlu melakukan *code change* atau *re-deploy*.

### ✨ Keunggulan Utama
- ⚡ **Ultra Fast & SEO-Optimized**: Menggunakan Next.js App Router dengan *Server Components*, dynamic metadata, dynamic OpenGraph, sitemap, robots.txt, serta integrasi JSON-LD Structured Data (Person, ProfilePage, Project, BreadcrumbList).
- 🎨 **Modern & Interactive UI**: Desain gelap elegan (*Dark Aesthetic*), animasi halus bertenaga Framer Motion, spotlight effect pada Hero, modal galeri, dan visualisasi bar skill interaktif.
- 🛡️ **Aman & Terproteksi**: Dashboard admin diamankan menggunakan NextAuth / Auth.js dengan autentikasi GitHub OAuth dan whitelist Admin ID berbasis middleware.
- 📦 **Manajemen Aset Mandiri**: Terintegrasi langsung dengan Supabase Storage untuk upload thumbnail proyek, galeri foto pengalaman, ikon keahlian, dan dokumen resume (PDF).

---

## 🌟 Fitur Utama

### 🌐 1. Public Portfolio
- **Hero Section**: Headline dinamis, spotlight effect interaktif, call-to-action ke CV dan kontak.
- **About Section**: Ringkasan profil profesional dan latar belakang karier.
- **Skills Section**: Kategori skill fleksibel (Frontend, Backend, Tools, dll.) dengan visualisasi level kemahiran.
- **Experience Timeline**: Linimasa perjalanan karier interaktif lengkap dengan galeri foto modal dan deskripsi detail.
- **Projects Showcase**: Filter kategori proyek, badge teknologi, modal/halaman detail proyek, serta tautan langsung ke GitHub dan Live Demo.
- **Contact & Socials**: Informasi kontak dan integrasi tautan media sosial.

### ⚙️ 2. Admin Dashboard (CMS)
- 🔐 **Autentikasi Aman**: Login via GitHub OAuth khusus akun yang terotorisasi.
- 📁 **CRUD Projects**: Tambah, ubah, dan hapus proyek lengkap dengan multi-image gallery, tag skill, dan kustomisasi metadata SEO per proyek.
- 💡 **CRUD Skills**: Manajemen skill, kategori ganda (*multi-category*), upload custom icon, dan indikator persentase level.
- 💼 **CRUD Experience**: Manajemen riwayat kerja, periode tanggal, dan upload dokumentasi galeri foto.
- ⚙️ **Global Site Settings**: Ubah informasi hero, foto profil, deskripsi about, tautan resume (PDF), verifikasi Google/Bing, serta konfigurasi OpenGraph global.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Library UI** | [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |
| **Animasi & Ikon** | [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Bahasa Pemrograman** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Database & ORM** | [PostgreSQL (Supabase)](https://supabase.com/), [Prisma ORM 7](https://www.prisma.io/) |
| **Media Storage** | [Supabase Storage](https://supabase.com/storage) |
| **Autentikasi** | [Auth.js / NextAuth v4](https://next-auth.js.org/) (GitHub OAuth) |
| **Validasi Form** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| **Notifikasi** | [Sonner Toast](https://sonner.emilkowal.ski/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal di komputer Anda:

### 1. Clone Repository (Branch `master`)

```bash
git clone -b master https://github.com/<username>/portfolio-app.git
cd portfolio-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Salin file template `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Isi variabel-variabel lingkungan yang diperlukan (lihat rincian di bawah).

### 4. Database Setup & Prisma Generate

Pastikan database PostgreSQL Anda sudah aktif (misalnya melalui Supabase), kemudian sinkronisasikan skema:

```bash
npx prisma generate
npx prisma db push
```

*(Opsional)* Anda dapat membuka Prisma Studio untuk menginspeksi database:
```bash
npx prisma studio
```

### 5. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

---

## 🔑 Konfigurasi Environment

Berikut adalah daftar variabel lingkungan (`.env`) yang dibutuhkan:

```env
# ----------------------------------------
# Database (PostgreSQL via Supabase)
# ----------------------------------------
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# ----------------------------------------
# Auth.js / NextAuth
# ----------------------------------------
AUTH_SECRET="your-generated-random-secret-key"
AUTH_URL="http://localhost:3000"

# ----------------------------------------
# GitHub OAuth (Untuk Admin Dashboard)
# ----------------------------------------
AUTH_GITHUB_ID="your_github_oauth_client_id"
AUTH_GITHUB_SECRET="your_github_oauth_client_secret"
AUTH_GITHUB_ADMIN_ID="your_github_user_id" # ID user GitHub yang diizinkan masuk ke CMS

# ----------------------------------------
# Supabase Storage (Bucket Penyimpanan File)
# ----------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Bucket Names
SUPABASE_PORTFOLIO_THUMBNAIL_BUCKET="portfolio-thumbnails"
SUPABASE_SKILLS_ICONS_BUCKET="skills-icon"
SUPABASE_EXPERIENCE_GALLERY_BUCKET="experience-images"
SUPABASE_SETTINGS_ASSETS_BUCKET="settings-assets"

# ----------------------------------------
# Vercel Cron Secret (Opsional)
# ----------------------------------------
CRON_SECRET="your_cron_secret"
```

---

## 📂 Struktur Proyek

```plaintext
portfolio-app/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Rute autentikasi (Login)
│   ├── (public)/             # Halaman publik (Portfolio, Projects, Experience)
│   ├── admin/                # Halaman dashboard CMS (CRUD Project, Skill, Experience, Settings)
│   ├── api/                  # API Routes (Auth, Cron, Upload)
│   ├── layout.tsx            # Root Layout dengan Font & Provider
│   ├── page.tsx              # Landing Page Utama
│   ├── robots.ts             # Dynamic Robots.txt
│   └── sitemap.ts            # Dynamic Sitemap.xml
├── components/               # Komponen UI Reusable
│   ├── admin/                # Komponen Form & Tabel Admin
│   ├── projects/             # Komponen Project Card & Showcase
│   ├── sections/             # Section Landing Page (Hero, Skills, Experience, Contact)
│   └── ui/                   # Komponen Primitif (Button, Dialog, Input, Sonner)
├── hooks/                    # Custom React Hooks
├── lib/                      # Utilitas, Prisma Client, Supabase Client & Server Actions
│   ├── actions/              # Server Actions (CRUD Operations)
│   ├── generated/            # Generated Prisma Client
│   └── validations/          # Skema Validasi Zod
├── prisma/                   # Prisma Schema & Migrations
│   └── schema.prisma         # Database Models
├── public/                   # Static Assets (Favicon, Logo, etc.)
├── types/                    # Definisi TypeScript Interfaces & Types
├── middleware.ts             # Auth Protection Middleware
├── package.json              # Dependencies & Scripts
└── README.md                 # Dokumentasi Proyek
```

---

## 🚀 Deployment

Proyek ini dioptimalkan untuk di-deploy ke **Vercel** dan **Supabase**:

1. **Database & Storage**:
   - Buat proyek baru di [Supabase](https://supabase.com/).
   - Buat 4 storage bucket: `portfolio-thumbnails`, `skills-icon`, `experience-images`, dan `settings-assets` (atur kebijakan akses/public read sesuai kebutuhan).
2. **Deploy ke Vercel**:
   - Import repository GitHub Anda ke [Vercel](https://vercel.com/).
   - Masukkan seluruh Environment Variables dari file `.env`.
   - Konfigurasi `Build Command`: `next build` (akan otomatis menjalankan `prisma generate` via `postinstall`).
3. **Konfigurasi OAuth Callback**:
   - Di GitHub Developer Settings, tambahkan URL callback produksi:
     `https://your-domain.vercel.app/api/auth/callback/github`

---

## 📄 Lisensi

Proyek ini dilisensikan @Wicaksaja. Silakan gunakan dan sesuaikan sesuai kebutuhan Anda.

---