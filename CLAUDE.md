# Aula Interactiva — instrucciones para Claude Code

Plataforma del Primer Ciclo (1° a 4° básico) del Colegio Cordillera para crear, compartir y proyectar actividades, guías y evaluaciones. Dueño del proyecto: José Miguel, Subdirección Primer Ciclo. No es programador: explícale en español simple qué hiciste y qué tiene que revisar, sin jerga.

**Antes de cambiar algo, lee `docs/ARQUITECTURA.md`**: dice dónde va cada cosa y trae recetas para los cambios comunes. Lee también `docs/ESPECIFICACION.md` (qué debe hacer la plataforma y en qué etapas).

## Cómo se publica

- Sitio estático en **GitHub Pages**, rama `main`, carpeta raíz. Cada push a `main` se publica solo en 1–2 minutos.
- Dirección: `https://jmromerojohnson.github.io/aula-interactiva/`
- Trabaja directo en `main` salvo que José Miguel pida otra cosa. Al terminar cada tarea: commit con mensaje en español, push, y dale el enlace para revisar.
- Cambios grandes: anótalos en `docs/CAMBIOS.md` y, si dejan el sitio estable, marca una etiqueta (`v2-…`).
- Para probar en local: `python -m http.server 8765` en la carpeta del repositorio (los módulos JS no funcionan con doble clic).

## Reglas que no se rompen

- **El repositorio es público.** Nunca guardes aquí nombres, listas, notas ni resultados de alumnos, ni contraseñas, claves o correos personales. Los datos irán más adelante en una planilla Google del colegio con Apps Script (etapa 2).
- Sin paso de compilación: HTML, CSS y JavaScript simples (módulos ES nativos), sin frameworks ni npm. Librerías solo desde CDN con versión fija, y solo si de verdad hacen falta.
- **Respeta las capas** (detalle en `docs/ARQUITECTURA.md`):
  - Colores, letras, tamaños y sombras solo en `src/estilos/tokens.css`; en el resto, usa sus variables.
  - Contenido editable en `config/*.json`, no escrito dentro del código.
  - Lo que se repite es una pieza en `src/componentes/<pieza>/` (su `.js` y su `.css`), y aparece en `piezas.html`.
  - Solo `src/nucleo/datos.js` lee datos.
  - Crea elementos con `h()` de `src/nucleo/dom.js`; nunca `innerHTML` con datos.
- Todo debe funcionar en proyector, computador, tablet y celular (revisa a 375 px de ancho).
- Textos de la interfaz en español de Chile, tuteo ("Elige", "Sube").

## Diseño

Diseño de referencia: lienzo "Aula Interactiva — propuesta visual" (https://claude.ai/artifact/NQyXXSWdyrPYFQDmrvrxuK). Los `.dc.html` de `diseno/` son del diseño anterior.

- Fondo papel `#F7F4EE`, azul marino `#10264A`, acento dorado `#E0A43A` (todos en `tokens.css`).
- Tipografías: títulos Alegreya; texto Atkinson Hyperlegible; vista de alumnos Baloo 2.
- Colores de las casas en `config/sitio.json`.
- Botones y zonas táctiles de al menos 44 px. Contraste legible. Sin emojis en la interfaz del profesor.

## Flujo: "sube esta actividad"

Cuando José Miguel te entregue una actividad (HTML suelto, zip de Claude Design o ya en el repositorio) y pida subirla:

1. **Id:** `<tema>-<nivel>` en minúsculas, con guiones y sin tildes (ej. `vertebrados-3basico`, `la-gran-aventura-3-4basico`). Si ya existe, pregunta si reemplaza o agrega `-v2`.
2. **Carpeta:** `actividades/<id>/index.html`; imágenes en `actividades/<id>/imagenes/`. Si viene de Claude Design y usa `support.js` / `image-slot.js`, apúntalos a `../_comun/` en vez de copiarlos.
3. **Comprime las imágenes:** `python herramientas/comprimir-imagenes.py actividades/<id>/imagenes`
4. **Revisión rápida** antes de subir, y avísale si algo falla:
   - Funciona sola desde su carpeta (ábrela en local).
   - No contiene nombres ni datos de alumnos.
   - No envía datos a otros sitios (`fetch`, formularios, `XMLHttpRequest` hacia fuera). Se permiten Google Fonts y librerías de CDN conocidas con versión fija.
   - Tiene `<meta name="viewport">`.
5. **Catálogo:** agrega su ficha en `actividades/catalogo.json`:
   ```json
   {"id": "vertebrados-3basico", "titulo": "Animales vertebrados", "asignatura": "ciencias", "niveles": [3], "tipo": "Clasificar", "autor": "José Miguel", "fecha": "2026-10-14", "descripcion": "Clasificar 10 animales en mamíferos, aves, reptiles, anfibios y peces.", "portada": "imagenes/portada.jpg"}
   ```
   `asignatura` es un id de `config/asignaturas.json`; `portada` es opcional. Si viene de Claude Design, agrega `"confiable": true` solo después de la revisión del paso 4 (sin eso su motor no arranca dentro de la sala; ver *Seguridad y datos* en `docs/ARQUITECTURA.md`). Si falta algún dato (asignatura, nivel, autor), dedúcelo del contenido y confírmalo en tu respuesta.
6. **Publica:** commit `Agrega actividad: <título>`, push a `main`.
7. **Responde** con el enlace a la sala (`sala.html?a=<id>`) y a la portada, y recuerda que tarda 1–2 minutos en aparecer.

Convención de resultados (para la etapa 2): una actividad puede avisar su puntaje con
`window.parent.postMessage({tipo: "aula-resultado", actividad, puntaje, total}, "*")`. No la quites si viene incluida.
