'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { t, languageOf, MESSAGES } = require('../lambda/lib/i18n');
const { formatSpokenList } = require('../lambda/lib/speech');

test('picks the language from a locale string or a handlerInput', () => {
  assert.strictEqual(languageOf('de-DE'), 'de');
  assert.strictEqual(languageOf('de-AT'), 'de');
  assert.strictEqual(languageOf('en-US'), 'en');
  assert.strictEqual(languageOf('fr-FR'), 'en');
  assert.strictEqual(languageOf(undefined), 'en');
  assert.strictEqual(languageOf({ requestEnvelope: { request: { locale: 'de-DE' } } }), 'de');
});

test('fills placeholders and never speaks "undefined" or "null"', () => {
  assert.strictEqual(t('de-DE', 'playing', { title: 'Momo', author: 'Michael Ende' }),
    'Ich spiele Momo von Michael Ende');
  assert.strictEqual(t('en-US', 'goingToChapter', { number: 3 }), 'Going to chapter 3.');
  assert.doesNotMatch(t('de-DE', 'notFound', { title: 'X', author: null }), /null|undefined/);
});

test('every German message exists for every English key', () => {
  assert.deepStrictEqual(Object.keys(MESSAGES.de).sort(), Object.keys(MESSAGES.en).sort());
});

test('German spoken list uses "und"', () => {
  assert.strictEqual(formatSpokenList(['A', 'B', 'C'], t('de-DE', 'listAnd')), 'A; B; und C');
});

test('de-DE interaction model declares the same intents and slots as en-US', () => {
  const dir = path.join(__dirname, '..', 'skill-package', 'interactionModels', 'custom');
  const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).interactionModel;
  const shape = (m) => m.languageModel.intents
    .map((i) => `${i.name}:${(i.slots || []).map((s) => `${s.name}/${s.type}`).join(',')}`).sort();
  const en = load('en-US.json');
  const de = load('de-DE.json');
  assert.deepStrictEqual(shape(de), shape(en));
  assert.deepStrictEqual(de.prompts.map((p) => p.id).sort(), en.prompts.map((p) => p.id).sort());
  for (const intent of de.languageModel.intents) {
    for (const sample of intent.samples || []) {
      assert.doesNotMatch(sample, /\d/, `digits are not allowed in samples: "${sample}"`);
      for (const [, slot] of sample.matchAll(/\{(\w+)\}/g)) {
        assert.ok((intent.slots || []).some((s) => s.name === slot), `${intent.name}: unknown slot ${slot}`);
      }
    }
  }
});
