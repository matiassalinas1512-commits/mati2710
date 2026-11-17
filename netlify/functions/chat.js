// Netlify Function: conecta el chat con un proveedor de IA desde el servidor.
// Configurá AI_API_KEY y AI_API_URL en Netlify > Site configuration > Environment variables.
// Nunca pongas claves privadas dentro del HTML.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido" }) };
  try {
    const { question } = JSON.parse(event.body || "{}");
    if (!question || typeof question !== "string" || question.length > 4000) {
      return { statusCode: 400, body: JSON.stringify({ error: "Pregunta vacía o demasiado larga." }) };
    }
    if (!process.env.AI_API_KEY || !process.env.AI_API_URL) {
      return { statusCode: 503, body: JSON.stringify({ error: "Falta configurar el proveedor de IA." }) };
    }

    // Adaptar este bloque al formato del proveedor elegido.
    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4.1-mini",
        messages: [
          { role: "system", content: "Sos Luz y Verdad, un asistente de estudio cristiano. Respondé en español con tono natural, cálido y profundo. Fundamentá tus afirmaciones en referencias bíblicas verificables. No inventes citas ni atribuyas a Dios mensajes personales. Diferenciá el texto bíblico de las interpretaciones. Si no podés verificar un versículo, decilo claramente. No reemplaces ayuda médica, psicológica, legal ni acompañamiento pastoral." },
          { role: "user", content: question }
        ],
        temperature: 0.4
      })
    });
    const payload = await response.json();
    if (!response.ok) return { statusCode: 502, body: JSON.stringify({ error: "El proveedor de IA rechazó la solicitud." }) };
    const answer = payload.choices?.[0]?.message?.content || payload.output_text || "No pude generar una respuesta.";
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer, references: [] }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno al procesar la pregunta." }) };
  }
};
