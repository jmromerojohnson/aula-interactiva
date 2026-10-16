/* Herramienta para crear elementos HTML desde JavaScript.

   h('a', { class: 'boton', href: 'x.html' }, 'Texto', otroElemento)

   - Los atributos que empiezan con "on" (onclick, oninput…) se conectan como eventos.
   - Los textos se insertan como texto (nunca como HTML), así nada externo puede
     inyectar código en la página.
   - null, undefined y false se ignoran, para poder escribir: condicion && h(...)
*/
export function h(etiqueta, atributos, ...hijos) {
  const el = document.createElement(etiqueta);
  for (const [clave, valor] of Object.entries(atributos || {})) {
    if (valor == null || valor === false) continue;
    if (clave.startsWith('on') && typeof valor === 'function') {
      el.addEventListener(clave.slice(2), valor);
    } else if (clave === 'style' && typeof valor === 'object') {
      for (const [prop, v] of Object.entries(valor)) el.style.setProperty(prop, v);
    } else if (valor === true) {
      el.setAttribute(clave, '');
    } else {
      el.setAttribute(clave, String(valor));
    }
  }
  agregar(el, hijos);
  return el;
}

function agregar(el, hijos) {
  for (const hijo of hijos) {
    if (hijo == null || hijo === false) continue;
    if (Array.isArray(hijo)) agregar(el, hijo);
    else el.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
  }
}

/* Reemplaza todo el contenido de un elemento */
export function reemplazar(el, ...hijos) {
  el.replaceChildren();
  agregar(el, hijos);
  return el;
}
