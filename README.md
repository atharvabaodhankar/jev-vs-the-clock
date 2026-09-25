# 💣 BOMB SQUAD — Jev vs. Bedrock (Extreme Arena)

> **The ultimate real-time head-to-head AI defusal race.**  
> Pit fast-reflex **System 1** models against deep **System 2** reasoning models under a high-tension ticking countdown.

![Arcade Duel UI Preview](https://img.shields.io/badge/Status-Live%20Arena-00E676?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-Local%20Proxy-000000?style=for-the-badge&logo=express)
![Vercel AI Gateway](https://img.shields.io/badge/Vercel_AI_Gateway-Jev-black?style=for-the-badge&logo=vercel)
![AWS Bedrock](https://img.shields.io/badge/AWS_Bedrock-DeepSeek_R1_%7C_Nova-FF9900?style=for-the-badge&logo=amazon-aws)

---

## ⚡ The Concept: System 1 vs. System 2

In bomb disposal, every millisecond counts. This demo dramatizes the trade-offs between two distinct AI paradigms:

1. **System 1 (Instant Reflex — TypeSafe AI Jev)**:
   - Evaluates clues and makes wire-selection decisions with strict choice schema in **~200–500ms**.
   - Built for instant reflex actions where latency equals survival.

2. **System 2 (Deep Reasoning — AWS Bedrock DeepSeek R1)**:
   - Evaluates clues through a massive internal chain-of-thought (`<think>...</think>`).
   - Often spends **4,000–8,000ms+** philosophizing over circuit possibilities while the bomb timer expires and detonates on it.

3. **Fast Utility LLM (AWS Bedrock Amazon Nova Micro)**:
   - A lightweight ~600–900ms general LLM prompted for strict JSON, showing formatting reliability vs. schema drift.

---

## 🎮 Key Features

- **⚡ Independent Real-Time Parallel Execution**: Both models race concurrently. As soon as Jev answers in ~400ms, its wire cuts and defuses **immediately** on screen while the opponent continues ticking in real time.
- **💥 Overthinking & Schema Drift Detection**: If a reasoning model runs out of time or wanders into conversational preamble, the UI triggers a distinct **⚠️ OVERTHINK DRIFT / MALFUNCTION** state with a live terminal snippet of the raw output.
- **🔊 Procedural Web Audio Engine**: 100% synthesized sound effects via the Web Audio API (accelerating geiger ticks, wire-snip electric zaps, heavy sub-bass 808 detonations, and victory chimes) — zero external MP3/WAV assets required.
- **✨ Canvas Particle Sparks & Screen Shakes**: Live 60 FPS HTML5 Canvas particle system generating electric sparks when wires are snipped, plus directional camera shakes and flash strobes on detonation.
- **🕹️ Dual Opponent Selector**: Toggle between **DeepSeek R1** (`us.deepseek.r1-v1:0`) and **Amazon Nova Micro** (`amazon.nova-micro-v1:0`) directly from the tactical dock.
- **📦 30 Hand-Crafted Bomb Scenarios**: Stored in a modular dataset (`rounds.js`) spanning mercury tilt switches, optical laser sensors, barometric altitude fuses, cold solder joints, RF antenna wires, and UV-reactive markings.
- **🏆 Esports Championship End Card**: Side-by-side victory summary detailing accuracy scores, best streaks, average reaction times, and schema reliability.

---

## 🛠️ Architecture

```
                 ┌────────────────────────────────────────────────────────┐
                 │       Browser Client (HTML5 / Canvas / Web Audio)      │
                 │              http://localhost:3000                     │
                 └───────────────────▲─────────────────▲──────────────────┘
                                     │                 │
                     POST /api/jev   │                 │   POST /api/deepseek
                                     │                 │   or /api/nova
                 ┌───────────────────▼─────────────────▼──────────────────┐
                 │                 Local Express Server                    │
                 │            (server.js — CORS & Proxy Relay)            │
                 └───────────────────┬─────────────────┬──────────────────┘
                                     │                 │
         Bearer AI_GATEWAY_API_KEY   │                 │   AWS IAM Credentials
                                     │                 │   (@aws-sdk/client-bedrock-runtime)
                 ┌───────────────────▼──┐           ┌──▼────────────────────────┐
                 │   Vercel AI Gateway  │           │        AWS Bedrock        │
                 │   TypeSafe AI "Jev"  │           │   DeepSeek R1 / Nova      │
                 └──────────────────────┘           └───────────────────────────┘
```

---

## 🚀 Quickstart Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/bomb-squad.git
cd bomb-squad
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# TypeSafe AI Jev via Vercel AI Gateway
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key

# AWS Bedrock Credentials (DeepSeek R1 & Nova Micro)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
BEDROCK_AWS_REGION=ap-south-1
BEDROCK_AWS_ACCESS_KEY_ID=your_aws_access_key_id
BEDROCK_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Local Server Port
PORT=3000
```

> **Note on Bedrock Models**:
> - **DeepSeek R1** runs via cross-region inference profile `us.deepseek.r1-v1:0` in `us-east-1`.
> - **Nova Micro** runs via cross-region inference profile `apac.amazon.nova-micro-v1:0` in `ap-south-1`.
> - Ensure Bedrock model access is enabled in your AWS account console.

### 3. Launch the Server

```bash
# Run server
npm start
# or: node server.js
```

### 4. Open the Arena

Navigate to:
```
http://localhost:3000
```

1. Select your Bedrock opponent: **DeepSeek R1** or **Nova Micro**.
2. Click **ARM THE DUEL (6 OF 30 ROUNDS)**.
3. Watch Jev and Bedrock duel live across 6 high-speed rounds!

---

## 📁 Repository Structure

```
bomb-squad/
├── BOMB SQUAD — Jev on the Clock.html   # Complete frontend arena UI, canvas FX & audio
├── rounds.js                           # 30 deterministic bomb defusal scenarios
├── server.js                           # Express server & API proxy to Vercel and Bedrock
├── package.json                        # Node.js project manifest & scripts
├── package-lock.json                   # Locked dependencies
├── .env                                # Local secrets (ignored by git)
├── .gitignore                          # Git ignore rules
└── README.md                           # Documentation & architecture overview
```

---

## ⚙️ API Endpoints

| Endpoint | Target Model | Provider / Gateway | Purpose |
|---|---|---|---|
| `POST /api/jev` | `typesafe-ai/jev` | Vercel AI Gateway | Evaluates wire clue using TypeSafe's System One choice schema. |
| `POST /api/deepseek` | `us.deepseek.r1-v1:0` | AWS Bedrock (`us-east-1`) | Executes deep reasoning on Bedrock, extracting JSON answer & thoughts. |
| `POST /api/nova` | `apac.amazon.nova-micro-v1:0` | AWS Bedrock (`ap-south-1`) | Fast lightweight Bedrock LLM prompted for strict JSON. |

---

## 🎯 Game Loop Telemetry

Each round grades both models against a ground-truth correct wire:
- **MATCH**: Cuts the wire with cyan/green particle burst, freezes timer readout, and records defusal.
- **MISMATCH**: Detonates with screen shake, sub-bass rumble, red wire highlight, and `BOOM`.
- **PARSE DRIFT**: Triggers purple glitch badge and displays the unparsed reasoning snippet.
- **FIRST BLOOD**: The fastest responding model is crowned with the `⚡ FIRST BLOOD` badge for that round.

---

## 📄 License

ISC License. Built for demonstrations, AI benchmark showcases, and short-form video creation.
