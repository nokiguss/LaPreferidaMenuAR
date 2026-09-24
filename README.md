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

1. Exporta el escaneo como **.glb** (desde Polycam o RealityScan), en **tamaño real**.
2. Cópialo a la carpeta `models/`, por ejemplo `models/taco-dorado.glb`.
3. En `js/tacos.js`, cambia el `modelo` de ese taco a `'models/taco-dorado.glb'`.

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
