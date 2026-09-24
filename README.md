# La Preferida · Menú AR

Página web para que los clientes escaneen un QR y vean los tacos en 3D sobre su mesa (realidad aumentada). No necesitan instalar ninguna app.

Funciona en **iPhone** (Quick Look) y **Android** (Scene Viewer / WebXR) gracias a [`<model-viewer>`](https://modelviewer.dev) de Google.

## Estructura

```
index.html      Página principal
css/styles.css  Colores y diseño
js/tacos.js     ← LISTA DE TACOS (aquí se agregan o cambian)
js/app.js       Navegación entre lista y visor
models/         Archivos 3D (.glb) de cada taco
```

## Agregar un taco nuevo

1. Exporta el escaneo como **.glb** (desde Polycam o RealityScan) y mide el taco real con una cinta.
2. Ajusta el escaneo (juntar texturas, centrar, tamaño) y guárdalo en `modelos-base/`, por ejemplo `modelos-base/taco-dorado.glb`.
3. Agrégale el letrero flotante con su nombre (desde la carpeta `herramientas`, la primera vez corre `npm install`):
   ```
   node letrero.mjs ../modelos-base/taco-dorado.glb "Taco Dorado" ../models/taco-dorado-v1.glb 90
   ```
   El último número (opcional) gira el producto para que quede de frente. Si en la página sale de lado o de espaldas, prueba con 0, 90, -90 o 180.
4. En `js/tacos.js`, cambia el `modelo` de ese taco a `'models/taco-dorado-v1.glb'`.

Cada vez que cambies un modelo, súbele el número de versión al nombre (`-v2`, `-v3`…) para que los celulares no se queden con el anterior guardado.

Recomendación: que cada archivo pese **menos de 5 MB** para que cargue rápido con datos del celular.

## Link directo a un taco

Cada taco tiene su propio link, útil si queremos un QR por taco:

```
https://<tu-sitio>/#taco-dorado
```

## Ver en la computadora

```
npx serve .
```

y abre http://localhost:3000. (En la compu se ve en 3D pero sin realidad aumentada; eso solo funciona en el celular.)
