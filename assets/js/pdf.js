/* ============================================================
   Generación del PDF del portafolio — jsPDF vectorial
   ------------------------------------------------------------
   No se usa html2canvas: el PDF se dibuja como documento real,
   con texto seleccionable, enlaces activos y control exacto de
   los saltos de página (ningún bloque se parte por la mitad).
   El contenido se lee del propio DOM, así el PDF nunca se
   desactualiza respecto al sitio.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Geometría de la página (A4, milímetros) ---------- */
  const ANCHO_PAG = 210;
  const ML = 15;                       // margen izquierdo
  const ANCHO = ANCHO_PAG - ML * 2;    // ancho útil = 180
  const Y_INICIO = 18;                 // inicio del contenido en páginas nuevas
  const Y_TOPE = 274;                  // último milímetro utilizable (antes del pie)

  /* ---------- Color (mismo sistema del sitio) ---------- */
  const INK = [15, 30, 51];
  const INK2 = [78, 97, 128];
  const INK3 = [129, 149, 175];
  const ACC = [11, 127, 184];
  const ACC_SUAVE = [232, 245, 253];
  const LINEA = [216, 228, 242];
  const BLANCO = [255, 255, 255];
  const GRAD = [[30, 159, 220], [91, 141, 240], [63, 198, 206]];
  const NAVY = [[13, 33, 58], [18, 52, 88], [15, 42, 74]];   // franja de cabecera
  const NAVY_TXT = [201, 221, 240];
  const NAVY_SUB = [143, 205, 240];

  const F = 'helvetica';

  let doc, y;

  // Alias del arreglo declarado en script.js (const de ámbito global de script).
  const proyectosDelSitio = (typeof proyectos !== 'undefined') ? proyectos : null;

  /* ---------- Utilidades ---------- */

  // jsPDF usa la codificación WinAnsi: se normaliza lo que queda fuera.
  function limpiar(t) {
    return String(t || '')
      .replace(/\s+/g, ' ')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/→/g, '->')
      .replace(/[✓✔ ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const txt = el => limpiar(el ? el.textContent : '');
  const uno = sel => document.querySelector(sel);
  const todos = sel => Array.from(document.querySelectorAll(sel));

  const relleno = c => doc.setFillColor(c[0], c[1], c[2]);
  const tinta = c => doc.setTextColor(c[0], c[1], c[2]);
  const trazo = c => doc.setDrawColor(c[0], c[1], c[2]);

  const alturaLinea = tam => tam * 0.3528 * 1.34;

  function lineas(texto, ancho, tam, estilo) {
    doc.setFont(F, estilo || 'normal');
    doc.setFontSize(tam);
    return doc.splitTextToSize(limpiar(texto), ancho);
  }

  // Altura que ocupará un texto sin llegar a dibujarlo (para medir bloques).
  function medir(texto, ancho, tam, estilo) {
    return lineas(texto, ancho, tam, estilo).length * alturaLinea(tam);
  }

  function nuevaPagina() {
    doc.addPage();
    y = Y_INICIO;
  }

  // Reserva vertical: si el bloque no cabe entero, empieza en la página siguiente.
  function asegurar(alto) {
    if (y + alto > Y_TOPE) nuevaPagina();
  }

  /* ---------- Bloques de dibujo ---------- */

  function parrafo(texto, op) {
    op = op || {};
    const tam = op.tam || 9.5;
    const estilo = op.estilo || 'normal';
    const x = op.x || ML;
    const ancho = op.ancho || ANCHO;
    const color = op.color || INK2;
    const ls = lineas(texto, ancho, tam, estilo);
    const h = alturaLinea(tam);

    tinta(color);
    doc.setFont(F, estilo);
    doc.setFontSize(tam);

    // Un párrafo largo sí puede continuar en la página siguiente,
    // pero siempre entre líneas completas, nunca cortando una.
    for (const linea of ls) {
      asegurar(h);
      doc.text(linea, x, y + h * 0.75);
      y += h;
    }
    y += op.despues === undefined ? 2.4 : op.despues;
  }

  function vineta(texto, op) {
    op = op || {};
    const x = op.x || ML;
    const ancho = (op.ancho || ANCHO) - 5;
    const tam = op.tam || 9;
    const ls = lineas(texto, ancho, tam, 'normal');
    const h = alturaLinea(tam);

    asegurar(ls.length * h);
    relleno(op.color || ACC);
    doc.circle(x + 1.3, y + h * 0.52, 0.75, 'F');

    tinta(op.tinta || INK2);
    doc.setFont(F, 'normal');
    doc.setFontSize(tam);
    ls.forEach((linea, i) => {
      doc.text(linea, x + 5, y + h * 0.75);
      y += h;
      if (i < ls.length - 1) asegurar(h);
    });
    y += 1;
  }

  function seccion(numero, titulo, reserva) {
    // El título viaja siempre con el primer bloque de su sección.
    asegurar(26 + (reserva || 0));
    y += 3;
    relleno(ACC_SUAVE);
    doc.roundedRect(ML, y, 10, 6.4, 1.6, 1.6, 'F');
    tinta(ACC);
    doc.setFont(F, 'bold');
    doc.setFontSize(8);
    doc.text(numero, ML + 5, y + 4.4, { align: 'center' });

    tinta(INK);
    doc.setFontSize(14.5);
    doc.text(limpiar(titulo), ML + 14, y + 5);
    y += 9.5;

    trazo(LINEA);
    doc.setLineWidth(0.3);
    doc.line(ML, y, ML + ANCHO, y);
    y += 5;
  }

  function filasEtiquetas(items, ancho) {
    doc.setFont(F, 'normal');
    doc.setFontSize(7.6);
    let filas = 1, x = 0;
    items.forEach(item => {
      const w = doc.getTextWidth(limpiar(item)) + 5;
      if (x + w > ancho) { filas++; x = 0; }
      x += w + 1.8;
    });
    return filas;
  }

  function etiquetas(items, op) {
    op = op || {};
    const x0 = op.x || ML;
    const ancho = op.ancho || ANCHO;
    const tam = 7.6;
    const altoCaja = 4.8;
    doc.setFont(F, 'normal');
    doc.setFontSize(tam);

    let x = x0;
    asegurar(altoCaja + 2);
    items.forEach(item => {
      const t = limpiar(item);
      const w = doc.getTextWidth(t) + 5;
      if (x + w > x0 + ancho) {
        x = x0;
        y += altoCaja + 1.6;
        asegurar(altoCaja);
      }
      relleno(ACC_SUAVE);
      doc.roundedRect(x, y, w, altoCaja, 1.4, 1.4, 'F');
      tinta(ACC);
      doc.text(t, x + 2.5, y + 3.35);
      x += w + 1.8;
    });
    y += altoCaja + (op.despues === undefined ? 3 : op.despues);
  }

  /* ---------- Portada / encabezado ---------- */

  function encabezado() {
    const alto = 46;
    const pasos = 90;

    // Franja azul marino con un degradado muy sutil.
    for (let i = 0; i < pasos; i++) {
      const t = i / (pasos - 1);
      const c = t < 0.5
        ? mezcla(NAVY[0], NAVY[1], t * 2)
        : mezcla(NAVY[1], NAVY[2], (t - 0.5) * 2);
      relleno(c);
      doc.rect((ANCHO_PAG / pasos) * i, 0, ANCHO_PAG / pasos + 0.4, alto, 'F');
    }

    // Línea de acento azul cielo al pie de la franja.
    for (let i = 0; i < pasos; i++) {
      const t = i / (pasos - 1);
      const c = t < 0.5
        ? mezcla(GRAD[0], GRAD[1], t * 2)
        : mezcla(GRAD[1], GRAD[2], (t - 0.5) * 2);
      relleno(c);
      doc.rect((ANCHO_PAG / pasos) * i, alto - 1.8, ANCHO_PAG / pasos + 0.4, 1.8, 'F');
    }

    // Foto de perfil, con marco blanco. Si no cargó, el texto ocupa todo el ancho.
    const anchoFoto = 23.5, altoFoto = 29.5;
    const xFoto = ANCHO_PAG - ML - anchoFoto;
    let anchoTexto = ANCHO;
    try {
      const img = document.querySelector('.hero-photo img');
      if (img && img.complete && img.naturalWidth) {
        relleno(BLANCO);
        trazo([120, 160, 200]);
        doc.setLineWidth(0.3);
        doc.rect(xFoto - 1.3, 6.7, anchoFoto + 2.6, altoFoto + 2.6, 'FD');
        doc.addImage(img, 'JPEG', xFoto, 8, anchoFoto, altoFoto, 'foto', 'MEDIUM');
        anchoTexto = xFoto - ML - 8;
      }
    } catch (e) {
      console.warn('No se pudo incrustar la foto en el PDF:', e);
    }

    tinta(BLANCO);
    doc.setFont(F, 'bold');
    doc.setFontSize(20);
    doc.text('Lisandro Antonio Núñez Marte', ML, 19);

    tinta(NAVY_SUB);
    doc.setFont(F, 'normal');
    doc.setFontSize(10.2);
    doc.text('Desarrollador Full-Stack & System Administrator', ML, 26.5);

    const c = datosContacto();
    const linea1 = [c['teléfono'] || '+1 (809) 660-3229',
                    c['correo'] || 'lisandronunez@alutecs.com'].join('  ·  ');
    const linea2 = [c['ubicación'] || 'Santiago, República Dominicana',
                    c['web'] || 'edfactura.com · alutecs.com',
                    'Actualmente en Teksoft'].join('  ·  ');
    tinta(NAVY_TXT);
    ajustado(linea1, ML, 34.6, 8.2, anchoTexto);
    ajustado(linea2, ML, 39.6, 8.2, anchoTexto);

    y = alto + 10;
  }

  function datosContacto() {
    const m = {};
    todos('#contact-info .contact-list li').forEach(li => {
      const k = txt(li.querySelector('.ci-k')).toLowerCase();
      if (k) m[k] = txt(li.querySelector('.ci-v'));
    });
    return m;
  }

  // Escribe una línea reduciendo el cuerpo si no cabe en el ancho útil.
  function ajustado(texto, x, yy, tam, anchoMax) {
    const t = limpiar(texto);
    const limite = anchoMax || ANCHO;
    doc.setFont(F, 'normal');
    let s = tam;
    doc.setFontSize(s);
    while (doc.getTextWidth(t) > limite && s > 5.5) {
      s -= 0.2;
      doc.setFontSize(s);
    }
    doc.text(t, x, yy);
  }

  function mezcla(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }

  function pies() {
    const total = doc.internal.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      trazo(LINEA);
      doc.setLineWidth(0.3);
      doc.line(ML, 283, ML + ANCHO, 283);
      doc.setFont(F, 'normal');
      doc.setFontSize(7.6);
      tinta(INK3);
      doc.text('Lisandro Núñez — Portafolio de desarrollo', ML, 288);
      doc.text('Página ' + p + ' de ' + total, ML + ANCHO, 288, { align: 'right' });
    }
  }

  /* ---------- Contenido leído del sitio ---------- */

  function perfil() {
    seccion('01', 'Perfil profesional');
    todos('#inicio .lede').forEach(p => parrafo(txt(p), { tam: 9.8 }));
    const nota = uno('.about-note');
    if (nota) {
      y += 1;
      const alto = medir(txt(nota), ANCHO - 10, 9) + 8;
      asegurar(alto);
      relleno([247, 251, 255]);
      doc.roundedRect(ML, y, ANCHO, alto, 2, 2, 'F');
      relleno(ACC);
      doc.rect(ML, y, 1.4, alto, 'F');
      const guardar = y;
      y += 4;
      parrafo(txt(nota), { x: ML + 6, ancho: ANCHO - 10, tam: 9, despues: 0 });
      y = guardar + alto + 3;
    }
  }

  function fortalezas() {
    const tarjetas = todos('.about-grid .card');
    if (!tarjetas.length) return;

    const altoDe = t => 11 +
      medir(txt(t.querySelector('p')), ANCHO - 12, 9) +
      Array.from(t.querySelectorAll('.mini-list li'))
        .reduce((s, li) => s + medir(txt(li), ANCHO - 20, 8.6) + 1.6, 0) + 3;

    seccion('02', 'Fortalezas diferenciales', altoDe(tarjetas[0]));

    tarjetas.forEach(tarjeta => {
      const titulo = txt(tarjeta.querySelector('h3'));
      const cuerpo = txt(tarjeta.querySelector('p'));
      const puntos = Array.from(tarjeta.querySelectorAll('.mini-list li')).map(txt);

      // Se mide la tarjeta completa antes de dibujarla: o entra entera, o pasa de página.
      const alto = altoDe(tarjeta);
      asegurar(alto + 2);

      const inicio = y;
      trazo(LINEA);
      doc.setLineWidth(0.3);
      relleno([252, 253, 255]);
      doc.roundedRect(ML, inicio, ANCHO, alto, 2.5, 2.5, 'FD');
      relleno(ACC);
      doc.roundedRect(ML, inicio, ANCHO, 1.2, 0.6, 0.6, 'F');

      y = inicio + 6;
      tinta(INK);
      doc.setFont(F, 'bold');
      doc.setFontSize(10.5);
      doc.text(titulo, ML + 6, y);
      y += 4;
      parrafo(cuerpo, { x: ML + 6, ancho: ANCHO - 12, tam: 9, despues: 1.5 });
      puntos.forEach(p => vineta(p, { x: ML + 6, ancho: ANCHO - 12, tam: 8.6 }));
      y = inicio + alto + 4;
    });
  }

  function stack() {
    const grupos = todos('.stack-card');
    if (!grupos.length) return;

    const altoGrupo = g => 5.4 + medir(
      Array.from(g.querySelectorAll('.chips li')).map(txt).join('  ·  '), ANCHO - 4, 9) + 3.4;
    seccion('03', 'Stack tecnológico', altoGrupo(grupos[0]));

    grupos.forEach(g => {
      const titulo = txt(g.querySelector('h3'));
      const items = Array.from(g.querySelectorAll('.chips li')).map(txt);
      const cuerpo = items.join('  ·  ');
      asegurar(altoGrupo(g) + 1);

      tinta(ACC);
      doc.setFont(F, 'bold');
      doc.setFontSize(9.6);
      doc.text(titulo, ML, y + 3.4);
      y += 5.4;
      parrafo(cuerpo, { x: ML + 3, ancho: ANCHO - 3, tam: 9, despues: 3.4 });
    });
  }

  function edfactura() {
    const sec = uno('#edfactura');
    if (!sec) return;

    const intro = txt(sec.querySelector('.featured-copy > p'));
    const puntos = Array.from(sec.querySelectorAll('.feature-list li')).map(txt);
    const tags = Array.from(sec.querySelectorAll('.chips-solid li')).map(txt);

    const alto = 14 + medir(intro, ANCHO - 12, 9.3) +
      puntos.reduce((s, p) => s + medir(p, ANCHO - 20, 8.8) + 1.6, 0) + 3;

    seccion('04', 'Proyecto destacado — EdFactura', alto);
    asegurar(alto);

    const inicio = y;
    trazo([180, 214, 240]);
    doc.setLineWidth(0.4);
    relleno([248, 252, 255]);
    doc.roundedRect(ML, inicio, ANCHO, alto, 3, 3, 'FD');

    y = inicio + 7;
    tinta(INK);
    doc.setFont(F, 'bold');
    doc.setFontSize(13);
    doc.text('EdFactura', ML + 6, y);

    doc.setFont(F, 'normal');
    doc.setFontSize(8.4);
    tinta(ACC);
    doc.textWithLink('edfactura.com', ML + 6 + doc.getTextWidth('EdFactura ') + 10, y, { url: 'https://edfactura.com' });

    tinta(INK3);
    doc.setFontSize(7.4);
    doc.text('PRODUCTO PROPIO · EN PRODUCCIÓN', ML + ANCHO - 6, y, { align: 'right' });

    y += 5;
    parrafo(intro, { x: ML + 6, ancho: ANCHO - 12, tam: 9.3, despues: 2 });
    puntos.forEach(p => vineta(p, { x: ML + 6, ancho: ANCHO - 12, tam: 8.8 }));
    y = inicio + alto + 4;

    if (tags.length) etiquetas(tags);
  }

  function sistemas() {
    const tarjetas = todos('.system-card');
    if (!tarjetas.length) return;

    const ANCHO_IMG = 62;
    const anchoTexto = ANCHO - 12 - ANCHO_IMG - 6;

    // Alto de la captura respetando su proporción real.
    const altoImagen = t => {
      const im = t.querySelector('.shot img');
      if (!im || !im.complete || !im.naturalWidth) return 0;
      return ANCHO_IMG * (im.naturalHeight / im.naturalWidth);
    };

    const altoDe = t => Math.max(
      13 + medir(txt(t.querySelector('p')), anchoTexto, 9) +
        Array.from(t.querySelectorAll('.mini-list li'))
          .reduce((a, li) => a + medir(txt(li), anchoTexto - 8, 8.6) + 1.6, 0) +
        filasEtiquetas(Array.from(t.querySelectorAll('.chips li')).map(txt), anchoTexto) * 6.4 + 3,
      altoImagen(t) + 14
    );

    seccion('05', 'Sistemas y aplicaciones', altoDe(tarjetas[0]));

    tarjetas.forEach(tarjeta => {
      const tipo = txt(tarjeta.querySelector('.kind'));
      const titulo = txt(tarjeta.querySelector('h3'));
      const cuerpo = txt(tarjeta.querySelector('p'));
      const puntos = Array.from(tarjeta.querySelectorAll('.mini-list li')).map(txt);
      const tags = Array.from(tarjeta.querySelectorAll('.chips li')).map(txt);

      const alto = altoDe(tarjeta);
      asegurar(alto + 4);

      const inicio = y;
      trazo(LINEA);
      doc.setLineWidth(0.3);
      relleno([252, 253, 255]);
      doc.roundedRect(ML, inicio, ANCHO, alto, 2.5, 2.5, 'FD');
      relleno(ACC);
      doc.rect(ML, inicio + 2.5, 1.3, alto - 5, 'F');

      // Captura de la aplicación
      const hImg = altoImagen(tarjeta);
      if (hImg) {
        try {
          const xImg = ML + ANCHO - 6 - ANCHO_IMG;
          trazo([205, 220, 238]);
          doc.setLineWidth(0.3);
          doc.rect(xImg, inicio + 7, ANCHO_IMG, hImg, 'D');
          doc.addImage(tarjeta.querySelector('.shot img'), 'JPEG',
            xImg, inicio + 7, ANCHO_IMG, hImg, titulo, 'MEDIUM');
        } catch (e) {
          console.warn('No se pudo incrustar la captura de ' + titulo + ':', e);
        }
      }

      y = inicio + 7;
      tinta(INK);
      doc.setFont(F, 'bold');
      doc.setFontSize(12);
      doc.text(titulo, ML + 6, y);
      tinta(INK3);
      doc.setFont(F, 'normal');
      doc.setFontSize(7.4);
      doc.text(tipo.toUpperCase(), ML + 6, y + 4);

      y += 8.4;
      parrafo(cuerpo, { x: ML + 6, ancho: anchoTexto, tam: 9, despues: 1.5 });
      puntos.forEach(pt => vineta(pt, { x: ML + 6, ancho: anchoTexto, tam: 8.6 }));
      y += 1;
      if (tags.length) etiquetas(tags, { x: ML + 6, ancho: anchoTexto, despues: 0 });
      y = inicio + alto + 5;
    });
  }

  // Ojo con el nombre: no debe coincidir con el arreglo global `proyectos`
  // de script.js, o lo tapa dentro de este ámbito.
  function seccionProyectos() {
    const lista = (typeof proyectosDelSitio !== 'undefined' && Array.isArray(proyectosDelSitio))
      ? proyectosDelSitio : null;
    const datos = (lista && lista.length) ? lista : todos('.project-card').map(a => ({
      idx: txt(a.querySelector('.project-idx')),
      nombre: txt(a.querySelector('.project-name')),
      cat: txt(a.querySelector('.project-cat')),
      desc: txt(a.querySelector('.project-desc'))
    }));
    if (!datos.length) return;

    const altoProyecto = p => 5.4 + medir(limpiar(p.desc), ANCHO - 12, 8.8) + 1.6;
    seccion('06', 'Portales y desarrollos corporativos', 8 + altoProyecto(datos[0]));
    parrafo('Sitios desarrollados a través de Alutecs Services, mi estudio de diseño y desarrollo web.',
      { tam: 9, color: INK3, despues: 3 });

    datos.forEach(p => {
      const desc = limpiar(p.desc);
      const alto = altoProyecto(p);
      asegurar(alto + 3);   // cada proyecto entra completo o pasa de página

      const inicio = y;
      relleno(ACC);
      doc.rect(ML, inicio + 0.6, 1.1, alto - 2, 'F');

      tinta(INK);
      doc.setFont(F, 'bold');
      doc.setFontSize(10);
      doc.text(limpiar(p.nombre), ML + 5, inicio + 4);

      tinta(INK3);
      doc.setFont(F, 'normal');
      doc.setFontSize(7.6);
      doc.text(limpiar(p.cat).toUpperCase(), ML + ANCHO, inicio + 4, { align: 'right' });

      y = inicio + 6.2;
      parrafo(desc, { x: ML + 5, ancho: ANCHO - 10, tam: 8.8, despues: 0 });
      y = inicio + alto + 3;
    });
  }

  function experiencia() {
    const items = todos('.tl-item');
    if (!items.length) return;

    const altoItem = it => 15.4 + medir(txt(it.querySelector('p')), ANCHO - 12, 8.8);
    seccion('07', 'Experiencia profesional', altoItem(items[0]));

    items.forEach(item => {
      const cuando = txt(item.querySelector('.tl-when'));
      const rol = txt(item.querySelector('h3'));
      const orgEl = item.querySelector('h4');
      const org = limpiar(orgEl ? orgEl.childNodes[0].textContent : '');
      const etiqueta = txt(item.querySelector('.tl-tag'));
      const desc = txt(item.querySelector('p'));

      const alto = altoItem(item);
      asegurar(alto + 3);

      const inicio = y;
      relleno(ACC);
      doc.circle(ML + 1.6, inicio + 3, 1.4, 'F');
      trazo(LINEA);
      doc.setLineWidth(0.3);
      doc.line(ML + 1.6, inicio + 5, ML + 1.6, inicio + alto - 1);

      tinta(ACC);
      doc.setFont(F, 'bold');
      doc.setFontSize(7.4);
      doc.text(cuando.toUpperCase(), ML + 6, inicio + 3);

      tinta(INK);
      doc.setFontSize(10.2);
      doc.text(rol, ML + 6, inicio + 8);

      tinta(INK2);
      doc.setFont(F, 'normal');
      doc.setFontSize(9);
      doc.text(org + (etiqueta ? '  (' + etiqueta + ')' : ''), ML + 6, inicio + 12.4);

      y = inicio + 14.6;
      parrafo(desc, { x: ML + 6, ancho: ANCHO - 12, tam: 8.8, despues: 0 });
      y = Math.max(y, inicio + alto) + 3.4;
    });
  }

  function formacion() {
    const grupos = todos('.course-group');
    if (!grupos.length) return;
    seccion('08', 'Formación y especializaciones', 6.4 + alturaLinea(8.6) * 3);

    grupos.forEach(g => {
      const nombre = txt(g.querySelector('.cg-name'));
      const cuenta = txt(g.querySelector('.cg-count'));
      const cursos = Array.from(g.querySelectorAll('li')).map(txt);

      // El título del grupo viaja junto a sus dos primeros cursos.
      asegurar(6 + alturaLinea(8.6) * 2);

      tinta(ACC);
      doc.setFont(F, 'bold');
      doc.setFontSize(9.6);
      doc.text(nombre + '  (' + cuenta + ')', ML, y + 3.4);
      y += 6.4;

      cursos.forEach(c => {
        const ls = lineas(c, ANCHO - 10, 8.6, 'normal');
        const h = alturaLinea(8.6);
        asegurar(ls.length * h);
        tinta(INK3);
        doc.setFont(F, 'normal');
        doc.setFontSize(8.6);
        doc.text('·', ML + 3, y + h * 0.75);
        tinta(INK2);
        ls.forEach(linea => {
          doc.text(linea, ML + 6.5, y + h * 0.75);
          y += h;
        });
      });
      y += 3.2;
    });

    parrafo('Cursos técnicos cursados en Pluralsight. Licencia de conducir categoría 02.',
      { tam: 8.4, color: INK3 });
  }

  function cierre() {
    asegurar(20);
    y += 6;
    trazo(LINEA);
    doc.setLineWidth(0.3);
    doc.line(ML + 55, y, ML + ANCHO - 55, y);
    y += 6;
    tinta(INK2);
    doc.setFont(F, 'normal');
    doc.setFontSize(9);
    doc.text('Disponible para entrevistas técnicas y colaboración con equipos de desarrollo.',
      ANCHO_PAG / 2, y, { align: 'center' });
    y += 6;

    const c = datosContacto();
    const contacto = [c['teléfono'], c['correo']].filter(Boolean).join('   ·   ') ||
      '+1 (809) 660-3229   ·   lisandronunez@alutecs.com';
    tinta(ACC);
    doc.setFont(F, 'bold');
    doc.setFontSize(9);
    doc.text(limpiar(contacto), ANCHO_PAG / 2, y, { align: 'center' });
  }

  /* ---------- Construcción completa ---------- */

  function construir() {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) throw new Error('jsPDF no está disponible');

    doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
    doc.setProperties({
      title: 'Lisandro Núñez — Portafolio de desarrollo',
      author: 'Lisandro Antonio Núñez Marte',
      subject: 'Portafolio de desarrollo full-stack',
      keywords: '.NET, C#, PHP, CodeIgniter, facturación electrónica, e-CF, DGII'
    });

    encabezado();
    perfil();
    fortalezas();
    stack();
    edfactura();
    sistemas();
    seccionProyectos();
    experiencia();
    formacion();
    cierre();
    pies();

    return doc;
  }

  /* Expuesto para script.js (y para pruebas: devuelve el documento). */
  window.construirPortafolioPDF = construir;

  window.generarPortafolioPDF = function () {
    const documento = construir();
    documento.save('Lisandro-Nunez-Portafolio.pdf');
  };
})();
