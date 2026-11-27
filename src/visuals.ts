import { icon, CHAPTER_ICONS } from './art';
import type { VisualModel, VisualItem, LessonSection } from './types';
/* Lab v2: kartu besar = PINYIN + ARTI (hanzi tetap tampil di baris rumus, langkah, dan soal). */
const P = (text: string, role: string) => ({ text, role });
const it = (label: string, parts: [string, string][], formula: string, meaning = '', cue = ''): VisualItem =>
 ({ label, parts: parts.map(([t, r]) => P(t, r)), formula, meaning, cue });
const lab = (note: string, kind: string, items: VisualItem[]): VisualModel => ({ note, kind, items });
/* ex: kartu pinyin + arti; rumus otomatis “hanzi · pinyin”. */
const ex = (label: string, hanzi: string, pinyin: string, arti: string, formula = '', cue = ''): VisualItem =>
 it(label, [[pinyin, 'pinyin'], [arti, 'arti']], formula || `${hanzi} · ${pinyin}`, '', cue || arti);
/* rx: materi berbasis huruf Latin (pola/konsonan) + arti. */
const rx = (label: string, primary: string, arti: string, formula = '', cue = ''): VisualItem =>
 it(label, [[primary, 'pinyin'], [arti, 'arti']], formula || primary, '', cue || arti);

export const VISUALS: Record<string, VisualModel> = {
/* BAB 1 */
's1-1': lab('Istilah dasar bahasa Mandarin.', 'formula', [
 ex('Bahasa', '汉语', 'Hànyǔ', 'Bahasa Mandarin'),
 ex('Baku', '普通话', 'Pǔtōnghuà', 'bahasa baku'),
 ex('Belajar', '学习', 'xuéxí', 'belajar')]),
's1-2': lab('Fakta singkat tentang Tiongkok.', 'formula', [
 ex('Negara', '中国', 'Zhōngguó', 'Tiongkok'),
 ex('Ibu kota', '北京', 'Běijīng', 'Beijing'),
 ex('Uang', '元', 'Yuán', 'yuan')]),
's1-3': lab('Hanzi ditulis; Pinyin membantu membacanya.', 'hanzi', [
 ex('Hanzi', '汉字', 'hànzì', 'karakter Tiongkok'),
 ex('Pinyin', '拼音', 'pīnyīn', 'tulisan Latin'),
 ex('Contoh', '中国', 'Zhōngguó', 'Tiongkok', '中国 → Zhōngguó')]),
's1-4': lab('Nada mengubah arti satu suku kata.', 'tones', [
 ex('Nada 1', '妈', 'mā', 'ibu', '妈 · mā — datar & tinggi'),
 ex('Nada 2', '麻', 'má', 'rami', '麻 · má — naik seperti tanya'),
 ex('Nada 3', '马', 'mǎ', 'kuda', '马 · mǎ — turun lalu naik'),
 ex('Nada 4', '骂', 'mà', 'memarahi', '骂 · mà — turun tajam')]),
/* BAB 2 */
's2-1': lab('Pinyin adalah huruf Latin untuk membaca hanzi.', 'formula', [
 ex('Pelajaran', '学习', 'xuéxí', 'belajar'),
 ex('Terima kasih', '谢谢', 'xièxie', 'terima kasih'),
 ex('Guru', '老师', 'lǎoshī', 'guru')]),
's2-2': lab('Contoh empat nada pada suku kata “tang”.', 'tones', [
 ex('Nada 1', '汤', 'tāng', 'kuah', '汤 · tāng — datar'),
 ex('Nada 2', '糖', 'táng', 'gula', '糖 · táng — naik'),
 ex('Nada 3', '躺', 'tǎng', 'berbaring', '躺 · tǎng — cekung'),
 ex('Nada 4', '烫', 'tàng', 'panas', '烫 · tàng — turun tajam')]),
's2-3': lab('Kelompok konsonan paling sering muncul.', 'formula', [
 rx('Dasar', 'b p m f · d t n l · g k h', 'kelompok dasar'),
 rx('Tebal', 'zh ch sh r', 'mirip j c s, lebih tebal'),
 rx('Lembut', 'j q x · z c s', 'lebih ringan')]),
's2-4': lab('Vokal utama dan cara latihannya.', 'formula', [
 rx('Vokal', 'a o e i u ü', '6 vokal utama'),
 ex('ü', '女', 'nǚ', 'perempuan — bibir maju'),
 rx('Tips', 'Baca lambat · tekankan nada', 'ulangi tiap kata 3×')]),
/* BAB 3 */
's3-1': lab('Sapaan umum kapan saja.', 'formula', [
 ex('Sapaan', '你好', 'nǐ hǎo', 'halo'),
 ex('Dengan nama', '你好，小明！', 'Nǐ hǎo, Xiǎomíng!', 'halo, Xiao Ming!'),
 ex('Arti', '你 + 好', 'nǐ hǎo', 'kamu + baik', '你 + 好 — harfiah: kamu baik')]),
's3-2': lab('Sesuaikan sapaan dengan waktu dan kesopanan.', 'steps', [
 ex('早上好', '早上好', 'zǎoshang hǎo', 'selamat pagi'),
 ex('晚上好', '晚上好', 'wǎnshang hǎo', 'selamat malam'),
 ex('晚安', '晚安', 'wǎn’ān', 'selamat tidur'),
 ex('您好', '您好', 'nín hǎo', 'Anda halo — sopan')]),
's3-3': lab('Sapaan dibalas sapaan; berpisah dengan 再见.', 'chat', [
 it('Sapaan', [['A: Nǐ hǎo! · B: Nǐ hǎo!', 'pinyin'], ['A: halo! · B: halo!', 'arti']],
  'A: 你好! → B: 你好!', '', 'balas sapaan'),
 it('Perpisahan', [['A: Zàijiàn! · B: Zàijiàn!', 'pinyin'], ['sampai jumpa', 'arti']],
  'A: 再见! → B: 再见!', '', 'zàijiàn')]),
/* BAB 4 */
's4-1': lab('Tanya kabar lalu balas dengan kabar.', 'chat', [
 it('Tanya', [['Nǐ hǎo ma?', 'pinyin'], ['apa kabar?', 'arti']], '你好吗？ — apa kabar?', '', 'nǐ hǎo ma'),
 it('Jawab', [['Wǒ hěn hǎo, xièxie!', 'pinyin'], ['baik, terima kasih!', 'arti']], '我很好，谢谢！', '', 'wǒ hěn hǎo'),
 it('Balik', [['Nǐ ne?', 'pinyin'], ['kamu gimana?', 'arti']], '你呢？ — kamu gimana?', '', 'nǐ ne')]),
's4-2': lab('Tambah 吗 di akhir → pertanyaan.', 'formula', [
 rx('Halo', 'nǐ hǎo + ma? = nǐ hǎo ma?', 'pernyataan jadi tanya', '你好 + 吗？ = 你好吗？'),
 rx('Sibuk', 'nǐ máng + ma? = nǐ máng ma?', 'kamu sibuk?', '你忙 + 吗？ = 你忙吗？')]),
's4-3': lab('Jawaban sesuai kondisi.', 'steps', [
 ex('很好', '很好', 'hěn hǎo', 'sangat baik'),
 ex('不错', '不错', 'bùcuò', 'lumayan'),
 ex('我不太好', '我不太好', 'wǒ bù tài hǎo', 'saya kurang baik'),
 ex('有点累', '有点累', 'yǒudiǎn lèi', 'sedikit lelah')]),
's4-4': lab('Contoh percakapan kabar lengkap.', 'chat', [
 it('Baris 1', [['A: Nǐ hǎo ma? · B: Wǒ hěn hǎo, xièxie! · B: Nǐ ne?', 'pinyin'], ['tanya → jawab → balik', 'arti']],
  'A 你好吗 → B 我很好，谢谢！你呢？', '', 'percakapan'),
 it('Baris 2', [['A: Wǒ yě hěn hǎo.', 'pinyin'], ['saya juga baik', 'arti']], 'A: 我也很好。', '', 'wǒ yě hěn hǎo')]),
/* BAB 5 */
's5-1': lab('Sepuluh angka dasar — hafalkan dulu.', 'steps', [
 ex('一 二', '一 二', 'yī èr', '1 · 2', '一 yī · 二 èr'),
 ex('三 四 五', '三 四 五', 'sān sì wǔ', '3 · 4 · 5', '三 sān · 四 sì · 五 wǔ'),
 ex('六 七 八', '六 七 八', 'liù qī bā', '6 · 7 · 8', '六 liù · 七 qī · 八 bā'),
 ex('九 十', '九 十', 'jiǔ shí', '9 · 10', '九 jiǔ · 十 shí')]),
's5-2': lab('Belasan dan puluhan disusun dari satuan + 十.', 'formula', [
 rx('Belasan', 'shí + wǔ = shíwǔ (15)', 'belasan = 十 + satuan', '十 + 五 = 十五 (15)'),
 rx('Puluhan', 'èr + shí = èrshí (20)', 'puluhan = angka + 十', '二 + 十 = 二十 (20)'),
 rx('Campuran', 'wǔ + shí + wǔ = wǔshíwǔ (55)', 'angka puluhan campuran', '五 + 十 + 五 = 五十五 (55)')]),
's5-3': lab('Angka dipakai untuk harga, umur, dan nilai.', 'formula', [
 ex('Harga', '五元', 'wǔ yuán', '5 yuan', '五元 — 5 yuan'),
 ex('Umur', '十五岁', 'shíwǔ suì', '15 tahun', '十五岁 — umur 15 tahun'),
 ex('Nilai', '一百分', 'yì bǎi fēn', 'nilai 100', '一百分 — nilai 100')]),
's5-4': lab('Angka dalam kehidupan sehari-hari.', 'formula', [
 rx('Telepon', '5 → wǔ', 'dibaca per digit', 'Nomor telepon: baca per digit (5 → 五 wǔ)'),
 ex('Tanggal', '三月十五日', 'sān yuè shíwǔ rì', '15 Maret', '三月十五日 — 15 Maret'),
 rx('Gestur', '1–10 dengan jari', 'isyarat pasar', 'Gestur jari 1–10')]),
/* BAB 6 */
's6-1': lab('Tanya nama, jawab dengan 我叫…', 'chat', [
 it('Tanya', [['Nǐ jiào shénme míngzi?', 'pinyin'], ['siapa namamu?', 'arti']], '你叫什么名字？', '', 'shénme míngzi'),
 it('Jawab', [['Wǒ jiào Xiǎomíng.', 'pinyin'], ['nama saya Xiao Ming.', 'arti']], '我叫小明。 — nama saya…', '', 'Wǒ jiào'),
 it('Balik', [['Nǐ jiào shénme?', 'pinyin'], ['namamu siapa?', 'arti']], '你叫什么？', '', 'Nǐ jiào')]),
's6-2': lab('叫 adalah kata kerja; 名字 adalah kata benda.', 'formula', [
 ex('叫', '叫', 'jiào', 'bernama / memanggil', '叫 = bernama'),
 ex('名字', '名字', 'míngzi', 'nama', '名字 = nama'),
 ex('Contoh', '我叫李明。', 'Wǒ jiào Lǐ Míng.', 'nama saya Li Ming')]),
's6-3': lab('Untuk yang dihormati, tanya marganya.', 'chat', [
 it('A', [['Nín guì xìng?', 'pinyin'], ['marga Anda?', 'arti']], '您贵姓？ — marga Anda?', '', 'guì xìng'),
 it('B', [['Wǒ xìng Wáng.', 'pinyin'], ['saya bermarga Wang', 'arti']], '我姓王。', '', 'xìng')]),
/* BAB 7 */
's7-1': lab('Tanya profesi dengan pola 是…吗.', 'chat', [
 it('Tanya', [['Nǐ shì lǎoshī ma?', 'pinyin'], ['kamu guru?', 'arti']], '你是老师吗？', '', 'lǎoshī'),
 it('Ya', [['Shì, wǒ shì lǎoshī.', 'pinyin'], ['ya, saya guru', 'arti']], '是，我是老师。', '', 'wǒ shì'),
 it('Tidak', [['Bú shì, wǒ shì xuéshēng.', 'pinyin'], ['bukan, saya siswa', 'arti']], '不是，我是学生。', '', 'bú shì')]),
's7-2': lab('是 = “adalah”; negatif dengan 不是.', 'formula', [
 rx('Positif', 'wǒ shì xuéshēng', 'saya siswa', '我 + 是 + 学生'),
 rx('Negatif', 'wǒ bú shì lǎoshī', 'saya bukan guru', '我 + 不是 + 老师')]),
's7-3': lab('Kosakata profesi sehari-hari.', 'steps', [
 ex('老师', '老师', 'lǎoshī', 'guru'),
 ex('医生', '医生', 'yīshēng', 'dokter'),
 ex('警察', '警察', 'jǐngchá', 'polisi'),
 ex('司机', '司机', 'sījī', 'sopir')]),
/* BAB 8 */
's8-1': lab('Tanya kebangsaan, jawab dengan 国 + 人.', 'chat', [
 it('Tanya', [['Nǐ shì nǎ guó rén?', 'pinyin'], ['dari negara mana?', 'arti']], '你是哪国人？', '', 'nǎ guó rén'),
 it('Saya', [['Wǒ shì Yìnní rén.', 'pinyin'], ['saya orang Indonesia', 'arti']], '我是印尼人。', '', 'Yìnní rén'),
 it('Dia', [['Tā shì Zhōngguórén.', 'pinyin'], ['dia orang Tiongkok', 'arti']], '他是中国人。', '', 'Zhōngguórén')]),
's8-2': lab('Nama negara; + 人 menjadi warganya.', 'steps', [
 ex('中国', '中国', 'Zhōngguó', 'Tiongkok'),
 ex('日本', '日本', 'Rìběn', 'Jepang'),
 ex('印尼', '印尼', 'Yìnní', 'Indonesia'),
 ex('法国', '法国', 'Fǎguó', 'Prancis')]),
's8-3': lab('Pola kalimat kebangsaan.', 'formula', [
 rx('Pola', 'wǒ shì + Yìnní + rén', 'saya orang Indonesia', '我是 + 印尼 + 人'),
 ex('Contoh', '他们 + 是 + 日本人。', 'Tāmen shì Rìběnrén.', 'mereka orang Jepang')]),
/* BAB 9 */
's9-1': lab('Tanya jumlah anggota keluarga.', 'chat', [
 it('Tanya', [['Nǐ jiā yǒu jǐ kǒu rén?', 'pinyin'], ['berapa orang di keluargamu?', 'arti']], '你家有几口人？', '', 'jǐ kǒu rén'),
 it('Jawab', [['Wǒ jiā yǒu sì kǒu rén.', 'pinyin'], ['keluarga saya 4 orang', 'arti']], '我家有四口人。', '', 'sì kǒu rén')]),
's9-2': lab('Angka membutuhkan satuan (量词).', 'formula', [
 ex('口', '口', 'kǒu', 'satuan orang keluarga', '口 — orang dalam keluarga (三口人)'),
 ex('个', '个', 'gè', 'satuan umum', '个 — satuan umum (一个人)')]),
's9-3': lab('Sebutan anggota keluarga.', 'steps', [
 ex('爸爸', '爸爸', 'bàba', 'ayah'),
 ex('妈妈', '妈妈', 'māma', 'ibu'),
 ex('姐姐', '姐姐', 'jiějie', 'kakak perempuan'),
 ex('妹妹', '妹妹', 'mèimei', 'adik perempuan')]),
};

const ROLE_LABEL: Record<string, string> = { pinyin: 'PINYIN', arti: 'ARTI', kata: 'KATA', tanya: 'TANYA', jawab: 'JAWAB', hanzi: 'HANZI' };

function toneCurves(): string {
 const paths = [
 'M4 14 C 30 14, 56 14, 82 14',
 'M4 20 C 30 20, 56 8, 82 6',
 'M4 8 C 24 24, 40 24, 56 20 C 68 17, 74 8, 82 5',
 'M4 5 C 30 7, 56 16, 82 22'
 ];
 const names = ['NADA 1', 'NADA 2', 'NADA 3', 'NADA 4'];
 return `<div class="tone-diagram">${paths.map((d, i) => `<span><svg viewBox="0 0 86 26" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="4" cy="${[14, 20, 8, 5][i]}" r="3" fill="currentColor"/><circle cx="82" cy="${[14, 6, 5, 22][i]}" r="3" fill="currentColor"/></svg><small>${names[i]}</small></span>`).join('')}</div>`;
}

function labDiagram(v: VisualModel, index: number): string {
 const i = v.items[index];
 if (v.kind === 'tones') return toneCurves();
 if (v.kind === 'hanzi') {
  const [big = '', small = ''] = i.formula.split('·').map((t) => t.trim());
  return `<div class="hanzi-diagram"><b lang="zh-Hans">${big}</b><small>${small}</small></div>`;
 }
 if (v.kind === 'formula') return `<div class="formula-diagram">${i.formula.split(/·|→|\+/).map(t => t.trim() ? `<span>${t.trim()}</span>` : '').join('<i>+</i>')}</div>`;
 if (v.kind === 'chat') return `<div class="chat-diagram"><span class="chat-avatar">A</span><div class="chat-bubble">${icon('chat')}<i>${i.formula}</i><span></span><span></span><span></span></div><span class="chat-avatar other">B</span></div>`;
 if (v.kind === 'steps') return `<div class="step-diagram">${v.items.map((it2, j) => `<span class="${j === index ? 'current' : j < index ? 'passed' : ''}"><b>${j < index ? '✓' : String(j + 1).padStart(2, '0')}</b><i lang="zh-Hans">${it2.label}</i></span>`).join('')}</div>`;
 if (v.kind === 'people') return `<div class="people-diagram"><span class="person-bust"><i></i><b></b></span><span class="person-link">→</span><div class="pronoun-bubble">${i.parts[0].text}</div><span class="mini-book">${icon('book')}</span></div>`;
 return `<div class="formula-diagram"><span>${i.formula}</span></div>`;
}

export function labStageHTML(v: VisualModel, index: number): string {
 const i = v.items[index];
 return `${labDiagram(v, index)}<div class="sentence-pieces">${i.parts.map(p => `<div class="sentence-piece piece-${p.role}"><b${p.role === 'hanzi' ? ' lang="zh-Hans"' : ''}>${p.text}</b><small>${ROLE_LABEL[p.role] || p.role.toUpperCase()}</small></div>`).join('')}</div><div class="lab-bottom"><div class="lab-formula">${icon('layers')}<span>${i.formula}</span></div>${i.meaning ? `<p>${i.meaning}</p>` : ''}</div>`;
}

export function visualHTML(s: LessonSection, chapterId: number): string {
 const v = VISUALS[s.id];
 if (!v) return '';
 return `<div class="visual-lab" data-lab="${s.id}" data-index="0"><div class="lab-caption"><span>${icon(CHAPTER_ICONS[chapterId - 1])} ${v.note}</span><b>INTERAKTIF</b></div><div class="lab-controls" role="group" aria-label="Contoh ${s.title.replace(/"/g, '')}">${v.items.map((it2, i) => `<button class="${i === 0 ? 'selected' : ''}" data-lab-choice="${i}" aria-pressed="${i === 0}">${it2.label}</button>`).join('')}</div><div class="lab-stage" aria-live="polite">${labStageHTML(v, 0)}</div><div class="lab-pagination"><span>01 <i>/ ${String(v.items.length).padStart(2, '0')}</i></span><button data-lab-next>Contoh berikutnya ${icon('arrow')}</button></div></div>`;
}
