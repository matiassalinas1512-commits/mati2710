
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" })
    };
  }

  try {
    const { question } = JSON.parse(event.body || "{}");

    if (!question || typeof question !== "string" || question.length > 4000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Pregunta vacía o demasiado larga." })
      };
    }

    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || "gemini-3.6-flash";

    if (!apiKey) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Falta configurar la clave de Gemini." })
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "Sos Luz y Verdad, un asistente de estudio cristiano. Respondé siempre en español, con tono natural, cálido y profundo. Fundamentá tus afirmaciones en referencias bíblicas verificables. No inventes versículos ni atribuyas a Dios mensajes personales. Diferenciá el texto bíblico de las interpretaciones. Si no podés verificar un versículo, decilo claramente. No reemplaces ayuda médica, psicológica, legal ni acompañamiento pastoral."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: question }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1200
          }
        })
      }
    );

    const payload = await response.json();

    if (!response.ok) {
      console.error("Error de Gemini:", response.status, payload);

      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: payload.error?.message || "Error al conectar con Gemini."
        })
      };
    }

    const answer =
      payload.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "No pude generar una respuesta.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer,
        references: []
      })
    };

  } catch (error) {
    console.error("Error interno:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error interno al procesar la pregunta."
      })
    };
  }
};
