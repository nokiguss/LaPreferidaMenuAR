// Lista de tacos que se muestran en la página.
// Para agregar o cambiar un taco, solo edita esta lista:
//   id:     identificador corto, sin espacios ni acentos (se usa en el link directo: .../#taco-dorado)
//   nombre: lo que ve el cliente
//   modelo: archivo 3D (.glb) dentro de la carpeta "models"
//
// Mientras no tengamos los escaneos reales, todos usan "prueba.glb".

const TACOS = [
  { id: 'alcancia-yoshi',      nombre: 'Taco Yoshi', modelo: 'models/alcancia-yoshi-v5.glb' },
  { id: 'taco-dorado',         nombre: 'Taco Dorado',             modelo: 'models/prueba.glb' },
  { id: 'taco-suave-barbacoa', nombre: 'Taco Suave de Barbacoa',  modelo: 'models/prueba.glb' },
  { id: 'taco-suave-sabor-2',  nombre: 'Taco Suave (sabor 2)',    modelo: 'models/prueba.glb' },
  { id: 'taco-suave-sabor-3',  nombre: 'Taco Suave (sabor 3)',    modelo: 'models/prueba.glb' },
];
