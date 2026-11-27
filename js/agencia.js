// =============================================
// NÓMADE · js/agencia.js
// =============================================

window.NOMADE_CONFIG = {
  revista: {
    nombre: 'Nómade',
    descriptor: 'Revista digital de turismo',
    edicion: 'Octubre 2026',
    logo: 'img/logo.png',
    agenciaTapa: 'Horizonte Viajes',
    destinoDelMes: {
      nombre: 'Estambul',
      foto: 'img/card-estambul.jpg'
    }
  },

  agencia: {
    nombre: 'Noelia García',
    rotulo: 'Revista creada por',
    lema: 'Travel Tech · Agente de viajes',
    sobreNosotros: '',
    logo: 'img/logo.png',
    logoFondo: 'claro',
    telefono: '',
    whatsapp: '+54 9 291 432-7563',
    email: '',
    web: '',
    direccion: '',
    horario: '',
    redes: [
      { nombre: 'Instagram', url: 'https://instagram.com' },
      { nombre: 'LinkedIn', url: 'https://linkedin.com' },
      { nombre: 'Substack', url: 'https://substack.com' }
    ]
  },

  tema: {
    '--color-primario': '#1b2349',
    '--color-acento': '#6366f1',
    '--color-secundario': '#9ae6d4'
  },

  // Pág. 25 · Operadores aliados (guardá sus logos en img/operadores/)
  operadores: [
    // Ejemplo:
    // { nombre: 'Ola Mayorista', logo: 'img/operadores/ola.png', web: 'https://ola.com.ar' }
  ],

  // Pág. 26 · Propuestas de operadores mayoristas
  ofertasOperadores: [
    {
      foto: 'img/destinos/card-rio.jpg',
      pais: 'Brasil · Salida grupal',
      titulo: 'Río de Janeiro All Inclusive',
      texto: '7 noches con aéreos, traslados y asistencia médica incluida.',
      fecha: 'Consultar fechas'
    },
    {
      foto: 'img/destinos/card-italia.jpg',
      pais: 'Europa · Circuito',
      titulo: 'Italia y Costa Amalfitana',
      texto: '12 días recorriendo Roma, Florencia, Venecia y Sorrento.',
      fecha: 'Salidas acompañadas'
    }
  ],

  // Pág. 27 · Salidas propias de la agencia
  salidas: [
    {
      foto: 'img/salidas/punta-cana.jpeg',
      pais: 'Caribe',
      titulo: 'Punta Cana Resort 5★',
      texto: 'Todo incluido frente al mar con vuelos directos y traslados.',
      fecha: 'Cupos limitados'
    }
  ],

  // Pág. 16 · Testimonios de viajeros
  viajeros: [
    {
      foto: 'img/viajero-ana.avif',
      destino: 'Estambul, Turquía',
      nombre: 'Ana Morales',
      frase: '«Tener la guía y las frases útiles en el celular nos salvó en cada traslado.»'
    },
    {
      foto: 'img/viajero-marcos.avif',
      destino: 'Kioto, Japón',
      nombre: 'Marcos Silva',
      frase: '«La organización y los consejos previos hicieron que disfrutemos sin estrés.»'
    }
  ],

  // Contratapa · Tus planes de suscripción para agencias (se ocultan en los links de clientes)
  venta: {
    titulo: '¿Querés esta revista con la marca de tu agencia?',
    texto: 'Personalizamos portada, contratapa y consultas directas a tu WhatsApp.',
    planes: [
      { nombre: 'Plan mensual', texto: 'Edición renovada cada mes con tu marca', precio: '' },
      { nombre: 'Plan anual', texto: '12 ediciones personalizadas + prioridad', precio: '' }
    ]
  }
};

/* ── Clientes Suscriptos (?c=alias-agencia) ── */
(() => {
  const CLIENTES = {
    'viajes-bahia': {
      nombre: 'Viajes Bahía',
      rotulo: 'Tu agencia de viajes',
      lema: 'Viajá con asesoramiento personalizado',
      logo: 'img/clientes/viajes-bahia.png',
      whatsapp: '+54 9 291 400-0000',
      email: 'info@viajesbahia.com',
      colorPrimario: '#0E9F6E',
      colorAcento: '#10B981',
      redes: [
        { nombre: 'Instagram', url: 'https://instagram.com' }
      ]
    }
    // Para sumar otra agencia: poné coma después de } arriba y copiá este mismo bloque
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
  delete cfg.venta;
})();