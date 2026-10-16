/* PIEZA: Encabezado con logo, menú y botón principal.
   El menú se arma solo con los módulos de config/sitio.json
   que tienen "activo": true y "enMenu": true. */

import { h } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { rutaSitio } from '../../nucleo/datos.js';

export function crearEncabezado(sitio, moduloActual) {
  const modulos = sitio.modulos.filter((m) => m.activo !== false && m.enMenu);
  const accion = sitio.accionPrincipal;

  return h('header', { class: 'encabezado' },
    h('div', { class: 'contenedor encabezado__fila' },
      h('a', { class: 'encabezado__marca', href: rutaSitio('index.html') },
        h('span', { class: 'encabezado__logo' }, icono('logo', 24)),
        h('span', { class: 'encabezado__nombre' },
          h('span', { class: 'encabezado__titulo' }, sitio.nombre),
          h('span', { class: 'encabezado__subtitulo' }, sitio.subtitulo)
        )
      ),
      h('nav', { class: 'encabezado__menu', 'aria-label': 'Principal' },
        modulos.map((m) => h('a', {
          class: 'encabezado__enlace',
          href: rutaSitio(m.ruta),
          'aria-current': m.id === moduloActual ? 'page' : null
        }, m.nombre))
      ),
      accion && h('a', { class: 'boton boton--principal encabezado__accion', href: rutaSitio(accion.ruta), 'aria-label': accion.texto },
        accion.icono && icono(accion.icono, 18), h('span', { class: 'encabezado__accion-texto' }, accion.texto))
    )
  );
}
