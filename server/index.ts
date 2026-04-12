import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { extractTextFromUpload, normalizeText } from './text-extract';
import { assistantChat, generateSmartSummary, parsePolicyDetailed, analyzePolicyMasterPrompt } from './gemini';
import { getPolicy, putPolicy, updatePolicy } from './storage';
import { validatePolicy } from './validator';
import { simulate } from './simulator';
import type { ScenarioRequest } from './types';

const app = express();

const configuredOrigin = process.env.ALLOWED_ORIGIN?.trim();
app.use(
  cors({
    origin(origin, callback) {
      // 1. Allow non-browser requests
      if (!origin) return callback(null, true);

      // 2. Trust Vercel origins automatically
      if (process.env.VERCEL || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // 3. Allow manual config or local dev
      if (
        (configuredOrigin && origin === configuredOrigin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
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
app.post(['/api/policy/upload', '/api/upload'], upload.single('file'), async (req, res) => {
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
 * Master Prompt Policy Analysis (Production-ready JSON extraction).
 * Body: { policyId?, policyText?, provider?, policyName? }
 */
app.post(['/api/analyze-policy', '/api/analyze'], async (req, res) => {
  try {
    const { policyId, policyText, provider, policyName } = req.body ?? {};

    let rawText = policyText;
    if (policyId && !policyText) {
      const policy = getPolicy(policyId);
      if (!policy) return res.status(404).json({ error: 'Policy not found. Upload first.' });
      rawText = policy.rawText;
    }
    if (!rawText) return res.status(400).json({ error: 'Provide policyId or policyText.' });

    const analysis = await analyzePolicyMasterPrompt({
      rawText,
      provider,
      policyName,
    });

    validatePolicy(analysis);

    // Cache in storage
    if (policyId) {
      updatePolicy(policyId, { lastAnalysis: analysis });
    }

    res.json({ analysis });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Analysis failed.' });
  }
});

/**
 * Legacy detailed parse for visualizer.
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
      provider: provider || policyName,
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
    const { policyData, scenario, policy, bill } = req.body ?? {};

    const effectivePolicy = policy || policyData;
    const effectiveScenario = bill && policy ? { bill, hasCopay: false } : scenario;

    if (effectivePolicy && effectiveScenario) {
      // New deterministic simulation engine
      const result = simulate(effectivePolicy, effectiveScenario);
      return res.json(result);
    }
    
    return res.status(400).json({ error: 'policy and bill OR policyData and scenario required.' });
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

// In Vercel serverless environment, we don't call app.listen()
// Vercel handles the execution. In local dev, we need to listen.
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT || 5050);
  app.listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://0.0.0.0:${port} (CORS: dynamic allowlist)`);
  });
} else if (!process.env.VERCEL) {
  // Production standalone (not Vercel)
  const port = Number(process.env.PORT || 5050);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Standalone production server on port ${port}`);
  });
}

export default app;