// Agrega un letrero flotante con el nombre del producto encima de un modelo 3D.
//
// Uso (desde la carpeta "herramientas"):
//   node letrero.mjs <modelo-base.glb> "<Nombre>" <salida.glb> [giro]
//
//   giro (opcional): grados para girar el producto y que quede de frente al cliente
//                    (ej. 90, -90, 180). Si en la página el producto sale de lado, ajusta este número.
//
// Ejemplo:
//   node letrero.mjs ../modelos-base/alcancia-yoshi.glb "Taco Yoshi" ../models/alcancia-yoshi-v4.glb -90
//
// El letrero:
//   - flota arriba del modelo y sube y baja suavecito (la animación se ve en Android;
//     en iPhone el letrero se ve fijo)
//   - se lee de frente y por detrás
//   - su ancho se ajusta al tamaño del modelo

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMaterialsUnlit } from '@gltf-transform/extensions';

const [entrada, nombre, salida, giroTexto = '0'] = process.argv.slice(2);
const giro = Number(giroTexto);
if (!entrada || !nombre || !salida || Number.isNaN(giro)) {
  console.error('Uso: node letrero.mjs <modelo-base.glb> "<Nombre>" <salida.glb> [giro]');
  process.exit(1);
}

const IMG_ANCHO = 1024;
const IMG_ALTO = 256;

// 1. Dibujar la imagen del letrero con Edge (sin fondo, bordes redondos)
function dibujarLetrero(texto) {
  const edge = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].find(existsSync);
  if (!edge) throw new Error('No encontré Microsoft Edge para dibujar el letrero.');

  const carpeta = mkdtempSync(join(tmpdir(), 'letrero-'));
  const html = join(carpeta, 'letrero.html');
  const png = join(carpeta, 'letrero.png');
  const seguro = texto.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  writeFileSync(html, `<!doctype html><meta charset="utf-8">
<style>
  html, body { margin: 0; background: transparent; }
  .letrero {
    box-sizing: border-box;
    width: ${IMG_ANCHO}px; height: ${IMG_ALTO}px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 60px;
    border: 10px solid #e0892e;
    border-radius: ${IMG_ALTO / 2}px;
    background: #1c1410;
    color: #f5ebe0;
    font: 700 120px "Segoe UI", system-ui, sans-serif;
    white-space: nowrap;
  }
</style>
<div class="letrero"><span id="t">${seguro}</span></div>
<script>
  // Achicar la letra si el nombre es muy largo
  const t = document.getElementById('t');
  let size = 120;
  while (t.offsetWidth > ${IMG_ANCHO - 140} && size > 40) t.style.fontSize = (size -= 4) + 'px';
</script>`);

  execFileSync(edge, [
    '--headless=new',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--user-data-dir=${join(carpeta, 'perfil')}`,
    `--window-size=${IMG_ANCHO},${IMG_ALTO}`,
    `--screenshot=${png}`,
    `file:///${html.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore' });

  return readFileSync(png);
}

// 2. Abrir el modelo y medirlo
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(entrada);
const root = doc.getRoot();
const escena = root.getDefaultScene() || root.listScenes()[0];

// Girar el producto para que quede de frente
if (giro !== 0) {
  const r = (giro * Math.PI) / 180 / 2;
  const producto = doc.createNode('producto').setRotation([0, Math.sin(r), 0, Math.cos(r)]);
  for (const hijo of escena.listChildren()) {
    escena.removeChild(hijo);
    producto.addChild(hijo);
  }
  escena.addChild(producto);
}

const caja = getBounds(escena);

const anchoModelo = Math.max(caja.max[0] - caja.min[0], caja.max[2] - caja.min[2]);
const altoModelo = caja.max[1] - caja.min[1];
const centroX = (caja.min[0] + caja.max[0]) / 2;
const centroZ = (caja.min[2] + caja.max[2]) / 2;

const W = anchoModelo * 1.1;                 // ancho del letrero
const H = W * (IMG_ALTO / IMG_ANCHO);        // alto del letrero
const Y = caja.max[1] + altoModelo * 0.08 + H / 2;   // un poco arriba del modelo

// 3. Crear el letrero (un rectángulo con la imagen)
const buffer = root.listBuffers()[0] || doc.createBuffer();

const textura = doc.createTexture('letrero')
  .setImage(dibujarLetrero(nombre))
  .setMimeType('image/png');

const unlit = doc.createExtension(KHRMaterialsUnlit);
const material = doc.createMaterial('letrero')
  .setBaseColorTexture(textura)
  .setAlphaMode('MASK')
  .setAlphaCutoff(0.5)
  .setMetallicFactor(0)
  .setRoughnessFactor(1)
  .setExtension('KHR_materials_unlit', unlit.createUnlit());

const acc = (tipo, arreglo) => doc.createAccessor().setType(tipo).setArray(arreglo).setBuffer(buffer);
const primitiva = doc.createPrimitive()
  .setAttribute('POSITION', acc('VEC3', new Float32Array([
    -W / 2, -H / 2, 0,   W / 2, -H / 2, 0,   W / 2, H / 2, 0,   -W / 2, H / 2, 0,
  ])))
  .setAttribute('NORMAL', acc('VEC3', new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])))
  .setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array([0, 1, 1, 1, 1, 0, 0, 0])))
  .setIndices(acc('SCALAR', new Uint16Array([0, 1, 2, 0, 2, 3])))
  .setMaterial(material);
const malla = doc.createMesh('letrero').addPrimitive(primitiva);

// Dos caras: una de frente y otra girada para leerse por detrás
const frente = doc.createNode('letrero-frente').setMesh(malla).setTranslation([0, 0, 0.001]);
const atras = doc.createNode('letrero-atras').setMesh(malla)
  .setTranslation([0, 0, -0.001])
  .setRotation([0, 1, 0, 0]); // 180° en Y

const letrero = doc.createNode('letrero')
  .setTranslation([centroX, Y, centroZ])
  .addChild(frente)
  .addChild(atras);
escena.addChild(letrero);

// 4. Animación: sube y baja suavecito (3 segundos por ciclo)
const PASOS = 24;
const DURACION = 3;
const tiempos = new Float32Array(PASOS + 1);
const posiciones = new Float32Array((PASOS + 1) * 3);
for (let i = 0; i <= PASOS; i++) {
  tiempos[i] = (i / PASOS) * DURACION;
  posiciones.set([centroX, Y + Math.sin((i / PASOS) * Math.PI * 2) * H * 0.15, centroZ], i * 3);
}
const muestra = doc.createAnimationSampler()
  .setInput(acc('SCALAR', tiempos))
  .setOutput(acc('VEC3', posiciones))
  .setInterpolation('LINEAR');
const canal = doc.createAnimationChannel()
  .setTargetNode(letrero)
  .setTargetPath('translation')
  .setSampler(muestra);
doc.createAnimation('letrero-flotando').addSampler(muestra).addChannel(canal);

// 5. Guardar
await io.write(salida, doc);
console.log(`Listo: ${salida}`);
console.log(`  Letrero "${nombre}" de ${(W * 100).toFixed(0)} cm de ancho, a ${(Y * 100).toFixed(0)} cm de altura`);
