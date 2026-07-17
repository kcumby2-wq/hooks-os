#!/usr/bin/env node
// parse-stats.mjs — Weekly stat paste → canonical stat file
//
// Reads Margin's raw paste (or a structured YAML block), resolves every athlete
// name against data/stats/canonical-athletes.md, and writes data/stats/YYYY-WW.md.
//
// Exits with code 1 if any name lands PENDING-MATCH — Kyron reconciles before
// the pipeline continues. Never writes downstream files (that's build-cards.mjs).
//
// Usage:
//   node scripts/parse-stats.mjs --season 2025 --week 8 --input data/inbound-stats/2025-W08-raw.txt
//   cat paste.txt | node scripts/parse-stats.mjs --season 2025 --week 8
//
// Env:
//   ANTHROPIC_API_KEY — required. Model: claude-haiku-4-5.
//
// See skills/weekly-stats-cards/SKILL.md for the full contract.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// ─── args ───────────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
if (!args.season || !args.week) {
  console.error('Usage: parse-stats.mjs --season YYYY --week N [--input FILE]');
  process.exit(2);
}
const season = String(args.season);
const week = String(args.week).padStart(2, '0');
const weekKey = `${season}-W${week}`;

// ─── read raw input ─────────────────────────────────────────────────────────
const raw = args.input
  ? fs.readFileSync(path.resolve(REPO_ROOT, args.input), 'utf8')
  : fs.readFileSync(0, 'utf8');

if (!raw.trim()) {
  console.error(`No input provided for ${weekKey}.`);
  process.exit(2);
}

// ─── load canonical athletes ────────────────────────────────────────────────
const canonicalPath = path.join(REPO_ROOT, 'data/stats/canonical-athletes.md');
const canonicalRaw = fs.readFileSync(canonicalPath, 'utf8');
const canonical = extractCanonicalAthletes(canonicalRaw);

if (canonical.length === 0) {
  console.error('canonical-athletes.md is empty — populate before parsing stats.');
  console.error('Every athlete_id used anywhere must exist there first.');
  process.exit(2);
}

// ─── detect input format ────────────────────────────────────────────────────
const format = detectFormat(raw);

// ─── parse ──────────────────────────────────────────────────────────────────
let statLines;
if (format === 'yaml') {
  statLines = parseYamlBlock(raw);
} else {
  statLines = await parseFreeForm(raw);
}

// ─── resolve every name to a canonical id ───────────────────────────────────
const resolved = statLines.map((row) => resolveName(row, canonical));
const pending = resolved.filter((r) => r.status === 'PENDING-MATCH');
const parseFailed = resolved.filter((r) => r.status === '_parse_failed');

// ─── write canonical stat file ──────────────────────────────────────────────
const outPath = path.join(REPO_ROOT, 'data/stats', `${weekKey}.md`);
const md = renderStatFile({ season, week, resolved, pending, parseFailed });
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md, 'utf8');

// ─── preview to stdout ──────────────────────────────────────────────────────
console.log(`\n✓ Wrote ${path.relative(REPO_ROOT, outPath)}`);
console.log(`  ${resolved.length - pending.length - parseFailed.length} resolved`);
if (pending.length) console.log(`  ⚠ ${pending.length} PENDING-MATCH → ${pending.map((p) => p.raw_name).join(', ')}`);
if (parseFailed.length) console.log(`  ✗ ${parseFailed.length} parse-failed`);

// ─── exit code ──────────────────────────────────────────────────────────────
if (pending.length > 0 || parseFailed.length > 0) {
  console.error(`\nBlocked. Reconcile ${weekKey} in canonical-athletes.md, then re-run.`);
  process.exit(1);
}
console.log('\nReady for build-cards.mjs.');

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[key] = val;
    }
  }
  return out;
}

function detectFormat(raw) {
  const first = raw.split('\n').find((l) => l.trim());
  if (!first) return 'freeform';
  if (first.startsWith('week:') || first.startsWith('season:') || first.startsWith('lines:')) {
    return 'yaml';
  }
  return 'freeform';
}

function parseYamlBlock(raw) {
  // Deliberately minimal — we don't ship a full YAML parser as a dependency.
  // Structure expected:
  //   week: 8
  //   season: 2025
  //   lines:
  //     - name: Kaydon Finley
  //       school: Aledo HS
  //       rec: 5
  //       yds: 157
  //       td: 2
  const lines = raw.split('\n');
  const rows = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(/^\s*-\s+name:\s*(.+)$/);
    if (m) {
      if (current) rows.push(current);
      current = { raw_name: m[1].trim(), rec: '', yds: '', td: '', apy: '', notes: '', school: '' };
      continue;
    }
    if (!current) continue;
    const kv = line.match(/^\s+(\w+):\s*(.+)$/);
    if (kv) {
      const [, k, v] = kv;
      current[k] = v.trim();
    }
  }
  if (current) rows.push(current);
  return rows;
}

async function parseFreeForm(raw) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set. Cannot parse free-form input.');
    console.error('Either export the key or supply --input in YAML format.');
    process.exit(2);
  }
  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are a strict stat-line parser for Margin Hooks's weekly wide-receiver stat sheet.

Input is a raw paste from Margin's iPhone Notes app — one athlete per line, mixed formats. Common patterns you MUST handle:

  Name School X-Y-Z          → rec-yds-td (e.g. "Kaydon Finley Aledo HS 5-157-2" = 5 rec, 157 yds, 2 td)
  Name School X-Y             → rec-yds (no td)
  Name School Ntd Napy        → td and APY (all-purpose yards), no rec/yds
  Name School N APY N         → APY marker with td count
  Name (no school)            → school = null; keep row
  M.Lakeridge / Mans. Lakeridge → variant school names; preserve exactly as pasted

Output STRICT JSON — one object per line, in this shape:

  { "raw_name": "Kaydon Finley", "school": "Aledo HS", "rec": 5, "yds": 157, "td": 2, "apy": null, "notes": "" }
  { "raw_name": "Trenton Yancey", "school": "Duncanville HS", "rec": null, "yds": null, "td": 4, "apy": 187, "notes": "APY marker" }

Rules:
- Preserve raw_name exactly as it appears in the paste (variant handling happens downstream).
- Any field that can't be inferred → null (not 0, not "").
- If a line is unparseable, output { "raw_name": "<the line>", "_parse_failed": true }.
- Output an array of these objects and NOTHING else — no commentary, no code fences.
- Every input line becomes exactly one output object.`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: raw }],
  });

  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const jsonStart = text.indexOf('[');
  const jsonEnd = text.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error('Parser returned non-JSON:', text.slice(0, 200));
    process.exit(2);
  }
  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  return parsed.map((r) => ({
    raw_name: r.raw_name || '',
    school: r.school ?? '',
    rec: r.rec ?? '',
    yds: r.yds ?? '',
    td: r.td ?? '',
    apy: r.apy ?? '',
    notes: r.notes ?? '',
    _parse_failed: r._parse_failed === true,
  }));
}

function extractCanonicalAthletes(md) {
  // Extract all fenced YAML blocks after the "## Athletes" heading,
  // then pull each `- id: ...` entry.
  const idx = md.indexOf('## Athletes');
  const region = idx === -1 ? md : md.slice(idx);
  const athletes = [];
  const blockRe = /```yaml\n([\s\S]*?)```/g;
  let m;
  while ((m = blockRe.exec(region)) !== null) {
    const block = m[1];
    // Split by "- id:" boundaries (uncommented only).
    const chunks = block.split(/\n(?=- id:)/);
    for (const chunk of chunks) {
      if (!chunk.trim().startsWith('- id:')) continue;
      // Skip commented entries.
      if (chunk.trim().startsWith('#')) continue;
      const a = parseAthleteBlock(chunk);
      if (a && a.id) athletes.push(a);
    }
  }
  return athletes;
}

function parseAthleteBlock(chunk) {
  const out = { variants: [] };
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('#')) continue;
    const m = line.match(/^\s*-?\s*(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, key, valRaw] = m;
    let val = valRaw.trim();
    if (val === 'null' || val === '') val = null;
    else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }
    out[key] = val;
  }
  return out;
}

function resolveName(row, canonical) {
  if (row._parse_failed) {
    return { ...row, status: '_parse_failed' };
  }
  const target = normalize(row.raw_name);
  for (const a of canonical) {
    const variants = Array.isArray(a.variants) ? a.variants : [];
    for (const v of variants) {
      if (normalize(v) === target) {
        return {
          ...row,
          status: 'resolved',
          athlete_id: a.id,
          canonical_name: a.canonical_name,
          school_canonical: a.school || row.school,
          hooks_folder: a.hooks_folder || null,
          class_year: a.class_year || null,
          position: a.position || null,
          athlete_status: a.status || null,
          consent_public_stats: a.consent_public_stats === true,
          guardian_signed_release_on_file: a.guardian_signed_release_on_file === true,
        };
      }
    }
    // Also try canonical_name.
    if (a.canonical_name && normalize(a.canonical_name) === target) {
      return {
        ...row,
        status: 'resolved',
        athlete_id: a.id,
        canonical_name: a.canonical_name,
        school_canonical: a.school || row.school,
        hooks_folder: a.hooks_folder || null,
        class_year: a.class_year || null,
        position: a.position || null,
        athlete_status: a.status || null,
        consent_public_stats: a.consent_public_stats === true,
        guardian_signed_release_on_file: a.guardian_signed_release_on_file === true,
      };
    }
  }
  return { ...row, status: 'PENDING-MATCH' };
}

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function renderStatFile({ season, week, resolved, pending, parseFailed }) {
  const today = new Date().toISOString().slice(0, 10);
  const clean = resolved.filter((r) => r.status === 'resolved');
  let out = `---
season: ${season}
week: ${parseInt(week, 10)}
ingested: ${today}
ingested_by: parse-stats.mjs
resolved_count: ${clean.length}
pending_match_count: ${pending.length}
parse_failed_count: ${parseFailed.length}
---

# Week ${parseInt(week, 10)} — ${season} Season Stats

| athlete_id | name | school | rec | yds | td | apy | notes |
|---|---|---|---|---|---|---|---|
`;
  for (const r of clean) {
    out += `| ${r.athlete_id} | ${r.canonical_name} | ${r.school_canonical || ''} | ${r.rec || ''} | ${r.yds || ''} | ${r.td || ''} | ${r.apy || ''} | ${r.notes || ''} |\n`;
  }

  if (pending.length) {
    out += `\n## ⚠ PENDING-MATCH (blocks card generation)\n\n`;
    out += `These names did not match any variant in \`data/stats/canonical-athletes.md\`. Add the variant or correct the paste, then re-run.\n\n`;
    for (const p of pending) {
      out += `- **${p.raw_name}** — ${p.school || 'no school'} | rec:${p.rec || '-'} yds:${p.yds || '-'} td:${p.td || '-'} apy:${p.apy || '-'}\n`;
    }
  }

  if (parseFailed.length) {
    out += `\n## ✗ Parse-failed lines (raw preserved)\n\n`;
    for (const p of parseFailed) {
      out += `- \`${p.raw_name}\`\n`;
    }
  }

  return out;
}
