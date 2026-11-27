# Bahasa Mandarin — Kelas XI · Semester 1

Redesign v2.0.0 memakai **shell website Bahasa Inggris** (struktur, animasi, dan mesin latihan yang sama) dengan identitas visual **jade hijau + merah bata**.

## Isi

- **9 bab ringkas, 31 topik, 62 soal** — penjelasan to the point:
  1. Pengetahuan Umum · 2. Pelafalan · 3. Ni Hao · 4. Ni Hao Ma · 5. Angka 1–99 · 6. Ni Jiao Shenme Mingzi · 7. Ni Shi Laoshi Ma · 8. Ni Shi Na Guo Ren · 9. Ni Jia You Ji Kou Ren
- **31 lab interaktif** per topik (hanzi + pinyin + arti, diagram nada, dialog, langkah).
- **Latihan PG · PGK · B/S** per bab + **latihan campuran 10 soal**, nilai, dan pembahasan.
- Pencilan `/`, pencarian per bab, mode hafalan tersimpan di perangkat.
- Hanzi memakai font lokal **Noto Sans SC**; seluruh aset offline-friendly.

## Perintah

```bash
npm ci
npm run build     # typecheck + vite build → dist/
npm run preview
```

`siap-upload/` = hasil build + `vercel.json`, siap diunggah ke hosting.
`original/` = salinan teks materi sumber (referensi).
`tools/gen_mandarin_content.py` = generator `src/content.ts`.
