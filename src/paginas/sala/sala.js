/* PÁGINA: Sala (sala.html?a=<id de la actividad>)
   Lo que se proyecta: barra delgada del profesor, la actividad a pantalla
   completa y, si se activa, el puntaje por casas. */

import { h } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { leerActividad, rutaSitio, recordar, recuperar } from '../../nucleo/datos.js';
import { textoNiveles } from '../../nucleo/formato.js';
import { montarPagina } from '../../nucleo/pagina.js';
import { crearMarcoActividad } from '../../componentes/marco-actividad/marco-actividad.js';
import { crearPuntajeCasas } from '../../componentes/puntaje-casas/puntaje-casas.js';
import { crearTemporizador } from '../../componentes/temporizador/temporizador.js';
import { crearBotonPantallaCompleta } from '../../componentes/pantalla-completa/pantalla-completa.js';
import { crearEstadoVacio } from '../../componentes/estado-vacio/estado-vacio.js';

const pagina = await montarPagina({ modulo: 'sala', modo: 'sala' });
if (pagina) {
  const { main, sitio } = pagina;
  const id = new URLSearchParams(location.search).get('a') || '';
  let actividad = null;
  try { actividad = await leerActividad(id); } catch (error) { console.error(error); }

  if (!actividad) {
    main.classList.add('sala--sin-actividad');
    main.append(crearEstadoVacio({
      titulo: 'No encontramos esta actividad',
      texto: 'Puede que el enlace esté incompleto o que la actividad se haya movido.',
      enlace: { texto: 'Ir a Explorar', ruta: 'explorar.html' }
    }));
  } else {
    montarSala(main, sitio, actividad);
  }
}

function montarSala(main, sitio, a) {
  document.title = `${a.titulo} · ${sitio.nombre}`;
  main.classList.add('sala');

  /* Puntaje por casas: se muestra u oculta, y se recuerda la elección */
  let conCasas = recuperar('sala:casas', false);
  const puntaje = crearPuntajeCasas({ casas: sitio.casas || [], clave: a.id });
  puntaje.hidden = !conCasas;
  const botonCasas = h('button', {
    type: 'button', class: 'boton boton--fantasma', 'aria-pressed': String(conCasas), 'aria-label': 'Puntaje por casas',
    onclick: () => {
      conCasas = !conCasas;
      puntaje.hidden = !conCasas;
      botonCasas.setAttribute('aria-pressed', String(conCasas));
      recordar('sala:casas', conCasas);
    }
  }, icono('copa', 18), h('span', { class: 'sala__texto-boton' }, 'Puntaje por casas'));

  /* "Volver" regresa a la página anterior del sitio, o a Explorar */
  const vieneDelSitio = document.referrer && new URL(document.referrer).origin === location.origin;
  const volver = h('a', {
    class: 'boton boton--fantasma', href: rutaSitio('explorar.html'), 'aria-label': 'Volver',
    onclick: (e) => { if (vieneDelSitio && history.length > 1) { e.preventDefault(); history.back(); } }
  }, icono('volver', 18), h('span', { class: 'sala__texto-boton' }, 'Volver'));

  main.append(
    h('header', { class: 'sala__barra' },
      volver,
      h('div', { class: 'sala__titulo' },
        h('h1', null, a.titulo),
        h('span', null, [a.asignaturaInfo.nombre, textoNiveles(a.niveles)].filter(Boolean).join(' · '))
      ),
      h('div', { class: 'sala__controles' },
        botonCasas,
        crearTemporizador(),
        h('a', { class: 'boton boton--fantasma boton--icono', href: a.url, target: '_blank', rel: 'noopener', 'aria-label': 'Abrir la actividad sola en otra pestaña', title: 'Abrir sola en otra pestaña' }, icono('pestana', 18)),
        crearBotonPantallaCompleta()
      )
    ),
    h('div', { class: 'sala__escenario' },
      crearMarcoActividad({
        url: a.url,
        titulo: a.titulo,
        confiable: a.confiable === true,
        alResultado: (datos) => document.dispatchEvent(new CustomEvent('aula-resultado', { detail: datos }))
      })
    ),
    puntaje
  );
}
