/* Aula Interactiva · lógica compartida
   - Lee actividades/catalogo.json
   - Dibuja las tarjetas de actividad
   - Abre una actividad a pantalla completa, aislada en un iframe con sandbox */

(function () {
  'use strict';

  var CARPETA = 'actividades/';
  var NOMBRE_VALIDO = /^[a-z0-9][a-z0-9-]*\.html$/;

  // ---------- Datos ----------
  var promesaCatalogo = null;
  function cargarCatalogo() {
    if (!promesaCatalogo) {
      promesaCatalogo = fetch(CARPETA + 'catalogo.json', { cache: 'no-cache' })
        .then(function (r) {
          if (!r.ok) throw new Error('No se pudo leer el catálogo');
          return r.json();
        })
        .then(function (lista) {
          return (Array.isArray(lista) ? lista : []).filter(function (a) {
            return a && typeof a.archivo === 'string' && NOMBRE_VALIDO.test(a.archivo);
          });
        });
    }
    return promesaCatalogo;
  }

  function sinTildes(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // ---------- Tarjetas ----------
  // Cada tipo de actividad tiene su dibujo de miniatura y color de fondo.
  var DIBUJOS = [
    { claves: ['quiz', 'alternativa', 'verdadero', 'evaluacion', 'prueba'], fondo: '#FAE7E7', dibujo: 'quiz' },
    { claves: ['ruleta'], fondo: '#E3F1E9', dibujo: 'ruleta' },
    { claves: ['memorice', 'pares'], fondo: '#E3F1E9', dibujo: 'memo' },
    { claves: ['guia', 'lectura', 'comprension'], fondo: '#E4EDFB', dibujo: 'guia' },
    { claves: ['temporizador', 'dinamica', 'reloj'], fondo: '#F6EEDC', dibujo: 'timer' }
  ];
  var AVATARES = [
    ['#E4EDFB', '#2C6BD3'], ['#E3F1E9', '#23804F'], ['#FAE7E7', '#C2373B'], ['#10264A', '#FFFFFF']
  ];

  function el(etiqueta, clase, texto) {
    var n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function dibujoMiniatura(tipo) {
    var t = sinTildes(tipo);
    var d = null;
    for (var i = 0; i < DIBUJOS.length && !d; i++) {
      for (var j = 0; j < DIBUJOS[i].claves.length; j++) {
        if (t.indexOf(DIBUJOS[i].claves[j]) !== -1) { d = DIBUJOS[i]; break; }
      }
    }
    var cont;
    if (!d) {
      cont = el('div', 'mini-html');
      cont.innerHTML = '<span></span><span><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"></path></svg></span>';
      return { fondo: '#EDE9F8', nodo: cont };
    }
    if (d.dibujo === 'quiz') { cont = el('div', 'mini-quiz'); cont.innerHTML = '<span></span><span></span><span></span><span></span><span></span>'; }
    if (d.dibujo === 'ruleta') { cont = el('div', 'mini-ruleta'); }
    if (d.dibujo === 'memo') { cont = el('div', 'mini-memo'); cont.innerHTML = '<span></span><span class="vuelta"></span><span></span><span></span><span></span><span></span><span class="vuelta"></span><span></span>'; }
    if (d.dibujo === 'guia') { cont = el('div', 'mini-guia'); cont.innerHTML = '<span></span><span></span><span></span><span></span><span></span>'; }
    if (d.dibujo === 'timer') { cont = el('div', 'mini-timer', '04:59'); }
    cont.setAttribute('aria-hidden', 'true');
    return { fondo: d.fondo, nodo: cont };
  }

  function iniciales(nombre) {
    var partes = String(nombre || '').replace(/^prof\.?\s+/i, '').split(/[\s.]+/).filter(Boolean);
    return ((partes[0] || '?')[0] + (partes[1] ? partes[1][0] : '')).toUpperCase();
  }

  function colorAvatar(nombre) {
    var s = 0;
    for (var i = 0; i < nombre.length; i++) s = (s + nombre.charCodeAt(i)) % AVATARES.length;
    return AVATARES[s];
  }

  function crearTarjeta(a) {
    var b = el('button', 'tarjeta');
    b.type = 'button';
    b.setAttribute('aria-label', 'Abrir a pantalla completa: ' + (a.titulo || a.archivo));

    var m = dibujoMiniatura(a.tipo);
    var mini = el('div', 'miniatura');
    mini.style.background = m.fondo;
    mini.appendChild(el('span', 'insignia', a.tipo || 'Actividad'));
    mini.appendChild(m.nodo);
    b.appendChild(mini);

    var cuerpo = el('div', 'tarjeta-cuerpo');
    cuerpo.appendChild(el('h3', null, a.titulo || a.archivo));
    var meta = [a.asignatura, a.nivel].filter(Boolean).join(' · ');
    if (meta) cuerpo.appendChild(el('span', 'tarjeta-meta', meta));
    if (a.descripcion) cuerpo.appendChild(el('span', 'tarjeta-desc', a.descripcion));
    if (a.autor) {
      var autor = el('span', 'tarjeta-autor');
      var av = el('span', 'avatar', iniciales(a.autor));
      var c = colorAvatar(a.autor);
      av.style.background = c[0];
      av.style.color = c[1];
      av.setAttribute('aria-hidden', 'true');
      autor.appendChild(av);
      autor.appendChild(document.createTextNode(a.autor));
      cuerpo.appendChild(autor);
    }
    b.appendChild(cuerpo);

    b.addEventListener('click', function () { abrirActividad(a, true); });
    return b;
  }

  // ---------- Visor a pantalla completa ----------
  var visor = null, visorTitulo, visorMarco, botonPantalla, actividadAbierta = null, conHistorial = false;

  var ICONO_CERRAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
  var ICONO_AMPLIAR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"></path></svg>';
  var ICONO_REDUCIR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"></path></svg>';
  var ICONO_PESTANA = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"></path></svg>';

  function crearVisor() {
    visor = el('div', 'visor');
    visor.hidden = true;
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');

    var barra = el('div', 'visor-barra');
    var cerrar = el('button');
    cerrar.type = 'button';
    cerrar.innerHTML = ICONO_CERRAR + '<span class="texto-boton">Salir</span>';
    cerrar.setAttribute('aria-label', 'Salir de la actividad');
    cerrar.addEventListener('click', function () { cerrarActividad(true); });

    visorTitulo = el('h2');
    visorTitulo.id = 'visor-titulo';
    visor.setAttribute('aria-labelledby', 'visor-titulo');

    var pestana = el('button');
    pestana.type = 'button';
    pestana.innerHTML = ICONO_PESTANA + '<span class="texto-boton">Abrir sola</span>';
    pestana.setAttribute('aria-label', 'Abrir la actividad sola en otra pestaña');
    pestana.addEventListener('click', function () {
      if (actividadAbierta) window.open(CARPETA + actividadAbierta.archivo, '_blank', 'noopener');
    });

    botonPantalla = el('button');
    botonPantalla.type = 'button';
    botonPantalla.addEventListener('click', alternarPantallaCompleta);

    barra.appendChild(cerrar);
    barra.appendChild(visorTitulo);
    barra.appendChild(pestana);
    barra.appendChild(botonPantalla);

    // La actividad corre aislada: puede usar scripts, pero no ve datos del sitio.
    visorMarco = document.createElement('iframe');
    visorMarco.setAttribute('sandbox', 'allow-scripts allow-modals allow-popups allow-forms');
    visorMarco.setAttribute('allow', 'fullscreen; autoplay');
    visorMarco.setAttribute('allowfullscreen', '');
    visorMarco.setAttribute('referrerpolicy', 'no-referrer');

    visor.appendChild(barra);
    visor.appendChild(visorMarco);
    document.body.appendChild(visor);

    document.addEventListener('fullscreenchange', actualizarBotonPantalla);
    document.addEventListener('webkitfullscreenchange', actualizarBotonPantalla);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !visor.hidden && !enPantallaCompleta()) cerrarActividad(true);
    });
    actualizarBotonPantalla();
  }

  function enPantallaCompleta() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }
  function pedirPantallaCompleta() {
    var f = visor.requestFullscreen || visor.webkitRequestFullscreen;
    if (!f) return;
    try {
      var p = f.call(visor);
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }
  function salirPantallaCompleta() {
    if (!enPantallaCompleta()) return;
    var f = document.exitFullscreen || document.webkitExitFullscreen;
    try {
      var p = f && f.call(document);
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }
  function alternarPantallaCompleta() {
    if (enPantallaCompleta()) salirPantallaCompleta(); else pedirPantallaCompleta();
  }
  function actualizarBotonPantalla() {
    if (!botonPantalla) return;
    var on = enPantallaCompleta();
    botonPantalla.innerHTML = (on ? ICONO_REDUCIR : ICONO_AMPLIAR) +
      '<span class="texto-boton">' + (on ? 'Salir de pantalla completa' : 'Pantalla completa') + '</span>';
    botonPantalla.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Pantalla completa');
    // Algunos celulares (iPhone) no permiten pantalla completa: se oculta el botón.
    botonPantalla.hidden = !(visor.requestFullscreen || visor.webkitRequestFullscreen);
  }

  function abrirActividad(a, pantallaCompleta) {
    if (!a || !NOMBRE_VALIDO.test(a.archivo)) return;
    if (!visor) crearVisor();
    actividadAbierta = a;
    visorTitulo.textContent = [a.titulo || a.archivo, a.nivel].filter(Boolean).join(' · ');
    visorMarco.title = a.titulo || a.archivo;
    visorMarco.src = CARPETA + a.archivo;
    visor.hidden = false;
    document.body.classList.add('con-visor');
    // La pantalla completa debe pedirse justo al tocar la tarjeta.
    if (pantallaCompleta) pedirPantallaCompleta();
    var hash = '#ver=' + a.archivo.replace(/\.html$/, '');
    if (location.hash !== hash) { history.pushState({ ver: a.archivo }, '', hash); conHistorial = true; }
    visorMarco.focus();
  }

  function cerrarActividad(volverAtras) {
    if (!visor || visor.hidden) return;
    salirPantallaCompleta();
    visor.hidden = true;
    visorMarco.src = 'about:blank';
    actividadAbierta = null;
    document.body.classList.remove('con-visor');
    if (volverAtras && /^#ver=/.test(location.hash)) {
      if (conHistorial) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    conHistorial = false;
  }

  // Enlaces directos: catalogo.html#ver=vertebrados-3basico
  function revisarEnlace() {
    var m = location.hash.match(/^#ver=([a-z0-9-]+)$/);
    if (!m) { cerrarActividad(false); return; }
    cargarCatalogo().then(function (lista) {
      var a = lista.filter(function (x) { return x.archivo === m[1] + '.html'; })[0];
      if (a) abrirActividad(a, false);
    }).catch(function () {});
  }
  window.addEventListener('popstate', revisarEnlace);
  window.addEventListener('hashchange', revisarEnlace);

  // Resultados que avisan las actividades (convención "aula-resultado").
  // Por ahora solo se reciben; en la etapa 2 se guardarán en la planilla del colegio.
  window.addEventListener('message', function (e) {
    if (!visorMarco || e.source !== visorMarco.contentWindow) return;
    var d = e.data;
    if (d && d.tipo === 'aula-resultado') {
      document.dispatchEvent(new CustomEvent('aula-resultado', { detail: d }));
    }
  });

  window.Aula = {
    cargarCatalogo: cargarCatalogo,
    crearTarjeta: crearTarjeta,
    abrirActividad: abrirActividad,
    sinTildes: sinTildes,
    revisarEnlace: revisarEnlace
  };
})();
