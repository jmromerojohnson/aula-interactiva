/* PIEZA: Buscador
   - Sin alEscribir: es un formulario que lleva a Explorar con lo buscado (portada).
   - Con alEscribir: filtra en vivo mientras se escribe (Explorar). */

import { h } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { rutaSitio } from '../../nucleo/datos.js';

let contador = 0;

export function crearBuscador({ placeholder = 'Buscar actividades', valor = '', alEscribir, grande = false } = {}) {
  const id = 'buscar-' + (++contador);
  let espera;

  const campo = h('input', {
    id, class: 'buscador__campo', type: 'search', name: 'q',
    placeholder, value: valor, autocomplete: 'off',
    oninput: alEscribir && (() => {
      clearTimeout(espera);
      espera = setTimeout(() => alEscribir(campo.value.trim()), 150);
    })
  });

  const formulario = h('form', {
    class: 'buscador' + (grande ? ' buscador--grande' : ''),
    role: 'search',
    action: rutaSitio('explorar.html'),
    method: 'get',
    onsubmit: alEscribir && ((e) => { e.preventDefault(); alEscribir(campo.value.trim()); })
  },
    h('label', { for: id, class: 'solo-lector' }, placeholder),
    h('span', { class: 'buscador__icono' }, icono('buscar', 20)),
    campo,
    h('button', { type: 'submit', class: 'boton boton--principal' }, 'Buscar')
  );

  formulario.fijarValor = (texto) => { campo.value = texto; };
  return formulario;
}
