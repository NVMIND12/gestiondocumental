# Sistema de Gestión Documental 2.0 — Netlify

Esta versión no contiene decretos de demostración y no utiliza `localStorage`.
Los decretos, estados, materias y firmantes se guardan centralizadamente en
Netlify Blobs mediante Netlify Functions.

## Publicación recomendada

1. Descomprime este paquete y súbelo a un repositorio GitHub, GitLab o Bitbucket.
2. En Netlify selecciona **Add new project > Import an existing project**.
3. Conecta el repositorio. Netlify leerá automáticamente `netlify.toml`.
4. Confirma:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions`
5. Publica el proyecto.

No se necesitan claves ni variables de entorno para Netlify Blobs cuando las
funciones se ejecutan dentro del mismo proyecto de Netlify.

## Importante

La carga mediante “drag and drop” del directorio compilado no sirve para esta
aplicación, porque el almacenamiento centralizado requiere desplegar también
las Functions. Usa la conexión con repositorio o Netlify CLI.

## Desarrollo local

Instala las dependencias con `npm install` y utiliza Netlify CLI:

```bash
npx netlify dev
```
