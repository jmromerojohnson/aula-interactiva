/* Íconos del sitio (trazos simples, 24×24).
   Para agregar uno: suma una línea con su nombre y su dibujo SVG.
   Se usan así: icono('buscar') o icono('buscar', 18) */

const TRAZOS = {
  logo: '<path d="M3 19l6-9 4 5 3-4 5 8z"/><circle cx="17" cy="6" r="2"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  volver: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  ampliar: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  reducir: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
  pestana: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  copa: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
  reloj: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/>',
  reiniciar: '<path d="M4 4v6h6"/><path d="M20 12a8 8 0 1 1-2.3-5.7L20 9"/>',
  pausa: '<path d="M9 5v14M15 5v14"/>',
  filtro: '<path d="M4 5h16l-6 8v5l-4 2v-7z"/>',
  /* Asignaturas */
  libro: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
  calculo: '<path d="M6 6h4M8 4v4M14 7h4M6 16l4 4M10 16l-4 4M14 16h4M14 19h4"/>',
  hoja: '<path d="M12 21c-4-3-7-7-7-11a7 7 0 0 1 14 0c0 4-3 8-7 11z"/><path d="M12 21V10M12 14l3-3M12 12l-3-2"/>',
  mundo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  cruz: '<path d="M12 3v18M7 8h10"/>',
  dialogo: '<path d="M4 6h16v10H9l-5 4z"/>',
  actividad: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
  /* Plantillas */
  pregunta: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"/>',
  ruleta: '<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 5M12 12l-7 5"/>',
  cuadricula: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  grupo: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 19c0-3 2-5 5-5s5 2 5 5M11 19c0-3 2-5 5-5s5 2 5 5"/>',
  lista: '<path d="M4 7h16M4 12h10M4 17h13"/>'
};

/* Íconos rellenos (no de trazo) */
const RELLENOS = {
  reproducir: '<path d="M7 4.5v15l12-7.5z"/>'
};

export function icono(nombre, tamano = 20) {
  const relleno = nombre in RELLENOS;
  const dibujo = relleno ? RELLENOS[nombre] : (TRAZOS[nombre] || TRAZOS.actividad);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', tamano);
  svg.setAttribute('height', tamano);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'icono');
  if (relleno) {
    svg.setAttribute('fill', 'currentColor');
  } else {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
  }
  svg.innerHTML = dibujo; // dibujos fijos de este archivo, nunca datos externos
  return svg;
}

export const NOMBRES_ICONOS = [...Object.keys(TRAZOS), ...Object.keys(RELLENOS)];
