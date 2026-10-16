/* CAPA DE DATOS
   Es el único archivo que sabe DE DÓNDE vienen los datos.
   Las páginas y piezas piden los datos aquí y no saben si vienen de un
   archivo JSON del repositorio, de la planilla del colegio (Apps Script)
   o de otro lugar. Cuando cambie el origen, se cambia solo este archivo. */

const RAIZ = new URL('../../', import.meta.url);   // carpeta principal del sitio
const ID_VALIDO = /^[a-z0-9][a-z0-9-]*$/;

const memoria = new Map();

function leerJSON(ruta) {
  if (!memoria.has(ruta)) {
    const promesa = fetch(new URL(ruta, RAIZ), { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(`No se pudo leer ${ruta}`);
      return r.json();
    });
    memoria.set(ruta, promesa);
    promesa.catch(() => memoria.delete(ruta)); // si falla, se puede reintentar
  }
  return memoria.get(ruta);
}

/* ---------- Configuración ---------- */
export const leerSitio = () => leerJSON('config/sitio.json');
export const leerPortada = () => leerJSON('config/portada.json');
export const leerAsignaturas = () => leerJSON('config/asignaturas.json');

/* ---------- Actividades ---------- */
export async function leerActividades() {
  const [lista, asignaturas] = await Promise.all([leerJSON('actividades/catalogo.json'), leerAsignaturas()]);
  const porId = new Map(asignaturas.map((a) => [a.id, a]));
  return (Array.isArray(lista) ? lista : [])
    .filter((a) => a && typeof a.id === 'string' && ID_VALIDO.test(a.id))
    .map((a) => ({
      ...a,
      niveles: Array.isArray(a.niveles) ? a.niveles : [],
      asignaturaInfo: porId.get(a.asignatura) || { id: a.asignatura || '', nombre: a.asignatura || 'Otra', color: '#5A6274', fondo: '#F2EEE6', icono: 'actividad' },
      url: rutaActividad(a.id, 'index.html'),
      portadaUrl: a.portada ? rutaActividad(a.id, a.portada) : ''
    }));
}

export async function leerActividad(id) {
  const lista = await leerActividades();
  return lista.find((a) => a.id === id) || null;
}

/* Dirección de una actividad o de un archivo dentro de su carpeta */
export function rutaActividad(id, archivo = '') {
  if (!ID_VALIDO.test(id)) return '';
  const limpio = String(archivo).replace(/^\/+/, '').replace(/\.\.+/g, '');
  return new URL(`actividades/${id}/${limpio}`, RAIZ).href;
}

/* Dirección de una página del sitio (sala.html, explorar.html…) */
export function rutaSitio(ruta) {
  return new URL(ruta, RAIZ).href;
}

/* ---------- Preferencias de este navegador ----------
   Solo para comodidades (recordar un filtro, el puntaje en curso).
   Si el navegador no deja guardar, todo sigue funcionando. */
export function recordar(clave, valor) {
  try { localStorage.setItem('aula:' + clave, JSON.stringify(valor)); } catch { /* sin almacenamiento */ }
}
export function recuperar(clave, porDefecto) {
  try {
    const v = localStorage.getItem('aula:' + clave);
    return v == null ? porDefecto : JSON.parse(v);
  } catch {
    return porDefecto;
  }
}
