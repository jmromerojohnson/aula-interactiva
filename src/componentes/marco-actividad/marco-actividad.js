/* PIEZA: Marco donde corre una actividad
   La actividad corre AISLADA (iframe con sandbox): puede usar sus propios
   scripts, pero no puede leer datos del sitio ni de otras páginas.

   Excepción: las actividades hechas con Claude Design necesitan correr como
   parte del sitio ("allow-same-origin") o su motor no arranca. Solo se permite
   a las marcadas "confiable": true en el catálogo, es decir, revisadas por el
   colegio. Con ese permiso la actividad podría leer lo que el sitio guarda en
   el navegador; por eso nunca se marcan como confiables actividades sin revisar.

   Si la actividad avisa un resultado con
     window.parent.postMessage({ tipo: 'aula-resultado', actividad, puntaje, total }, '*')
   se llama a alResultado(datos). En la etapa 2 se guardará en la planilla del colegio. */

import { h } from '../../nucleo/dom.js';

const PERMISOS = 'allow-scripts allow-modals allow-popups allow-forms';

export function crearMarcoActividad({ url, titulo, confiable = false, alResultado }) {
  const marco = h('iframe', {
    class: 'marco-actividad',
    src: url,
    title: titulo,
    sandbox: confiable ? PERMISOS + ' allow-same-origin' : PERMISOS,
    allow: 'fullscreen; autoplay',
    allowfullscreen: true,
    referrerpolicy: 'no-referrer'
  });

  function alMensaje(e) {
    if (e.source !== marco.contentWindow) return;
    const d = e.data;
    if (d && d.tipo === 'aula-resultado' && alResultado) alResultado(d);
  }
  window.addEventListener('message', alMensaje);
  marco.desconectar = () => window.removeEventListener('message', alMensaje);

  return marco;
}
