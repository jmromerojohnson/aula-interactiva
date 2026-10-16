# Bitácora de cambios

Lo más reciente arriba. Cada versión estable tiene una etiqueta en GitHub para poder volver a ella.

## v1-cimientos — 16 de octubre de 2026

Se rehízo la base del sitio para que crecer sea fácil y ordenado. Detalle en `docs/ARQUITECTURA.md`.

- **Nuevo diseño** (basado en el lienzo "Aula Interactiva — propuesta visual"): fondo papel, títulos en Alegreya, acento dorado.
- **Materiales en un solo lugar** (`src/estilos/tokens.css`).
- **Contenido editable sin programar**: menú y casas (`config/sitio.json`), portada (`config/portada.json`), asignaturas (`config/asignaturas.json`).
- **Piezas reutilizables** en `src/componentes/`: encabezado, pie, botones, etiquetas, buscador, tarjetas, aviso vacío, marco de actividad, puntaje por casas, temporizador, pantalla completa.
- **Páginas nuevas**:
  - `explorar.html` (reemplaza a `catalogo.html`): filtros por nivel, asignatura y tipo.
  - `sala.html`: barra del profesor, puntaje por casas, temporizador y pantalla completa.
  - `piezas.html`: catálogo de todas las piezas.
- **Cada actividad en su carpeta** (`actividades/<id>/`), con sus imágenes comprimidas (La gran aventura bajó de 2,9 MB a 1,8 MB).
- **Herramienta** `herramientas/comprimir-imagenes.py`.
- Las direcciones antiguas (`catalogo.html#ver=…` y `actividades/<id>.html`) siguen funcionando: redirigen a las nuevas.
- Nuevo campo `"confiable": true` en el catálogo para actividades de Claude Design revisadas (las deja correr dentro de la sala).
- El catálogo ahora usa `id`, `asignatura` (id) y `niveles` (lista de números) en vez de `archivo`, `asignatura` (texto) y `nivel` (texto).

## v0-antes-de-cimientos — 16 de octubre de 2026

Estado del sitio antes de la reconstrucción: portada y catálogo con diseño anterior, dos actividades.
