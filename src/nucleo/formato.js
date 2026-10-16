/* Formatos de texto que se repiten en el sitio */

/* "Ñandú Ácido" -> "nandu acido" (para buscar sin importar tildes ni mayúsculas) */
export function sinTildes(texto) {
  return String(texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* [3] -> "3° básico" · [3, 4] -> "3° y 4° básico" · [1, 2, 3] -> "1°, 2° y 3° básico" */
export function textoNiveles(niveles) {
  const n = [...new Set(niveles || [])].sort((a, b) => a - b).map((x) => x + '°');
  if (!n.length) return '';
  if (n.length === 1) return n[0] + ' básico';
  return n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1] + ' básico';
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/* "2026-10-16" -> "16 oct 2026" */
export function textoFecha(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return '';
  return `${Number(m[3])} ${MESES[Number(m[2]) - 1]} ${m[1]}`;
}

/* 1 -> "1 actividad" · 3 -> "3 actividades" */
export function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}

/* 125 -> "2:05" */
export function textoMinutos(segundos) {
  const s = Math.max(0, Math.round(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
