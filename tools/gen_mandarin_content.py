# -*- coding: utf-8 -*-
"""Generate src/content.ts — Bahasa Mandarin XI: 9 bab ringkas (to the point) + 60 soal."""
import json, io, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def s(num, sid, title, lead, details, search):
    return {"id": sid, "number": num, "title": title, "lead": lead,
            "details": [{"title": t, "html": h} for t, h in details], "search": search}

def q(qid, chapter, group, prompt, options, correct, explanation, qtype="single"):
    return {"id": qid, "chapter": chapter, "group": group, "prompt": prompt,
            "options": [{"id": o[0], "html": o[1], "text": o[2]} for o in options],
            "correct": correct, "explanation": explanation, "type": qtype}

ZH = lambda t: f'<span lang="zh-Hans">{t}</span>'

chapters, questions = [], []

# ───────────────────────────── BAB 1 — Pengetahuan Umum ─────────────────────────────
chapters.append({
 "id": 1, "title": "Pengetahuan Umum", "fullTitle": "Pengetahuan Umum Bahasa Mandarin",
 "subtitle": "Hanzi · Pinyin · Fakta Tiongkok",
 "intro": "<p>Kenalan dulu dengan bahasa Mandarin: istilah dasar, sistem tulisannya, dan fakta singkat tentang Tiongkok.</p>",
 "example": "汉语 Hànyǔ", "translation": "Bahasa Mandarin — bahasa resmi Tiongkok.",
 "sections": [
  s("1.1", "s1-1", "Apa itu bahasa Mandarin?",
    "<p><strong>Mandarin</strong> (汉语 / Hànyǔ) adalah bahasa resmi Republik Rakyat Tiongkok dan salah satu dari enam bahasa resmi PBB.</p>",
    [("Fakta singkat",
      "<ul><li>Penutur <strong>paling banyak di dunia</strong>: lebih dari 1 miliar orang.</li>"
      "<li>Bahasa resmi Tiongkok, Singapura, dan Taiwan.</li>"
      "<li>Baku disebut 普通话 (Pǔtōnghuà).</li></ul>"),
     ("Kata penting",
      "<ul><li>学习 (xuéxí) — belajar</li><li>汉语 (Hànyǔ) — bahasa Mandarin</li>"
      "<li>你好 (nǐ hǎo) — halo</li></ul>")],
    "apa itu bahasa mandarin hànyǔ 汉语 pbb bahasa resmi penutur"),
  s("1.2", "s1-2", "Kenali Tiongkok",
    "<p>Negara asal bahasa Mandarin adalah <strong>中国</strong> (Zhōngguó).</p>",
    [("Data dasar",
      "<ul><li>Ibu kota: <strong>北京</strong> (Běijīng)</li><li>Mata uang: <strong>元</strong> (Yuán)</li>"
      "<li>Benua: Asia Timur</li><li>Penduduk: ± 1,4 miliar jiwa</li><li>± 56 suku bangsa</li></ul>"),
     ("Nama lain",
      "<p>在中国 (zài Zhōngguó) = di Tiongkok; 中国人 (Zhōngguórén) = orang Tiongkok.</p>")],
    "tiongkok zhongguo 中国 beijing 北京 yuan 元 fakta ibu kota mata uang"),
  s("1.3", "s1-3", "Hanzi dan Pinyin",
    "<p><strong>Hanzi</strong> (汉字) adalah karakter Tiongkok; <strong>Pinyin</strong> adalah tulisan Latin untuk membacanya.</p>",
    [("Cara membaca",
      "<ul><li>中国 → <strong>Zhōngguó</strong> → Tiongkok</li>"
      "<li>学生 → <strong>Xuéshēng</strong> → siswa</li>"
      "<li>Baca Pinyin-nya dulu, hafalkan Hanzi-nya bersamanya.</li></ul>"),
     ("Tiga bagian tulisan",
      "<p>Hanzi (汉字) + Pinyin (拼音) + arti Bahasa Indonesia — ketiganya selalu muncul di materi ini.</p>")],
    "hanzi 汉字 pinyin 拼音 karakter cara membaca romanisasi"),
  s("1.4", "s1-4", "Empat nada",
    "<p>Setiap suku kata Mandarin punya <strong>nada</strong>. Nada mengubah arti.</p>",
    [("Contoh: ma",
      "<ul><li>mā 妈 — ibu</li><li>má 麻 — rami</li><li>mǎ 马 — kuda</li><li>mà 骂 — memarahi</li></ul>"),
     ("Nada netral",
      "<p>Suku kata tanpa nada (contoh: 吗 ma di akhir tanya) dibaca ringan dan pendek.</p>")],
    "nada empat mā má mǎ mà makna beda netral"),
 ],
 "questions": [
  q("m1q1", 1, 1, "Bahasa resmi Tiongkok adalah …",
    [("a", "Bahasa Mandarin (汉语)", "Bahasa Mandarin (汉语)"), ("b", "Bahasa Kanton", "Bahasa Kanton"),
     ("c", "Bahasa Jepang", "Bahasa Jepang"), ("d", "Bahasa Korea", "Bahasa Korea")], "a",
    "汉语 (Hànyǔ) atau Mandarin adalah bahasa resmi RRT dan salah satu bahasa resmi PBB."),
  q("m1q2", 1, 1, "Ibu kota Tiongkok adalah …",
    [("a", "上海 Shànghǎi", "上海 Shànghǎi"), ("b", "北京 Běijīng", "北京 Běijīng"),
     ("c", "香港 Xiānggǎng", "香港 Xiānggǎng"), ("d", "台北 Táiběi", "台北 Táiběi")], "b",
    "北京 (Běijīng) adalah ibu kota Republik Rakyat Tiongkok."),
  q("m1q3", 1, 1, "Pinyin digunakan untuk …",
    [("a", "Menulis karakter Tiongkok dengan huruf Latin", "Menulis karakter Tiongkok dengan huruf Latin"),
     ("b", "Menerjemahkan ke Bahasa Indonesia", "Menerjemahkan ke Bahasa Indonesia"),
     ("c", "Menghitung angka", "Menghitung angka"), ("d", "Menyapa orang", "Menyapa orang")], "a",
    "Pinyin (拼音) adalah sistem romanisasi: huruf Latin untuk membaca hanzi."),
  q("m1q4", 1, 1, f"汉字 disebut …",
    [("a", "Pinyin", "Pinyin"), ("b", "Hanzi", "Hanzi"), ("c", "Nada", "Nada"), ("d", "Kosakata", "Kosakata")], "b",
    "汉字 (hànzì) adalah karakter atau tulisan Tiongkok."),
  q("m1q5", 1, 1, "Mata uang Tiongkok adalah …",
    [("a", "元 Yuán", "元 Yuán"), ("b", "Won", "Won"), ("c", "Yen", "Yen"), ("d", "Rupee", "Rupee")], "a",
    "Mata uang Tiongkok adalah 元 (Yuán), sering disebut renminbi."),
  {"id": "m1q6", "chapter": 1, "group": 1, "type": "multi",
   "prompt": "Pilih semua pernyataan yang <strong>benar</strong> tentang bahasa Mandarin:",
   "options": [{"id": "a", "html": "Penuturnya lebih dari 1 miliar orang", "text": "Penuturnya lebih dari 1 miliar orang"},
               {"id": "b", "html": "Salah satu bahasa resmi PBB", "text": "Salah satu bahasa resmi PBB"},
               {"id": "c", "html": "Menggunakan alfabet Latin sebagai tulisan resmi", "text": "Menggunakan alfabet Latin sebagai tulisan resmi"},
               {"id": "d", "html": "Tulisan utamanya Hanzi (汉字)", "text": "Tulisan utamanya Hanzi (汉字)"}],
   "correct": "a,b,d", "explanation": "Tulisan resmi hanzi, bukan alfabet Latin; alfabet hanya lewat pinyin.", "type": "multi"},
  {"id": "m1q7", "chapter": 1, "group": 1, "type": "tf",
   "prompt": "Benar atau salah: 北京 (Běijīng) adalah ibu kota Tiongkok.",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "北京 (Běijīng) adalah ibu kota Tiongkok.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 2 — Pelafalan ─────────────────────────────
chapters.append({
 "id": 2, "title": "Pelafalan", "fullTitle": "Pelafalan Bahasa Mandarin",
 "subtitle": "Pinyin · Nada · Konsonan & vokal",
 "intro": "<p>Pelafalan Mandarin dibaca dari Pinyin: perhatikan nada dan kombinasi konsonan–vokalnya.</p>",
 "example": "nǐ hǎo", "translation": "Dibaca: “nǐ hǎo” — halo.",
 "sections": [
  s("2.1", "s2-1", "Apa itu Pinyin?",
    "<p>Pinyin (拼音) adalah cara membaca hanzi memakai huruf Latin.</p>",
    [("Aturan dasar",
      "<ul><li>Satu suku kata = satu konsonan + satu vokal (contoh: hao, ming).</li>"
      "<li>Tulis dan baca sesuai tanda nada di atas vokal.</li></ul>"),
     ("Contoh",
      "<ul><li>谢谢 → <strong>xièxie</strong> → terima kasih</li>"
      "<li>老师 → <strong>lǎoshī</strong> → guru</li></ul>")],
    "pinyin 拼音 aturan baca latin xièxie xiexie lǎoshi laoshi"),
  s("2.2", "s2-2", "Empat nada + nada netral",
    "<p>Tanda nada menentukan arti: ā (1), á (2), ǎ (3), à (4).</p>",
    [("Perbandingan",
      "<ul><li>mā 妈 (ibu) · má 麻 · mǎ 马 (kuda) · mà 骂</li>"
      "<li>tāng 汤 (kuah) · táng 糖 (gula) · tǎng 躺 · tàng 烫</li></ul>"),
     ("Nada netral",
      "<p>Tanpa tanda (contoh: 吗 ma, 的 de) — ringan, pendek, tidak ditekan.</p>")],
    "nada tanda ā á ǎ à netral perbandingan contoh"),
  s("2.3", "s2-3", "Konsonan utama",
    "<p>Kelompok konsonan paling sering dipakai pemula:</p>",
    [("Kelompok dasar",
      "<ul><li>b p m f · d t n l · g k h</li>"
      "<li>zh ch sh r (mirip j c s tapi lebih “tebal”)</li><li>j q x · z c s</li></ul>"),
     ("Tip cepat",
      "<ul><li><strong>b</strong> tanpa hembusan kuat; <strong>p</strong> dengan hembusan (papa vs babi).</li>"
      "<li><strong>x</strong> seperti “sy” ringan (xī = senang).</li></ul>")],
    "konsonan b p m f d t n l g k h zh ch sh r j q x z c s hembusan"),
  s("2.4", "s2-4", "Vokal & tips melafalkan",
    "<p>Vokal utama: a o e i u ü.</p>",
    [("Vokal",
      "<ul><li>a seperti “a” dalam “apa”; o seperti “o”; e seperti “e” datar.</li>"
      "<li>i seperti “i”; u seperti “u”; ü seperti “ü” Jerman (bibir maju).</li></ul>"),
     ("Tips latihan",
      "<ul><li>Baca lambat, tekankan nadanya.</li><li>Jangan menambah -r atau -e di akhir.</li>"
      "<li>Ulangi tiap kata 3× dengan pinyin terbuka.</li></ul>")],
    "vokal a o e i u ü tips pelafalan latihan lambat"),
 ],
 "questions": [
  q("m2q1", 2, 2, "Fungsi Pinyin adalah …",
    [("a", "Membaca hanzi dengan huruf Latin", "Membaca hanzi dengan huruf Latin"),
     ("b", "Menulis karangan", "Menulis karangan"), ("c", "Menghitung angka", "Menghitung angka"),
     ("d", "Menerjemahkan naskah", "Menerjemahkan naskah")], "a",
    "Pinyin (拼音) adalah sistem romanisasi untuk membaca karakter Tiongkok."),
  q("m2q2", 2, 2, "Tanda nada ǎ (nada 3) dibaca …",
    [("a", "Turun lalu naik (cekung)", "Turun lalu naik (cekung)"), ("b", "Naik seperti tanya", "Naik seperti tanya"),
     ("c", "Datar panjang", "Datar panjang"), ("d", "Turun tajam", "Turun tajam")], "a",
    "Nada 3 turun lalu naik, seperti cekung (contoh: mǎ 马)."),
  q("m2q3", 2, 2, f"Yang termasuk kelompok konsonan dasar adalah …",
    [("a", "b p m f", "b p m f"), ("b", "j q x zh", "j q x zh"), ("c", "z c s r", "z c s r"),
     ("d", "g k h j", "g k h j")], "a",
    "Kelompok pertama yang dipelajari: b p m f, lalu d t n l, g k h."),
  q("m2q4", 2, 2, "Vokal “ü” terdapat pada kata …",
    [("a", "女 nǚ (perempuan)", "女 nǚ (perempuan)"), ("b", "妈 mā (ibu)", "妈 mā (ibu)"),
     ("c", "好 hǎo (baik)", "好 hǎo (baik)"), ("d", "书 shū (buku)", "书 shū (buku)")], "a",
    "女 (nǚ) memakai vokal ü — bibir maju seperti menyebut “u” sambil tersenyum."),
  q("m2q5", 2, 2, "Suku kata tanpa tanda nada dibaca …",
    [("a", "Ringan dan pendek (nada netral)", "Ringan dan pendek (nada netral)"),
     ("b", "Panjang dan keras", "Panjang dan keras"), ("c", "Seperti nada 1", "Seperti nada 1"),
     ("d", "Tidak dibaca", "Tidak dibaca")], "a",
    "Nada netral (吗 ma, 的 de) dibaca ringan tanpa tekanan."),
  {"id": "m2q6", "chapter": 2, "group": 2, "type": "multi",
   "prompt": "Pilih semua vokal utama Pinyin:",
   "options": [{"id": "a", "html": "a", "text": "a"}, {"id": "b", "html": "e", "text": "e"},
               {"id": "c", "html": "ü", "text": "ü"}, {"id": "d", "html": "p", "text": "p"}],
   "correct": "a,b,c", "explanation": "Vokal utama: a o e i u ü. “p” adalah konsonan.", "type": "multi"},
  {"id": "m2q7", "chapter": 2, "group": 2, "type": "tf",
   "prompt": "Benar atau salah: mā, má, mǎ, mà adalah empat nada yang menghasilkan arti berbeda.",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "妈/麻/马/骂 — nada menentukan arti dalam bahasa Mandarin.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 3 — Ni hao ─────────────────────────────
chapters.append({
 "id": 3, "title": "Ni Hao", "fullTitle": "Sapaan: Ni Hao",
 "subtitle": "你好 · Sapaan sehari-hari",
 "intro": "<p>Sapaan pertama yang dipakai sehari-hari: 你好 beserta variasinya.</p>",
 "example": "你好！", "translation": "Nǐ hǎo! — Halo!",
 "sections": [
  s("3.1", "s3-1", "你好 — Halo",
    "<p><strong>你好</strong> (Nǐ hǎo) adalah sapaan umum kapan saja.</p>",
    [("Arti & pemakaian",
      "<ul><li>你 = kamu, 好 = baik → sapaan netral “halo”.</li>"
      "<li>Dipakai untuk teman, guru, atau orang baru.</li>"
      "<li>Bisa disertai nama: 你好, 小明! (Halo, Xiao Ming!)</li></ul>")],
    "ni hao 你好 halo sapaan nǐ hǎo arti pemakaian"),
  s("3.2", "s3-2", "Variasi sapaan",
    "<p>Sesuaikan waktu dan kesopanan.</p>",
    [("Sapaan waktu",
      "<ul><li>早上好 (zǎoshang hǎo) — selamat pagi</li>"
      "<li>晚上好 (wǎnshang hǎo) — selamat malam</li><li>晚安 (wǎn’ān) — selamat tidur</li></ul>"),
     ("Lebih sopan",
      "<p><strong>您好</strong> (Nín hǎo) — “Anda halo”, untuk guru atau yang lebih tua.</p>")],
    "sapaan waktu zǎoshang hǎo pagi wǎnshang hǎo malam 您好 nín sopan"),
  s("3.3", "s3-3", "Dialog & perpisahan",
    "<p>Sapaan dibalas sapaan; saat berpisah pakai 再见.</p>",
    [("Dialog singkat",
      "<ul><li>A: 你好! — Halo!</li><li>B: 你好! — Halo!</li>"
      "<li>A: 再见! — Sampai jumpa!</li><li>B: 再见!</li></ul>"),
     ("Kata perpisahan",
      "<p><strong>再见</strong> (Zàijiàn) = sampai jumpa, dipakai sebelum berpisah.</p>")],
    "dialog perpisahan zài jiàn 再见 sampai jumpa balas sapaan"),
 ],
 "questions": [
  q("m3q1", 3, 3, "你好 (Nǐ hǎo) berarti …",
    [("a", "Halo", "Halo"), ("b", "Terima kasih", "Terima kasih"), ("c", "Selamat tinggal", "Selamat tinggal"),
     ("d", "Maaf", "Maaf")], "a",
    "你好 (nǐ hǎo) adalah sapaan “halo”."),
  q("m3q2", 3, 3, "Sapaan yang lebih sopan untuk guru adalah …",
    [("a", "您好 Nín hǎo", "您好 Nín hǎo"), ("b", "再见 Zàijiàn", "再见 Zàijiàn"),
     ("c", "谢谢 Xièxie", "谢谢 Xièxie"), ("d", "晚安 Wǎn’ān", "晚安 Wǎn’ān")], "a",
    "您 (nín) = “Anda” sopan; 您好 untuk yang lebih tua atau dihormati."),
  q("m3q3", 3, 3, "“Selamat pagi” dalam Mandarin adalah …",
    [("a", "早上好 zǎoshang hǎo", "早上好 zǎoshang hǎo"), ("b", "晚上好 wǎnshang hǎo", "晚上好 wǎnshang hǎo"),
     ("c", "你好 nǐ hǎo", "你好 nǐ hǎo"), ("d", "再见 zài jiàn", "再见 zài jiàn")], "a",
    "早上 (zǎoshang) = pagi; 早上好 = selamat pagi."),
  q("m3q4", 3, 3, "Kata yang dipakai saat berpisah adalah …",
    [("a", "再见 Zàijiàn", "再见 Zàijiàn"), ("b", "你好 Nǐ hǎo", "你好 Nǐ hǎo"),
     ("c", "谢谢 Xièxie", "谢谢 Xièxie"), ("d", "贵姓 Guìxìng", "贵姓 Guìxìng")], "a",
    "再见 (zàijiàn) = sampai jumpa, dipakai saat perpisahan."),
  q("m3q5", 3, 3, "你好 terdiri dari …",
    [("a", "你 (kamu) + 好 (baik)", "你 (kamu) + 好 (baik)"), ("b", "好 + 你", "好 + 你"),
     ("c", "我 + 你", "我 + 你"), ("d", "马 + 好", "马 + 好")], "a",
    "你 (nǐ) = kamu; 奻 (hǎo) = baik; urutannya 你好."),
  {"id": "m3q6", "chapter": 3, "group": 3, "type": "multi",
   "prompt": "Pilih semua yang termasuk sapaan:",
   "options": [{"id": "a", "html": "你好 Nǐ hǎo", "text": "你好 Nǐ hǎo"},
               {"id": "b", "html": "早上好 zǎoshang hǎo", "text": "早上好 zǎoshang hǎo"},
               {"id": "c", "html": "再见 Zàijiàn", "text": "再见 Zàijiàn"},
               {"id": "d", "html": "老师 lǎoshī (guru)", "text": "老师 lǎoshī (guru)"}],
   "correct": "a,b,c", "explanation": "再见 adalah sapaan perpisahan; 老师 adalah sebutan profesi.", "type": "multi"},
  {"id": "m3q7", "chapter": 3, "group": 3, "type": "tf",
   "prompt": "Benar atau salah: 您好 (Nín hǎo) lebih sopan daripada 你好 (Nǐ hǎo).",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "您 (nín) menunjukkan rasa hormat, dipakai untuk guru/orang tua.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 4 — Ni hao ma ─────────────────────────────
chapters.append({
 "id": 4, "title": "Ni Hao Ma", "fullTitle": "Menanyakan Kabar: Ni Hao Ma",
 "subtitle": "你好吗 · Tanya & jawab kabar",
 "intro": "<p>Cara menanyakan dan menjawab kabar dengan pola tanya …吗 (ma).</p>",
 "example": "你好吗？", "translation": "Nǐ hǎo ma? — Apa kabar?",
 "sections": [
  s("4.1", "s4-1", "你好吗？— Apa kabar?",
    "<p><strong>你好吗？</strong> (Nǐ hǎo ma?) = “Apa kabar?”</p>",
    [("Jawaban umum",
      "<ul><li>我很好 (Wǒ hěn hǎo) — Saya baik.</li>"
      "<li>谢谢！你呢？(Xièxie! Nǐ ne?) — Terima kasih! Kamu?</li>"
      "<li>我也很好 (Wǒ yě hěn hǎo) — Saya juga baik.</li></ul>")],
    "ni hao ma 你好吗 apa kabar wǒ hěn hǎo 我很好 jawab"),
  s("4.2", "s4-2", "Pola …吗 (ma)",
    "<p>Tambah <strong>吗</strong> di akhir kalimat → jadi pertanyaan.</p>",
    [("Pola",
      "<ul><li>你好 → 你好<strong>吗</strong>？ — Halo → Apa kabar?</li>"
      "<li>你忙 → 你忙<strong>吗</strong>？ — Kamu sibuk → Kamu sibuk?</li></ul>"),
     ("Catatan",
      "<p>Tidak perlu mengubah kata lain; cukup tambah 吗 dan tanda ?</p>")],
    "pola tanya 吗 ma akhir kalimat nǐ máng ma 你忙吗"),
  s("4.3", "s4-3", "Jawaban kabar",
    "<p>Sesuaikan jawaban dengan kondisi.</p>",
    [("Positif",
      "<ul><li>很好 (hěn hǎo) — sangat baik</li><li>不错 (bùcuò) — lumayan/bagus</li></ul>"),
     ("Kurang baik",
      "<ul><li>我不太好 (wǒ bù tài hǎo) — saya kurang baik</li>"
      "<li>有点累 (yǒudiǎn lèi) — sedikit lelah</li></ul>")],
    "jawaban kabar hěn hǎo 很好 bùcuò 不错 kurang baik yǒudiǎn lèi"),
  s("4.4", "s4-4", "Dialog kabar",
    "<p>Contoh percakapan lengkap.</p>",
    [("Dialog",
      "<ul><li>A: 你好吗？— Apa kabar?</li><li>B: 我很好，谢谢！你呢？— Baik, terima kasih! Kamu?</li>"
      "<li>A: 我也很好。— Saya juga baik.</li></ul>")],
    "dialog kabar nǐ ne 你呢 wǒ yě hěn hǎo 我也很好 percakapan"),
 ],
 "questions": [
  q("m4q1", 4, 4, "你好吗？ (Nǐ hǎo ma?) adalah pertanyaan untuk …",
    [("a", "Menanyakan kabar", "Menanyakan kabar"), ("b", "Memperkenalkan nama", "Memperkenalkan nama"),
     ("c", "Menanyakan harga", "Menanyakan harga"), ("d", "Berpisah", "Berpisah")], "a",
    "你好吗 = “apa kabar?”, ditujukan untuk menanyakan keadaan seseorang."),
  q("m4q2", 4, 4, "Jawaban tepat untuk 你好吗？ adalah …",
    [("a", "我很好，谢谢！", "我很好，谢谢！"), ("b", "再见！", "再见！"),
     ("c", "我姓王。", "我姓王。"), ("d", "三十五元。", "三十五元。")], "a",
    "我很好，谢谢 (wǒ hěn hǎo, xièxie) = saya baik, terima kasih."),
  q("m4q3", 4, 4, "Kata 吗 (ma) berfungsi untuk …",
    [("a", "Membuat kalimat jadi tanya", "Membuat kalimat jadi tanya"), ("b", "Menambah jumlah", "Menambah jumlah"),
     ("c", "Menunjukkan waktu lampau", "Menunjukkan waktu lampau"), ("d", "Menyapa", "Menyapa")], "a",
    "吗 di akhir kalimat mengubah pernyataan menjadi pertanyaan ya/tidak."),
  q("m4q4", 4, 4, "“Saya juga baik” = …",
    [("a", "我也很好 Wǒ yě hěn hǎo", "我也很好 Wǒ yě hěn hǎo"), ("b", "我不太好 Wǒ bù tài hǎo", "我不太好 Wǒ bù tài hǎo"),
     ("c", "我姓李 Wǒ xìng Lǐ", "我姓李 Wǒ xìng Lǐ"), ("d", "我十五岁 Wǒ shíwǔ suì", "我十五岁 Wǒ shíwǔ suì")], "a",
    "也 (yě) = juga; 我也很好 = saya juga baik."),
  q("m4q5", 4, 4, "你呢？ (Nǐ ne?) artinya …",
    [("a", "Kamu?", "Kamu?"), ("b", "Siapa?", "Siapa?"), ("c", "Di mana?", "Di mana?"), ("d", "Kapan?", "Kapan?")], "a",
    "呢 (ne) membalik pertanyaan: “kamu (gimana)?”."),
  {"id": "m4q6", "chapter": 4, "group": 4, "type": "multi",
   "prompt": "Pilih semua jawaban yang wajar untuk 你好吗？",
   "options": [{"id": "a", "html": "我很好 (saya baik)", "text": "我很好 (saya baik)"},
               {"id": "b", "html": "不错 (lumayan)", "text": "不错 (lumayan)"},
               {"id": "c", "html": "我不太好 (kurang baik)", "text": "我不太好 (kurang baik)"},
               {"id": "d", "html": "再见 (sampai jumpa)", "text": "再见 (sampai jumpa)"}],
   "correct": "a,b,c", "explanation": "再见 adalah sapaan perpisahan, bukan jawaban kabar.", "type": "multi"},
  {"id": "m4q7", "chapter": 4, "group": 4, "type": "tf",
   "prompt": "Benar atau salah: untuk menanyakan “kamu sibuk?” cukup menambah 吗: 你忙吗？",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "你忙 (nǐ máng) + 吗 → 你忙吗？ = Kamu sibuk?", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 5 — Angka 1–99 ─────────────────────────────
chapters.append({
 "id": 5, "title": "Angka 1–99", "fullTitle": "Angka Satu sampai Sembilan Puluh Sembilan",
 "subtitle": "数字 · Angka & cara membaca",
 "intro": "<p>Pola angka Mandarin mudah: kuasai 1–10, lalu susun belasan dan puluhan.</p>",
 "example": "三十五", "translation": "Sānshíwǔ — tiga puluh lima.",
 "sections": [
  s("5.1", "s5-1", "Angka 1–10",
    "<p>Hafalkan sepuluh angka dasar ini terlebih dahulu.</p>",
    [("Daftar",
      "<ul><li>一 yī (1) · 二 èr (2) · 三 sān (3) · 四 sì (4) · 五 wǔ (5)</li>"
      "<li>六 liù (6) · 七 qī (7) · 八 bā (8) · 九 jiǔ (9) · 十 shí (10)</li></ul>"),
     ("Tip",
      "<p>四 (sì) dan 十 (shí) dibedakan nadanya — latih pelafalan sejak awal.</p>")],
    "angka 一二三四五六七八九十 yī èr sān sì wǔ liù qī bā jiǔ shí dasar"),
  s("5.2", "s5-2", "Belasan & puluhan",
    "<p>Pola: belasan = 十 + satuan; puluhan = angka + 十.</p>",
    [("Belasan (11–19)",
      "<ul><li>十一 shíyī (11) · 十五 shíwǔ (15) · 十九 shíjiǔ (19)</li></ul>"),
     ("Puluhan",
      "<ul><li>二十 èrshí (20) · 三十 sānshí (30) · 五十五 wǔshíwǔ (55)</li>"
      "<li>九十九 jiǔshíjiǔ (99)</li></ul>")],
    "belasan puluhan shí èrshí 二十 pola angka 11 15 20 55 99"),
  s("5.3", "s5-3", "Membaca angka nyata",
    "<p>Angka dipakai untuk harga, umur, dan nilai.</p>",
    [("Contoh",
      "<ul><li>Harga 5 yuan: <strong>五元</strong> (wǔ yuán)</li>"
      "<li>Umur 15 tahun: <strong>十五岁</strong> (shíwǔ suì)</li>"
      "<li>Nilai 100: <strong>一百分</strong> (yì bǎi fēn)</li></ul>")],
    "membaca harga yuan umur 岁 nilai 分 contoh nyata"),
  s("5.4", "s5-4", "Angka dalam kehidupan",
    "<p>Pemakaian sehari-hari dan gestur.</p>",
    [("Pemakaian",
      "<ul><li>Nomor telepon dibaca per digit: 5 → 五 wǔ.</li>"
      "<li>Tanggal: 三月十五日 (15 Maret).</li></ul>"),
     ("Gestur tangan",
      "<p>Di pasar, orang Tiongkok sering menunjukkan angka 1–10 dengan jari (lihat gambar isyarat angka).</p>")],
    "kehidupan nomor telepon tanggal gestur jari pasar 数字 harian"),
 ],
 "questions": [
  q("m5q1", 5, 5, "Angka 7 dalam Mandarin adalah …",
    [("a", "七 qī", "七 qī"), ("b", "九 jiǔ", "九 jiǔ"), ("c", "六 liù", "六 liù"), ("d", "八 bā", "八 bā")], "a",
    "七 (qī) = 7; lihat urutan 1–10: …六七八九十."),
  q("m5q2", 5, 5, "15 ditulis …",
    [("a", "十五 shíwǔ", "十五 shíwǔ"), ("b", "五十 wǔshí", "五十 wǔshí"),
     ("c", "十五日 shíwǔ rì", "十五日 shíwǔ rì"), ("d", "五十五 wǔshíwǔ", "五十五 wǔshíwǔ")], "a",
    "15 = 十 (10) + 五 (5) → 十五 (shíwǔ). 五十 adalah 50."),
  q("m5q3", 5, 5, "55 dibaca …",
    [("a", "五十五 wǔshíwǔ", "五十五 wǔshíwǔ"),
     ("b", "四十五 sìshíwǔ", "四十五 sìshíwǔ"),
     ("c", "十五 shíwǔ", "十五 shíwǔ"), ("d", "五十 wǔshí", "五十 wǔshí")], "a",
    "55 = 五 (5) + 十 (10) + 五 (5) → 五十五 (wǔshíwǔ)."),
  q("m5q4", 5, 5, "“Harga 5 yuan” dalam Mandarin adalah …",
    [("a", "五元 wǔ yuán", "五元 wǔ yuán"), ("b", "五岁 wǔ suì", "五岁 wǔ suì"),
     ("c", "五分 wǔ fēn", "五分 wǔ fēn"), ("d", "五十 wǔshí", "五十 wǔshí")], "a",
    "元 (yuán) adalah satuan uang; 五元 = 5 yuan."),
  {"id": "m5q5", "chapter": 5, "group": 5, "type": "multi",
   "prompt": "Pilih semua angka yang <strong>benar</strong>:",
   "options": [{"id": "a", "html": "八 = 8", "text": "八 = 8"}, {"id": "b", "html": "十 = 10", "text": "十 = 10"},
               {"id": "c", "html": "九 = 9", "text": "九 = 9"}, {"id": "d", "html": "七 = 6", "text": "七 = 6"}],
   "correct": "a,b,c", "explanation": "八 = 8, 十 = 10, 九 = 9 benar; 七 = 7, bukan 6 — yang 6 adalah 六 (liù).", "type": "multi"},
  {"id": "m5q6", "chapter": 5, "group": 5, "type": "tf",
   "prompt": "Benar atau salah: 九十九 (jiǔshíjiǔ) berarti 99.",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "九 (9) + 十 (10) + 九 (9) → 99.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 6 — Nama ─────────────────────────────
chapters.append({
 "id": 6, "title": "Ni Jiao Shenme Mingzi", "fullTitle": "Menanyakan Nama: Ni Jiao Shenme Mingzi",
 "subtitle": "你叫什么名字 · Nama & sapaan",
 "intro": "<p>Cara memperkenalkan diri dan menanyakan nama dengan sopan.</p>",
 "example": "我叫小明。", "translation": "Wǒ jiào Xiǎomíng. — Nama saya Xiao Ming.",
 "sections": [
  s("6.1", "s6-1", "你叫什么名字？",
    "<p>Pertanyaan “Siapa namamu?”: <strong>你叫什么名字？</strong> (Nǐ jiào shénme míngzi?)</p>",
    [("Jawaban",
      "<ul><li>我叫… (Wǒ jiào …) — Saya bernama…</li>"
      "<li>我叫安娜。 (Wǒ jiào Ānnà.) — Saya bernama Anna.</li></ul>")],
    "ni jiao shenme mingzi 你叫什么名字 nama wǒ jiào 我叫 perkenalan"),
  s("6.2", "s6-2", "叫 vs 名字",
    "<p>Dua kata inti yang sering tertukar.</p>",
    [("Perbedaan",
      "<ul><li><strong>叫</strong> (jiào) — bernama / memanggil</li>"
      "<li><strong>名字</strong> (míngzi) — nama (kata benda)</li></ul>"),
     ("Contoh",
      "<p>我叫李明。 = Nama saya Li Ming. · 这是我的名字。= Ini nama saya.</p>")],
    "jiào 叫 míngzi 名字 beda contoh perkenalan nama"),
  s("6.3", "s6-3", "Sapaan sopan: 您贵姓",
    "<p>Untuk orang yang dihormati, tanya marganya.</p>",
    [("Dialog",
      "<ul><li>A: 您贵姓？(Nín guì xìng?) — Marga Anda?</li>"
      "<li>B: 我姓王。(Wǒ xìng Wáng.) — Saya bermarga Wang.</li></ul>"),
     ("Catatan",
      "<p>姓 (xìng) = marga; 贵姓 (guìxìng) = “marga mulia”, bentuk sopan.</p>")],
    "nín guì xìng 您贵姓 sopan marga xìng 姓 wǒ xìng 我姓 wang 王"),
 ],
 "questions": [
  q("m6q1", 6, 6, "你叫什么名字？ artinya …",
    [("a", "Siapa namamu?", "Siapa namamu?"), ("b", "Dari mana asalmu?", "Dari mana asalmu?"),
     ("c", "Berapa umurmu?", "Berapa umurmu?"), ("d", "Apa kabarmu?", "Apa kabarmu?")], "a",
    "叫什么名字 = “dipanggil nama apa” → siapa namamu."),
  q("m6q2", 6, 6, "Perkenalan diri yang tepat: …",
    [("a", "我叫安娜 Wǒ jiào Ānnà", "我叫安娜 Wǒ jiào Ānnà"), ("b", "我姓安娜 Wǒ xìng Ānnà", "我姓安娜 Wǒ xìng Ānnà"),
     ("c", "你好安娜 Nǐ hǎo Ānnà", "你好安娜 Nǐ hǎo Ānnà"), ("d", "再见安娜 Zàijiàn Ānnà", "再见安娜 Zàijiàn Ānnà")], "a",
    "叫 (jiào) untuk menyebut nama; 我叫… = nama saya …"),
  q("m6q3", 6, 6, "“Saya bermarga Wang” = …",
    [("a", "我姓王 Wǒ xìng Wáng", "我姓王 Wǒ xìng Wáng"), ("b", "我叫王 Wǒ jiào Wáng", "我叫王 Wǒ jiào Wáng"),
     ("c", "我是王 Wǒ shì Wáng", "我是王 Wǒ shì Wáng"), ("d", "我王 Wǒ Wáng", "我王 Wǒ Wáng")], "a",
    "姓 (xìng) = marga; 我姓王 = saya bermarga Wang."),
  q("m6q4", 6, 6, "Cara sopan menanyakan marga adalah …",
    [("a", "您贵姓？ Nín guì xìng?", "您贵姓？ Nín guì xìng?"), ("b", "你叫什么？ Nǐ jiào shénme?", "你叫什么？ Nǐ jiào shénme?"),
     ("c", "你好吗？ Nǐ hǎo ma?", "你好吗？ Nǐ hǎo ma?"), ("d", "几口人？ Jǐ kǒu rén?", "几口人？ Jǐ kǒu rén?")], "a",
    "贵姓 (guìxìng) = marga (bentuk hormat)."),
  q("m6q5", 6, 6, "Kata benda “nama” adalah …",
    [("a", "名字 míngzi", "名字 míngzi"), ("b", "叫 jiào", "叫 jiào"), ("c", "姓 xìng", "姓 xìng"),
     ("d", "人 rén", "人 rén")], "a",
    "名字 (míngzi) = nama; 叫 = bernama/memanggil; 姓 = marga; 人 = orang."),
  {"id": "m6q6", "chapter": 6, "group": 6, "type": "multi",
   "prompt": "Pilih semua yang berkaitan dengan nama:",
   "options": [{"id": "a", "html": "名字 míngzi (nama)", "text": "名字 míngzi (nama)"},
               {"id": "b", "html": "叫 jiào (bernama)", "text": "叫 jiào (bernama)"},
               {"id": "c", "html": "姓 xìng (marga)", "text": "姓 xìng (marga)"},
               {"id": "d", "html": "岁 suì (tahun/umur)", "text": "岁 suì (tahun/umur)"}],
   "correct": "a,b,c", "explanation": "岁 (suì) berkaitan dengan umur, bukan nama.", "type": "multi"},
  {"id": "m6q7", "chapter": 6, "group": 6, "type": "tf",
   "prompt": "Benar atau salah: 我姓李 (Wǒ xìng Lǐ) berarti “Saya bermarga Li”.",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "姓 (xìng) = marga; 我姓李 = saya bermarga Li.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 7 — Profesi ─────────────────────────────
chapters.append({
 "id": 7, "title": "Ni Shi Laoshi Ma", "fullTitle": "Profesi: Ni Shi Laoshi Ma",
 "subtitle": "你是老师吗 · Identitas & pekerjaan",
 "intro": "<p>Bertanya dan menyatakan profesi dengan pola 是…吗.</p>",
 "example": "我是学生。", "translation": "Wǒ shì xuéshēng. — Saya seorang siswa.",
 "sections": [
  s("7.1", "s7-1", "Pola …吗 untuk identitas",
    "<p>Tanya profesi: <strong>你是老师吗？</strong> (Nǐ shì lǎoshī ma?) — Kamu guru?</p>",
    [("Jawaban",
      "<ul><li>是，我是老师。(Shì, wǒ shì lǎoshī.) — Ya, saya guru.</li>"
      "<li>不是，我是学生。(Bú shì, wǒ shì xuéshēng.) — Tidak, saya siswa.</li></ul>")],
    "ni shi laoshi ma 你是老师吗 profesi tanya shì 是 identitas jawab"),
  s("7.2", "s7-2", "Kata 是 shì",
    "<p><strong>是</strong> (shì) = “adalah” untuk menyatakan identitas.</p>",
    [("Pola kalimat",
      "<ul><li>Saya siswa: 我<strong>是</strong>学生。 (Wǒ shì xuéshēng.)</li>"
      "<li>Negatif: 我<strong>不是</strong>老师。(Wǒ bú shì lǎoshī.)</li></ul>")],
    "shì 是 adalah identitas bú shì 不是 negatif pola kalimat siswa"),
  s("7.3", "s7-3", "Kosakata profesi",
    "<p>Ungkapkan pekerjaan sehari-hari.</p>",
    [("Daftar",
      "<ul><li>老师 lǎoshī — guru · 学生 xuéshēng — siswa</li>"
      "<li>医生 yīshēng — dokter · 护士 hùshì — perawat</li>"
      "<li>警察 jǐngchá — polisi · 司机 sījī — sopir</li>"
      "<li>工程师 gōngchéngshī — insinyur · 农民 nóngmín — petani</li></ul>")],
    "profesi kosakata lǎoshī 老师 xuéshēng 学生 yīshēng 医生 hùshì 护士 jǐngchá 警察 sījī 司机"),
 ],
 "questions": [
  q("m7q1", 7, 7, "你是老师吗？ bertanya tentang …",
    [("a", "Profesi", "Profesi"), ("b", "Nama", "Nama"), ("c", "Harga", "Harga"), ("d", "Waktu", "Waktu")], "a",
    "老师 = guru; pola 是…吗 menanyakan identitas/profesi."),
  q("m7q2", 7, 7, "我是一名医生 berarti …",
    [("a", "Saya seorang dokter", "Saya seorang dokter"), ("b", "Saya seorang guru", "Saya seorang guru"),
     ("c", "Saya seorang polisi", "Saya seorang polisi"), ("d", "Saya seorang siswa", "Saya seorang siswa")], "a",
    "医生 (yīshēng) = dokter."),
  q("m7q3", 7, 7, "Negatif dari 我是学生 adalah …",
    [("a", "我不是学生 Wǒ bú shì xuéshēng", "我不是学生 Wǒ bú shì xuéshēng"),
     ("b", "我不有学生", "我不有学生"), ("c", "我没有学生 Wǒ méiyǒu xuéshēng", "我没有学生 Wǒ méiyǒu xuéshēng"),
     ("d", "我不是有学生", "我不是有学生")], "a",
    "Negatif 是 → 不是 (bú shì): 我不是学生 = saya bukan siswa."),
  q("m7q4", 7, 7, "“Guru” dalam Mandarin adalah …",
    [("a", "老师 lǎoshī", "老师 lǎoshī"), ("b", "学生 xuéshēng", "学生 xuéshēng"),
     ("c", "医生 yīshēng", "医生 yīshēng"), ("d", "司机 sījī", "司机 sījī")], "a",
    "老师 (lǎoshī) = guru;学生 = siswa."),
  q("m7q5", 7, 7, "警察 jǐngchá adalah …",
    [("a", "Polisi", "Polisi"), ("b", "Dokter", "Dokter"), ("c", "Sopir", "Sopir"), ("d", "Perawat", "Perawat")], "a",
    "警察 (jǐngchá) = polisi."),
  {"id": "m7q6", "chapter": 7, "group": 7, "type": "multi",
   "prompt": "Pilih semua kata yang benar artinya:",
   "options": [{"id": "a", "html": "医生 yīshēng — dokter", "text": "医生 yīshēng — dokter"},
               {"id": "b", "html": "司机 sījī — sopir", "text": "司机 sījī — sopir"},
               {"id": "c", "html": "护士 hùshì — perawat", "text": "护士 hùshì — perawat"},
               {"id": "d", "html": "学生 xuéshēng — guru", "text": "学生 xuéshēng — guru"}],
   "correct": "a,b,c", "explanation": "学生 (xuéshēng) = siswa, bukan guru; guru = 老师.", "type": "multi"},
  {"id": "m7q7", "chapter": 7, "group": 7, "type": "tf",
   "prompt": "Benar atau salah: 我不是老师 berarti “Saya bukan guru”.",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "不是 (bú shì) = bukan.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 8 — Negara ─────────────────────────────
chapters.append({
 "id": 8, "title": "Ni Shi Na Guo Ren", "fullTitle": "Negara dan Kebangsaan: Ni Shi Na Guo Ren",
 "subtitle": "你是哪国人 · Dari negara mana",
 "intro": "<p>Menanyakan dan menyebut kebangsaan dengan pola 国 + 人.</p>",
 "example": "我是印尼人。", "translation": "Wǒ shì Yìnní rén. — Saya orang Indonesia.",
 "sections": [
  s("8.1", "s8-1", "你是哪国人？",
    "<p>“Kamu dari negara mana?”: <strong>你是哪国人？</strong> (Nǐ shì nǎ guó rén?)</p>",
    [("Jawaban",
      "<ul><li>我是印尼人。(Wǒ shì Yìnní rén.) — Saya orang Indonesia.</li>"
      "<li>他是中国人。(Tā shì Zhōngguórén.) — Dia orang Tiongkok.</li></ul>")],
    "ni shi na guo ren 你是哪国人 kebangsaan nǎ guó 哪国 indonesia 人 rén"),
  s("8.2", "s8-2", "Kosakata negara",
    "<p>Nama negara + 人 = orang dari negara itu.</p>",
    [("Daftar",
      "<ul><li>中国 Zhōngguó — Tiongkok · 美国 Měiguó — AS</li>"
      "<li>日本 Rìběn — Jepang · 韩国 Hánguó — Korea</li>"
      "<li>印尼 Yìnní — Indonesia · 法国 Fǎguó — Prancis</li>"
      "<li>英国 Yīngguó — Inggris · 德国 Déguó — Jerman</li></ul>")],
    "negara kosakata zhōngguó 中国 měiguó 美国 rìběn 日本 hánguó 韩国 yìnní 印尼 fǎguó 法国"),
  s("8.3", "s8-3", "Kalimat kebangsaan",
    "<p>Susun kalimat: 我是 + bangsa + 人.</p>",
    [("Pola",
      "<ul><li>Saya orang Indonesia: 我是印尼人。</li>"
      "<li>Kamu orang Tiongkok: 你是中国人。</li>"
      "<li>Mereka orang Jepang: 他们是日本人。</li></ul>"),
     ("Catatan",
      "<p>人 (rén) = orang; 国 (guó) = negara. Gabungan 国人 = warga negara.</p>")],
    "kalimat kebangsaan rén 人 guó 国 warga pola 我是 印尼人 中国人"),
 ],
 "questions": [
  q("m8q1", 8, 8, "你是哪国人？ bertanya tentang …",
    [("a", "Kebangsaan", "Kebangsaan"), ("b", "Profesi", "Profesi"), ("c", "Nama", "Nama"), ("d", "Umur", "Umur")], "a",
    "哪国 (nǎ guó) = negara mana; 人 = orang → dari negara mana?"),
  q("m8q2", 8, 8, "“Saya orang Indonesia” = …",
    [("a", "我是印尼人 Wǒ shì Yìnní rén", "我是印尼人 Wǒ shì Yìnní rén"),
     ("b", "我是中国 Wǒ shì Zhōngguó", "我是中国 Wǒ shì Zhōngguó"),
     ("c", "我印尼 Wǒ Yìnní", "我印尼 Wǒ Yìnní"), ("d", "在印尼 Zài Yìnní", "在印尼 Zài Yìnní")], "a",
    "Pola: 我是 + 印尼 + 人."),
  q("m8q3", 8, 8, "日本 Rìběn adalah nama negara …",
    [("a", "Jepang", "Jepang"), ("b", "Korea", "Korea"), ("c", "Prancis", "Prancis"), ("d", "Jerman", "Jerman")], "a",
    "日本 (Rìběn) = Jepang; orang Jepang = 日本人."),
  q("m8q4", 8, 8, "“Orang Tiongkok” ditulis …",
    [("a", "中国人 Zhōngguórén", "中国人 Zhōngguórén"), ("b", "中国 Zhōngguó", "中国 Zhōngguó"),
     ("c", "国人 Guórén", "国人 Guórén"), ("d", "华人 Huárén", "华人 Huárén")], "a",
    "中国 (negara) + 人 (orang) = 中国人."),
  q("m8q5", 8, 8, "美国 Měiguó adalah …",
    [("a", "Amerika Serikat", "Amerika Serikat"), ("b", "Inggris", "Inggris"),
     ("c", "Jerman", "Jerman"), ("d", "Korea", "Korea")], "a",
    "美国 (Měiguó) = Amerika Serikat."),
  {"id": "m8q6", "chapter": 8, "group": 8, "type": "multi",
   "prompt": "Pilih semua pasangan negara yang benar:",
   "options": [{"id": "a", "html": "日本 — Jepang", "text": "日本 — Jepang"},
               {"id": "b", "html": "韩国 — Korea", "text": "韩国 — Korea"},
               {"id": "c", "html": "法国 — Prancis", "text": "法国 — Prancis"},
               {"id": "d", "html": "英国 — Jerman", "text": "英国 — Jerman"}],
   "correct": "a,b,c", "explanation": "英国 (Yīngguó) = Inggris; Jerman = 德国 (Déguó).", "type": "multi"},
  {"id": "m8q7", "chapter": 8, "group": 8, "type": "tf",
   "prompt": "Benar atau salah: 韩国 (Hánguó) adalah Korea.",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "韩国 (Hánguó) = Korea.", "type": "tf"},
 ]
})

# ───────────────────────────── BAB 9 — Keluarga ─────────────────────────────
chapters.append({
 "id": 9, "title": "Ni Jia You Ji Kou Ren", "fullTitle": "Keluarga: Ni Jia You Ji Kou Ren",
 "subtitle": "你家有几口人 · Jumlah & anggota keluarga",
 "intro": "<p>Menanyakan jumlah anggota keluarga dan menyebut anggotanya.</p>",
 "example": "我家有四口人。", "translation": "Wǒ jiā yǒu sì kǒu rén. — Keluarga saya ada empat orang.",
 "sections": [
  s("9.1", "s9-1", "你家有几口人？",
    "<p>“Berapa orang di keluargamu?”: <strong>你家有几口人？</strong> (Nǐ jiā yǒu jǐ kǒu rén?)</p>",
    [("Jawaban",
      "<ul><li>我家有四口人。(Wǒ jiā yǒu sì kǒu rén.) — Keluarga saya 4 orang.</li>"
      "<li>我家有三口人。(Wǒ jiā yǒu sān kǒu rén.) — Keluarga saya 3 orang.</li></ul>")],
    "ni jia you ji kou ren 你家有几口人 keluarga jumlah wǒ jiā 我家 yǒu 有"),
  s("9.2", "s9-2", "量词: 口 dan 个",
    "<p>Angka membutuhkan <strong>量词</strong> (satuan kata).</p>",
    [("口 kǒu",
      "<ul><li>Dipakai untuk orang dalam keluarga: 三口人 (sān kǒu rén) — 3 orang.</li></ul>"),
     ("个 gè",
      "<ul><li>Satuan umum: 一个人 (yí ge rén) — seorang orang; 两个苹果 — dua apel.</li></ul>")],
    "liàngcí 量词 kǒu 口 gè 个 satuan orang keluarga"),
  s("9.3", "s9-3", "Kosakata keluarga",
    "<p>Sebutan anggota keluarga.</p>",
    [("Daftar",
      "<ul><li>爸爸 bàba — ayah · 妈妈 māma — ibu</li>"
      "<li>哥哥 gēge — kakak laki-laki · 姐姐 jiějie — kakak perempuan</li>"
      "<li>弟弟 dìdi — adik laki-laki · 妹妹 mèimei — adik perempuan</li>"
      "<li>家人 jiārén — keluarga</li></ul>")],
    "kosakata keluarga bàba 爸爸 māma 妈妈 gēge 哥哥 jiějie 姐姐 dìdi 弟弟 mèimei 妹妹 jiārén 家人"),
 ],
 "questions": [
  q("m9q1", 9, 9, "你家有几口人？ bertanya tentang …",
    [("a", "Jumlah anggota keluarga", "Jumlah anggota keluarga"), ("b", "Nama keluarga", "Nama keluarga"),
     ("c", "Profesi keluarga", "Profesi keluarga"), ("d", "Alamat rumah", "Alamat rumah")], "a",
    "几 (jǐ) = berapa; 口 orang → berapa orang dalam keluarga."),
  q("m9q2", 9, 9, "“Keluarga saya ada empat orang” = …",
    [("a", "我家有四口人 Wǒ jiā yǒu sì kǒu rén", "我家有四口人 Wǒ jiā yǒu sì kǒu rén"),
     ("b", "我家有四个人岁", "我家有四个人岁"), ("c", "我四口 Wǒ sì kǒu", "我四口 Wǒ sì kǒu"),
     ("d", "家四人 Jiā sì rén", "家四人 Jiā sì rén")], "a",
    "我家 (keluarga saya) + 有 (ada) + 四口人 (empat orang)."),
  q("m9q3", 9, 9, "Satuan untuk orang dalam keluarga adalah …",
    [("a", "口 kǒu", "口 kǒu"), ("b", "岁 suì", "岁 suì"), ("c", "元 yuán", "元 yuán"), ("d", "分 fēn", "分 fēn")], "a",
    "口 (kǒu) = satuan orang dalam keluarga (几口人)."),
  q("m9q4", 9, 9, "妈妈 māma adalah …",
    [("a", "Ibu", "Ibu"), ("b", "Ayah", "Ayah"), ("c", "Kakak perempuan", "Kakak perempuan"),
     ("d", "Adik laki-laki", "Adik laki-laki")], "a",
    "妈妈 (māma) = ibu; 爸爸 (bàba) = ayah."),
  q("m9q5", 9, 9, "“Adik laki-laki” = …",
    [("a", "弟弟 dìdi", "弟弟 dìdi"), ("b", "哥哥 gēge", "哥哥 gēge"), ("c", "姐姐 jiějie", "姐姐 jiějie"),
     ("d", "妹妹 mèimei", "妹妹 mèimei")], "a",
    "弟弟 (dìdi) = adik laki-laki; 哥哥 = kakak laki-laki."),
  {"id": "m9q6", "chapter": 9, "group": 9, "type": "multi",
   "prompt": "Pilih semua anggota keluarga yang benar artinya:",
   "options": [{"id": "a", "html": "爸爸 bàba — ayah", "text": "爸爸 bàba — ayah"},
               {"id": "b", "html": "姐姐 jiějie — kakak perempuan", "text": "姐姐 jiějie — kakak perempuan"},
               {"id": "c", "html": "妹妹 mèimei — adik perempuan", "text": "妹妹 mèimei — adik perempuan"},
               {"id": "d", "html": "老师 lǎoshī — ibu", "text": "老师 lǎoshī — ibu"}],
   "correct": "a,b,c", "explanation": "老师 (lǎoshī) = guru, bukan anggota keluarga.", "type": "multi"},
  {"id": "m9q7", "chapter": 9, "group": 9, "type": "tf",
   "prompt": "Benar atau salah: 有 (yǒu) berarti “punya/ada” dan dipakai dalam我家有…",
   "options": [{"id": "t", "html": "Benar", "text": "Benar"}, {"id": "f", "html": "Salah", "text": "Salah"}],
   "correct": "t", "explanation": "有 (yǒu) = punya/ada; 我家有四口人 = keluarga saya ada 4 orang.", "type": "tf"},
 ]
})

# ───────────────────────────── validasi & tulis ─────────────────────────────
def fix_options(qq):
    # buang entri option rusak (duplikat id kosong dkk)
    seen, opts = set(), []
    for o in qq["options"]:
        if not o["id"] or o["id"] in seen:
            continue
        seen.add(o["id"]); opts.append(o)
    assert len(opts) >= 2, qq["id"]
    ids = [o["id"] for o in opts]
    corr = qq["correct"].split(",")
    assert all(c in ids for c in corr), (qq["id"], qq["correct"], ids)
    qq["options"] = opts
    return qq

for c in chapters:
    for i, sec in enumerate(c["sections"], 1):
        assert sec["id"].startswith(f"s{c['id']}-"), sec["id"]
    c["questions"] = [fix_options(x) for x in c["questions"]]

all_q = [q for c in chapters for q in c["questions"]]
assert len(all_q) == 62, len(all_q)
assert len({q["id"] for q in all_q}) == 62
# Chapter.questions = daftar id soal (bukan objek)
for c in chapters:
    c["questions"] = [x["id"] for x in c["questions"]]

summary = ("<p><strong>Ringkasan materi Mandarin kelas XI.</strong> "
 "Bab 1–2: pengenalan Mandarin, Hanzi, Pinyin, dan empat nada. "
 "Bab 3–4: sapaan 你好 dan tanya kabar 你好吗 dengan pola …吗. "
 "Bab 5: angka 1–99. Bab 6: nama dengan 你叫什么名字 dan 您贵姓. "
 "Bab 7: profesi dengan 是…吗. Bab 8: kebangsaan 你是哪国人 (国 + 人). "
 "Bab 9: keluarga dengan 你家有几口人 dan satuan 口.</p>")

counts = {"chapters": len(chapters),
          "sections": sum(len(c["sections"]) for c in chapters),
          "questions": len(all_q)}

course = {"chapters": chapters, "questions": all_q, "summary": summary, "counts": counts}

payload = json.dumps(course, ensure_ascii=False, separators=(",", ":"))
# amankan untuk string TS satu baris
payload = payload.replace("</", "<\\/")

out = "import type { Course } from './types';\nexport const COURSE: Course = " + payload + ";\n"
path = os.path.join(ROOT, "src", "content.ts")
io.open(path, "w", encoding="utf8").write(out)
print("OK", path)
print("counts:", counts)
print("per bab:", [(c["id"], len(c["sections"]), len(c["questions"])) for c in chapters])
