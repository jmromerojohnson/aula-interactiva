/* PÁGINA: Explorar (explorar.html)
   Busca y filtra el catálogo. Los filtros quedan en la dirección
   (ej: explorar.html?nivel=3&asignatura=religion), así un enlace
   compartido abre con los mismos filtros. */

import { h, reemplazar } from '../../nucleo/dom.js';
import { icono } from '../../nucleo/iconos.js';
import { leerActividades, leerAsignaturas, rutaSitio } from '../../nucleo/datos.js';
import { sinTildes, textoNiveles, plural } from '../../nucleo/formato.js';
import { montarPagina, mostrarError } from '../../nucleo/pagina.js';
import { crearBuscador } from '../../componentes/buscador/buscador.js';
import { crearTarjetaActividad } from '../../componentes/tarjeta-actividad/tarjeta-actividad.js';
import { crearEstadoVacio } from '../../componentes/estado-vacio/estado-vacio.js';

const pagina = await montarPagina({ modulo: 'explorar' });
if (pagina) {
  const { main, sitio } = pagina;
  try {
    const [actividades, asignaturas] = await Promise.all([leerActividades(), leerAsignaturas()]);
    iniciar(main, sitio, actividades, asignaturas);
  } catch (error) {
    mostrarError(main, 'No se pudieron cargar las actividades');
    console.error(error);
  }
}

function iniciar(main, sitio, actividades, asignaturas) {
  /* ---------- Estado (leído desde la dirección) ---------- */
  const p = new URLSearchParams(location.search);
  const lista = (v) => (v ? v.split(',').filter(Boolean) : []);
  const estado = {
    q: p.get('q') || '',
    nivel: Number(p.get('nivel')) || 0,
    asignaturas: lista(p.get('asignatura')),
    tipos: lista(p.get('tipo')),
    orden: p.get('orden') === 'titulo' ? 'titulo' : 'recientes'
  };

  function guardarEnDireccion() {
    const u = new URLSearchParams();
    if (estado.q) u.set('q', estado.q);
    if (estado.nivel) u.set('nivel', estado.nivel);
    if (estado.asignaturas.length) u.set('asignatura', estado.asignaturas.join(','));
    if (estado.tipos.length) u.set('tipo', estado.tipos.join(','));
    if (estado.orden !== 'recientes') u.set('orden', estado.orden);
    const s = u.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }

  function cambiar(cambios) {
    Object.assign(estado, cambios);
    guardarEnDireccion();
    dibujar();
  }

  const alternar = (arreglo, valor) => (arreglo.includes(valor) ? arreglo.filter((x) => x !== valor) : [...arreglo, valor]);

  /* ---------- Filtrado ---------- */
  function filtrar() {
    const palabras = sinTildes(estado.q).split(/\s+/).filter(Boolean);
    const resultado = actividades.filter((a) => {
      if (estado.nivel && !a.niveles.includes(estado.nivel)) return false;
      if (estado.asignaturas.length && !estado.asignaturas.includes(a.asignatura)) return false;
      if (estado.tipos.length && !estado.tipos.includes(a.tipo)) return false;
      if (palabras.length) {
        const texto = sinTildes([a.titulo, a.asignaturaInfo.nombre, textoNiveles(a.niveles), a.tipo, a.descripcion, a.autor].join(' '));
        if (!palabras.every((w) => texto.includes(w))) return false;
      }
      return true;
    });
    return resultado.sort(estado.orden === 'titulo'
      ? (a, b) => a.titulo.localeCompare(b.titulo, 'es')
      : (a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  }

  /* ---------- Estructura de la página ---------- */
  const buscador = crearBuscador({ placeholder: 'Busca por tema, asignatura o tipo', valor: estado.q, alEscribir: (q) => cambiar({ q }) });
  const filtros = h('aside', { class: 'explorar__filtros', 'aria-label': 'Filtros' });
  const resumen = h('div', { class: 'explorar__resumen', 'aria-live': 'polite' });
  const grilla = h('div', { class: 'grilla', style: { '--grilla-min': '280px' } });
  const selectorOrden = h('select', { class: 'explorar__orden', id: 'orden', onchange: (e) => cambiar({ orden: e.target.value }) },
    h('option', { value: 'recientes' }, 'Más recientes'),
    h('option', { value: 'titulo' }, 'Por nombre')
  );

  main.append(
    h('section', { class: 'contenedor explorar__cabecera' },
      h('nav', { class: 'explorar__ruta', 'aria-label': 'Ruta' }, h('a', { href: rutaSitio('index.html') }, 'Inicio'), ' / Explorar'),
      h('h1', null, 'Explorar actividades'),
      buscador
    ),
    h('div', { class: 'contenedor explorar__cuerpo' },
      filtros,
      h('section', { class: 'explorar__resultados', 'aria-label': 'Resultados' },
        h('div', { class: 'explorar__barra' },
          resumen,
          h('label', { class: 'explorar__etiqueta-orden', for: 'orden' }, 'Ordenar', selectorOrden)
        ),
        grilla
      )
    )
  );

  /* ---------- Dibujo ---------- */
  const tipos = [...new Set(actividades.map((a) => a.tipo).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const contar = (fn) => actividades.filter(fn).length;

  function casilla(texto, marcada, alCambiar, cantidad) {
    return h('label', { class: 'explorar__casilla' },
      h('input', { type: 'checkbox', checked: marcada, onchange: alCambiar }),
      h('span', null, texto),
      cantidad != null && h('span', { class: 'explorar__cantidad' }, String(cantidad))
    );
  }

  function grupo(titulo, ...contenido) {
    return h('fieldset', { class: 'explorar__grupo' }, h('legend', null, titulo), ...contenido);
  }

  function dibujarFiltros() {
    reemplazar(filtros,
      grupo('Nivel', h('div', { class: 'explorar__niveles' },
        (sitio.niveles || []).map((n) => h('button', {
          type: 'button', class: 'pildora', 'aria-pressed': String(estado.nivel === n),
          onclick: () => cambiar({ nivel: estado.nivel === n ? 0 : n })
        }, textoNiveles([n])))
      )),
      grupo('Asignatura', asignaturas.map((asig) => casilla(asig.nombre, estado.asignaturas.includes(asig.id),
        () => cambiar({ asignaturas: alternar(estado.asignaturas, asig.id) }), contar((a) => a.asignatura === asig.id)))),
      tipos.length > 0 && grupo('Tipo', tipos.map((t) => casilla(t, estado.tipos.includes(t),
        () => cambiar({ tipos: alternar(estado.tipos, t) }), contar((a) => a.tipo === t)))),
      hayFiltros() && h('button', { type: 'button', class: 'boton boton--enlace', onclick: limpiar }, 'Limpiar filtros')
    );
  }

  function hayFiltros() {
    return !!(estado.q || estado.nivel || estado.asignaturas.length || estado.tipos.length);
  }

  function limpiar() {
    buscador.fijarValor('');
    cambiar({ q: '', nivel: 0, asignaturas: [], tipos: [] });
  }

  function chipFiltro(texto, quitar) {
    return h('span', { class: 'filtro-activo' }, texto,
      h('button', { type: 'button', 'aria-label': `Quitar filtro ${texto}`, onclick: quitar }, icono('cerrar', 14)));
  }

  function dibujar() {
    const resultado = filtrar();
    selectorOrden.value = estado.orden;
    dibujarFiltros();

    const nombreAsig = (id) => (asignaturas.find((a) => a.id === id) || { nombre: id }).nombre;
    reemplazar(resumen,
      h('strong', null, plural(resultado.length, 'actividad', 'actividades')),
      estado.q && chipFiltro(`“${estado.q}”`, () => { buscador.fijarValor(''); cambiar({ q: '' }); }),
      estado.nivel > 0 && chipFiltro(textoNiveles([estado.nivel]), () => cambiar({ nivel: 0 })),
      estado.asignaturas.map((id) => chipFiltro(nombreAsig(id), () => cambiar({ asignaturas: alternar(estado.asignaturas, id) }))),
      estado.tipos.map((t) => chipFiltro(t, () => cambiar({ tipos: alternar(estado.tipos, t) })))
    );

    reemplazar(grilla, resultado.length
      ? resultado.map(crearTarjetaActividad)
      : crearEstadoVacio({
        titulo: 'No encontramos actividades con esos filtros',
        texto: 'Prueba con otra palabra o quita algún filtro.',
        accion: { texto: 'Limpiar filtros', alHacer: limpiar }
      }));
  }

  dibujar();
}
