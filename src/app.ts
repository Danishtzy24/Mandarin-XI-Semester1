import { $, $$, esc } from './dom';
import { COURSE } from './content';
import { icon, chapterArt, CHAPTER_ICONS, FORMULAS } from './art';
import { VISUALS, labStageHTML, visualHTML } from './visuals';
import type { SavedState, QuizSession, Question, LessonSection } from './types';
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),KEY='mandarin-xi-course-v1';
const Q=new Map(COURSE.questions.map(q=>[q.id,q]));
let current: number | 'mixed'=1,observer=null,searchTimer=null,storageOK=true,confirmPending=null;
let saved: SavedState = {version:1,current:1,sessions:{}};
try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw?.version===1&&raw.sessions&&typeof raw.sessions==='object'&&!Array.isArray(raw.sessions)){saved=raw;current=raw.current==='mixed'||COURSE.chapters.some(c=>c.id===raw.current)?raw.current:1}}catch{storageOK=false}
function save(){saved.current=current;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch{storageOK=false}$('#save-status').innerHTML=icon('device')+(storageOK?'Disimpan di perangkat ini':'Mode sementara · penyimpanan tidak tersedia')}
function fillIcons(root=document){root.querySelectorAll('[data-icon]').forEach((n: HTMLElement)=>n.outerHTML=icon(n.dataset.icon!))}
const activeMotions=new WeakMap();
function motion(el,frames,duration=330,delay=0){
 if(!el)return;const previous=activeMotions.get(el);
 if(reduced.matches){previous?.cancel();activeMotions.delete(el);return}
 if(previous&&previous.playState!=='idle'&&previous.playState!=='finished'){const style=getComputedStyle(el);frames=[{...frames[0]},...frames.slice(1)];for(const key of Object.keys(frames[0]))if(['opacity','transform','translate','scale'].includes(key))frames[0][key]=style[key];previous.cancel()}
 const a=el.animate(frames,{duration,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});activeMotions.set(el,a);
 a.finished.then(()=>{if(activeMotions.get(el)===a){a.cancel();activeMotions.delete(el)}}).catch(()=>{if(activeMotions.get(el)===a)activeMotions.delete(el)});
}
function chapter(){return COURSE.chapters.find(c=>c.id===current)}
function sid(){return String(current)}
function validSession(s: QuizSession | undefined,key: string): boolean{
 if(!s||!Array.isArray(s.order)||!s.options||!s.answers||typeof s.submitted!=='boolean')return false;
 const expected=key==='mixed'?null:COURSE.chapters.find(c=>String(c.id)===key)?.questions;
 if(s.order.length!==(expected?expected.length:10)||new Set(s.order).size!==s.order.length)return false;
 for(const id of s.order){const q=Q.get(id);if(!q||(expected&&!expected.includes(id)))return false;const opts=s.options[id];if(!Array.isArray(opts)||opts.length!==q.options.length||new Set(opts).size!==opts.length||opts.some(o=>!q.options.some(v=>v.id===o)))return false;if(s.answers[id]&&s.answers[id].split(',').some(x=>!opts.includes(x)))return false}
 return true;
}
for(const key of Object.keys(saved.sessions))if(!['mixed',...COURSE.chapters.map(c=>String(c.id))].includes(key)||!validSession(saved.sessions[key],key))delete saved.sessions[key];
function session(){return saved.sessions[sid()]||null}
function normSet(x:string){return x.split(',').sort().join(',')}
function isRightQ(q:Question,ans:string|undefined){if(!ans)return false;return(q.type==='multi'?normSet(ans)===normSet(q.correct):ans===q.correct)}
function score(s: QuizSession){let correct=0,blank=0;for(const id of s.order){if(!s.answers[id])blank++;else if(isRightQ(Q.get(id),s.answers[id]))correct++}return{correct,blank,wrong:s.order.length-correct-blank,total:s.order.length,value:Math.round(correct/s.order.length*100)}}
function randomInt(n: number): number{if(globalThis.crypto?.getRandomValues){const limit=Math.floor(4294967296/n)*n,a=new Uint32Array(1);do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%n}return Math.floor(Math.random()*n)}
function shuffle<T>(items: readonly T[]): T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function differentOrder<T>(a: readonly T[],prior: readonly T[] | null): T[]{const out=shuffle(a);if(out.length>1&&prior&&out.join('|')===prior.join('|'))[out[0],out[1]]=[out[1],out[0]];return out}
function mixedQuestions(previous?: QuizSession): string[]{
 // Satu soal dari tiap kelompok bab (1–9) + 1 tambahan → 10 soal campuran.
 const old=new Set(previous?.order||[]),groups=[1,2,3,4,5,6,7,8,9];const chosen: string[]=[];
 for(const group of groups){const pool=COURSE.questions.filter(q=>q.group===group);const fresh=pool.filter(q=>!old.has(q.id));chosen.push(shuffle(fresh.length?fresh:pool)[0].id)}
 const rest=COURSE.questions.filter(q=>!chosen.includes(q.id));const fresh=rest.filter(q=>!old.has(q.id));chosen.push(...shuffle(fresh.length>=2?fresh:rest).slice(0,1).map(q=>q.id));return chosen;
}
function makeSession(key=sid()){
 const previous=saved.sessions[key];const pool=key==='mixed'?mixedQuestions(previous):COURSE.chapters.find(c=>String(c.id)===key).questions;
 const order=differentOrder(pool,previous?.order),options: Record<string,string[]>={};
 // Balance the displayed correct letter without tying correctness to that letter.
 const slots=differentOrder(order.map((_,i)=>i%4),null);
 order.forEach((id,i)=>{const q=Q.get(id);
  if(q.type==='multi'){const all=shuffle(q.options.map(o=>o.id));if(previous?.options[id]?.join('|')===all.join('|')){[all[0],all[1]]=[all[1],all[0]]}options[id]=all;return}
  const correctIds=q.correct.split(',');
  const wrong=shuffle(q.options.filter(o=>!correctIds.includes(o.id)).map(o=>o.id));
  const slot=slots[i]%q.options.length;wrong.splice(slot,0,...correctIds);
  if(previous?.options[id]?.join('|')===wrong.join('|')){const positions=wrong.map((_,n)=>n).filter(n=>n!==slot);if(positions.length>1){[wrong[positions[0]],wrong[positions[1]]]=[wrong[positions[1]],wrong[positions[0]]]}}
  options[id]=wrong});
 saved.sessions[key]={order,options,answers:{},submitted:false};save();return saved.sessions[key];
}
function renderChapters(){
 if($('#chapter-nav').children.length===COURSE.chapters.length){for(const c of COURSE.chapters){const b=$(`#chapter-nav [data-chapter="${c.id}"]`),active=c.id===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));const ss=saved.sessions[String(c.id)],grade=ss?.submitted?score(ss).value:null;let badge=b.querySelector('.chapter-score');if(grade===null)badge?.remove();else{if(!badge){badge=document.createElement('span');badge.className='chapter-score';b.querySelector('.chapter-card-meta').append(badge)}badge.textContent=String(grade);badge.setAttribute('aria-label','Nilai terakhir '+grade)}}return}
 $('#chapter-nav').innerHTML=COURSE.chapters.map(c=>{const s=saved.sessions[String(c.id)],grade=s?.submitted?score(s).value:null;return `<button class="chapter-button ${c.id===current?'active':''}" data-chapter="${c.id}" aria-pressed="${c.id===current}" aria-controls="chapter-title"><span class="chapter-mini">${chapterArt(c.id)}</span><span class="chapter-card-copy"><small>BAB ${String(c.id).padStart(2,'0')}</small><strong>${esc(c.title)}</strong><span class="chapter-card-meta">${c.sections.length} topik<i></i>${c.questions.length} soal${grade!==null?`<span class="chapter-score" aria-label="Nilai terakhir ${grade}">${grade}</span>`:''}</span></span></button>`}).join('');
}
const HERO_CHIPS: Record<number | 'mixed', [string, string, string][]> = {
 1:[['BAHASA','汉语','Hànyǔ'],['NEGARA','中国','Zhōngguó'],['IBU KOTA','北京','Běijīng']],
 2:[['NADA 1','mā','ā'],['NADA 2','má','á'],['NADA 3','mǎ','ǎ']],
 3:[['SAPAAN','你好','Nǐ hǎo'],['SOPAN','您好','Nín hǎo'],['PISAH','再见','Zàijiàn']],
 4:[['TANYA','你好吗？','…ma'],['JAWAB','我很好','Wǒ hěn hǎo'],['BALIKAN','你呢？','Nǐ ne?']],
 5:[['SATUAN','一','yī'],['PULUHAN','二十','èrshí'],['TOTAL','九十九','jiǔshíjiǔ']],
 6:[['TANYA','叫什么名字？','jiào…'],['JAWAB','我叫…','Wǒ jiào…'],['SOPAN','贵姓？','guì xìng?']],
 7:[['TANYA','…吗？','…ma?'],['YA','我是老师','Wǒ shì…'],['TIDAK','我不是','Wǒ bú shì']],
 8:[['TANYA','哪国人？','Nǎ guó rén'],['SAYA','印尼人','Yìnní rén'],['NEGARA','中国','Zhōngguó']],
 9:[['TANYA','几口人？','Jǐ kǒu rén'],['JAWAB','四口人','Sì kǒu rén'],['KELUARGA','家人','jiārén']],
 mixed:[['SOAL','acak','10'],['BENTUK','PG · PGK · B/S','3'],['MATERI','9 bab','XI']],
};
function headingArt(){const n=current==='mixed'?10:current;const f=FORMULAS[n-1];$('#formula-icon').outerHTML=icon(CHAPTER_ICONS[n-1],'formula-icon');$('.formula-icon').id='formula-icon';$('#formula-label').textContent=f[0];$('#formula-text').textContent=f[1]}
function defaultOpen(){return false}
function renderLessons(){
 observer?.disconnect();
 const c=chapter();
 $('#lesson-content').innerHTML=c.sections.map((s,i)=>`<section class="lesson-section" id="${s.id}" aria-labelledby="heading-${s.id}"><div class="section-heading"><span class="section-number">${s.number}</span><h3 id="heading-${s.id}">${esc(s.title)}</h3>${icon(CHAPTER_ICONS[c.id-1])}</div><div class="section-body">${visualHTML(s,current as number)}<details class="source-details detail-block"><summary>Baca detail ${icon('arrow-down')}</summary><div class="detail-content prose">${i===0?c.intro:''}${s.lead}${s.details.map(d=>`<details class="detail-block"><summary>${esc(d.title)}</summary><div class="detail-content prose">${d.html}</div></details>`).join('')}</div></details></div></section>`).join('');
 if(c.id===9)$('#lesson-content').insertAdjacentHTML('beforeend',`<details class="lesson-summary detail-block"><summary>Ringkasan akhir</summary><div class="detail-content prose">${COURSE.summary}</div></details>`);
 $('#toc').innerHTML=c.sections.map((s,i)=>`<a href="#${s.id}" ${i===0?'class="active" aria-current="location"':''}><span>${s.number}</span>${esc(s.title)}</a>`).join('');
 $('#chapter-intro').innerHTML='';$('#chapter-intro').hidden=true;$('.toc-panel').hidden=false;$<HTMLInputElement>('#search').disabled=false;$('.lesson-options').hidden=false;
 $('#topic-position').textContent='01 / '+String(c.sections.length).padStart(2,'0');
 observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(!visible.length)return;const id=visible[0].target.closest('.lesson-section').id;$$<HTMLAnchorElement>('#toc a').forEach(a=>{const active=a.hash==='#'+id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});$('#topic-position').textContent=String(c.sections.findIndex(s=>s.id===id)+1).padStart(2,'0')+' / '+String(c.sections.length).padStart(2,'0')},{rootMargin:'-100px 0px -60% 0px',threshold:0});
 $$('.section-heading').forEach(h=>observer.observe(h));updateDetailToggle();observeEntries();
}
function setChapter(value,scroll=true){
 const next=value==='mixed'?'mixed':Number(value);if(next!=='mixed'&&!COURSE.chapters.some(c=>c.id===next))return;
 ++searchEpoch;++quizEpoch;++navigationEpoch;current=next;clearTimeout(searchTimer);$<HTMLInputElement>('#search').value='';$<HTMLButtonElement>('#search-clear').hidden=true;$('#search-empty').hidden=true;$('#search-status').textContent='';save();renderChapters();
 const mixed=current==='mixed',c=chapter();
 $('#chapter-kicker').innerHTML=`<span class="hero-chapter-label">${mixed?'LATIHAN CAMPURAN':'BAB '+String(c.id).padStart(2,'0')}</span>MANDARIN / XI`;
 $('#chapter-title').textContent=mixed?'Latihan campuran.':c.title+'.';$('#chapter-subtitle').textContent=mixed?'Sapaan · kabar · angka · nama · profesi · negara · keluarga':c.subtitle;
 $('#example-english').textContent=mixed?'你好 → 我很好 → 我叫… → 我是…':c.example;$('#example-english').lang='zh-Hans';$('#example-meaning').textContent=mixed?'10 soal acak dari 9 bab materi.':c.translation;
 $('#hero-question-count').textContent=mixed?'10 soal acak':c.questions.length+' soal latihan';$('#material-number').textContent=mixed?'—':String(c.id).padStart(2,'0');
 $('.hero-actions .button').hidden=mixed;
 $('.hero-actions .hero-practice').hidden=false;
 headingArt();
 const chipSet=HERO_CHIPS[current==='mixed'?'mixed':current]||HERO_CHIPS[1];
 $$('.hero-word').forEach((w,i)=>{const c=chipSet[i];if(!c)return;const sm=w.querySelector('small'),bb=w.querySelector('b'),sp=w.querySelector('span');if(sm)sm.textContent=c[0];if(bb)bb.textContent=c[1];if(sp)sp.textContent=c[2]});
 if(mixed){observer?.disconnect();$('.material-toolbar').hidden=true;$('.toc-panel').hidden=true;$('.lesson-options').hidden=true;$('#chapter-intro').hidden=true;$('#lesson-content').innerHTML='';$('.course-layout').classList.add('mixed-layout');$('#end-title').textContent='Latihan campuran';$<HTMLButtonElement>('#next-chapter').innerHTML='Kembali ke pilihan bab '+icon('arrow-up')}
 else{$('.material-toolbar').hidden=false;$('.course-layout').classList.remove('mixed-layout');renderLessons();$('#end-title').textContent=c.title;$<HTMLButtonElement>('#next-chapter').innerHTML=(c.id<COURSE.chapters.length?'Bab berikutnya':'Latihan campuran')+' '+icon('arrow')}
 renderQuiz();
 if(scroll){$('.chapter-hero').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});$('#chapter-title').setAttribute('tabindex','-1');$('#chapter-title').focus({preventScroll:true})}
 motion($('.hero-copy'),[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],330);
 motion($('.hero-image'),[{opacity:.1,transform:'translateY(16px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],570);
 motion($('.scene-formula'),[{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],390);
}
let searchEpoch=0;
async function searchTopics(){
 if(current==='mixed')return;const epoch=++searchEpoch,key=sid(),term=$<HTMLInputElement>('#search').value.trim().toLocaleLowerCase('id'),c=chapter(),matches=new Set(c.sections.filter(s=>!term||s.search.includes(term)).map(s=>s.id));
 const before=new Map(),out=[];
 for(const section of $$('.lesson-section'))if(!section.hidden){const st=getComputedStyle(section);before.set(section.id,{rect:section.getBoundingClientRect(),opacity:st.opacity,transform:st.transform});if(!matches.has(section.id))out.push(exitElement(section));else if(exits.get(section)){const opacity=st.opacity,transform=st.transform;exits.get(section).cancel();motion(section,[{opacity,transform},{opacity:1,transform:'none'}],280)}}
 await Promise.all(out.map(x=>x.finished));if(epoch!==searchEpoch||sid()!==key){out.forEach(x=>x.animation?.cancel());return}
 for(const sec of c.sections){const node=$('#'+sec.id),visible=matches.has(sec.id);node.hidden=!visible;$(`#toc a[href="#${sec.id}"]`).hidden=!visible}
 out.forEach(x=>x.animation?.cancel());$('#chapter-intro').hidden=true;$('#search-empty').hidden=matches.size>0;$<HTMLButtonElement>('#search-clear').hidden=!$<HTMLInputElement>('#search').value;$('#search-status').textContent=term?`${matches.size} dari ${c.sections.length} topik cocok`:'';
 for(const sec of c.sections)if(matches.has(sec.id)){
  const node=$('#'+sec.id),old=before.get(sec.id),rect=node.getBoundingClientRect();
  if(!old||Math.abs(old.rect.top-rect.top)>1)motion(node,[{opacity:old?.opacity??0,transform:`translateY(${old?old.rect.top-rect.top:12}px)`},{opacity:1,transform:'none'}],350);
  const source=node.querySelector<HTMLDetailsElement>('.source-details');if(term){const child=[...source.querySelectorAll<HTMLDetailsElement>('details')];child.forEach(d=>{if(d.textContent.toLocaleLowerCase('id').includes(term))d.open=true});animateDisclosure(source,true)}else if(source.open)animateDisclosure(source,false);
 }
 if(!matches.size)motion($('#search-empty'),[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],300);updateDetailToggle();observeEntries();
}
function updateDetailToggle(){const all=$$<HTMLDetailsElement>('.lesson-section:not([hidden]) .source-details'),opened=all.length&&all.every(d=>disclosureMotions.get(d)?.opening??d.open);$<HTMLButtonElement>('#detail-toggle').lastElementChild.textContent=opened?'Tutup semua detail':'Buka semua detail';$<HTMLButtonElement>('#detail-toggle').setAttribute('aria-expanded',String(!!opened));$<HTMLButtonElement>('#detail-toggle').hidden=all.length===0}
function renderQuiz(){
 const s=session(),mixed=current==='mixed',count=mixed?10:chapter().questions.length;
 $('#quiz-title').textContent=mixed?'Latihan campuran.':'Latihan Bab '+String(current).padStart(2,'0')+'.';const fmts=mixed?['PG','PGK']:[...new Set(chapter().questions.map(id=>{const t=Q.get(id).type||'single';return t==='multi'?'PGK':t==='tf'?'B/S':'PG'}))];$('#quiz-count').textContent=count+' soal · '+fmts.join(' · ');
 if(!s){$('#quiz-workspace').innerHTML=`${mixed?'<p class="mixed-info">10 soal · 9 kelompok materi · urutan acak.</p>':''}<div class="quiz-start"><div class="quiz-emblem" aria-hidden="true">${chapterArt(mixed?10:Number(current))}</div><div class="quiz-start-copy"><h3>${count} soal. Siap mencoba?</h3><p>Pilih atau centang jawaban → cek nilai → lihat pembahasan.</p><div class="quiz-start-tags"><span>${icon('shuffle')}Urutan acak</span><span>${icon('check-circle')}Pembahasan tersedia</span></div></div><button class="button primary" id="quiz-start">Mulai latihan ${icon('arrow')}</button></div>`;observeEntries();return}
 const result=s.submitted?score(s):null;
 $('#quiz-workspace').innerHTML=`${result?resultHTML(result):''}<div class="quiz-session-header"><span>${s.submitted?'Jawaban sudah dikunci':'Pilih satu jawaban untuk setiap soal.'}</span><button data-restart>${icon('shuffle')}Acak ulang</button></div><div class="question-list">${s.order.map((id,i)=>questionHTML(Q.get(id),i,s)).join('')}</div>${s.submitted?`<div class="result-end"><a href="#quiz-result">Kembali ke hasil ↑</a><button class="button secondary" data-restart>${icon('shuffle')}Acak & coba lagi</button></div>`:`<div class="quiz-submit-bar"><div><p class="quiz-progress-copy" id="quiz-progress-text"></p><div class="quiz-progress-track" aria-hidden="true"><span></span></div></div><button class="button primary" id="quiz-submit">Cek jawaban ${icon('check-circle')}</button></div>`}`;
 if(!s.submitted)updateQuizProgress();observeEntries();
}
function resultHTML(r){return `<div class="quiz-result" id="quiz-result"><div class="score-ring" style="--score:${r.value}" aria-label="Nilai ${r.value} dari 100"><div><strong>${r.value}</strong><small>DARI 100</small></div></div><div class="result-copy"><span class="eyebrow">HASIL LATIHAN</span><h3 tabindex="-1" id="result-title">${r.correct} dari ${r.total} benar.</h3><div class="score-breakdown"><span>${r.correct} benar</span><span>${r.wrong} salah</span><span>${r.blank} kosong</span></div><p>Buka pembahasan jika diperlukan.</p><span class="sr-only" role="status">Nilai ${r.value} dari 100. ${r.correct} benar, ${r.wrong} salah, ${r.blank} kosong.</span></div><button class="button secondary" data-restart>${icon('shuffle')}Coba lagi</button></div>`}
function questionHTML(q: Question,i: number,s: QuizSession){
 const answer=s.answers[q.id],submitted=s.submitted,isRight=isRightQ(q,answer),blank=!answer;
 const type=q.type||'single',correctIds=type==='multi'?q.correct.split(','):[q.correct];
 const letter=(oid:string)=>{const j=s.options[q.id].indexOf(oid);return type==='tf'?'BS'[j]||'?':'ABCDE'[j]||'?'};
 const correctLabel=correctIds.map(letter).join(', ');
 const correctText=correctIds.map(cid=>q.options.find(o=>o.id===cid)?.text||'').join(' + ');
 const feedback=submitted?`<div class="question-feedback"><span class="feedback-label ${blank?'blank':isRight?'':'wrong'}">${icon(isRight?'check-circle':blank?'quiz':'close')}${blank?'Tidak dijawab':isRight?'Jawaban benar':'Jawaban kurang tepat'}</span>${!isRight?`<p class="correct-answer">Jawaban benar: <strong>${correctLabel} · ${esc(correctText)}</strong></p>`:''}<details class="feedback-detail detail-block"><summary>Lihat pembahasan ${icon('arrow-down')}</summary><div class="detail-content explanation prose">${q.explanation}</div></details></div>`:'';
 const legend=type==='multi'?'Pilih semua jawaban yang benar':type==='tf'?'Benar atau salah':'Pilih satu jawaban';
 const badge=type==='multi'?'PGK':type==='tf'?'B/S':'PG';
 return `<article class="question-card type-${type}" id="q-${q.id}" data-question="${q.id}"><div class="question-top"><span class="question-counter"><b>${String(i+1).padStart(2,'0')}</b> / ${s.order.length}</span><span class="question-badge badge-${type}">${badge}</span></div><div class="question-prompt prose" id="prompt-${q.id}">${q.prompt}</div>${type==='multi'?'<p class="multi-hint">Centang semua jawaban yang benar — bisa lebih dari satu.</p>':type==='tf'?'<p class="multi-hint tf-hint">Pilih Benar atau Salah.</p>':''}<fieldset class="question-options" aria-labelledby="prompt-${q.id}" ${submitted?'disabled':''}><legend>${legend}</legend>${s.options[q.id].map((oid,j)=>{const o=q.options.find(v=>v.id===oid),isC=submitted&&correctIds.includes(oid),isW=submitted&&!!answer&&answer.split(',').includes(oid)&&!correctIds.includes(oid),checked=type==='multi'?(answer||'').split(',').includes(oid):answer===oid;return `<label class="option ${isC?'is-correct':isW?'is-wrong':''}"><input type="${type==='multi'?'checkbox':'radio'}" name="answer-${q.id}" value="${oid}" data-answer="${q.id}" ${checked?'checked':''}><span class="option-letter" aria-hidden="true">${letter(oid)}</span><span class="option-text">${o.html}</span>${isC||isW?`<span class="option-status" aria-label="${isC?'Jawaban benar':'Jawaban salah'}">${icon(isC?'check':'close')}</span>`:''}</label>`}).join('')}</fieldset>${feedback}</article>`;
}
function updateQuizProgress(){const s=session();if(!s||s.submitted)return;const n=s.order.filter(id=>s.answers[id]).length;$('#quiz-progress-text').innerHTML=`<strong>${n} / ${s.order.length}</strong> soal terjawab`;$('.quiz-progress-track>span').style.width=(n/s.order.length*100)+'%'}
function askConfirm(title,text,accept='Lanjutkan',cancel='Batal'){
 if(confirmPending)return Promise.resolve(false);const d=$<HTMLDialogElement>('#confirm-dialog');$('#confirm-title').textContent=title;$('#confirm-description').textContent=text;$<HTMLButtonElement>('#confirm-accept').textContent=accept;$<HTMLButtonElement>('#confirm-cancel').textContent=cancel;d.showModal();$<HTMLButtonElement>('#confirm-cancel').focus();motion(d,[{opacity:0,transform:'translateY(14px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],250);return new Promise(resolve=>confirmPending=resolve);
}
async function resolveConfirm(value){if(!confirmPending||$<HTMLDialogElement>('#confirm-dialog').classList.contains('closing'))return;const d=$<HTMLDialogElement>('#confirm-dialog');d.classList.add('closing');const out=exitElement(d);await out.finished;out.animation?.cancel();d.close();d.classList.remove('closing');const resolve=confirmPending;confirmPending=null;resolve?.(value)}
async function submitQuiz(){
 const key=sid(),s=session();if(!s||s.submitted||confirmPending)return;
 const blanks=s.order.filter(id=>!s.answers[id]).length;
 if(blanks&&!await askConfirm(`Masih ada ${blanks} soal kosong.`,`Jawaban kosong bernilai 0. Setelah diperiksa, semua jawaban dikunci. Tetap cek sekarang?`,'Tetap cek','Lanjut mengisi'))return;
 if(sid()!==key||session()!==s||s.submitted)return;const committed=await transitionQuiz(()=>{s.submitted=true;save();renderChapters();renderQuiz()});if(!committed||sid()!==key)return;$('#quiz-result').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});$('#result-title').focus({preventScroll:true});motion($('.score-ring'),[{opacity:.3,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'}],400);
}
async function restartQuiz(){
 const key=sid(),s=session();if(confirmPending)return;
 if(s&&(s.submitted||Object.keys(s.answers).length)&&!await askConfirm('Mulai percobaan baru?',s.submitted?'Hasil dan jawaban percobaan ini akan diganti. Soal dan pilihan akan diacak kembali.':'Jawaban pada percobaan ini akan dihapus. Urutan soal dan pilihan akan diacak kembali.','Acak & mulai','Batal'))return;
 if(sid()!==key)return;const committed=await transitionQuiz(()=>{makeSession(key);renderChapters();renderQuiz()});if(!committed||sid()!==key)return;$('#latihan').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});$('.question-card input')?.focus({preventScroll:true});
}
$('#chapter-nav').addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLElement>('button[data-chapter]');if(b)navigateChapter(b.dataset.chapter)});
$<HTMLButtonElement>('#mixed-launch').onclick=()=>navigateChapter('mixed');$<HTMLButtonElement>('#next-chapter').onclick=()=>{if(current==='mixed'){$('#pilihan-bab').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});return}navigateChapter(current<9?current+1:'mixed')};
document.addEventListener('click',e=>{const a=(e.target as HTMLElement).closest<HTMLElement>('.toc-arrow');if(!a)return;const nav=a.parentElement?.querySelector('#toc');nav?.scrollBy({left:a.classList.contains('next')?240:-240,behavior:'smooth'})});
$<HTMLInputElement>('#search').addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(searchTopics,100)});function clearSearch(){clearTimeout(searchTimer);$<HTMLInputElement>('#search').value='';searchTopics();$<HTMLInputElement>('#search').focus()}$<HTMLButtonElement>('#search-clear').onclick=clearSearch;$<HTMLButtonElement>('#search-reset').onclick=clearSearch;
$<HTMLButtonElement>('#detail-toggle').onclick=()=>{const ds=$$<HTMLDetailsElement>('.lesson-section:not([hidden]) .source-details'),open=!ds.every(d=>disclosureMotions.get(d)?.opening??d.open);ds.forEach(d=>animateDisclosure(d,open));updateDetailToggle()};$('#lesson-content').addEventListener('toggle',updateDetailToggle,true);
$('#quiz-workspace').addEventListener('change',e=>{const input=(e.target as HTMLElement).closest<HTMLInputElement>('input[data-answer]'),s=session();if(!input||!s||s.submitted)return;const id=input.dataset.answer;if(!id||!s.order.includes(id)||!s.options[id].includes(input.value))return;const q=Q.get(id);if((q.type||'single')==='multi'){const fs=input.closest('fieldset');const sel=fs?[...fs.querySelectorAll<HTMLInputElement>('input[data-answer]:checked')].map(x=>x.value).sort():[];s.answers[id]=sel.join(',')}else s.answers[id]=input.value;save();updateQuizProgress()});
$('#quiz-workspace').addEventListener('click',e=>{if((e.target as HTMLElement).closest<HTMLElement>('#quiz-start')){startQuizFlow()}else if((e.target as HTMLElement).closest<HTMLElement>('#quiz-submit'))submitQuiz();else if((e.target as HTMLElement).closest<HTMLElement>('[data-restart]'))restartQuiz()});
$<HTMLButtonElement>('#confirm-accept').onclick=()=>resolveConfirm(true);$<HTMLButtonElement>('#confirm-cancel').onclick=()=>resolveConfirm(false);$<HTMLDialogElement>('#confirm-dialog').addEventListener('cancel',e=>{e.preventDefault();resolveConfirm(false)});$<HTMLDialogElement>('#confirm-dialog').addEventListener('click',e=>{if(e.target===$<HTMLDialogElement>('#confirm-dialog')){const r=(e.target as HTMLElement).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)resolveConfirm(false)}});
$<HTMLButtonElement>('#back-top').onclick=()=>$('#pilihan-bab').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$<HTMLDialogElement>('#confirm-dialog').open&&current!=='mixed'){e.preventDefault();$<HTMLInputElement>('#search').focus();$('#materi').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'})}if(e.key==='Escape'&&document.activeElement===$<HTMLInputElement>('#search')&&!$<HTMLDialogElement>('#confirm-dialog').open)clearSearch()});
const entered=new WeakSet(),watched=new Set<Element>();
const entranceObserver=new IntersectionObserver(entries=>{let i=0;for(const e of entries)if(e.isIntersecting){entranceObserver.unobserve(e.target);watched.delete(e.target);if(!e.target.isConnected||!e.target.getClientRects().length)continue;entered.add(e.target);e.target.classList.add('seen');motion(e.target,[{opacity:0,transform:'translateY(19px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],480,Math.min(i++*45,180));if(e.target.matches('.visual-lab'))e.target.querySelectorAll('.sentence-piece').forEach((piece,j)=>motion(piece,[{opacity:0,transform:'translateY(9px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],420,j*45))}},{threshold:.06,rootMargin:'0px 0px -15px 0px'});
function observeEntries(){for(const n of watched)if(!n.isConnected){entranceObserver.unobserve(n);watched.delete(n)}if(reduced.matches)return;for(const n of $$('.visual-lab,.question-card,.quiz-start,.quiz-result,.chapter-button,.lesson-section .section-heading,.chapter-end,.mixed-info'))if(!entered.has(n)&&!watched.has(n)){watched.add(n);entranceObserver.observe(n)}}
const exits=new WeakMap();
function exitElement(el){
 if(!el||reduced.matches||!el.getClientRects().length)return{finished:Promise.resolve(),animation:null};
 const s=getComputedStyle(el),opacity=s.opacity,transform=s.transform;activeMotions.get(el)?.cancel();activeMotions.delete(el);exits.get(el)?.cancel();
 const a=el.animate([{opacity,transform},{opacity:0,transform:'translateY(-9px) scale(.985)'}],{duration:155,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});exits.set(el,a);return{animation:a,finished:a.finished.catch(()=>{})};
}
function inView(el){const r=el.getBoundingClientRect();return r.bottom>80&&r.top<innerHeight&&r.height>0}
let navigationEpoch=0,quizEpoch=0;
async function navigateChapter(value){
 const n=value==='mixed'?'mixed':Number(value),epoch=++navigationEpoch;
 if(n===current){for(const el of [$('.hero-copy'),$('.hero-image'),$('.scene-formula'),...$$('.visual-lab').filter(inView)]){const style=getComputedStyle(el),opacity=style.opacity,transform=style.transform;exits.get(el)?.cancel();motion(el,[{opacity,transform},{opacity:1,transform:'none'}],250)}$('.chapter-hero').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});return}
 const elements=[$('.hero-copy'),$('.hero-image'),$('.scene-formula'),...$$('.visual-lab').filter(inView).slice(0,2)].filter(Boolean),out=elements.map(exitElement);
 await Promise.all(out.map(x=>x.finished));if(epoch!==navigationEpoch){out.forEach(x=>x.animation?.cancel());return}
 out.forEach(x=>x.animation?.cancel());setChapter(n);observeEntries();
}
async function transitionQuiz(commit){const epoch=++quizEpoch,key=sid(),els=$$('#quiz-workspace .quiz-start,#quiz-workspace .question-card,#quiz-workspace .quiz-result,#quiz-workspace .quiz-submit-bar').filter(inView).slice(0,4),out=els.map(exitElement);await Promise.all(out.map(x=>x.finished));const valid=epoch===quizEpoch&&key===sid();if(valid)commit();out.forEach(x=>x.animation?.cancel());return valid}
async function startQuizFlow(){if(!await transitionQuiz(()=>{makeSession();renderQuiz()}))return;$('#latihan').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});$('.question-card input')?.focus({preventScroll:true})}
const disclosureMotions=new WeakMap();
function animateDisclosure(d,opening){
 const content=d.querySelector(':scope > .detail-content'),previous=disclosureMotions.get(d),from=d.getBoundingClientRect().height;previous?.animation?.cancel();previous?.contentAnimation?.cancel();
 if(reduced.matches||!content){d.open=opening;d.style.height='';d.style.overflow='';disclosureMotions.delete(d);updateDetailToggle();return}
 d.open=true;d.style.height='';const full=d.getBoundingClientRect().height,target=opening?full:d.querySelector('summary').getBoundingClientRect().height+2;
 d.style.overflow='hidden';d.style.height=from+'px';
 const a=d.animate([{height:from+'px'},{height:target+'px'}],{duration:330,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
 const ca=content.animate(opening?[{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}]:[{opacity:getComputedStyle(content).opacity},{opacity:0}],{duration:opening?310:160,fill:'both'});
 const state={animation:a,contentAnimation:ca,opening};disclosureMotions.set(d,state);updateDetailToggle();
 a.finished.then(()=>{if(disclosureMotions.get(d)!==state)return;d.open=opening;d.style.height='';d.style.overflow='';a.cancel();ca.cancel();disclosureMotions.delete(d);updateDetailToggle()}).catch(()=>{});
}
$('#lesson-content').addEventListener('click',e=>{const summary=(e.target as HTMLElement).closest<HTMLElement>('summary');if(!summary)return;e.preventDefault();const d=summary.parentElement as HTMLDetailsElement;animateDisclosure(d,!(disclosureMotions.get(d)?.opening??d.open))});
const labEpochs=new WeakMap();
async function chooseLab(root,index){
 const v=VISUALS[root.dataset.lab],old=Number(root.dataset.index);if(Number(root.dataset.pendingIndex??old)===index)return;root.dataset.pendingIndex=String(index);const epoch=(labEpochs.get(root)||0)+1;labEpochs.set(root,epoch);
 root.querySelectorAll('[data-lab-choice]').forEach(b=>{const active=Number(b.dataset.labChoice)===index;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});
 const stage=root.querySelector('.lab-stage'),out=exitElement(stage);await out.finished;if(labEpochs.get(root)!==epoch){out.animation?.cancel();return}
 const oldHeight=stage.getBoundingClientRect().height;stage.innerHTML=labStageHTML(v,index);root.dataset.index=index;delete root.dataset.pendingIndex;root.querySelector('.lab-pagination>span').innerHTML=String(index+1).padStart(2,'0')+' <i>/ '+String(v.items.length).padStart(2,'0')+'</i>';out.animation?.cancel();
 motion(stage,[{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],350);
 stage.querySelectorAll('.sentence-piece').forEach((el,i)=>motion(el,[{opacity:0,transform:'translateY(10px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],370,i*45));
 const newHeight=stage.getBoundingClientRect().height;if(!reduced.matches&&Math.abs(newHeight-oldHeight)>2){const a=stage.animate([{height:oldHeight+'px'},{height:newHeight+'px'}],{duration:330,easing:'cubic-bezier(.22,1,.36,1)'});a.finished.then(()=>a.cancel()).catch(()=>{})}
}
$('#lesson-content').addEventListener('click',e=>{const root=(e.target as HTMLElement).closest<HTMLElement>('[data-lab]');if(!root)return;const b=(e.target as HTMLElement).closest<HTMLElement>('[data-lab-choice]');if(b)chooseLab(root,Number(b.dataset.labChoice));else if((e.target as HTMLElement).closest<HTMLElement>('[data-lab-next]'))chooseLab(root,(Number(root.dataset.pendingIndex??root.dataset.index)+1)%VISUALS[root.dataset.lab].items.length)});
$('#quiz-workspace').addEventListener('click',e=>{const summary=(e.target as HTMLElement).closest<HTMLElement>('summary');if(!summary)return;e.preventDefault();const d=summary.parentElement as HTMLDetailsElement;animateDisclosure(d,!(disclosureMotions.get(d)?.opening??d.open))});
$('#quiz-workspace').addEventListener('change',e=>{const el=(e.target as HTMLElement).closest<HTMLElement>('.option');if(!el)return;motion(el.querySelector('.option-letter'),[{transform:'scale(.75) rotate(-12deg)'},{transform:'scale(1.12) rotate(4deg)',offset:.6},{transform:'scale(1) rotate(0deg)'}],340)});
let parallaxFrame=0;$('.hero-scene').addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;cancelAnimationFrame(parallaxFrame);parallaxFrame=requestAnimationFrame(()=>{const r=$('.hero-scene').getBoundingClientRect();$('.hero-scene').style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*9+'px');$('.hero-scene').style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*7+'px')})});$('.hero-scene').addEventListener('pointerleave',()=>{cancelAnimationFrame(parallaxFrame);$('.hero-scene').style.setProperty('--px','0px');$('.hero-scene').style.setProperty('--py','0px')});
fillIcons();setChapter(current,false);save();document.fonts.ready.then(()=>{motion($('.collection-heading'),[{opacity:.5,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],400)});
