/* PIEZA: Botón de pantalla completa
   Pone en pantalla completa el elemento "objetivo" (por defecto, toda la página).
   En equipos que no lo permiten (iPhone) el botón no aparece. */

import { h, reemplazar } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';

const activo = () => !!(document.fullscreenElement || document.webkitFullscreenElement);

export function crearBotonPantallaCompleta(objetivo = document.documentElement) {
  const pedir = objetivo.requestFullscreen || objetivo.webkitRequestFullscreen;
  const salir = document.exitFullscreen || document.webkitExitFullscreen;

  const boton = h('button', {
    type: 'button', class: 'boton boton--acento boton--icono',
    hidden: !pedir,
    onclick: () => {
      try {
        const p = activo() ? salir.call(document) : pedir.call(objetivo);
        if (p && p.catch) p.catch(() => {});
      } catch { /* el navegador no lo permitió */ }
    }
  });

  function actualizar() {
    const on = activo();
    reemplazar(boton, icono(on ? 'reducir' : 'ampliar', 20));
    boton.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Pantalla completa');
    boton.title = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  }
  document.addEventListener('fullscreenchange', actualizar);
  document.addEventListener('webkitfullscreenchange', actualizar);
  actualizar();
  return boton;
}
