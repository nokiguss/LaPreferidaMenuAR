// Navegación sencilla entre la lista y el visor.
// El link con #id (ej. .../#taco-dorado) abre directo ese taco,
// así podemos tener un QR por taco si lo queremos.

const lista = document.getElementById('lista');
const visor = document.getElementById('visor');
const modelo = document.getElementById('modelo');
const nombre = document.getElementById('nombre');
const aviso = document.getElementById('aviso');
const cargando = document.getElementById('cargando');

function pintarLista() {
  lista.innerHTML = '';
  TACOS.forEach((taco) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'tarjeta';
    boton.innerHTML = `<span class="tarjeta-icono">🌮</span><span>${taco.nombre}</span>`;
    boton.addEventListener('click', () => { location.hash = taco.id; });
    lista.appendChild(boton);
  });
}

function mostrar() {
  const taco = TACOS.find((t) => t.id === location.hash.slice(1));

  if (!taco) {
    visor.hidden = true;
    lista.hidden = false;
    modelo.removeAttribute('src');
    return;
  }

  lista.hidden = true;
  visor.hidden = false;
  nombre.textContent = taco.nombre;
  modelo.alt = `Taco en 3D: ${taco.nombre}`;
  cargando.hidden = false;
  cargando.textContent = 'Cargando…';
  modelo.src = taco.modelo;
  window.scrollTo(0, 0);
}

modelo.addEventListener('load', () => {
  cargando.hidden = true;
  aviso.hidden = modelo.canActivateAR;
});

modelo.addEventListener('error', () => {
  cargando.textContent = location.protocol === 'file:'
    ? 'No se puede cargar abriendo el archivo directo. Abre la página desde el servidor (http://localhost:5173).'
    : 'No se pudo cargar el taco. Revisa tu conexión e inténtalo de nuevo.';
});

document.getElementById('volver').addEventListener('click', () => {
  history.length > 1 ? history.back() : (location.hash = '');
});

window.addEventListener('hashchange', mostrar);
pintarLista();
mostrar();
