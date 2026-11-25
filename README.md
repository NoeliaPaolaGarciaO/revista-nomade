# Nómade · Revista Digital Interactiva de Turismo

**Nómade** es una revista digital mensual de viajes en formato libro interactivo (flipbook 3D), pensada para agencias de viajes minoristas, operadores mayoristas y viajeros.

🔗 **Demo en vivo:** [Ver revista online](https://github.io)

---

## Características principales

* **Experiencia de lectura tipo libro (Flipbook 3D):** Navegación fluida arrastrando o haciendo clic en las esquinas inferiores, con teclado (`←` / `→`) o desde el índice interactivo.
* **Personalización Marca Blanca (White-Label):** Cada agencia minorista puede tener su propia edición con su logo, paleta de colores, datos de contacto y salidas destacadas editando un único archivo (`js/agencia.js`).
* **Modo Demo instantáneo por URL:** Permite generar muestras personalizadas en segundos mediante parámetros en el enlace:
  `?agencia=Nombre+Agencia&color=%230E9F6E&wa=5492914000000`
* **Espacio para Operadores Mayoristas:** Secciones dedicadas a isologotipos de operadores aliados y propuestas comerciales con consulta directa al WhatsApp de cada agencia.
* **PWA instalable y lectura sin conexión:** Incluye `manifest.webmanifest` y Service Worker (`sw.js`) para instalar la revista en el celular y consultarla offline durante el viaje.
* **Herramientas prácticas para el viajero:** Guía de documentación, equipaje, frases útiles y *checklist* interactivo con guardado automático en el dispositivo (`localStorage`).

---

## Estructura del proyecto

```text
revista-nomade/
├── index.html             # Estructura editorial de 28 páginas
├── manifest.webmanifest   # Configuración PWA instalable
├── sw.js                  # Service Worker para soporte offline
├── css/
│   └── style.css          # Diseño responsivo, tipografía y libro 3D
├── js/
│   ├── agencia.js         # Configuración de edición, agencia, operadores y modo demo
│   └── app.js             # Motor del flipbook, render dinámico e interacciones
└── img/                   # Recursos visuales, destinos y marca
```

---

## Creado por

**Noelia García** · Travel Tech & Desarrollo Web  
[Instagram](https://instagram.com/soynoelia.garcia) · [Substack](https://substack.com) · [LinkedIn](https://linkedin.com)

---

## Licencia y Copyright

© 2026 **Noelia García** · *Nómade — Revista Digital de Turismo*. Todos los derechos reservados.

El código fuente, la arquitectura visual, el diseño editorial y los activos de marca de **Nómade** son propiedad intelectual de su autora. Queda prohibida su reproducción, distribución comercial o uso en modalidad marca blanca sin autorización expresa o licencia vigente.
