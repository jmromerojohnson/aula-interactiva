/* PIEZA: Temporizador para la sala
   Un botón que abre un panel con tiempos rápidos. Mientras corre,
   el botón muestra el tiempo que queda; al terminar, avisa. */

import { h, reemplazar } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { textoMinutos } from '../../nucleo/formato.js';

const MINUTOS = [1, 3, 5, 10];

export function crearTemporizador() {
  let restante = 0;     // segundos
  let reloj = null;     // intervalo activo
  let pausado = false;

  const boton = h('button', {
    type: 'button', class: 'boton boton--fantasma temporizador__boton',
    'aria-expanded': 'false', 'aria-haspopup': 'true',
    onclick: () => alternarPanel()
  });
  const panel = h('div', { class: 'temporizador__panel', hidden: true, role: 'dialog', 'aria-label': 'Temporizador' });
  const caja = h('div', { class: 'temporizador' }, boton, panel);

  function alternarPanel(abrir = panel.hidden) {
    panel.hidden = !abrir;
    boton.setAttribute('aria-expanded', String(abrir));
    if (abrir) dibujarPanel();
  }

  function iniciar(minutos) {
    detener();
    restante = minutos * 60;
    pausado = false;
    reloj = setInterval(tic, 1000);
    alternarPanel(false);
    dibujarBoton();
  }

  function tic() {
    if (pausado) return;
    restante -= 1;
    if (restante <= 0) { restante = 0; detener(); caja.classList.add('temporizador--terminado'); }
    dibujarBoton();
  }

  function detener() {
    clearInterval(reloj);
    reloj = null;
    caja.classList.remove('temporizador--terminado');
  }

  function dibujarBoton() {
    const corriendo = reloj !== null;
    const terminado = caja.classList.contains('temporizador--terminado');
    reemplazar(boton, icono('reloj', 18),
      corriendo ? h('span', { class: 'temporizador__tiempo' }, textoMinutos(restante))
        : terminado ? '¡Tiempo!' : 'Temporizador');
    boton.setAttribute('aria-label', corriendo ? `Temporizador: quedan ${textoMinutos(restante)}` : 'Temporizador');
  }

  function dibujarPanel() {
    const corriendo = reloj !== null;
    reemplazar(panel,
      h('span', { class: 'temporizador__titulo' }, 'Elige el tiempo'),
      h('div', { class: 'temporizador__opciones' },
        MINUTOS.map((m) => h('button', { type: 'button', class: 'boton', onclick: () => iniciar(m) }, `${m} min`))
      ),
      corriendo && h('div', { class: 'temporizador__opciones' },
        h('button', { type: 'button', class: 'boton', onclick: () => { pausado = !pausado; dibujarPanel(); } },
          icono(pausado ? 'reproducir' : 'pausa', 16), pausado ? 'Continuar' : 'Pausar'),
        h('button', { type: 'button', class: 'boton', onclick: () => { detener(); restante = 0; dibujarBoton(); alternarPanel(false); } },
          icono('cerrar', 16), 'Detener')
      )
    );
  }

  document.addEventListener('click', (e) => { if (!panel.hidden && !e.composedPath().includes(caja)) alternarPanel(false); });
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { alternarPanel(false); boton.focus(); } });

  dibujarBoton();
  return caja;
}
