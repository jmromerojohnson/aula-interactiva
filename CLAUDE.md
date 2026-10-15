# Aula Interactiva — instrucciones para Claude Code

Plataforma del Primer Ciclo (1° a 4° básico) del Colegio Cordillera para crear, compartir y proyectar actividades, guías y evaluaciones. Dueño del proyecto: José Miguel, Subdirección Primer Ciclo. No es programador: explícale en español simple qué hiciste y qué tiene que revisar, sin jerga.

Lee también `docs/ESPECIFICACION.md` (qué debe hacer la plataforma y en qué etapas) y los diseños de `diseno/`.

## Cómo se publica

- Sitio estático en **GitHub Pages**, rama `main`, carpeta raíz. Cada push a `main` se publica solo en 1–2 minutos.
- Dirección: `https://jmromerojohnson.github.io/aula-interactiva/`
- Trabaja directo en `main` salvo que José Miguel pida otra cosa. Al terminar cada tarea: commit con mensaje en español, push, y dale el enlace para revisar.

## Reglas que no se rompen

- **El repositorio es público.** Nunca guardes aquí nombres, listas, notas ni resultados de alumnos, ni contraseñas, claves o correos personales. Los datos irán más adelante en una planilla Google del colegio con Apps Script (etapa 2).
- Sin paso de compilación por ahora: HTML, CSS y JavaScript simples, sin frameworks ni npm. Librerías solo desde CDN con versión fija, y solo si de verdad hacen falta.
- Todo debe funcionar en proyector, computador, tablet y celular.
- Textos de la interfaz en español de Chile, tuteo ("Elige", "Sube").

## Estructura

```
index.html                 Portada (diseño: diseno/portada.dc.html)
catalogo.html              Explorar (diseño: diseno/catalogo.dc.html)
assets/estilos.css         Estilos compartidos y variables de diseño
assets/app.js              Lógica compartida
actividades/               Actividades HTML del ciclo (una por archivo)
actividades/catalogo.json  Lista de actividades que muestra el sitio
plantillas/                Plantillas propias de la plataforma (quiz, ruleta, etc.)
diseno/                    Diseños de referencia exportados de Claude Design (no se publican como páginas)
docs/                      Especificación y notas
```

Los archivos `.dc.html` de `diseno/` son referencias visuales en el formato de Claude Design: úsalos para copiar estructura, textos, colores, tamaños y espaciados, no los enlaces directamente desde el sitio.

## Diseño

Estilo mixto: sobrio e institucional en lo que usa el profesor; lúdico y grande en lo que se proyecta a los alumnos.

- Azul marino `#10264A` (encabezado, botones principales), azul medio `#1A3866`, fondo `#F4F6FA`, texto `#111C30`, texto secundario `#556178`, bordes `#DCE2EC`, acento `#2C6BD3`.
- Colores de las casas: Cóndor verde `#23804F`, Águilas azul `#2C6BD3`, Pumas blanco, Linces rojo `#C2373B`.
- Tipografías (Google Fonts): títulos Bricolage Grotesque; texto Atkinson Hyperlegible; vista de alumnos Baloo 2.
- Botones y zonas táctiles de al menos 44 px. Contraste legible. Sin emojis en la interfaz del profesor.

## Flujo: "sube esta actividad"

Cuando José Miguel te entregue un archivo HTML (adjunto, pegado o ya en el repositorio) y pida subirlo:

1. **Nombre:** guárdalo como `actividades/<tema>-<nivel>.html`, en minúsculas, con guiones y sin tildes ni espacios (ej. `vertebrados-3basico.html`). Si ya existe uno igual, pregunta si reemplaza o agrega `-v2`.
2. **Revisión rápida** antes de subir, y avísale si algo falla:
   - Es un solo archivo que funciona solo (estilos y scripts dentro).
   - No contiene nombres ni datos de alumnos.
   - No envía datos a otros sitios (`fetch`, formularios, `XMLHttpRequest` hacia fuera). Se permiten Google Fonts y librerías de CDN conocidas.
   - Tiene `<meta name="viewport">` para verse bien en tablet y celular.
3. **Catálogo:** agrega una entrada en `actividades/catalogo.json`:
   ```json
   {"archivo": "vertebrados-3basico.html", "titulo": "Animales vertebrados", "asignatura": "Ciencias Naturales", "nivel": "3° básico", "tipo": "Clasificar", "autor": "José Miguel", "fecha": "2026-10-14", "descripcion": "Clasificar 10 animales en mamíferos, aves, reptiles, anfibios y peces."}
   ```
   Si falta algún dato (asignatura, nivel, autor), dedúcelo del contenido y confírmalo en tu respuesta.
4. **Publica:** commit `Agrega actividad: <título>`, push a `main`.
5. **Responde** con el enlace directo a la actividad y a la portada, y recuerda que tarda 1–2 minutos en aparecer.

Convención de resultados (para la etapa 2): una actividad puede avisar su puntaje con
`window.parent.postMessage({tipo: "aula-resultado", actividad, puntaje, total}, "*")`. No la quites si viene incluida.
