/* PIEZA: Pie de página */

import { h } from '../../nucleo/dom.js';
import { rutaSitio } from '../../nucleo/datos.js';

export function crearPie(sitio) {
  const casas = (sitio.casas || []).map((c) => c.nombre).join(' · ');
  return h('footer', { class: 'pie' },
    h('div', { class: 'contenedor pie__fila' },
      h('span', null, sitio.pie),
      h('span', null, sitio.aviso),
      h('span', { class: 'pie__extra' },
        casas,
        h('a', { href: rutaSitio('piezas.html') }, 'Piezas del sitio')
      )
    )
  );
}
