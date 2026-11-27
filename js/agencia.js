/* NÓMADE · config/agencia.js — el ÚNICO archivo que una agencia edita.
   Un dato vacío ('') no se muestra. "Salidas" y "viajeros" aparecen solo si tienen datos.
   Esta carpeta "config" tiene que estar junto a index.html.

   EDICIÓN ACTUAL: la que publicás como @soynoelia.garcia (sin ofertas de destinos).
   Cuando una agencia contrate la revista: cambiá "agencia" por sus datos, borrá "venta"
   y cargá sus "salidas". La contratapa pasa a mostrar el contacto de esa agencia. */

/* NÓMADE · js/agencia.js — configuración de la edición, agencia, operadores y modo demo */

window.NOMADE_CONFIG = {
  revista: {
    nombre: 'Nómade',
    descriptor: 'Revista digital de turismo',
    edicion: 'Diciembre 2026',
    destinoDelMes: {
      nombre: 'Estambul',
      foto: 'img/card-estambul.jpg'
    },
    selloTapa: 'img/marca/nomade-icono.svg',
    agenciaTapa: 'Horizonte Viajes'
  },

  agencia: {
    nombre: 'Noelia García',
    rotulo: 'Revista creada por',
    lema: 'Travel Tech · Agente de viajes',
    logo: 'img/logo.png',
    logoFondo: 'claro',
    sobreNosotros: '',
    telefono: '',
    whatsapp: '',
    email: '',
    web: '',
    direccion: '',
    horario: '',
    redes: [
      { nombre: '@soynoelia.garcia', url: 'https://instagram.com/soynoelia.garcia' },
      { nombre: 'Substack', url: 'https://substack.com/@noepgarcia' },
      { nombre: 'LinkedIn', url: 'https://www.linkedin.com/in/noeliapgarcia/' }
    ]
  },

  venta: {
    titulo: '¿Tenés una agencia de viajes?',
    texto: 'Sumá tu propia revista Nómade, con tu logo, tus colores y tus datos de contacto.',
    planes: [
      { nombre: 'Plan mensual', texto: 'Una edición por mes.' },
      { nombre: 'Plan anual', texto: 'Las 12 ediciones del año.' }
    ]
  },

   // Pág. 27: Oferta o salida destacada de la agencia minorista (si está vacío, se ve el cierre editorial)
  salidas: [
    { foto: 'img/destinos/card-rio.jpg', pais: 'Salida grupal', titulo: 'Río de Janeiro All Inclusive', texto: '7 noches frente al mar con asistencia al viajero incluida.', fecha: 'Consultar tarifa' }
  ],

  viajeros: [],

  // Pág. 25: Logos de operadores aliados
  operadores: [
    { nombre: 'Aventura Sur Mayorista', logo: 'img/marca/nomade-icono.svg', web: 'https://instagram.com/soynoelia.garcia' },
    { nombre: 'Horizonte Operador', logo: 'img/logo.png', web: 'https://substack.com/@noepgarcia' },
    { nombre: 'Rutas del Mundo', logo: 'img/marca/nomade-icono.svg', web: 'https://www.linkedin.com/in/noeliapgarcia/' }
  ],

  // Pág. 26: Ofertas de distintos operadores
  ofertasOperadores: [
    { foto: 'img/card-estambul.jpg', pais: 'Aventura Sur', titulo: 'Estambul & Capadocia', texto: '10 noches con aéreos, traslados y excursiones.', fecha: 'Salidas Oct/Nov' },
    { foto: 'img/destinos/card-italia.jpg', pais: 'Horizonte Operador', titulo: 'Italia Clásica', texto: 'Roma, Florencia y Venecia con guía en español.', fecha: 'Cupos confirmados' }
  ],

  tema: {}
};

/* ── Modo Demo por URL (?agencia=Nombre&color=%230E9F6E&wa=5491112345678) ── */
(() => {
  const params = new URLSearchParams(location.search);
  const cfg = window.NOMADE_CONFIG;
  if (!cfg) return;

  if (params.get('agencia')) {
    cfg.esDemo = true;
    cfg.whatsappVentas = '5492914327563'; // <-- Poné acá TU WhatsApp real
    cfg.agencia.nombre = params.get('agencia');
    cfg.revista.agenciaTapa = params.get('agencia');
    cfg.agencia.rotulo = 'Tu agencia de viajes';
    cfg.agencia.lema = 'Edición personalizada de muestra';
    cfg.agencia.logo = '';
    cfg.agencia.redes = [];
    delete cfg.venta;
  }

  if (params.get('color')) {
    cfg.tema['--color-primario'] = params.get('color');
  }
  if (params.get('acento')) {
    cfg.tema['--color-acento'] = params.get('acento');
  }
  if (params.get('wa')) {
    cfg.agencia.whatsapp = params.get('wa');
  }
})();

/* ── Clientes Suscriptos (?c=alias-agencia) ── */
(() => {
  const CLIENTES = {
    'viajes-bahia': {
      nombre: 'Viajes Bahía',
      rotulo: 'Tu agencia de viajes',
      lema: 'Viajá con asesoramiento personalizado',
      logo: 'img/clientes/viajes-bahia.png', // Guardá acá su logo PNG
      whatsapp: '+54 9 291 400-0000',
      email: 'info@viajesbahia.com',
      colorPrimario: '#0E9F6E',
      colorAcento: '#10B981',
      redes: [
        { red: 'Instagram', usuario: '@viajesbahia', url: 'https://instagram.com' }
      ]
    }
    // Cuando contrate otra agencia, copiás este bloque con coma arriba y cambiás los datos
  };

  const id = new URLSearchParams(location.search).get('c');
  const cliente = id && CLIENTES[id.toLowerCase()];
  const cfg = window.NOMADE_CONFIG;
  if (!cliente || !cfg) return;

  cfg.agencia.nombre = cliente.nombre;
  cfg.revista.agenciaTapa = cliente.nombre;
  cfg.agencia.rotulo = cliente.rotulo || 'Tu agencia de viajes';
  cfg.agencia.lema = cliente.lema || '';
  cfg.agencia.logo = cliente.logo || '';
  cfg.agencia.whatsapp = cliente.whatsapp || '';
  cfg.agencia.email = cliente.email || '';
  cfg.agencia.redes = cliente.redes || [];
  if (cliente.colorPrimario) cfg.tema['--color-primario'] = cliente.colorPrimario;
  if (cliente.colorAcento) cfg.tema['--color-acento'] = cliente.colorAcento;
  delete cfg.venta; // Oculta tus planes de suscripción en la edición del cliente
})();