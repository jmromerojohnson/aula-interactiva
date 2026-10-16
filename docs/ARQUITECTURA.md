# Aula Interactiva — Arquitectura

Cómo está construido el sitio y dónde va cada cosa. Si vas a cambiar algo, empieza aquí.

La idea general: **un edificio en capas**. Cada capa usa la de abajo y nunca al revés.

```
  Páginas      index.html, explorar.html, sala.html, piezas.html
     ↓ arman
  Piezas       encabezado, tarjeta, buscador, puntaje por casas, temporizador…
     ↓ usan
  Núcleo       datos, armado de página, íconos, formatos
     ↓ usan
  Materiales   colores, letras, espacios (tokens.css)

  Contenido    config/*.json y actividades/  ← se edita sin tocar el código
```

## Mapa de carpetas

```
index.html · explorar.html · sala.html · piezas.html
                         Páginas. Son solo un "cascarón": cargan la hoja de estilos
                         y el archivo .js de su página. No escribas contenido aquí.
catalogo.html            Redirección de la dirección antigua (no borrar).

config/                  CONTENIDO EDITABLE (sin programar)
  sitio.json             Nombre, menú (módulos), botón principal, niveles y casas
  portada.json           Textos, actividad destacada y secciones de la portada
  asignaturas.json       Asignaturas con su color e ícono

actividades/             LAS ACTIVIDADES
  catalogo.json          Lista de actividades que muestra el sitio
  <id>/index.html        Cada actividad en su carpeta, con sus imágenes en <id>/imagenes/
  _comun/                Archivos compartidos por actividades hechas con Claude Design
  <id>.html              Redirecciones de direcciones antiguas (no borrar)

medios/portada/          Imágenes para la portada

src/                     EL CÓDIGO
  estilos/
    tokens.css           MATERIALES: todos los colores, letras, tamaños y sombras
    base.css             Reglas generales (texto, títulos, contenedor, grillas)
    sitio.css            Junta todas las hojas de estilo (la única que cargan las páginas)
  nucleo/
    datos.js             CAPA DE DATOS: el único archivo que sabe de dónde vienen los datos
    pagina.js            Arma cada página: encabezado + contenido + pie
    dom.js               Herramienta para crear elementos
    iconos.js            Todos los íconos
    formato.js           Textos repetidos: niveles, fechas, plurales
  componentes/<pieza>/   PIEZAS: cada una en su carpeta, con su .js y su .css
  paginas/<página>/      PÁGINAS: la lógica y el estilo propio de cada página

herramientas/            Utilidades (comprimir imágenes)
diseno/                  Diseños de referencia (no se publican como páginas)
docs/                    Esta documentación, la especificación y la bitácora
```

## Reglas para mantener el orden

1. **Un dato, un lugar.** Un color se define solo en `tokens.css`. Un texto de la portada, solo en `portada.json`. El menú, solo en `sitio.json`.
2. **Las piezas no se copian, se reutilizan.** Si dos páginas necesitan lo mismo, es una pieza en `src/componentes/`.
3. **Solo `datos.js` lee datos.** Las páginas y piezas le piden los datos a `datos.js`. Así, cuando lleguen la planilla del colegio y Apps Script, se cambia solo ese archivo.
4. **Los textos de la gente nunca se insertan como código.** `dom.js` inserta todo como texto; no usar `innerHTML` con datos.
5. **Sin compilar ni instalar nada.** HTML, CSS y JavaScript simples. Los navegadores modernos cargan los módulos (`import`) solos.
6. **Cada pieza nueva aparece en `piezas.html`** para revisarla antes de usarla.

## Recetas: cómo hacer los cambios más comunes

### Cambiar un color, la tipografía o un tamaño
Edita el valor en `src/estilos/tokens.css`. Revisa `piezas.html` para ver cómo quedó todo.

### Cambiar textos de la portada, la destacada o el orden de las secciones
Edita `config/portada.json`. Las secciones aparecen en el orden en que están escritas; para quitar una, bórrala de la lista.

### Agregar una imagen grande a la portada
1. Guarda la imagen en `medios/portada/` (y comprímela, ver abajo).
2. Agrega una sección en `config/portada.json` donde quieras que aparezca:
   ```json
   { "tipo": "imagen", "imagen": "medios/portada/mi-foto.jpg", "descripcionImagen": "Qué se ve en la foto",
     "titulo": "Semana de la Biblia", "texto": "Actividades para toda la semana.",
     "boton": { "texto": "Ver actividades", "ruta": "explorar.html?asignatura=religion" } }
   ```
Tipos de sección disponibles: `recientes`, `asignaturas`, `plantillas`, `aprende`, `imagen`. Para crear un tipo nuevo, agrégalo en `SECCIONES` de `src/paginas/portada/portada.js`.

### Agregar una actividad
1. Crea `actividades/<id>/index.html` (el id en minúsculas, con guiones, sin tildes; ej. `sumas-1basico`). Sus imágenes van en `actividades/<id>/imagenes/`.
2. Comprime las imágenes: `python herramientas/comprimir-imagenes.py actividades/<id>/imagenes`
3. Agrega su ficha en `actividades/catalogo.json`:
   ```json
   { "id": "sumas-1basico", "titulo": "Sumas hasta 20", "asignatura": "matematica", "niveles": [1],
     "tipo": "Quiz", "autor": "José Miguel", "fecha": "2026-10-20",
     "descripcion": "Diez sumas con apoyo visual.", "portada": "imagenes/portada.jpg" }
   ```
   `asignatura` es el `id` de `config/asignaturas.json`. `portada` es opcional: sin ella, la tarjeta muestra el ícono de la asignatura.
   Si la actividad viene de Claude Design (usa `../_comun/support.js`), agrega `"confiable": true` después de revisarla (ver *Seguridad y datos*).

### Agregar una asignatura
Una línea en `config/asignaturas.json` con su `id`, `nombre`, `color`, `fondo` e `icono` (ver nombres en `piezas.html`).

### Agregar un módulo nuevo (ej. "Guías imprimibles")
1. Crea la página: `guias.html` (copia el cascarón de `explorar.html`) y `src/paginas/guias/guias.js` + `guias.css`.
2. En el `.js`, empieza con `const pagina = await montarPagina({ modulo: 'guias' });`.
3. Agrega su `.css` en `src/estilos/sitio.css`.
4. Agrega el módulo en `config/sitio.json`: `{ "id": "guias", "nombre": "Guías", "ruta": "guias.html", "activo": true, "enMenu": true }`.
   Con `"activo": false` queda apagado (muestra "en construcción") sin borrar nada.

### Agregar o cambiar una funcionalidad (pieza)
1. Crea `src/componentes/<pieza>/<pieza>.js` (exporta una función `crear…`) y `<pieza>.css`.
2. Agrega su `.css` en `src/estilos/sitio.css`.
3. Úsala en la página que la necesite con `import`.
4. Muéstrala en `piezas.html` (`src/paginas/piezas/piezas.js`).

### Agregar un ícono
Una línea en `TRAZOS` de `src/nucleo/iconos.js` (dibujo SVG de 24×24 con trazos).

## Seguridad y datos

- El repositorio es **público**: nunca guardes datos de alumnos, contraseñas ni correos personales.
- Las actividades corren **aisladas** (`marco-actividad`: iframe con sandbox). No pueden leer datos del sitio.
- **Excepción `"confiable": true`** (en `catalogo.json`): las actividades hechas con Claude Design necesitan correr como parte del sitio o su motor no arranca. Ese permiso les deja leer lo que el sitio guarda en el navegador, así que **solo se marca en actividades revisadas por el colegio**. Cuando exista el ingreso con cuenta (etapa 2), revisar esta regla antes de marcar actividades nuevas.
- Una actividad puede avisar su puntaje con
  `window.parent.postMessage({ tipo: "aula-resultado", actividad, puntaje, total }, "*")`.
  La sala lo recibe como evento `aula-resultado`; en la etapa 2 se guardará en la planilla del colegio.
- El navegador solo recuerda comodidades (puntaje en curso, si el puntaje por casas está visible).

## Capacidad

GitHub Pages recomienda que el sitio no supere 1 GB; ningún archivo puede pasar de 100 MB.
Con las imágenes comprimidas (~250 KB cada una) caben cientos de actividades ilustradas.
Si algún día no alcanza, las imágenes pueden pasar al Google Drive del colegio cambiando solo `rutaActividad()` en `src/nucleo/datos.js`.

## Versiones y cómo volver atrás

- Cada cambio queda guardado en el historial de GitHub.
- Los estados estables se marcan con una etiqueta (`v0-antes-de-cimientos`, `v1-cimientos`, …).
- Para volver a una versión: `git checkout <etiqueta> -- .` y publicar, o pedírselo a Claude indicando la etiqueta.
- Lo que cambia en cada versión se anota en `docs/CAMBIOS.md`.

## Probar en el computador

Las páginas usan módulos de JavaScript, así que no funcionan abriendo el archivo con doble clic. Desde la carpeta del repositorio:

```
python -m http.server 8765
```

y abre `http://localhost:8765`.
