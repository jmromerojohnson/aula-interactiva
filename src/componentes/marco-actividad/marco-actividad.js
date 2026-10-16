/* PIEZA: Marco donde corre una actividad
   La actividad corre AISLADA (iframe con sandbox): puede usar sus propios
   scripts, pero no puede leer datos del sitio ni de otras páginas.

   Si la actividad avisa un resultado con
     window.parent.postMessage({ tipo: 'aula-resultado', actividad, puntaje, total }, '*')
   se llama a alResultado(datos). En la etapa 2 se guardará en la planilla del colegio. */

import { h } from '../../nucleo/dom.js';

export function crearMarcoActividad({ url, titulo, alResultado }) {
  const marco = h('iframe', {
    class: 'marco-actividad',
    src: url,
    title: titulo,
    sandbox: 'allow-scripts allow-modals allow-popups allow-forms',
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
