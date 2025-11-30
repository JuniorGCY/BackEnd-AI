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
    const { message } = req.body;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: "Você é um assistente educado dentro de um aplicativo mobile." },
        { role: "user", content: message }
      ],
    });

    const reply = completion.output_text;

    return res.json({ reply });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro ao processar a IA" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

