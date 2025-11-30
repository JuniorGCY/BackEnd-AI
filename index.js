import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const safeHistory = Array.isArray(history) ? history : [];

    const messagesForModel = [
      { role: "system", content: 
        `
          Você é uma assistente jurídica do aplicativo mobile Projeto Amparo.
          - Use linguagem simples e organizada em tópicos.
          - Mantenha coerência com o que já foi dito na conversa.
          - Quando o usuário pedir para repetir, reforçar ou explicar melhor algo que você mesma falou antes,
            procure a informação nas mensagens anteriores e repita de forma resumida e clara.
          - Se o pedido estiver vago (por exemplo: "fala aquilo que você comentou antes"),
            peça para o usuário especificar sobre qual parte ele está falando (ex: prazo, direito, documento, etc.).
            Responda sempre em texto simples, sem usar Markdown (sem **negrito**, _itálico_, listas com -, etc.).Use apenas frases normais.
        ` 
      },
      ...safeHistory,
      { role: "user", content: message }
    ];

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: messagesForModel,
    });

    const reply = completion.output_text;

    return res.json({ reply });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro ao processar a IA" });
  }
});


