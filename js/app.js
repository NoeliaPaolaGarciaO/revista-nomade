// =============================================
// NÓMADE · js/app.js
// =============================================

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const h = (tag, cls, txt) => Object.assign(document.createElement(tag), cls ? { className: cls } : {}, txt ? { textContent: txt } : {});
const iniciales = (n = '') => n.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
const filas = (el, attr) => el.getAttribute(attr).trim().split('\n').map((l) => l.split('|').map((s) => s.trim()));

/* ───────── 0. RENDER COMPACTO DE LISTAS ───────── */
$$('[data-datos]').forEach((ul) => filas(ul, 'data-datos').forEach((p) => {
  if (p.at(0)) ul.append(Object.assign(h('li'), { innerHTML: `<span class="dato-titulo">${p.at(0)}</span><p>${p.at(1) ?? ''}</p>` }));
}));

$$('[data-tarjetas]').forEach((ul) => filas(ul, 'data-tarjetas').forEach((p) => {
  if (!p.at(2)) return;
  const li = h('li', 'tarjeta');
  li.innerHTML = `<div class="tarjeta-foto"><img class="tarjeta-img" src="${p.at(0)}" alt="${p.at(2)}"></div>
    <div class="tarjeta-cuerpo"><span class="tarjeta-pais">${p.at(1)}</span><h3>${p.at(2)}</h3><p>${p.at(3)}</p>
    ${p.at(4) ? `<div class="tarjeta-pie"><a class="enlace" href="${p.at(4)}">Leer artículo →</a></div>` : ''}</div>`;
  ul.append(li);
}));

$$('[data-platos]').forEach((ul) => filas(ul, 'data-platos').forEach((p) => {
  if (!p.at(2)) return;
  const li = h('li', 'plato');
  li.innerHTML = `
    <div class="plato-foto"><img class="plato-img" src="${p.at(0)}" alt="${p.at(2)}"></div>
    <div class="plato-cuerpo">
      <div class="plato-cabecera"><span class="plato-pais">${p.at(1)}</span><h3>${p.at(2)}</h3></div>
      <p class="plato-desc">${p.at(3)}</p>
    </div>`;
  ul.append(li);
}));

$$('[data-check]').forEach((ul) => filas(ul, 'data-check').forEach((p) => {
  if (p.at(0)) ul.append(Object.assign(h('li'), { innerHTML: `<label><input type="checkbox" id="${p.at(0)}"><span>${p.at(1)}</span></label>` }));
}));

$$('[data-frases]').forEach((tb) => filas(tb, 'data-frases').forEach((c) => {
  if (c.at(0)) { const tr = h('tr'); c.forEach((txt) => tr.append(h('td', '', txt))); tb.append(tr); }
}));

/* ───────── 1. MARCA ───────── */
(() => {
  const cfg = window.NOMADE_CONFIG ?? {};
  const { revista = {}, agencia = {} } = cfg;
  const esUrl = (u) => /^https?:\/\//i.test(u ?? '');
  const enlace = (txt, href, cls) => Object.assign(h('a', cls, txt), { href }, esUrl(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {});

  Object.entries(cfg.tema ?? {}).forEach((e) => e.at(0).startsWith('--') && document.documentElement.style.setProperty(e.at(0), e.at(1)));

  $$('[data-texto]').forEach((el) => {
    const ruta = el.dataset.texto.split('.');
    const clave = ruta.pop();
    const padre = ruta.reduce((o, k) => o?.[k], cfg);
    if (padre?.[clave]) el.textContent = padre[clave];
    else if (padre && clave in padre) el.hidden = true;
  });

  const titulo = Array.of(revista.nombre, agencia.nombre).filter(Boolean).join(' · ');
  if (titulo) document.title = `${titulo} | ${revista.descriptor ?? 'Revista digital de turismo'}`;

  $$('[data-logo]').forEach((caja) => {
    caja.classList.toggle('insignia--oscura', agencia.logoFondo === 'oscuro');
    const fallback = () => caja.replaceChildren(h('span', 'insignia-iniciales', iniciales(agencia.nombre) || 'N'));
    if (!agencia.logo) return fallback();
    const img = Object.assign(new Image(), { alt: '', src: agencia.logo });
    img.addEventListener('error', fallback, { once: true });
    caja.replaceChildren(img);
  });

  $$('[data-logo-agencia]').forEach((caja) => {
    const nombreAgTapa = revista.agenciaTapa || agencia.nombre || 'N';
    caja.replaceChildren(h('span', 'insignia-iniciales', iniciales(nombreAgTapa)));
  });

  if (revista.logo) {
    const img = Object.assign(new Image(), { className: 'nav-marca-img', alt: revista.nombre ?? 'Revista', src: revista.logo });
    img.addEventListener('load', () => $('.nav-marca')?.replaceChildren(img), { once: true });
  }

  const dest = revista.destinoDelMes;
  const fotoPortada = $('.pagina--portada .pagina-foto');
  if (dest?.foto && fotoPortada) Object.assign(fotoPortada, { src: dest.foto, alt: dest.nombre ?? '' });
  else fotoPortada?.remove();

  const solo = (t) => t.replace(/[^\d+]/g, '');
  const contacto = Array.of(
    Array.of('Teléfono', agencia.telefono, agencia.telefono && 'tel:' + solo(agencia.telefono)),
    Array.of('WhatsApp', agencia.whatsapp, agencia.whatsapp && 'https://wa.me' + solo(agencia.whatsapp).replace('+', '')),
    Array.of('Email', agencia.email, agencia.email && 'mailto:' + agencia.email),
    Array.of('Web', agencia.web?.replace(/^https?:\/\//i, ''), esUrl(agencia.web) && agencia.web),
    Array.of('Dirección', agencia.direccion, ''),
    Array.of('Horario', agencia.horario, '')
  ).filter((x) => x.at(1));

  const lista = $('#contacto');
  if (lista) {
    lista.replaceChildren(...contacto.map((x) => {
      const li = h('li');
      li.append(h('span', 'contacto-etiqueta', x.at(0)), x.at(2) ? enlace(x.at(1), x.at(2)) : h('span', '', x.at(1)));
      return li;
    }));
    lista.hidden = !contacto.length;
  }

  const redes = $('#redes');
  if (redes) {
    (agencia.redes ?? []).filter((r) => r.nombre && esUrl(r.url)).forEach((r) => redes.append(enlace(r.nombre, r.url)));
    redes.hidden = !redes.children.length;
  }

  const tarjeta = ({ foto, pais, titulo: t, texto, fecha, consulta, cita }) => {
    const min = h('div', 'tarjeta-foto');
    if (foto) min.append(Object.assign(h('img', 'tarjeta-img'), { alt: t, src: foto }));
    else if (cita) min.append(h('span', 'insignia-iniciales', iniciales(t)));
    const cuerpo = h('div', 'tarjeta-cuerpo');
    if (pais) cuerpo.append(h('span', 'tarjeta-pais', pais));
    cuerpo.append(h('h3', '', t));
    if (texto) cuerpo.append(h('p', '', texto));
    if (consulta) {
      const pie = h('div', 'tarjeta-pie');
      if (fecha) pie.append(h('span', 'tarjeta-fecha', fecha));
      const btn = Object.assign(h('a', 'boton', 'Consultar'), { href: '#' });
      btn.dataset.consultar = consulta;
      pie.append(btn);
      cuerpo.append(pie);
    }
    const li = h('li', cita ? 'tarjeta tarjeta--cita' : 'tarjeta');
    li.append(min, cuerpo);
    return li;
  };

  const quitar = (n) => $$(`[data-requiere="${n}"]`).forEach((el) => el.remove());

  // Pág. 25: Operadores aliados (si no hay logos cargados, muestra invitación a sumarse)
  const operadores = (cfg.operadores ?? []).filter((op) => op?.logo).slice(0, 9);
  const grillaOp = $('#operadores-lista');
  if (grillaOp) {
    if (!operadores.length) {
      grillaOp.replaceWith(Object.assign(h('div', 'aviso'), {
        innerHTML: '<strong>Espacio reservado para operadores mayoristas y aliados.</strong><br>¿Querés que tu marca llegue a agencias minoristas y viajeros de todo el país? Contactanos en la contratapa.'
      }));
    } else {
      operadores.forEach((op) => {
        const li = h('li', 'operador-item');
        const caja = h('div', 'operador-caja');
        const img = Object.assign(new Image(), { src: op.logo, alt: op.nombre || 'Operador aliado' });
        img.addEventListener('error', () => li.remove(), { once: true });
        caja.append(img);

        if (esUrl(op.web)) {
          const a = Object.assign(h('a', 'operador-link'), { href: op.web, target: '_blank', rel: 'noopener noreferrer', title: op.nombre || '' });
          a.append(caja);
          li.append(a);
        } else {
          li.append(caja);
        }
        grillaOp.append(li);
      });
    }
  }

  // Pág. 26: Propuestas de operadores (si no hay cargadas, muestra invitación a pautar)
  const ofertasOp = (cfg.ofertasOperadores ?? []).filter((o) => o?.titulo).slice(0, 3);
  const listaOfertasOp = $('#ofertas-operadores-lista');
  if (listaOfertasOp) {
    if (!ofertasOp.length) {
      listaOfertasOp.replaceWith(Object.assign(h('div', 'aviso'), {
        innerHTML: '<strong>Espacio para salidas destacadas de operadores.</strong><br>Publicá tus paquetes grupales y promociones con consulta directa al WhatsApp de cada agencia.'
      }));
    } else {
      ofertasOp.forEach((o) =>
        listaOfertasOp.append(tarjeta({ ...o, consulta: o.fecha ? `${o.titulo} (${o.fecha})` : o.titulo }))
      );
    }
  }

  // Pág. 27: Salida destacada de la agencia minorista (si tiene datos, quita #cierre para que queden 28 páginas exactas)
  const salidas = (cfg.salidas ?? []).filter((s) => s?.titulo).slice(0, 3);
  const listaSalidas = $('#salidas-lista');
  if (!salidas.length) {
    quitar('salidas');
  } else if (listaSalidas) {
    $('#cierre')?.remove();
    salidas.forEach((s) =>
      listaSalidas.append(tarjeta({ ...s, consulta: s.fecha ? `${s.titulo} (${s.fecha})` : s.titulo }))
    );
  }

  const viajeros = (cfg.viajeros ?? []).filter((v) => v?.nombre && v?.frase).slice(0, 3);
  if (!viajeros.length) quitar('viajeros');
  else viajeros.forEach((v) => $('#viajeros-lista')?.append(tarjeta({ foto: v.foto, pais: v.destino, titulo: v.nombre, texto: v.frase, cita: true })));

  const cajaVenta = $('#venta');
  if (cfg.venta?.planes?.length && cajaVenta) {
    const ul = h('ul', 'planes');
    cfg.venta.planes.forEach((plan) => {
      const li = h('li', 'plan');
      const btn = Object.assign(h('a', 'boton', 'Consultar'), { href: '#' });
      btn.dataset.consultar = `${revista.nombre ?? 'Revista'} · plan ${plan.nombre}`;
      li.append(h('strong', '', plan.nombre), h('span', '', plan.texto), plan.precio ? h('b', '', plan.precio) : '', btn);
      ul.append(li);
    });
    cajaVenta.append(h('h3', '', cfg.venta.titulo), h('p', '', cfg.venta.texto), ul);
    cajaVenta.hidden = false;
  }

  const selloTapa = $('[data-sello-tapa]');
  if (selloTapa) {
    if (revista.selloTapa) selloTapa.src = revista.selloTapa;
    else selloTapa.remove();
  }

  const redUrl = (agencia.redes ?? []).find((r) => esUrl(r.url))?.url ?? '';
  $$('[data-consultar]').forEach((b) => {
    const asunto = b.dataset.consultar;
    const msg = encodeURIComponent(`Hola, quiero consultar por: ${asunto}`);
    const dig = (agencia.whatsapp ?? '').replace(/\D/g, '');
    const href = dig
      ? `https://wa.me{dig}?text=${msg}`
      : agencia.email
        ? `mailto:${agencia.email}?subject=${encodeURIComponent(asunto)}&body=${msg}`
        : esUrl(agencia.web) ? agencia.web : redUrl;
    if (!href) return (b.hidden = true);
    b.href = href;
    if (esUrl(href)) Object.assign(b, { target: '_blank', rel: 'noopener noreferrer' });
  });
})();

/* ───────── 2. LIBRO (FLIPBOOK) ───────── */
class Flipbook {
  constructor(contenedor, onCambio) {
    Object.assign(this, { contenedor, onCambio, indice: 0, ocupado: false, pendiente: null, temporizador: null });
    this.paginas = this.#armar();
    this.hojas = Array.from(contenedor.querySelectorAll('.hoja'));
  }
  get total() { return this.hojas.length; }
  get izq() { return this.indice > 0 ? this.paginas.at(2 * this.indice - 1) : null; }
  get der() { return this.indice < this.total ? this.paginas.at(2 * this.indice) : null; }
  get etiqueta() { return this.izq?.dataset.etiqueta ?? this.der?.dataset.etiqueta ?? ''; }
  get id() { return this.izq?.id || this.der?.id || ''; }
  aperturaDeId(id) { const p = id ? this.paginas.findIndex((pg) => pg.id === id) : -1; return p === -1 ? -1 : Math.ceil(p / 2); }

  ir(n, animar = true) {
    if (n < 0 || n > this.total) return;
    if (this.ocupado) return (this.pendiente = n);
    if (n === this.indice && animar) return;
    const previo = this.indice;
    this.indice = n;
    this.#render(previo, animar);
  }

  #armar() {
    const paginas = Array.from(this.contenedor.querySelectorAll(':scope > .pagina'));
    if (paginas.length % 2) {
      const relleno = h('article', 'pagina pagina--papel-alt pagina--sin-folio');
      relleno.setAttribute('aria-hidden', 'true');
      paginas.push(relleno);
    }
    const hojas = [];
    for (let i = 0; i < paginas.length; i += 2) {
      const hoja = h('div', 'hoja');
      const [frente, dorso] = [paginas.at(i), paginas.at(i + 1)];
      frente.classList.add('pagina--frente');
      dorso.classList.add('pagina--dorso');
      frente.prepend(h('span', 'lomo'));
      dorso.prepend(h('span', 'lomo'));
      hoja.append(frente, dorso);
      hojas.push(hoja);
    }
    this.contenedor.replaceChildren(...hojas);
    return paginas;
  }

  #render(previo, animar) {
    clearTimeout(this.temporizador);
    this.contenedor.classList.toggle('sin-animacion', !animar);
    const total = this.total;
    const movidas = Math.abs(this.indice - previo);
    this.hojas.forEach((hoja, i) => {
      const volteada = i < this.indice;
      const viajando = animar && (volteada ? i >= previo : i < previo);
      hoja.classList.toggle('volteada', volteada);
      hoja.style.zIndex = viajando ? total * 2 + (volteada ? i : total - i) : volteada ? i + 1 : total - i;
    });
    this.contenedor.dataset.estado = this.indice === 0 ? 'portada' : this.indice === total ? 'contratapa' : 'abierto';
    this.onCambio?.(this);
    if (!animar || !movidas) return (this.ocupado = false);
    this.ocupado = true;
    this.temporizador = setTimeout(() => {
      this.ocupado = false;
      const sig = this.pendiente;
      this.pendiente = null;
      if (sig !== null && sig !== this.indice) this.ir(sig);
    }, 760);
  }
}

const contenedorFlipbook = $('#flipbook');
if (contenedorFlipbook) {
  const btnPrev = $('#btn-prev'), btnNext = $('#btn-next');
  const fb = new Flipbook(contenedorFlipbook, (libro) => {
    if ($('#indicador')) $('#indicador').textContent = libro.etiqueta;
    if (btnPrev) btnPrev.disabled = libro.indice === 0;
    if (btnNext) btnNext.disabled = libro.indice === libro.total;
    history.replaceState(null, '', location.pathname + location.search + (libro.id ? '#' + libro.id : ''));
  });

  const desdeHash = () => Math.max(0, fb.aperturaDeId(location.hash.slice(1)));
  const mover = (d) => fb.ir(fb.indice + d);

  const interactuarEsquina = (btn, direccion) => {
    if (!btn) return;
    let inicioX = null;

    btn.addEventListener('pointerdown', (e) => {
      inicioX = e.clientX;
      btn.setPointerCapture(e.pointerId);
    });

    btn.addEventListener('pointermove', (e) => {
      if (inicioX === null) return;
      const delta = e.clientX - inicioX;
      const avance = Math.min(12, Math.max(3.4, 3.4 + Math.abs(delta) * 0.08));
      btn.style.setProperty('--s', avance + 'cqw');
    });

    const soltar = (e) => {
      if (inicioX === null) return;
      const delta = e.clientX - inicioX;
      inicioX = null;
      btn.style.removeProperty('--s');
      const arrastroBien = direccion === 1 ? delta < -25 : delta > 25;
      const hizoClic = Math.abs(delta) < 10;
      if (arrastroBien || hizoClic) mover(direccion);
    };

    btn.addEventListener('pointerup', soltar);
    btn.addEventListener('pointercancel', () => { inicioX = null; btn.style.removeProperty('--s'); });
  };

  interactuarEsquina(btnPrev, -1);
  interactuarEsquina(btnNext, 1);

  addEventListener('hashchange', () => fb.ir(desdeHash()));
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') mover(1);
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'Home') fb.ir(0);
    else if (e.key === 'End') fb.ir(fb.total);
  });
  addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const n = fb.aperturaDeId(link.hash.slice(1));
    if (n !== -1) fb.ir(n);
  });

  if ($('#ayuda-teclado')) {
    $('#ayuda-teclado').textContent = 'Arrastrá o hacé clic en las esquinas inferiores para pasar de página';
  }
fb.ir(desdeHash(), false);
/* ───────── 3. DETALLES ───────── */ 
$$('[data-folio-de]').forEach((el) => { 
const i = fb.paginas.findIndex((p) => p.id === el.dataset.folioDe); 
el.textContent = i === -1 ? '' : String(i + 1).padStart(2, '0'); 
}); 
}
/* ───────── 4. LISTA DE VERIFICACIÓN, FOTOS ROTAS Y PWA ───────── */ 
const casillas = Array.from($$('.checklist input[type="checkbox"]')); 
const contarListas = () => { 
if ($('#checklist-progreso')) { 
$('#checklist-progreso').textContent = casillas.filter((c) => c.checked).length + ' de ' + casillas.length + ' listas'; 
} 
}; 
casillas.forEach((c) => { 
try { c.checked = localStorage.getItem('nomade:check:' + c.id) === '1'; } catch {} 
c.addEventListener('change', () => { 
try { localStorage.setItem('nomade:check:' + c.id, c.checked ? '1' : '0'); } catch {} 
contarListas(); 
}); 
}); 
contarListas();
$$('img.pagina-foto, img.tarjeta-img, img.plato-img').forEach((img) => {
const quitar = () => {
const caja = img.parentElement;
if (!caja) return;
caja.classList.add('sin-foto');
if (caja.closest('.tarjeta--cita')) caja.append(h('span', 'insignia-iniciales', iniciales(img.alt)));
img.remove();
};
img.complete && !img.naturalWidth ? quitar() : img.addEventListener('error', quitar, { once: true });
});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
let eventoInstalar;
const btnInstalar = $('#btn-instalar');
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); eventoInstalar = e; if (btnInstalar) btnInstalar.hidden = false; });
addEventListener('appinstalled', () => { if (btnInstalar) btnInstalar.hidden = true; });
btnInstalar?.addEventListener('click', async () => { eventoInstalar?.prompt(); await eventoInstalar?.userChoice; if (btnInstalar) btnInstalar.hidden = true; });
const btnCompartir = $('#btn-compartir');
btnCompartir?.addEventListener('click', async () => {
const url = location.href.split('#').at(0);
try {
if (navigator.share) return await navigator.share({ title: document.title, url });
await navigator.clipboard.writeText(url);
const orig = btnCompartir.textContent;
btnCompartir.textContent = '¡Link copiado!';
setTimeout(() => { btnCompartir.textContent = orig; }, 2000);
} catch {}
});