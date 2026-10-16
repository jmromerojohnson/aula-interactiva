/* PIEZA: Acceso a una asignatura (lleva a Explorar con esa asignatura filtrada) */

import { h } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { rutaSitio } from '../../nucleo/datos.js';
import { plural } from '../../nucleo/formato.js';

export function crearTarjetaAsignatura(asignatura, cantidad) {
  return h('a', {
    class: 'tarjeta-asignatura',
    href: rutaSitio('explorar.html?asignatura=' + encodeURIComponent(asignatura.id)),
    style: { background: asignatura.fondo }
  },
    h('span', { style: { color: asignatura.color } }, icono(asignatura.icono, 30)),
    h('span', { class: 'tarjeta-asignatura__nombre' }, asignatura.nombre),
    h('span', { class: 'tarjeta-asignatura__cantidad' }, plural(cantidad, 'actividad', 'actividades'))
  );
}
