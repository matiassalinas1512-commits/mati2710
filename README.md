# Luz y Verdad — prototipo inicial

## Incluye
- Interfaz adaptable a celular y computadora, completamente en español.
- Chat visual con preguntas sugeridas.
- Función de Netlify para conectar OpenAI sin exponer la clave en el navegador.
- Configuración `netlify.toml` para indicar la carpeta de funciones.

## Variables de entorno en Netlify
- `AI_API_KEY`: clave privada de OpenAI (marcar como secreto).
- `AI_API_URL`: `https://api.openai.com/v1/chat/completions`
- `AI_MODEL`: `gpt-4.1-mini`

## Importante: publicar también la función
Un despliegue manual de archivos estáticos puede publicar el HTML, pero no necesariamente compilar/publicar Netlify Functions.
Para que el chat responda, desplegá este proyecto conectado a un repositorio Git (GitHub) o mediante Netlify CLI, manteniendo `netlify/functions/chat.js` y `netlify.toml` en la raíz.

## Estado actual
La interfaz y la función inicial están preparadas. Todavía falta integrar la base bíblica estructurada y la búsqueda contextual (RAG); por eso esta versión no garantiza todavía que cada respuesta esté respaldada por versículos recuperados de la Biblia.
