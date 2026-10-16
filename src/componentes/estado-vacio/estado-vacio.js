/* PIEZA: Aviso cuando no hay nada que mostrar o algo falló */

import { h } from '../../nucleo/dom.js';
import { rutaSitio } from '../../nucleo/datos.js';

/* { titulo, texto, error, enlace: { texto, ruta }, accion: { texto, alHacer } } */
export function crearEstadoVacio({ titulo, texto, error = false, enlace, accion } = {}) {
  return h('div', { class: 'estado-vacio' + (error ? ' estado-vacio--error' : ''), role: error ? 'alert' : 'status' },
    h('strong', { class: 'estado-vacio__titulo' }, titulo),
    texto && h('p', null, texto),
    enlace && h('a', { class: 'boton', href: rutaSitio(enlace.ruta) }, enlace.texto),
    accion && h('button', { type: 'button', class: 'boton', onclick: accion.alHacer }, accion.texto)
  );
}
