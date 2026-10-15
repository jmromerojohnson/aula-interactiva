# Aula Interactiva — Especificación

Versión de trabajo: octubre 2026 · Subdirección Primer Ciclo, Colegio Cordillera. La versión editable completa está en el documento "Aula Interactiva — Especificación" de Claude.

## Propósito y usuarios

Plataforma del Primer Ciclo para crear, compartir y usar recursos de clase, organizados por asignatura y nivel (1° a 4° básico).

- **Profesores:** buscan, crean, adaptan y proyectan recursos; suben actividades propias hechas con Claude.
- **Alumnos:** participan proyectado, con dispositivo en sala o desde la casa.
- **Subdirección y coordinadores:** revisan lo que se comparte y siguen resultados.

Principios: simple para el profesor con poco tiempo; todo lo opcional es opcional; bajo costo, sin servidor pagado; los datos de alumnos se cuidan desde el diseño.

## Módulos

| Módulo | Qué hace |
| --- | --- |
| Actividades proyectables | Plantillas para la sala: quiz, ruleta, memorice, arrastrar y ordenar, sopa de letras, verdadero o falso, temporizador, armador de grupos, semáforo, presentación, cuento interactivo, línea de tiempo |
| Actividades propias | Cualquier profesor sube un HTML hecho por él (por ejemplo con Claude). Corre aislado del resto del sitio |
| Guías imprimibles | Ejercitación, comprensión lectora, escritura y trazos, pautas y rúbricas. Salida en PDF y Google Docs |
| Evaluaciones | Alternativas, verdadero o falso, respuesta corta; pauta, puntaje y nivel de logro |
| Banco compartido | Recursos del ciclo; lo compartido pasa por revisión antes de publicarse; muestra el autor |
| Aprende a crear | Tutoriales y el kit Aula Interactiva para crear actividades con Claude |

Imágenes: subir propias, pictogramas ARASAAC, banco de ilustraciones gratuitas y, más adelante, generadas con IA.

## Acceso y roles

- Profesores, revisores y subdirección entran con su cuenta @colegiocordillera.cl.
- Alumnos: código de sala + tocan su nombre en la lista del curso. Sin contraseñas.
- Al guardar, el profesor deja el recurso privado o lo envía al banco; un revisor lo aprueba antes de que sea visible para todos.

## Experiencia en sala y resultados

Opciones que cada profesor activa por actividad: puntaje por casas (Cóndor, Águilas, Pumas, Linces), lectura en voz alta, sonidos y celebración, temporizador por pregunta, pantalla completa.

Resultados por alumno: logro por pregunta, alumnos descendidos (apoyo PIE), vista de subdirección de los 8 cursos (1°A a 4°B), exportar a planilla.

## Asistente de IA (etapa 4, presupuesto por definir)

Generar preguntas, armar guías completas, adaptar a PIE / Decreto 83, sugerir actividades, generar imágenes. Todo es propuesta que el profesor revisa. Límite mensual por profesor.

## Arquitectura

- Página web: GitHub Pages, repositorio público, sin datos.
- Datos: planilla Google del colegio + Apps Script (verifica la cuenta, guarda y lee). Archivos subidos, imágenes y guías en Google Drive del colegio.
- Actividades propias: se muestran aisladas (iframe con sandbox), sin acceso a datos ni a otros sitios.
- Costo: cero en servidor; dominio .cl opcional; IA cuando se active.

## Etapas

1. **Base:** portada y catálogo con el nuevo diseño; actividades propias (subir HTML); quiz proyectable con opciones de sala; banco con revisión; kit Aula Interactiva. *Primero sin login, con las actividades en la carpeta `actividades/`; el ingreso con cuenta del colegio llega con Apps Script.*
2. **Alumnos:** código de sala, listas de curso, resultados y reportes.
3. **Guías imprimibles.**
4. **Asistente de IA.**

## Pendientes por decidir

- Validar con dirección el uso de datos de alumnos (Ley 21.719).
- Revisores del banco además de subdirección.
- Presupuesto y proveedor de IA.
- Dominio propio o dirección de GitHub Pages.
- Vínculo con el organizador del ciclo.
- Asignaturas piloto de la etapa 1.
