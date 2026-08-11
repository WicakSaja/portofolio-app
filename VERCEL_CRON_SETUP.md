# Dokumentasi Implementasi Vercel Cron (Supabase Keep-Alive)

Dokumen ini berisi panduan lengkap mengenai cara mengaktifkan dan mengonfigurasi **Vercel Cron Job** untuk menjaga database **Supabase Free Tier** tetap aktif (mencegah auto-pause setelah 7 hari tidak diakses).

---

## 1. Apa yang Telah Dibuat di Codebase?

### A. Endpoint API Cron ([route.ts](file:///d:/Project/%21Portofolio/portfolio-app/app/api/cron/keep-alive/route.ts))
Endpoint `/api/cron/keep-alive` bertugas menerima request HTTP `GET` dari Vercel Cron, memverifikasi token pengaman (`CRON_SECRET`), lalu menjalankan query SQL ringan (`SELECT 1 as ping`) via Prisma ke database Supabase.

### B. Konfigurasi Vercel Cron ([vercel.json](file:///d:/Project/%21Portofolio/portfolio-app/vercel.json))
File `vercel.json` mengonfigurasi Vercel agar secara otomatis memanggil `/api/cron/keep-alive` setiap **2 hari sekali pada pukul 04:00 UTC** (`0 4 */2 * *`).

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 4 */2 * *"
    }
  ]
}
```

### C. Update File `.env.example`
Menambahkan variabel `CRON_SECRET` sebagai referensi environment variable di `.env.example`.

---

## 2. Langkah-Langkah yang Harus Anda Lakukan

### Langkah 1: Buat Random Secret Key
Buat sebuah string acak rahasia untuk digunakan sebagai `CRON_SECRET`.
Anda bisa membuatnya dengan perintah terminal/PowerShell berikut:
```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```
*Atau buat string acak rahasia sendiri (misal: `my_super_secret_cron_key_12345`).*

### Langkah 2: Tambahkan Environment Variable
1. **Di Lokal (`.env`):**
   Buka file `.env` di komputer Anda, lalu tambahkan:
   ```env
   CRON_SECRET="string_acak_rahasia_anda"
   ```
2. **Di Vercel Dashboard:**
   - Buka project Anda di [Vercel Dashboard](https://vercel.com).
   - Masuk ke menu **Settings** -> **Environment Variables**.
   - Tambahkan Key: `CRON_SECRET` dan Value: `string_acak_rahasia_anda`.
   - Simpan (Save).

> [!NOTE]
> Pada Vercel, secara otomatis Vercel akan mengirimkan header `Authorization: Bearer <CRON_SECRET>` saat memanggil cron job jika `CRON_SECRET` diset di Environment Variables project Vercel Anda.

### Langkah 3: Deploy ke Vercel
Push perubahan kode ini ke repository Git Anda (GitHub/GitLab/Bitbucket) agar Vercel melakukan build & deploy ulang:
```bash
git add .
git commit -m "feat: add vercel cron keep-alive for supabase"
git push origin main
```

---

## 3. Cara Verifikasi & Uji Coba

### A. Uji Coba Manual di Lokal (Dev Mode)
1. Jalankan aplikasi secara lokal: `npm run dev`
2. Panggil API endpoint menggunakan `curl` atau Postman/Thunder Client:
   - **Tanpa Secret (Harus Error 401 Unauthorized):**
     ```bash
     curl http://localhost:3000/api/cron/keep-alive
     ```
   - **Dengan Secret (Harus Berhasil 200 OK):**
     ```bash
     curl -H "Authorization: Bearer string_acak_rahasia_anda" http://localhost:3000/api/cron/keep-alive
     ```

### B. Cek Status Cron Job di Vercel Dashboard
1. Buka project Anda di [Vercel Dashboard](https://vercel.com).
2. Masuk ke tab **Cron Jobs** atau menu **Settings** -> **Cron Jobs**.
3. Anda akan melihat daftar job `/api/cron/keep-alive` dengan jadwal `0 4 */2 * *`.
4. Anda dapat menekan tombol **"Run"** secara manual di Vercel Dashboard untuk menguji apakah eksekusi cron berhasil (status `200 OK`).

---

## 4. Mengapa Memilih Interval 2 Hari (Bukan Random 1-3 Hari)?

1. **Jaminan Anti-Pause:** Supabase mem-pause database jika tidak ada aktivitas selama **7 hari berturut-turut**. Panggilan otomatis setiap 2 hari menjamin database **100% tidak akan pernah dipause**.
2. **Standard Cron Syntax:** Vercel Cron menggunakan format `cron` standar industri yang sifatnya deterministik (jadwal pasti). Interval 2 hari adalah bentuk efisiensi paling optimal tanpa memerlukan servis/tool pihak ketiga tambahan.
3. **Sangat Hemat Kuota Vercel Free Tier:**
   - Kuota Vercel Hobby Plan: **100 cron executions / bulan**.
   - Interval 2 hari hanya mengonsumsi **~15 executions / bulan** (sangat jauh di bawah limit).
