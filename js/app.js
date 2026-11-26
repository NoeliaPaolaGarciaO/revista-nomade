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

  // Pág. 25: Solo logos de operadores aliados
  const operadores = (cfg.operadores ?? []).filter((op) => op?.logo).slice(0, 9);
  const grillaOp = $('#operadores-lista');
  if (!operadores.length) {
    quitar('operadores');
  } else if (grillaOp) {
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

  // Pág. 26: Ofertas de distintos operadores
  const ofertasOp = (cfg.ofertasOperadores ?? []).filter((o) => o?.titulo).slice(0, 3);
  const listaOfertasOp = $('#ofertas-operadores-lista');
  if (!ofertasOp.length) {
    quitar('ofertasOperadores');
  } else if (listaOfertasOp) {
    ofertasOp.forEach((o) =>
      listaOfertasOp.append(tarjeta({ ...o, consulta: o.fecha ? `${o.titulo} (${o.fecha})` : o.titulo }))
    );
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
    const href = dig ? 'https://wa.me' + dig + '?text=' + msg : agencia.email ? 'mailto:' + agencia.email + '?subject=' + encodeURIComponent(asunto) + '&body=' + msg : esUrl(agencia.web) ? agencia.web : redUrl;
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
    const pags = Array.from(this.contenedor.querySelectorAll(':scope > .pagina'));
    if (pags.length % 2) pags.push(h('article', 'pagina pagina--papel pagina--sin-folio'));
    for (let i = 0; i < pags.length; i += 2) {
      const hoja = h('div', 'hoja');
      pags.at(i).classList.add('pagina--frente');
      pags.at(i + 1).classList.add('pagina--dorso');
      hoja.append(pags.at(i), pags.at(i + 1));
      hoja.querySelectorAll('.pagina').forEach((p) => p.append(Object.assign(h('span', 'lomo'), { ariaHidden: 'true' })));
      this.contenedor.append(hoja);
    }
    this.contenedor.classList.add('listo');
    return pags;
  }

  #render(previo, animar) {
    const { contenedor, hojas, total, indice } = this;
    if (!animar) { contenedor.classList.add('sin-animacion'); void contenedor.offsetWidth; }
    const adelante = indice > previo;
    const desde = Math.min(previo, indice), hasta = Math.max(previo, indice);
    const duracion = parseFloat(getComputedStyle(contenedor).getPropertyValue('--duracion-giro')) * 1000;
    const pausa = animar && duracion > 100 ? 70 : 0;

    hojas.forEach((hoja, i) => {
      const gira = animar && i >= desde && i < hasta;
      hoja.style.transitionDelay = gira ? ((adelante ? i - desde : hasta - 1 - i) * pausa) + 'ms' : '';
      hoja.classList.toggle('volteada', i < indice);
      if (gira) hoja.style.zIndex = total + 2 + (adelante ? i : total - i);
    });

    const terminar = () => {
      hojas.forEach((hoja, i) => { hoja.style.zIndex = i < this.indice ? i + 1 : total - i; });
      this.ocupado = false;
      if (this.pendiente !== null) { const n = this.pendiente; this.pendiente = null; this.ir(n); }
    };

    const espera = animar ? duracion + (hasta - desde) * pausa + 50 : 0;
    clearTimeout(this.temporizador);
    this.ocupado = espera > 0;
    espera > 0 ? (this.temporizador = setTimeout(terminar, espera)) : terminar();
    if (!animar) requestAnimationFrame(() => requestAnimationFrame(() => contenedor.classList.remove('sin-animacion')));

    contenedor.dataset.estado = indice === 0 ? 'portada' : indice === total ? 'contratapa' : 'doble';
    this.paginas.forEach((p) => { p.inert = p !== this.izq && p !== this.der; });
    this.onCambio(this);
  }
}

const contenedorFlipbook = $('#flipbook');
if (contenedorFlipbook) {
  // Si es enlace Demo (?agencia=...), reemplaza las páginas reales por la galería protegida de muestra
  if (window.NOMADE_CONFIG?.esDemo) {
    const cfg = window.NOMADE_CONFIG;
    const nombreAg = cfg.agencia?.nombre || 'Tu Agencia';
    const wa = (cfg.whatsappVentas || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Hola Noelia, probé la demo de Nómade para ${nombreAg} y quiero activar nuestra edición.`);
    const linkWa = wa ? 'https://wa.me' + wa + '?text=' + msg : 'https://instagram.com';

    Array.from(contenedorFlipbook.querySelectorAll(':scope > .pagina:not(#portada)')).forEach((p) => p.remove());

    const paginasDemo = [
      `<article class="pagina pagina--papel pagina--arriba pagina--demo-muestra" data-etiqueta="Vista previa · Destinos" data-marca="MUESTRA · ${nombreAg}">
        <span class="etiqueta">Vista previa · Contenido editorial</span>
        <h2 class="titulo">Destinos y <em>experiencias</em></h2>
        <div class="demo-captura">
          <img src="img/card-estambul.jpg" alt="Vista previa destinos">
          <div class="demo-captura-pie"><strong>Guías visuales de cada destino</strong><span>Inspiración, gastronomía y consejos prácticos listos para tus pasajeros.</span></div>
        </div>
      </article>`,

      `<article class="pagina pagina--papel-alt pagina--arriba pagina--demo-muestra" data-etiqueta="Vista previa · Ofertas" data-marca="MUESTRA · ${nombreAg}">
        <span class="etiqueta">Vista previa · Ventas directas</span>
        <h2 class="titulo">Tus salidas y <em>operadores</em></h2>
        <div class="demo-captura">
          <img src="img/destinos/card-rio.jpg" alt="Vista previa salidas">
          <div class="demo-captura-pie"><strong>Botón «Consultar» a tu WhatsApp</strong><span>Cada propuesta lleva al pasajero directo a tu chat con el viaje precargado.</span></div>
        </div>
      </article>`,

      `<article class="pagina pagina--papel pagina--arriba pagina--demo-muestra" data-etiqueta="Vista previa · Guía" data-marca="MUESTRA · ${nombreAg}">
        <span class="etiqueta">Vista previa · Valor agregado</span>
        <h2 class="titulo">Guía y <em>checklist</em></h2>
        <div class="demo-captura">
          <img src="img/hero-patagonia.avif" alt="Vista previa guía">
          <div class="demo-captura-pie"><strong>App instalable en el celular</strong><span>Tus clientes guardan la revista con el logo de ${nombreAg} en su teléfono.</span></div>
        </div>
      </article>`,

      `<article class="pagina pagina--primaria pagina--centrada" data-etiqueta="Activar edición">
        <span class="etiqueta">Muestra para ${nombreAg}</span>
        <h2 class="titulo">¿Te gustó cómo luce <em>tu revista</em>?</h2>
        <p class="texto">Activá tu suscripción mensual y recibí la edición completa de 28 páginas con tu logo, tus colores, tus salidas y tu contacto listo para enviar por WhatsApp.</p>
        <a class="boton" href="${linkWa}" target="_blank" rel="noopener noreferrer">Activar edición de ${nombreAg}</a>
      </article>`,

      `<article class="pagina pagina--contratapa pagina--centrada pagina--oscura pagina--sin-folio" data-etiqueta="Contacto">
        <span class="etiqueta">Nómade · Revista Digital de Turismo</span>
        <h2 class="titulo">Tu agencia, <em>siempre presente</em></h2>
        <p class="texto">Consultá planes mensuales y anuales para agencias de viajes.</p>
        <a class="boton" href="${linkWa}" target="_blank" rel="noopener noreferrer">Hablar con Noelia García</a>
        <p class="credito">© 2026 Nómade por Noelia García · Edición de muestra</p>
      </article>`
    ];

    contenedorFlipbook.insertAdjacentHTML('beforeend', paginasDemo.join(''));
  }

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

/* ───────── 4. CHECKLIST, FOTOS ROTAS Y PWA ───────── */
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