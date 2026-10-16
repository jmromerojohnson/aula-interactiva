/* PÁGINA: Piezas del sitio (piezas.html)
   Muestra todos los materiales y piezas juntos, como un catálogo.
   Sirve para revisar cómo se ve un cambio antes de usarlo en el sitio.
   Cuando crees una pieza nueva, agrégala aquí también. */

import { h } from '../../nucleo/dom.js';
import { icono, NOMBRES_ICONOS } from '../../nucleo/iconos.js';
import { leerActividades, leerAsignaturas } from '../../nucleo/datos.js';
import { montarPagina } from '../../nucleo/pagina.js';
import { crearBuscador } from '../../componentes/buscador/buscador.js';
import { crearTarjetaActividad } from '../../componentes/tarjeta-actividad/tarjeta-actividad.js';
import { crearTarjetaAsignatura } from '../../componentes/tarjeta-asignatura/tarjeta-asignatura.js';
import { crearEstadoVacio } from '../../componentes/estado-vacio/estado-vacio.js';
import { crearPuntajeCasas } from '../../componentes/puntaje-casas/puntaje-casas.js';
import { crearTemporizador } from '../../componentes/temporizador/temporizador.js';

const COLORES = [
  'marino', 'marino-medio', 'marino-profundo', 'dorado', 'dorado-oscuro', 'tinta-calida',
  'fondo', 'superficie', 'superficie-suave', 'seleccion',
  'texto', 'texto-medio', 'texto-suave', 'borde', 'borde-fuerte', 'foco', 'error', 'exito'
];

const pagina = await montarPagina({ modulo: 'piezas' });
if (pagina) {
  const { main, sitio } = pagina;
  const [actividades, asignaturas] = await Promise.all([leerActividades(), leerAsignaturas()]).catch(() => [[], []]);

  const bloque = (titulo, archivo, ...contenido) => h('section', { class: 'piezas__bloque' },
    h('div', { class: 'piezas__cabecera' }, h('h2', null, titulo), archivo && h('code', null, archivo)),
    ...contenido
  );

  main.append(h('div', { class: 'contenedor piezas' },
    h('header', { class: 'piezas__intro' },
      h('span', { class: 'antetitulo' }, 'Catálogo de materiales'),
      h('h1', null, 'Piezas del sitio'),
      h('p', null, 'Todas las piezas con las que se arma Aula Interactiva. Si cambias una pieza o un material, revisa aquí que se vea bien antes de publicar.')
    ),

    bloque('Colores', 'src/estilos/tokens.css',
      h('div', { class: 'piezas__colores' }, COLORES.map((c) => h('div', { class: 'piezas__color' },
        h('span', { class: 'piezas__muestra', style: { background: `var(--color-${c})` } }),
        h('code', null, `--color-${c}`)
      )))
    ),

    bloque('Tipografía', 'src/estilos/tokens.css',
      h('p', { class: 'piezas__letra-titulo' }, 'Alegreya — títulos y narración'),
      h('p', null, 'Atkinson Hyperlegible — textos, botones y formularios. Fácil de leer para todos.'),
      h('p', { class: 'piezas__letra-sala' }, 'Baloo 2 — lo que leen los alumnos en la sala')
    ),

    bloque('Botones', 'src/componentes/boton/boton.css',
      h('div', { class: 'piezas__fila' },
        h('button', { type: 'button', class: 'boton boton--principal' }, 'Principal'),
        h('button', { type: 'button', class: 'boton boton--acento' }, icono('reproducir', 16), 'Acento'),
        h('button', { type: 'button', class: 'boton' }, 'Normal'),
        h('button', { type: 'button', class: 'boton boton--enlace' }, 'Enlace'),
        h('button', { type: 'button', class: 'boton boton--icono', 'aria-label': 'Solo ícono' }, icono('buscar', 18))
      ),
      h('div', { class: 'piezas__fila piezas__oscuro' },
        h('button', { type: 'button', class: 'boton boton--fantasma' }, icono('reloj', 18), 'Fantasma'),
        h('button', { type: 'button', class: 'boton boton--fantasma', 'aria-pressed': 'true' }, icono('copa', 18), 'Fantasma activo')
      )
    ),

    bloque('Etiquetas y píldoras', 'src/componentes/etiqueta/etiqueta.css',
      h('div', { class: 'piezas__fila' },
        h('span', { class: 'etiqueta' }, '3° básico'),
        h('span', { class: 'etiqueta etiqueta--destacada' }, 'Destacada'),
        h('button', { type: 'button', class: 'pildora' }, '1° básico'),
        h('button', { type: 'button', class: 'pildora', 'aria-pressed': 'true' }, '2° básico'),
        h('span', { class: 'filtro-activo' }, 'Religión', h('button', { type: 'button', 'aria-label': 'Quitar' }, icono('cerrar', 14)))
      )
    ),

    bloque('Íconos', 'src/nucleo/iconos.js',
      h('div', { class: 'piezas__iconos' }, NOMBRES_ICONOS.map((n) => h('div', { class: 'piezas__icono' }, icono(n, 24), h('code', null, n))))
    ),

    bloque('Buscador', 'src/componentes/buscador/', crearBuscador({ placeholder: 'Ejemplo de buscador', alEscribir: () => {} })),

    bloque('Tarjeta de actividad', 'src/componentes/tarjeta-actividad/',
      h('div', { class: 'grilla' }, actividades.slice(0, 2).map(crearTarjetaActividad))
    ),

    bloque('Acceso a asignatura', 'src/componentes/tarjeta-asignatura/',
      h('div', { class: 'grilla', style: { '--grilla-min': '180px' } },
        asignaturas.slice(0, 3).map((a) => crearTarjetaAsignatura(a, actividades.filter((x) => x.asignatura === a.id).length)))
    ),

    bloque('Aviso vacío o de error', 'src/componentes/estado-vacio/',
      h('div', { class: 'grilla' },
        crearEstadoVacio({ titulo: 'No hay resultados', texto: 'Prueba con otra palabra.' }),
        crearEstadoVacio({ titulo: 'No se pudo cargar', texto: 'Revisa tu conexión.', error: true })
      )
    ),

    bloque('Sala: puntaje por casas y temporizador', 'src/componentes/puntaje-casas/ · temporizador/',
      h('div', { class: 'piezas__sala' },
        h('div', { class: 'piezas__fila piezas__oscuro' }, crearTemporizador()),
        crearPuntajeCasas({ casas: sitio.casas || [], clave: 'muestra' })
      )
    )
  ));
}
