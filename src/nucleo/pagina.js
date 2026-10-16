/* ARMADO DE PÁGINA
   Cada página llama a montarPagina() y recibe un <main> vacío para llenar.
   Aquí se ponen el encabezado, el pie y el aviso de error comunes,
   así ninguna página los repite. */

import { h } from './dom.js';
import { leerSitio } from './datos.js';
import { crearEncabezado } from '../componentes/encabezado/encabezado.js';
import { crearPie } from '../componentes/pie/pie.js';
import { crearEstadoVacio } from '../componentes/estado-vacio/estado-vacio.js';

/* opciones.modulo: id del módulo en config/sitio.json (marca el menú y revisa si está activo)
   opciones.modo:   'normal' (con encabezado y pie) o 'sala' (pantalla limpia para proyectar) */
export async function montarPagina({ modulo, modo = 'normal' } = {}) {
  document.body.classList.add('pagina', `pagina--${modo}`);
  const main = h('main', { id: 'contenido', class: 'pagina__contenido', tabindex: '-1' });

  let sitio;
  try {
    sitio = await leerSitio();
  } catch (error) {
    document.body.replaceChildren(main);
    main.append(crearEstadoVacio({ titulo: 'No se pudo cargar el sitio', texto: 'Revisa tu conexión y vuelve a intentarlo.', error: true }));
    throw error;
  }

  const info = sitio.modulos.find((m) => m.id === modulo);
  if (modo === 'normal') {
    document.body.replaceChildren(
      h('a', { class: 'saltar', href: '#contenido' }, 'Saltar al contenido'),
      crearEncabezado(sitio, modulo),
      main,
      crearPie(sitio)
    );
  } else {
    document.body.replaceChildren(main);
  }

  if (info && info.activo === false) {
    main.append(crearEstadoVacio({ titulo: `${info.nombre} todavía no está disponible`, texto: 'Esta sección está en construcción.', enlace: { texto: 'Volver al inicio', ruta: 'index.html' } }));
    return null;
  }
  return { main, sitio };
}

/* Muestra un error dentro de la página sin romper el resto */
export function mostrarError(contenedor, titulo = 'No se pudo cargar esta sección') {
  contenedor.replaceChildren(crearEstadoVacio({ titulo, texto: 'Revisa tu conexión y vuelve a intentarlo.', error: true }));
}
