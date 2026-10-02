// URL Storage Architecture: Deflate-raw + Base64URL + UTF-8 preservation

export const digits = (s) => String(s || '').replace(/\D/g, '');

export function formatWaNumber(v) {
  let d = digits(v).replace(/^0+/, '');
  return d.length === 10 ? '91' + d : d;
}

export function formatPrice(p, currencySymbol = '₹') {
  if (p === null || p === undefined) return '';
  p = String(p).trim();
  if (!p) return '';
  // Check if string contains custom currency already
  if (/^[^\d\s]/.test(p)) return p;
  const num = parseFloat(p.replace(/,/g, ''));
  if (!isNaN(num) && /^\d+(\.\d+)?$/.test(p.replace(/,/g, ''))) {
    return currencySymbol + num.toLocaleString('en-IN');
  }
  return p;
}

export function cleanInstagramUrl(v) {
  v = String(v || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (/instagram\.com/i.test(v)) return 'https://' + v.replace(/^\/+/, '');
  return 'https://instagram.com/' + v.replace(/^@/, '').replace(/\/+$/, '');
}

function toB64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

async function pipe(bytes, stream) {
  const buf = await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer();
  return new Uint8Array(buf);
}

export async function encodeCatalog(catalog) {
  const compact = {
    b: {
      n: catalog.business.name || '',
      w: catalog.business.whatsapp || '',
      p: catalog.business.phone || '',
      a: catalog.business.address || '',
      i: catalog.business.instagram || '',
      th: catalog.business.theme || 'indigo',
      cu: catalog.business.currency || '₹'
    },
    t: catalog.type || 'products',
    i: (catalog.items || []).map((x) => [
      x.name || '',
      x.price || '',
      x.image || '',
      x.category || '',
      x.badge || ''
    ])
  };

  const bytes = new TextEncoder().encode(JSON.stringify(compact));
  if (typeof CompressionStream === 'function') {
    try {
      const compressed = await pipe(bytes, new CompressionStream('deflate-raw'));
      return 'z' + toB64Url(compressed);
    } catch (e) {
      console.warn('Deflate compression failed, falling back to JSON', e);
    }
  }
  return 'j' + toB64Url(bytes);
}

export async function decodeCatalog(hash) {
  if (!hash) throw new Error('Empty hash');
  const flag = hash[0];
  let bytes = fromB64Url(hash.slice(1));

  if (flag === 'z') {
    bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  } else if (flag !== 'j') {
    throw new Error('Unsupported format prefix: ' + flag);
  }

  const jsonStr = new TextDecoder().decode(bytes);
  const o = JSON.parse(jsonStr);

  if (!o || typeof o !== 'object' || !o.b || typeof o.b.n !== 'string' || !o.b.n.trim() || !Array.isArray(o.i)) {
    throw new Error('Invalid catalog structure');
  }

  const s = (v) => (typeof v === 'string' ? v : '');
  const items = o.i.slice(0, 500).map((r, idx) => {
    if (!Array.isArray(r) || typeof r[0] !== 'string' || !r[0].trim()) {
      throw new Error('Invalid item at index ' + idx);
    }
    const img = s(r[2]);
    return {
      id: idx + 1,
      name: r[0],
      price: s(r[1]),
      image: /^data:image\/(webp|jpeg|png);base64,/.test(img) ? img : '',
      category: s(r[3]),
      badge: s(r[4])
    };
  });

  return {
    business: {
      name: o.b.n,
      whatsapp: s(o.b.w),
      phone: s(o.b.p),
      address: s(o.b.a),
      instagram: s(o.b.i),
      theme: s(o.b.th) || 'indigo',
      currency: s(o.b.cu) || '₹'
    },
    type: ['products', 'services', 'both'].includes(o.t) ? o.t : 'products',
    items
  };
}

export function compressImage(file, max = 480) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('FileReader error'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image decode error'));
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * k);
        cv.height = Math.round(img.height * k);
        const ctx = cv.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        let out = cv.toDataURL('image/webp', 0.62);
        if (!out.startsWith('data:image/webp')) {
          out = cv.toDataURL('image/jpeg', 0.62);
        }
        resolve(out);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
