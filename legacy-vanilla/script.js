'use strict';
/*
 * URL STORAGE ARCHITECTURE
 * ------------------------
 * The URL hash is the only storage. No server, no localStorage.
 *
 *  encode:  catalog object -> compact JSON (short keys) -> UTF-8 bytes
 *           -> deflate-raw (CompressionStream, if supported) -> base64url -> "#" + prefix + text
 *  decode:  reverse. The first character of the hash is a format flag:
 *           "z" = compressed, "j" = uncompressed UTF-8 JSON (fallback for older browsers).
 *
 * UTF-8 bytes (TextEncoder) keep Malayalam, Tamil, Arabic, emoji and ₹ intact.
 * Compact keys: b{n,w,p,a,i}=business, t=type, i=[[name,price,image],...]
 */
const $ = (id) => document.getElementById(id);
const WARN_LEN = 6000, HARD_LEN = 30000, MAX_ITEMS = 60;
let state = { items: [] };   // creator state (items: {id,name,price,image})
let viewing = null;          // catalog currently shown in the viewer
let uid = 0;

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const digits = (s) => String(s || '').replace(/\D/g, '');
function waNumber(v) { let d = digits(v).replace(/^0+/, ''); return d.length === 10 ? '91' + d : d; }
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
function formatPrice(p) {
  p = String(p || '').trim();
  return /^\d+(\.\d+)?$/.test(p) ? '₹' + Number(p).toLocaleString('en-IN') : p;
}
function instagramUrl(v) {
  v = String(v || '').trim(); if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (/instagram\.com/i.test(v)) return 'https://' + v.replace(/^\/+/, '');
  return 'https://instagram.com/' + v.replace(/^@/, '').replace(/\/+$/, '');
}

/* ---------- encoding / decoding ---------- */
function toB64Url(bytes) {
  let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64Url(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
  const bin = atob(s), out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function pipe(bytes, stream) {
  const buf = await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer();
  return new Uint8Array(buf);
}
async function encodeCatalog(c) {
  const compact = { b: { n: c.business.name, w: c.business.whatsapp, p: c.business.phone, a: c.business.address, i: c.business.instagram }, t: c.type, i: c.items.map((x) => [x.name, x.price, x.image || '']) };
  const bytes = new TextEncoder().encode(JSON.stringify(compact));
  if (typeof CompressionStream === 'function') {
    try { return 'z' + toB64Url(await pipe(bytes, new CompressionStream('deflate-raw'))); } catch (e) { /* fall through */ }
  }
  return 'j' + toB64Url(bytes);
}
async function decodeCatalog(hash) {
  const flag = hash[0]; let bytes = fromB64Url(hash.slice(1));
  if (flag === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  else if (flag !== 'j') throw new Error('bad format');
  const o = JSON.parse(new TextDecoder().decode(bytes));
  if (!o || typeof o !== 'object' || !o.b || typeof o.b.n !== 'string' || !o.b.n.trim() || !Array.isArray(o.i)) throw new Error('invalid');
  const s = (v) => (typeof v === 'string' ? v : '');
  const items = o.i.slice(0, 500).map((r) => { if (!Array.isArray(r) || typeof r[0] !== 'string' || !r[0].trim()) throw new Error('invalid item'); const img = s(r[2]); return { name: r[0], price: s(r[1]), image: /^data:image\/(webp|jpeg|png);base64,/.test(img) ? img : '' }; });
  return { business: { name: o.b.n, whatsapp: s(o.b.w), phone: s(o.b.p), address: s(o.b.a), instagram: s(o.b.i) }, type: ['products', 'services', 'both'].includes(o.t) ? o.t : 'products', items };
}

/* ---------- images ---------- */
function compressImage(file, max = 480) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('read'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image'));
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        const ctx = cv.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(img, 0, 0, cv.width, cv.height);
        let out = cv.toDataURL('image/webp', 0.6);
        if (!out.startsWith('data:image/webp')) out = cv.toDataURL('image/jpeg', 0.6); // Safari lacks WebP encoding
        resolve(out);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* ---------- catalog rendering (viewer + live preview) ---------- */
function renderCatalog(c, el, opts = {}) {
  const b = c.business, wa = waNumber(b.whatsapp), ph = String(b.phone || '').replace(/[^\d+]/g, ''), ig = instagramUrl(b.instagram);
  const btns = [
    ph && `<a class="chip" href="tel:${esc(ph)}">Call</a>`,
    wa && `<a class="chip wa" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>`,
    ig && `<a class="chip" href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>`,
  ].filter(Boolean).join('');
  const cards = c.items.map((it, n) => {
    const msg = encodeURIComponent(`Hi, I'm interested in ${it.name}${it.price ? ' priced at ' + formatPrice(it.price) : ''}.`);
    return `<article class="pcard" data-name="${esc(it.name.toLowerCase())}">
      <div class="pimg" ${it.image ? '' : `style="color:hsl(${(n * 47 + 230) % 360} 55% 40%);background:hsl(${(n * 47 + 230) % 360} 70% 94%)" aria-hidden="true"`}>${it.image ? `<img src="${esc(it.image)}" alt="${esc(it.name)}" loading="lazy">` : esc([...it.name][0]?.toUpperCase() || '•')}</div>
      <div class="pbody"><h3>${esc(it.name)}</h3><div class="price">${esc(formatPrice(it.price))}</div>
      ${wa ? `<a class="chip wa" href="https://wa.me/${wa}?text=${msg}" target="_blank" rel="noopener">Order on WhatsApp</a>` : ''}</div></article>`;
  }).join('');
  el.innerHTML = `<div class="cat"><header class="cat-head"><div class="avatar" aria-hidden="true">${esc([...b.name][0]?.toUpperCase() || '•')}</div><h1>${esc(b.name) || 'Your business name'}</h1>
    ${b.address ? `<p class="addr">${esc(b.address)}</p>` : ''}<div class="actions">${btns}</div></header>
    ${c.items.length > 1 ? '<input class="search" type="search" placeholder="Search items" aria-label="Search items">' : ''}
    <div class="grid">${cards || '<p class="noitems">Items you add will appear here.</p>'}<p class="noitems" hidden>No items found</p></div>
    ${opts.editable ? '<div class="cat-foot"><button class="btn ghost" id="vEdit" type="button">Edit Catalog</button><a class="btn ghost" href="./">Made with QuickCatalog</a></div>' : ''}</div>`;
  const s = el.querySelector('.search');
  if (s) s.addEventListener('input', () => {
    const q = s.value.trim().toLowerCase(); let shown = 0;
    el.querySelectorAll('.pcard').forEach((card) => { const ok = card.dataset.name.includes(q); card.hidden = !ok; if (ok) shown++; });
    el.querySelector('.grid .noitems:last-child').hidden = shown > 0;
  });
  if (opts.editable) $('vEdit').onclick = () => openEditor(c);
}
function renderPreview() { renderCatalog(collectCatalogData(), $('preview')); }

/* ---------- creator: items ---------- */
function addProduct(focus = true) {
  if (state.items.length >= MAX_ITEMS) return toast('Maximum ' + MAX_ITEMS + ' items reached');
  state.items.push({ id: ++uid, name: '', price: '', image: '' });
  renderItems(); renderPreview();
  if (focus) document.querySelector('.item:last-child .iname')?.focus();
}
function removeProduct(id) { state.items = state.items.filter((i) => i.id !== id); renderItems(); renderPreview(); }
function updateProduct(id, patch) { Object.assign(state.items.find((i) => i.id === id), patch); renderPreview(); }
function renderItems() {
  const eg = { products: ['T-Shirt', '799'], services: ['Haircut', '300'], both: ['T-Shirt or Haircut', '799'] }[document.querySelector('input[name=ctype]:checked').value];
  const box = $('items');
  if (!state.items.length) { box.innerHTML = '<div class="empty"><b>Nothing here yet</b><br>Add your first product or service to start your catalog.</div>'; return; }
  box.innerHTML = state.items.map((it, n) => `<div class="item" data-id="${it.id}">
    <label class="thumb">${it.image ? `<img src="${esc(it.image)}" alt="Preview of ${esc(it.name) || 'item'}">` : 'Add photo'}<input type="file" accept="image/*" aria-label="Photo for item ${n + 1}"></label>
    <div class="fields"><input class="iname" value="${esc(it.name)}" placeholder="e.g. ${eg[0]}" aria-label="Item ${n + 1} name"><input class="iprice" value="${esc(it.price)}" placeholder="Price e.g. ${eg[1]}" inputmode="decimal" aria-label="Item ${n + 1} price"></div>
    <button class="del" type="button" aria-label="Delete item ${n + 1}">✕</button></div>`).join('');
}
$('items').addEventListener('input', (e) => {
  const row = e.target.closest('.item'); if (!row) return; const id = +row.dataset.id;
  e.target.removeAttribute('aria-invalid');
  if (e.target.classList.contains('iname')) updateProduct(id, { name: e.target.value });
  if (e.target.classList.contains('iprice')) updateProduct(id, { price: e.target.value });
});
$('items').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (e.target.classList.contains('iname')) { e.preventDefault(); e.target.closest('.item').querySelector('.iprice').focus(); }
  if (e.target.classList.contains('iprice')) { e.preventDefault(); addProduct(); }
});
$('items').addEventListener('click', (e) => { const d = e.target.closest('.del'); if (d) removeProduct(+d.closest('.item').dataset.id); });
$('items').addEventListener('change', async (e) => {
  if (e.target.type !== 'file' || !e.target.files[0]) return;
  const id = +e.target.closest('.item').dataset.id;
  try { const image = await compressImage(e.target.files[0]); updateProduct(id, { image }); renderItems(); }
  catch (err) { toast('Could not read that image. Try another file.'); }
});

/* ---------- creator: data in/out ---------- */
function collectCatalogData() {
  return { business: { name: $('bName').value.trim(), whatsapp: $('bWa').value.trim(), phone: $('bPhone').value.trim(), address: $('bAddr').value.trim(), instagram: $('bIg').value.trim() },
    type: document.querySelector('input[name=ctype]:checked').value,
    items: state.items.map(({ name, price, image }) => ({ name: name.trim(), price: price.trim(), image })) };
}
function fillForm(c) {
  $('bName').value = c.business.name; $('bWa').value = c.business.whatsapp; $('bPhone').value = c.business.phone; $('bAddr').value = c.business.address; $('bIg').value = c.business.instagram;
  document.querySelector(`input[name=ctype][value=${c.type}]`).checked = true;
  state.items = c.items.map((i) => ({ id: ++uid, ...i }));
  renderItems(); renderPreview();
}
function validate() {
  const errs = []; document.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
  if (!$('bName').value.trim()) { errs.push('Enter your business name.'); $('bName').setAttribute('aria-invalid', 'true'); }
  if (!state.items.length) errs.push('Add at least one product or service.');
  document.querySelectorAll('.item').forEach((row, n) => {
    const it = state.items[n];
    if (!it.name.trim()) { errs.push(`Item ${n + 1} needs a name.`); row.querySelector('.iname').setAttribute('aria-invalid', 'true'); }
    if (!it.price.trim()) { errs.push(`Item ${n + 1} needs a price.`); row.querySelector('.iprice').setAttribute('aria-invalid', 'true'); }
  });
  $('errors').textContent = errs.join(' ');
  if (errs.length) (document.querySelector('[aria-invalid]') || $('addBtn')).focus();
  return !errs.length;
}

/* ---------- generate / share ---------- */
async function generateCatalogLink() {
  if (!validate()) return;
  const enc = await encodeCatalog(collectCatalogData());
  const url = location.href.split('#')[0] + '#' + enc;
  history.replaceState(null, '', '#' + enc); // keep hash in sync without triggering a route change
  $('linkOut').value = url;
  const note = $('sizeNote');
  note.hidden = url.length < WARN_LEN;
  note.textContent = url.length >= HARD_LEN ? `This link is very long (${url.length.toLocaleString()} characters) and may not open in some apps. Use fewer or smaller images.` : 'Your catalog is getting large. Try using smaller images or fewer images.';
  $('shareBtn').hidden = url.length > 6000;
  $('modal').showModal();
}
async function copyCatalogLink() {
  const text = $('linkOut').value;
  try { await navigator.clipboard.writeText(text); } catch (e) { $('linkOut').select(); document.execCommand('copy'); }
  toast('Link copied!');
}
function openEditor(c) {
  show('creator');
  if (c) fillForm(c);
  if (!state.items.length) addProduct(false);
  window.scrollTo({ top: 0 });
}

/* ---------- routing ---------- */
function show(id) { ['landing', 'creator', 'viewer', 'invalid'].forEach((v) => ($(v).hidden = v !== id)); $('headerCreate').hidden = id !== 'viewer' && id !== 'landing' ? true : false; }
async function route() {
  const hash = location.hash.slice(1);
  if (!hash) { show('landing'); return; }
  try {
    viewing = await decodeCatalog(hash);
    document.title = viewing.business.name + ' – Catalog';
    renderCatalog(viewing, $('catalog'), { editable: true });
    show('viewer');
  } catch (e) { show('invalid'); }
}
function newCatalog() { history.replaceState(null, '', location.pathname + location.search); state.items = []; $('bizForm').reset(); document.querySelector('input[name=ctype][value=products]').checked = true; document.title = 'QuickCatalog'; openEditor(); renderPreview(); }

/* ---------- wiring ---------- */
$('addBtn').onclick = () => addProduct();
$('genBtn').onclick = generateCatalogLink;
$('copyBtn').onclick = copyCatalogLink;
$('openBtn').onclick = () => window.open($('linkOut').value, '_blank', 'noopener');
$('shareBtn').onclick = () => window.open('https://wa.me/?text=' + encodeURIComponent('Check out our catalog: ' + $('linkOut').value), '_blank', 'noopener');
$('prevBtn').onclick = () => { document.body.classList.add('show-preview'); window.scrollTo({ top: 0 }); };
$('closePrev').onclick = () => document.body.classList.remove('show-preview');
document.querySelectorAll('input[name=ctype]').forEach((r) => r.addEventListener('change', renderItems));
$('editBtn').onclick = () => $('modal').close();
['heroCreate', 'headerCreate', 'newBtn'].forEach((id) => ($(id).onclick = newCatalog));
$('brand').onclick = (e) => { e.preventDefault(); history.replaceState(null, '', location.pathname + location.search); show('landing'); };
$('bizForm').addEventListener('input', (e) => { e.target.removeAttribute('aria-invalid'); renderPreview(); });
$('itemsCard').addEventListener('change', (e) => { if (e.target.name === 'ctype') renderPreview(); });
$('bizForm').addEventListener('submit', (e) => e.preventDefault());
$('modal').addEventListener('click', (e) => { if (e.target === $('modal')) $('modal').close(); });
window.addEventListener('hashchange', route);
renderItems(); renderPreview(); route();
