'use strict';
// Self-hosted endpoint: serves the same skill as the Lambda handler over plain
// HTTP behind a TLS-terminating proxy (e.g. a Cloudflare Tunnel). Alexa's
// request signature and timestamp are verified by ask-sdk-express-adapter.
//
//   PORT       listen port (default 3000)
//   BIND       listen address (default 127.0.0.1)
//   SKILL_ID   optional; rejects requests for other skill ids
//   SKILL_PATH optional; endpoint path (default /alexa)

const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const { skillBuilder } = require('./index');

const PORT = Number(process.env.PORT || 3000);
const BIND = process.env.BIND || '127.0.0.1';
const SKILL_PATH = process.env.SKILL_PATH || '/alexa';

if (process.env.SKILL_ID) skillBuilder.withSkillId(process.env.SKILL_ID);
const skill = skillBuilder.create();
// verifySignature = true, verifyTimestamp = true
const adapter = new ExpressAdapter(skill, true, true);

const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));
app.post(SKILL_PATH, adapter.getRequestHandlers());

app.listen(PORT, BIND, () => {
  console.log(`ABS Alexa skill listening on http://${BIND}:${PORT}${SKILL_PATH}`);
});
