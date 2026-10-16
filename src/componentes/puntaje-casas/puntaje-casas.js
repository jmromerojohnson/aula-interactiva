/* PIEZA: Puntaje por casas (Cóndor, Águilas, Pumas, Linces)
   Las casas y sus colores vienen de config/sitio.json.
   El puntaje se recuerda en este navegador mientras dura la clase
   (clave = id de la actividad), así no se pierde si se recarga la página. */

import { h, reemplazar } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { recordar, recuperar } from '../../nucleo/datos.js';

export function crearPuntajeCasas({ casas, clave = 'general' }) {
  const guardado = 'puntaje:' + clave;
  const puntos = Object.assign(Object.fromEntries(casas.map((c) => [c.id, 0])), recuperar(guardado, {}));
  const lista = h('div', { class: 'puntaje-casas__lista' });

  function cambiar(id, d) {
    puntos[id] = Math.max(0, (puntos[id] || 0) + d);
    recordar(guardado, puntos);
    dibujar();
  }

  function reiniciar() {
    casas.forEach((c) => { puntos[c.id] = 0; });
    recordar(guardado, puntos);
    dibujar();
  }

  function dibujar() {
    const maximo = Math.max(...casas.map((c) => puntos[c.id]));
    reemplazar(lista, casas.map((c) => {
      const lider = maximo > 0 && puntos[c.id] === maximo;
      return h('div', { class: 'puntaje-casas__casa' + (lider ? ' puntaje-casas__casa--lider' : '') },
        h('span', { class: 'puntaje-casas__color', style: { background: c.color } }),
        h('span', { class: 'puntaje-casas__nombre' }, c.nombre),
        h('button', { type: 'button', class: 'puntaje-casas__boton', 'aria-label': `Restar un punto a ${c.nombre}`, onclick: () => cambiar(c.id, -1) }, icono('menos', 20)),
        h('span', { class: 'puntaje-casas__puntos', 'aria-live': 'polite', 'aria-label': `${c.nombre}: ${puntos[c.id]} puntos` }, String(puntos[c.id])),
        h('button', { type: 'button', class: 'puntaje-casas__boton puntaje-casas__boton--sumar', 'aria-label': `Sumar un punto a ${c.nombre}`, onclick: () => cambiar(c.id, 1) }, icono('mas', 20))
      );
    }));
  }

  dibujar();
  return h('section', { class: 'puntaje-casas', 'aria-label': 'Puntaje por casas' },
    lista,
    h('button', { type: 'button', class: 'boton boton--fantasma boton--icono', 'aria-label': 'Reiniciar puntaje', title: 'Reiniciar puntaje', onclick: reiniciar }, icono('reiniciar', 18))
  );
}
