# Sistema de Gestión Documental 2.0 — Netlify

Esta versión contiene un `index.html` real en la raíz, no incluye decretos de
demostración y no utiliza `localStorage`. Los números, fechas y descripciones
se guardan centralizadamente en Netlify Blobs.

## Publicación recomendada

1. Descomprime este paquete y súbelo a un repositorio GitHub, GitLab o Bitbucket.
2. En Netlify selecciona **Add new project > Import an existing project**.
3. Conecta el repositorio. Netlify leerá automáticamente `netlify.toml`.
4. Confirma:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Publica el proyecto.

No se necesitan claves ni variables de entorno para Netlify Blobs cuando las
funciones se ejecutan dentro del mismo proyecto de Netlify.

## Importante

La carga mediante “drag and drop” del directorio compilado no sirve para esta
aplicación, porque el almacenamiento centralizado requiere desplegar también
la ruta del servidor. Usa la conexión con repositorio o Netlify CLI.

Los archivos `index.html`, `package.json`, `build.mjs` y `netlify.toml` deben
quedar visibles en la raíz del repositorio.

## Desarrollo local

Instala las dependencias con `npm install` y utiliza Netlify CLI:

```bash
npx netlify dev
```
