/* PIEZA: Tarjeta de actividad
   Recibe una actividad ya preparada por nucleo/datos.js (leerActividades)
   y devuelve un enlace a la sala, donde se proyecta. */

import { h } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { rutaSitio } from '../../nucleo/datos.js';
import { textoNiveles, textoFecha } from '../../nucleo/formato.js';

export function urlSala(actividad) {
  return rutaSitio('sala.html?a=' + encodeURIComponent(actividad.id));
}

export function crearTarjetaActividad(a) {
  const asig = a.asignaturaInfo;
  const imagen = a.portadaUrl
    ? h('img', { class: 'tarjeta__foto', src: a.portadaUrl, alt: '', loading: 'lazy' })
    : h('span', { class: 'tarjeta__dibujo', style: { color: asig.color } }, icono(asig.icono, 84));

  return h('a', { class: 'tarjeta', href: urlSala(a) },
    h('div', { class: 'tarjeta__imagen', style: { background: asig.fondo } },
      imagen,
      h('span', { class: 'etiqueta etiqueta--sobre-imagen tarjeta__asignatura', style: { color: asig.color } }, asig.nombre)
    ),
    h('div', { class: 'tarjeta__cuerpo' },
      h('h3', { class: 'tarjeta__titulo' }, a.titulo),
      a.descripcion && h('p', { class: 'tarjeta__descripcion' }, a.descripcion),
      h('div', { class: 'tarjeta__etiquetas' },
        a.niveles.length > 0 && h('span', { class: 'etiqueta' }, textoNiveles(a.niveles)),
        a.tipo && h('span', { class: 'etiqueta' }, a.tipo)
      ),
      h('div', { class: 'tarjeta__pie' },
        h('span', { class: 'tarjeta__autor' }, [a.autor, textoFecha(a.fecha)].filter(Boolean).join(' · ')),
        h('span', { class: 'tarjeta__accion' }, icono('reproducir', 14), 'Proyectar')
      )
    )
  );
}
