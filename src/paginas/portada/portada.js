/* PÁGINA: Portada (index.html)
   Todo el contenido sale de config/portada.json.
   Cada sección del archivo tiene un "tipo"; aquí abajo, SECCIONES dice
   cómo se dibuja cada tipo. Para una sección nueva: agrega su tipo aquí
   y úsalo en portada.json. */

import { h } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { leerPortada, leerActividades, leerAsignaturas, rutaSitio } from '../../nucleo/datos.js';
import { textoNiveles } from '../../nucleo/formato.js';
import { montarPagina, mostrarError } from '../../nucleo/pagina.js';
import { crearBuscador } from '../../componentes/buscador/buscador.js';
import { crearTarjetaActividad, urlSala } from '../../componentes/tarjeta-actividad/tarjeta-actividad.js';
import { crearTarjetaAsignatura } from '../../componentes/tarjeta-asignatura/tarjeta-asignatura.js';
import { crearEstadoVacio } from '../../componentes/estado-vacio/estado-vacio.js';

/* ---------- Bienvenida + destacada ---------- */
function crearBienvenida({ sitio, portada, actividades }) {
  const b = portada.bienvenida || {};
  return h('section', { class: 'contenedor portada-bienvenida' },
    h('div', { class: 'portada-bienvenida__texto' },
      b.saludo && h('span', { class: 'antetitulo' }, b.saludo),
      h('h1', { class: 'portada-bienvenida__titulo' }, b.titulo),
      b.bajada && h('p', { class: 'portada-bienvenida__bajada' }, b.bajada),
      crearBuscador({ placeholder: b.buscador, grande: true }),
      h('div', { class: 'portada-bienvenida__niveles' },
        h('span', null, 'Por nivel:'),
        (sitio.niveles || []).map((n) => h('a', { class: 'pildora', href: rutaSitio('explorar.html?nivel=' + n) }, textoNiveles([n])))
      )
    ),
    crearDestacada(portada.destacada, actividades)
  );
}

function crearDestacada(destacada, actividades) {
  if (!destacada) return null;
  const a = actividades.find((x) => x.id === destacada.actividad);
  if (!a) return null;
  const imagen = destacada.imagen ? rutaSitio(destacada.imagen) : a.portadaUrl;
  return h('article', { class: 'destacada' },
    imagen && h('img', { class: 'destacada__imagen', src: imagen, alt: '' }),
    h('div', { class: 'destacada__contenido' },
      destacada.etiqueta && h('span', { class: 'etiqueta etiqueta--destacada' }, destacada.etiqueta),
      h('h2', { class: 'destacada__titulo' }, destacada.titulo || a.titulo),
      h('p', null, destacada.texto || a.descripcion),
      h('div', { class: 'destacada__acciones' },
        h('a', { class: 'boton boton--acento boton--grande', href: urlSala(a) }, icono('reproducir', 18), 'Proyectar'),
        h('span', { class: 'destacada__meta' }, [a.asignaturaInfo.nombre, textoNiveles(a.niveles), a.tipo].filter(Boolean).join(' · '))
      )
    )
  );
}

/* ---------- Tipos de sección ---------- */
const SECCIONES = {
  recientes(s, { actividades }) {
    const ultimas = [...actividades].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).slice(0, s.cantidad || 3);
    return crearSeccion(s, {
      enlace: h('a', { class: 'portada-ver-todo', href: rutaSitio('explorar.html') }, 'Ver todas', icono('flecha', 18)),
      cuerpo: h('div', { class: 'grilla' },
        ultimas.length ? ultimas.map(crearTarjetaActividad)
          : crearEstadoVacio({ titulo: 'Aún no hay actividades publicadas', texto: 'Pronto aparecerán aquí las del ciclo.' }),
        h('a', { class: 'tarjeta-sumar', href: rutaSitio('index.html#aprende') },
          h('span', { class: 'tarjeta-sumar__icono' }, icono('mas', 26)),
          h('strong', null, 'Suma tu actividad'),
          h('span', null, '¿La hiciste con Claude? Súbela y queda disponible para todo el ciclo.')
        )
      )
    });
  },

  asignaturas(s, { actividades, asignaturas }) {
    return crearSeccion(s, {
      fondo: true,
      cuerpo: h('div', { class: 'grilla', style: { '--grilla-min': '160px' } },
        asignaturas.map((asig) => crearTarjetaAsignatura(asig, actividades.filter((a) => a.asignatura === asig.id).length))
      )
    });
  },

  plantillas(s) {
    return crearSeccion(s, {
      cuerpo: h('div', { class: 'grilla', style: { '--grilla-min': '220px' } },
        (s.elementos || []).map((p) => h('div', { class: 'plantilla' },
          h('span', { class: 'plantilla__icono' }, icono(p.icono, 24)),
          h('span', { class: 'plantilla__texto' },
            h('strong', null, p.nombre),
            p.estado && h('span', { class: 'plantilla__estado' }, p.estado)
          )
        ))
      )
    });
  },

  aprende(s) {
    return h('section', { class: 'contenedor portada-aprende-envoltura', id: s.id },
      h('div', { class: 'portada-aprende' },
        h('div', { class: 'portada-aprende__texto' },
          s.saludo && h('span', { class: 'antetitulo antetitulo--claro' }, s.saludo),
          h('h2', null, s.titulo),
          s.boton && h('a', { class: 'boton boton--acento boton--grande', href: rutaSitio(s.boton.ruta) }, s.boton.texto)
        ),
        h('ol', { class: 'portada-aprende__pasos' },
          (s.pasos || []).map((p, i) => h('li', null,
            h('span', { class: 'portada-aprende__numero' }, String(i + 1)),
            h('strong', null, p.titulo),
            h('span', null, p.texto)
          ))
        )
      )
    );
  },

  /* Sección con una imagen grande y texto. Ejemplo en portada.json:
     { "tipo": "imagen", "imagen": "medios/portada/semana-santa.jpg", "titulo": "...", "texto": "...",
       "boton": { "texto": "Ver actividades", "ruta": "explorar.html?asignatura=religion" } } */
  imagen(s) {
    return h('section', { class: 'contenedor seccion', id: s.id },
      h('div', { class: 'portada-imagen' },
        h('img', { class: 'portada-imagen__foto', src: rutaSitio(s.imagen), alt: s.descripcionImagen || '' }),
        (s.titulo || s.texto) && h('div', { class: 'portada-imagen__texto' },
          s.titulo && h('h2', null, s.titulo),
          s.texto && h('p', null, s.texto),
          s.boton && h('a', { class: 'boton boton--acento boton--grande', href: rutaSitio(s.boton.ruta) }, s.boton.texto)
        )
      )
    );
  }
};

/* Marco común de una sección: título, bajada, enlace opcional y cuerpo */
function crearSeccion(s, { cuerpo, enlace, fondo = false }) {
  const interior = h('div', { class: 'contenedor seccion' },
    h('div', { class: 'seccion__cabecera' },
      h('div', null,
        h('h2', { class: 'seccion__titulo' }, s.titulo),
        s.bajada && h('p', { class: 'seccion__bajada' }, s.bajada)
      ),
      enlace
    ),
    cuerpo
  );
  return fondo
    ? h('section', { class: 'seccion-con-fondo', id: s.id }, interior)
    : h('section', { id: s.id }, interior);
}

/* ---------- Arranque ---------- */
const pagina = await montarPagina({ modulo: 'inicio' });
if (pagina) {
  const { main, sitio } = pagina;
  try {
    const [portada, actividades, asignaturas] = await Promise.all([leerPortada(), leerActividades(), leerAsignaturas()]);
    const datos = { sitio, portada, actividades, asignaturas };
    main.append(crearBienvenida(datos));
    for (const seccion of portada.secciones || []) {
      const dibujar = SECCIONES[seccion.tipo];
      if (dibujar) main.append(dibujar(seccion, datos));
    }
  } catch (error) {
    mostrarError(main, 'No se pudo cargar la portada');
    console.error(error);
  }
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}
