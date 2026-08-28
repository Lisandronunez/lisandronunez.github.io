# Lisandro Antonio Núñez Marte

**Desarrollador Full-Stack & System Administrator** · Santiago, República Dominicana

Construyo sistemas empresariales que se usan todos los días: facturación electrónica **e-CF
homologada por la DGII**, contabilidad, inventario, CRM y portales corporativos — desde la
arquitectura de la base de datos hasta el despliegue y el soporte en producción.

Trabajo actualmente en **Teksoft** y, en paralelo, diseño y opero mis propios productos:
**EdFactura** y **Alutecs Services**.

🌐 **[lisandronunez.github.io](https://lisandronunez.github.io/)** · 📄 El sitio genera su
propio CV en PDF con un botón

![Portafolio de Lisandro Núñez](img/preview.png)

---

## Qué construyo

| Proyecto | Tipo | Stack | Qué resuelve |
|---|---|---|---|
| **[EdFactura](https://edfactura.com)** | SaaS multi-tenant | PHP · CodeIgniter 4 · MySQL · XML e-CF | Facturación electrónica homologada por la DGII, con contabilidad e inventario integrados |
| **CashFlow** | App de escritorio | Tauri · Rust · PostgreSQL | Control de caja y flujo de efectivo para punto de venta: sesiones por cajero, corte parcial, cierre, caja chica y gastos fijos |
| **EDLawOffice** | App de escritorio | Tauri · Rust · PostgreSQL | Gestión de oficinas de abogados: expedientes, clientes, agenda de audiencias, documentos y honorarios |
| **Surek CRM** | Sistema web | PHP · CodeIgniter 4 · MySQL | CRM para corredora de seguros con portales diferenciados para socios, clínicas y clientes |

Además, **10 portales corporativos** desarrollados a través de
[Alutecs Services](https://alutecs.com): periódicos digitales (Tamboril News, Sernoticia,
Aguajero), retail (Hipermercado La Fuente), turismo (Destino Travel RD), inmobiliaria
(Bolívar Rosa), consultoría (Claso Consultores), servicios (NIXAURYS Global Cleaning),
distribución (Gala Cosmetic) y legal (BJ Rosa & Asociados).

## Stack

- **Backend** — C# · .NET Core · ASP.NET Core · Web API REST · Blazor · .NET MAUI · PHP · CodeIgniter 4 · Python · Rust (Tauri)
- **Frontend** — JavaScript · HTML5 · CSS3 · diseño responsive · Tauri
- **Datos** — MySQL · PostgreSQL · modelado relacional · arquitectura multi-tenant
- **Calidad** — Playwright · Automated Testing en C# · revisión de código seguro
- **Infraestructura** — cPanel / LiteSpeed · administración de servidores · hardening y despliegue
- **IA aplicada** — uso estructurado y seguro de LLM dentro del flujo de desarrollo

---

## Sobre este sitio

Portafolio estático en **HTML, CSS y JavaScript puro**: sin framework, sin build, sin paso de
compilación. Tampoco tiene dependencias externas en tiempo de ejecución — las fuentes y jsPDF están
dentro del repositorio, así que el sitio carga igual sin internet y no depende de que un CDN siga
en pie.

- **Tema claro y oscuro**, con la preferencia guardada en el navegador del visitante.
- **Contacto oculto** tras un botón, con copiar al portapapeles y accesos directos a correo y WhatsApp.
- **CV en PDF generado en el navegador** con jsPDF: documento vectorial de 5 páginas, con texto
  seleccionable, foto de perfil, capturas de los sistemas y saltos de página controlados — ningún
  bloque se parte por la mitad. No es una captura de pantalla del sitio.
- **Animaciones** de aparición por scroll, contadores y brillo sobre las tarjetas, todas desactivadas
  si el visitante pidió *reducir movimiento* en su sistema.

### Estructura

```
index.html                     Estructura y contenido

assets/
  css/style.css                Diseño (tema claro por defecto + tema oscuro)
  css/fonts.css                @font-face de las fuentes autoalojadas
  js/script.js                 Proyectos, tema, animaciones, contacto, botón de PDF
  js/pdf.js                    Generador del PDF (jsPDF vectorial)
  fonts/                       Space Grotesk, Inter, JetBrains Mono (woff2, subconjunto latin)
  vendor/jspdf.umd.min.js      jsPDF 2.5.1

img/
  perfil/                      Foto de perfil
  proyectos/                   Capturas de los 10 portales
  sistemas/                    Capturas de CashFlow, EDLawOffice y Surek CRM

_privado/                      Material de trabajo. Excluido por .gitignore, no se publica.
```

### Trabajar en local

Cualquier servidor estático sirve. Con XAMPP, la carpeta va en `htdocs` y se abre en
`http://localhost/portafolio/`. Sin XAMPP:

```bash
python -m http.server 8080
# http://localhost:8080
```

Conviene servirlo por HTTP y no abrir `index.html` con doble clic, para probarlo igual que en
producción. Si cambias CSS o JS y no ves el cambio, recarga con **Ctrl+F5**.

### Publicar

Este repositorio se llama `lisandronunez.github.io`, así que GitHub lo publica como **sitio de
usuario** en la raíz del dominio. Basta con **Settings → Pages → Deploy from a branch**, rama
`main`, carpeta `/ (root)`: en uno o dos minutos queda en <https://lisandronunez.github.io/>.

Para usar un dominio propio, añade un archivo `CNAME` con el dominio dentro y crea el registro DNS
que indique GitHub Pages.

### Editar el contenido

**Portales:** arreglo `proyectos` al inicio de `assets/js/script.js`. Sube la captura a
`img/proyectos/` (apaisada, se recorta a 16:10 desde arriba) y añade su objeto:

```js
{ idx:'01', nombre:'Tamboril News', cat:'Periódico digital',
  desc:'...', img:'img/proyectos/tamboril-news.png' }
```

**Sistemas, cursos, experiencia y stack:** HTML directo en `index.html`; cada sección está marcada
con un comentario en mayúsculas. El PDF lee el contenido del propio DOM, así que al editar el sitio
el PDF se actualiza solo.

**Colores:** variables CSS al inicio de `assets/css/style.css` (`:root` para el tema claro,
`html[data-theme="dark"]` para el oscuro). Cambiando `--accent`, `--grad` y `--grad-strong` cambia
todo el sitio. La paleta del PDF está al inicio de `assets/js/pdf.js`.

### Notas

- El sitio no publica sueldo deseado, cédula ni los contactos de las referencias del CV: la cifra
  salarial resta margen de negociación y los teléfonos de terceros no deberían quedar públicos.
- Las fuentes en `assets/fonts/` son SIL Open Font License 1.1 (Space Grotesk, Inter, JetBrains
  Mono); solo se incluye el subconjunto `latin`, suficiente para español.

---

## Contacto

Los datos completos están en el sitio, tras el botón *Ver información de contacto*.

[edfactura.com](https://edfactura.com) · [alutecs.com](https://alutecs.com)
