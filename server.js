require("dotenv").config();
const express = require("express");
const path = require("path");
const { BedrockRuntimeClient, InvokeModelCommand, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");

const app = express();
app.use(express.json());

// Enable CORS for all local environments (port 3000, port 5500, etc.)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "BOMB SQUAD — Jev on the Clock.html"));
});

// --- JEV PROXY ENDPOINT ---
app.post("/api/jev", async (req, res) => {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Set AI_GATEWAY_API_KEY in .env before starting the server." });
  }

  const t0 = performance.now();
  try {
    const upstream = await fetch("https://ai-gateway.vercel.sh/typesafe/v1/systemone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const ms = Math.round(performance.now() - t0);
    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }

    const ans = data?.answers?.wire;
    res.json({
      choice: ans?.choice ?? ans?.value,
      confidence: ans?.confidence ?? 0,
      ms,
      raw: data,
    });
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    res.status(502).json({ error: "Upstream request failed: " + err.message, ms });
  }
});

// --- BEDROCK NOVA MICRO CLIENT & ENDPOINT ---
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_AWS_REGION || process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/api/nova", async (req, res) => {
  const { clue, options } = req.body;
  if (!clue || !options) {
    return res.status(400).json({ error: "Missing clue or options in request body." });
  }

  const prompt = `Given this clue and these wire options, respond with ONLY valid JSON: {"choice": "<wire_key>", "confidence": <0-1 number>}. No explanation, no markdown.
Clue: ${clue}
Options: ${JSON.stringify(options)}`;

  const payload = {
    messages: [
      {
        role: "user",
        content: [{ text: prompt }],
      },
    ],
    inferenceConfig: {
      max_new_tokens: 120,
      temperature: 0.1,
    },
  };

  const modelIds = [
    "apac.amazon.nova-micro-v1:0",
    "amazon.nova-micro-v1:0",
    "us.amazon.nova-micro-v1:0",
  ];

  const t0 = performance.now();
  let rawText = "";
  let lastErr = null;

  for (const modelId of modelIds) {
    try {
      const cmd = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });

      const result = await bedrockClient.send(cmd);
      rawText = new TextDecoder().decode(result.body);
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
      // If validation says on-demand throughput isn't supported, try next modelId
      if (err.name === "ValidationException") continue;
      break;
    }
  }

  const ms = Math.round(performance.now() - t0);

  if (lastErr) {
    return res.status(502).json({
      error: "bedrock_error",
      message: lastErr.message,
      ms,
    });
  }

  try {
    const parsedBody = JSON.parse(rawText);
    const contentText = parsedBody?.output?.message?.content?.[0]?.text?.trim() || "";

    // Attempt to extract JSON from contentText (strip markdown backticks if Nova added them)
    let jsonMatch = contentText;
    const fenceMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      jsonMatch = fenceMatch[1];
    } else {
      const objMatch = contentText.match(/\{[\s\S]*\}/);
      if (objMatch) jsonMatch = objMatch[0];
    }

    const decision = JSON.parse(jsonMatch);
    if (!decision || typeof decision.choice !== "string") {
      return res.json({
        error: "parse_failed",
        raw: contentText,
        ms,
      });
    }

    return res.json({
      choice: decision.choice.toLowerCase().trim(),
      confidence: typeof decision.confidence === "number" ? decision.confidence : 0.8,
      ms,
      raw: contentText,
    });
  } catch (parseErr) {
    return res.json({
      error: "parse_failed",
      raw: rawText,
      ms,
    });
  }
});

// --- BEDROCK DEEPSEEK R1 CLIENT & ENDPOINT ---
const bedrockDeepSeekClient = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/api/deepseek", async (req, res) => {
  const { clue, options } = req.body;
  if (!clue || !options) {
    return res.status(400).json({ error: "Missing clue or options in request body." });
  }

  const prompt = `Given this clue and these wire options, respond with ONLY valid JSON: {"choice": "<wire_key>", "confidence": <0-1 number>}. No explanation, no markdown.
Clue: ${clue}
Options: ${JSON.stringify(options)}`;

  const t0 = performance.now();
  try {
    const cmd = new ConverseCommand({
      modelId: "us.deepseek.r1-v1:0",
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 1000, temperature: 0.1 }
    });

    const result = await bedrockDeepSeekClient.send(cmd);
    const ms = Math.round(performance.now() - t0);

    const contents = result?.output?.message?.content || [];
    const textBlock = contents.find(c => c.text);
    const reasoningBlock = contents.find(c => c.reasoningContent);
    const contentText = textBlock?.text?.trim() || "";
    const reasoningText = reasoningBlock?.reasoningContent?.reasoningText?.text || "";

    // Extract JSON
    let jsonMatch = contentText;
    const fenceMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      jsonMatch = fenceMatch[1];
    } else {
      const objMatch = contentText.match(/\{[\s\S]*\}/);
      if (objMatch) jsonMatch = objMatch[0];
    }

    try {
      const decision = JSON.parse(jsonMatch);
      if (!decision || typeof decision.choice !== "string") {
        return res.json({ error: "parse_failed", raw: contentText, reasoning: reasoningText, ms });
      }
      return res.json({
        choice: decision.choice.toLowerCase().trim(),
        confidence: typeof decision.confidence === "number" ? decision.confidence : 0.9,
        ms,
        raw: contentText,
        reasoning: reasoningText,
      });
    } catch (parseErr) {
      return res.json({ error: "parse_failed", raw: contentText || reasoningText, ms });
    }
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    return res.status(502).json({ error: "bedrock_r1_error", message: err.message, ms });
  }
});

app.post("/api/deepseek-v3", async (req, res) => {
  const { clue, options } = req.body;
  if (!clue || !options) {
    return res.status(400).json({ error: "Missing clue or options in request body." });
  }

  const prompt = `Given this clue and these wire options, respond with ONLY valid JSON: {"choice": "<wire_key>", "confidence": <0-1 number>}. No explanation, no markdown.
Clue: ${clue}
Options: ${JSON.stringify(options)}`;

  const t0 = performance.now();
  try {
    const cmd = new ConverseCommand({
      modelId: "deepseek.v3.2",
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 400, temperature: 0.1 }
    });

    const result = await bedrockDeepSeekClient.send(cmd);
    const ms = Math.round(performance.now() - t0);

    const contents = result?.output?.message?.content || [];
    const textBlock = contents.find(c => c.text);
    const contentText = textBlock?.text?.trim() || "";

    // Extract JSON
    let jsonMatch = contentText;
    const fenceMatch = contentText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      jsonMatch = fenceMatch[1];
    } else {
      const objMatch = contentText.match(/\{[\s\S]*\}/);
      if (objMatch) jsonMatch = objMatch[0];
    }

    try {
      const decision = JSON.parse(jsonMatch);
      if (!decision || typeof decision.choice !== "string") {
        return res.json({ error: "parse_failed", raw: contentText, ms });
      }
      return res.json({
        choice: decision.choice.toLowerCase().trim(),
        confidence: typeof decision.confidence === "number" ? decision.confidence : 0.9,
        ms,
        raw: contentText,
      });
    } catch (parseErr) {
      return res.json({ error: "parse_failed", raw: contentText, ms });
    }
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    return res.status(502).json({ error: "bedrock_v3_error", message: err.message, ms });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bomb Squad server running at http://localhost:${PORT}`));