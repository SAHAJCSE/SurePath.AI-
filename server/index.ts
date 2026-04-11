import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { extractTextFromUpload, normalizeText } from './text-extract.js';
import { assistantChat, generateSmartSummary, simulateScenario, parsePolicyDetailed } from './gemini.js';
import { getPolicy, putPolicy, updatePolicy } from './storage.js';
import type { ScenarioRequest } from './types.js';

const app = express();

const configuredOrigin = process.env.ALLOWED_ORIGIN?.trim();
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header)
      if (!origin) return callback(null, true);
      if (configuredOrigin && origin === configuredOrigin) return callback(null, true);
      // Dev-friendly allowlist for localhost and local network Vite URLs.
      if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) || /^http:\/\/192\.168\.\d+\.\d+:\d+$/.test(origin) || /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/.test(origin) || /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'));
    },
  }),
);
app.use(express.json({ limit: '2mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: Date.now() });
});

/**
 * Upload a policy file (PDF or text).
 * Returns: { policyId, extractedChars }
 */
app.post('/api/policy/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const textBody = typeof req.body?.text === 'string' ? req.body.text : '';

    let rawText = '';
    let filename: string | undefined;
    let mimeType: string | undefined;

    if (file) {
      rawText = await extractTextFromUpload(file);
      filename = file.originalname;
      mimeType = file.mimetype;
    } else if (textBody.trim()) {
      rawText = normalizeText(textBody);
    } else {
      return res.status(400).json({ error: 'Provide a file (field "file") or text (field "text").' });
    }

    if (!rawText.trim()) {
      return res.status(400).json({ error: 'Could not extract any readable text from the upload.' });
    }

    const policyId = randomUUID();
    putPolicy({
      policyId,
      uploadedAt: Date.now(),
      filename,
      mimeType,
      rawText,
    });

    res.json({ policyId, extractedChars: rawText.length });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Upload failed.' });
  }
});

/**
 * Analyze a policy by policyId and return SmartSummary.
 * Body: { policyId, locale?, provider?, policyName? }
 */
app.post('/api/policy/analyze', async (req, res) => {
  try {
    const { policyId, locale, provider, policyName } = req.body ?? {};
    if (!policyId || typeof policyId !== 'string') {
      return res.status(400).json({ error: 'policyId is required.' });
    }

    const policy = getPolicy(policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found. Upload first.' });
    }

    const summary = await generateSmartSummary({
      rawText: policy.rawText,
      locale: locale === 'hi' ? 'hi' : 'en',
      provider,
      policyName,
    });

    updatePolicy(policyId, { lastSummary: summary });
    res.json({ policyId, summary });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Analysis failed.' });
  }
});

/**
 * Detailed parse for visualizer/exclusions/simulator features.
 * Body: { policyId, provider?, policyName? }
 */
app.post('/api/policy/parse', async (req, res) => {
  try {
    const { policyId, provider, policyName } = req.body ?? {};
    if (!policyId) return res.status(400).json({ error: 'policyId is required.' });

    let rawText = '';
    if (policyId !== 'demo-policy-id') {
      const policy = getPolicy(policyId);
      if (!policy) return res.status(404).json({ error: 'Policy not found.' });
      rawText = policy.rawText;
    }

    const result = await parsePolicyDetailed({
      rawText: rawText,
      provider: provider || policyName, // Use provider or policyName
      policyName
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Parsing failed.' });
  }
});

/**
 * Run scenario simulation.
 * Body: { policyId, scenarioId, locale?, notes? }
 */
app.post('/api/simulate', async (req, res) => {
  try {
    const body = (req.body ?? {}) as ScenarioRequest;
    if (!body.policyId || typeof body.policyId !== 'string') {
      return res.status(400).json({ error: 'policyId is required.' });
    }
    if (!body.scenarioId || typeof body.scenarioId !== 'string') {
      return res.status(400).json({ error: 'scenarioId is required.' });
    }

    const policy = getPolicy(body.policyId);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found. Upload first.' });
    }

    const result = await simulateScenario({
      rawText: policy.rawText,
      scenarioId: body.scenarioId as any,
      locale: body.locale,
      notes: body.notes,
    });

    res.json({ policyId: body.policyId, scenarioId: body.scenarioId, result });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Simulation failed.' });
  }
});

app.post('/api/assistant/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    if (!messages.length) return res.status(400).json({ error: 'messages are required.' });

    const policyId = typeof req.body?.policyId === 'string' ? req.body.policyId : undefined;
    const policy = policyId ? getPolicy(policyId) : undefined;

    const reply = await assistantChat({
      messages: messages
        .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.text === 'string')
        .map((m: any) => ({ role: m.role, text: m.text })),
      provider: typeof req.body?.provider === 'string' ? req.body.provider : undefined,
      rawText: policy?.rawText,
    });
    res.json({ reply, usesPolicy: Boolean(policy) });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Assistant failed.' });
  }
});

const port = Number(process.env.PORT || 5050);
app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port} (CORS: dynamic allowlist)`);
});

