/* ============================================================
   Portafolio — Lisandro Núñez
   ============================================================ */

/* ---------- 1. PROYECTOS (Alutecs Services) ----------
   Cada tarjeta muestra la captura del sitio. No llevan enlace:
   la sección es una muestra de trabajos, no un directorio de enlaces.   */
const proyectos = [
  {
    idx: '01', nombre: 'Tamboril News', cat: 'Periódico digital',
    desc: 'Portal de noticias con gestión de contenidos por secciones, portada editable y optimización SEO para alta concurrencia.',
    img: 'img/proyectos/tamboril-news.png'
  },
  {
    idx: '02', nombre: 'Sernoticia', cat: 'Periódico digital',
    desc: 'Periódico digital con publicación por secciones, contenido multimedia y rendimiento optimizado en móviles.',
    img: 'img/proyectos/sernoticia.jpg'
  },
  {
    idx: '03', nombre: 'Aguajero', cat: 'Periódico digital',
    desc: 'Portal informativo con portada por categorías (actualidad, deportes, economía, tecnología, salud), bloque de lo más leído y espacios publicitarios administrables.',
    img: 'img/proyectos/aguajero.jpg'
  },
  {
    idx: '04', nombre: 'Destino Travel RD', cat: 'Portal de viajes',
    desc: 'Sitio turístico con presentación visual de destinos, paquetes y canales de reserva y contacto.',
    img: 'img/proyectos/destino-travel-rd.jpg'
  },
  {
    idx: '05', nombre: 'Hipermercado La Fuente', cat: 'Retail corporativo',
    desc: 'Plataforma institucional para exhibición de productos, ofertas, sucursales y atención al cliente.',
    img: 'img/proyectos/hipermercado-la-fuente.jpg'
  },
  {
    idx: '06', nombre: 'Inmobiliaria Bolívar Rosa', cat: 'Portal inmobiliario',
    desc: 'Catálogo de propiedades con fichas detalladas, filtros de búsqueda y contacto directo con el agente.',
    img: 'img/proyectos/bolivar-rosa.png'
  },
  {
    idx: '07', nombre: 'Claso Consultores', cat: 'Consultoría corporativa',
    desc: 'Sitio corporativo de una empresa consultora con presencia en Latinoamérica: líneas de servicio, inscripción en línea, solicitud de consultoría y registro de currículum.',
    img: 'img/proyectos/claso-consultores.png'
  },
  {
    idx: '08', nombre: 'NIXAURYS Global Cleaning', cat: 'Servicios corporativos',
    desc: 'Sitio corporativo de servicios de limpieza empresarial con catálogo de servicios y solicitud de cotización.',
    img: 'img/proyectos/nixaurys.jpg'
  },
  {
    idx: '09', nombre: 'Gala Cosmetic S.A.', cat: 'Distribución / cosmética',
    desc: 'Portal comercial para distribución de productos cosméticos, con catálogo por líneas y marcas.',
    img: 'img/proyectos/gala-cosmetic.jpg'
  },
  {
    idx: '10', nombre: 'BJ Rosa & Asociados', cat: 'Corporativo / legal',
    desc: 'Sitio institucional para firma de abogados: áreas de práctica, equipo y canales de contacto formal.',
    img: 'img/proyectos/bj-rosa.png'
  }
];

const grid = document.getElementById('project-grid');
if (grid) {
  grid.innerHTML = proyectos.map((p, i) => `
    <article class="project-card reveal" data-d="${(i % 4) + 1}">
      <div class="project-cover">
        <span class="project-idx">${p.idx}</span>
        <img src="${p.img}" alt="Captura del sitio ${p.nombre}" loading="lazy">
      </div>
      <div class="project-body">
        <span class="project-cat">${p.cat}</span>
        <span class="project-name">${p.nombre}</span>
        <span class="project-desc">${p.desc}</span>
      </div>
    </article>
  `).join('');
}

/* ---------- 2. TEMA CLARO / OSCURO ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || savedTheme === 'light') root.setAttribute('data-theme', savedTheme);

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#070F1D' : '#F4F9FF');
}
setTheme(root.getAttribute('data-theme') || 'light');

themeToggle?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('theme', next);
});

/* ---------- 3. MENÚ MÓVIL ---------- */
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- 4. SCROLL: progreso, nav pegado, enlace activo ---------- */
const nav = document.getElementById('nav');
const scrollBar = document.getElementById('scroll-bar');
const sections = Array.from(document.querySelectorAll('main section[id]'));
const linkMap = new Map();
navLinks?.querySelectorAll('a[href^="#"]').forEach(a => linkMap.set(a.getAttribute('href').slice(1), a));

let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  nav?.classList.toggle('stuck', y > 12);

  let current = '';
  for (const sec of sections) {
    if (sec.offsetTop - 140 <= y) current = sec.id;
  }
  linkMap.forEach((link, id) => link.classList.toggle('active', id === current));
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

/* ---------- 5. APARICIÓN AL HACER SCROLL ---------- */
// Red de seguridad: si el navegador no soporta IntersectionObserver, se muestra todo.
if (!('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

const revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    if (entry.target.classList.contains('stats')) animateCounters(entry.target);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }) : null;

if (revealObserver) document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Garantía: al terminar de cargar, todo lo que ya está a la vista se muestra
// aunque el observador no haya alcanzado a dispararse.
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 1.05) {
      el.classList.add('in');
      if (el.classList.contains('stats')) animateCounters(el);
    }
  });
});

/* ---------- 6. CONTADORES ---------- */
function animateCounters(scope) {
  scope.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    if (!target) return;
    const start = performance.now();
    const dur = 1100;
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  });
}

/* ---------- 7. BRILLO QUE SIGUE AL CURSOR EN LAS TARJETAS ---------- */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ---------- 8. TOAST ---------- */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ---------- 9. CONTACTO: revelar y copiar ---------- */
const btnContacto = document.getElementById('btn-contacto');
const contactInfo = document.getElementById('contact-info');

btnContacto?.addEventListener('click', () => {
  const hidden = contactInfo.classList.toggle('hidden');
  btnContacto.lastChild.textContent = hidden
    ? ' Ver información de contacto'
    : ' Ocultar información de contacto';
  if (!hidden) contactInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const tmp = document.createElement('textarea');
      tmp.value = value;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      tmp.remove();
    }
    showToast('Copiado: ' + value);
  });
});

/* ---------- 10. GENERAR PDF DEL PORTAFOLIO ----------
   El PDF lo dibuja pdf.js con jsPDF (documento vectorial, texto
   seleccionable y saltos de página controlados). No hace falta
   tocar el DOM: el generador lee el contenido tal cual está,
   incluida la información de contacto aunque esté oculta.        */
const pdfButtons = document.querySelectorAll('[data-pdf]');

async function generarPDF() {
  pdfButtons.forEach(b => { b.disabled = true; });
  showToast('Generando PDF...');

  try {
    if (typeof window.generarPortafolioPDF !== 'function') {
      throw new Error('El generador de PDF no está cargado');
    }
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    window.generarPortafolioPDF();
    showToast('PDF descargado');
  } catch (err) {
    console.error('No se pudo generar el PDF:', err);
    // Respaldo: diálogo de impresión del navegador (permite "Guardar como PDF").
    showToast('Usando el diálogo de impresión...');
    const contactoOculto = contactInfo?.classList.contains('hidden');
    contactInfo?.classList.remove('hidden');
    setTimeout(() => {
      window.print();
      if (contactoOculto) contactInfo?.classList.add('hidden');
    }, 400);
  } finally {
    pdfButtons.forEach(b => { b.disabled = false; });
  }
}

pdfButtons.forEach(btn => btn.addEventListener('click', generarPDF));

/* ---------- 11. AÑO EN EL PIE ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
