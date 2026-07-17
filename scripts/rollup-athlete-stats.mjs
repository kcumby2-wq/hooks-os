#!/usr/bin/env node
// rollup-athlete-stats.mjs — Append this week's row to each athlete's season file
//
// After parse-stats.mjs writes data/stats/YYYY-WW.md, this script reads that
// canonical file and appends/updates the per-athlete season rollup at:
//   data/athletes/[hooks_folder]/stats-season-YYYY.md
//
// Idempotent — safe to re-run on the same week. If the week's row already
// exists in the athlete's season file, it's replaced (not duplicated).
//
// Usage:
//   node scripts/rollup-athlete-stats.mjs --season 2025 --week 8
//
// See skills/weekly-stats-cards/SKILL.md.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const args = parseArgs(process.argv.slice(2));
if (!args.season || !args.week) {
  console.error('Usage: rollup-athlete-stats.mjs --season YYYY --week N');
  process.exit(2);
}
const season = String(args.season);
const week = parseInt(String(args.week), 10);
const weekKey = `${season}-W${String(week).padStart(2, '0')}`;

// ─── load canonical stat file ───────────────────────────────────────────────
const statFile = path.join(REPO_ROOT, 'data/stats', `${weekKey}.md`);
if (!fs.existsSync(statFile)) {
  console.error(`Missing ${path.relative(REPO_ROOT, statFile)}. Run parse-stats.mjs first.`);
  process.exit(2);
}
const stats = parseStatFile(fs.readFileSync(statFile, 'utf8'));

// ─── load canonical athletes for hooks_folder lookup ────────────────────────
const canonicalRaw = fs.readFileSync(path.join(REPO_ROOT, 'data/stats/canonical-athletes.md'), 'utf8');
const canonical = extractCanonicalAthletes(canonicalRaw);
const byId = new Map(canonical.map((a) => [a.id, a]));

// ─── rollup per athlete ─────────────────────────────────────────────────────
let updated = 0;
let skipped = 0;
for (const row of stats.rows) {
  const a = byId.get(row.athlete_id);
  if (!a || !a.hooks_folder) {
    skipped++;
    continue;
  }
  const athleteDir = path.join(REPO_ROOT, 'data/athletes', a.hooks_folder);
  fs.mkdirSync(athleteDir, { recursive: true });
  const rollupFile = path.join(athleteDir, `stats-season-${season}.md`);
  updateRollup(rollupFile, { week, row, athlete: a, season });
  updated++;
}

console.log(`\n✓ Rolled up ${updated} athlete season files for ${weekKey}.`);
if (skipped > 0) console.log(`  (${skipped} athletes have no hooks_folder set — rollup skipped.)`);

// ═══════════════════════════════════════════════════════════════════════════
// Rollup logic
// ═══════════════════════════════════════════════════════════════════════════

function updateRollup(filePath, { week, row, athlete, season }) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;

  const weekRow = `| ${week} | ${row.rec || ''} | ${row.yds || ''} | ${row.td || ''} | ${row.apy || ''} | ${row.notes || ''} |`;
  const tableHeader = `| week | rec | yds | td | apy | notes |\n|---|---|---|---|---|---|`;

  let existingWeeks = new Map(); // week → row string
  if (existing) {
    // Extract weeks from the existing table.
    const tableStart = existing.indexOf(tableHeader);
    if (tableStart !== -1) {
      const body = existing.slice(tableStart + tableHeader.length);
      const endMatch = body.match(/\n\n|\n---/);
      const tableBody = endMatch ? body.slice(0, endMatch.index) : body;
      for (const line of tableBody.split('\n')) {
        const m = line.match(/^\|\s*(\d+)\s*\|/);
        if (m) existingWeeks.set(parseInt(m[1], 10), line.trim());
      }
    }
  }

  // Upsert this week's row.
  existingWeeks.set(week, weekRow);

  // Sort by week and totals.
  const weeks = [...existingWeeks.entries()].sort((a, b) => a[0] - b[0]);
  const totals = weeks.reduce(
    (acc, [, line]) => {
      const cells = line.split('|').map((c) => c.trim());
      // | week | rec | yds | td | apy | notes |
      acc.rec += num(cells[2]);
      acc.yds += num(cells[3]);
      acc.td += num(cells[4]);
      acc.apy += num(cells[5]);
      return acc;
    },
    { rec: 0, yds: 0, td: 0, apy: 0 },
  );

  const today = new Date().toISOString().slice(0, 10);
  let out = `---
athlete_id: ${row.athlete_id}
canonical_name: ${athlete.canonical_name}
school: ${athlete.school}
position: ${athlete.position || ''}
class_year: ${athlete.class_year || ''}
status: ${athlete.status || ''}
season: ${season}
last_updated: ${today}
games_played: ${weeks.length}
season_totals:
  rec: ${totals.rec}
  yds: ${totals.yds}
  td: ${totals.td}
  apy: ${totals.apy}
---

# ${athlete.canonical_name} — ${season} Season Stats

**${athlete.school}** · ${athlete.position || ''} · Class of ${athlete.class_year || ''} · Status: ${athlete.status || 'active'}

## Season totals

**${totals.rec} REC · ${totals.yds} YDS · ${totals.td} TD${totals.apy ? ` · ${totals.apy} APY` : ''}** over ${weeks.length} game${weeks.length === 1 ? '' : 's'}.

## Week-by-week

${tableHeader}
${weeks.map(([, line]) => line).join('\n')}

---

*Auto-generated by \`scripts/rollup-athlete-stats.mjs\`. Idempotent — safe to re-run any week.*
`;
  fs.writeFileSync(filePath, out, 'utf8');
}

function num(s) {
  const n = parseInt(String(s).trim(), 10);
  return isNaN(n) ? 0 : n;
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared parsing (matches parse-stats.mjs + build-cards.mjs)
// ═══════════════════════════════════════════════════════════════════════════

function parseStatFile(md) {
  const rows = [];
  const tableRe = /^\|\s*([a-z0-9\-]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|$/;
  for (const line of md.split('\n')) {
    const m = line.match(tableRe);
    if (m && m[1] !== 'athlete_id') {
      rows.push({
        athlete_id: m[1],
        canonical_name: m[2],
        school_canonical: m[3],
        rec: m[4],
        yds: m[5],
        td: m[6],
        apy: m[7],
        notes: m[8],
      });
    }
  }
  return { rows };
}

function extractCanonicalAthletes(md) {
  const idx = md.indexOf('## Athletes');
  const region = idx === -1 ? md : md.slice(idx);
  const athletes = [];
  const blockRe = /```yaml\n([\s\S]*?)```/g;
  let m;
  while ((m = blockRe.exec(region)) !== null) {
    const block = m[1];
    const chunks = block.split(/\n(?=- id:)/);
    for (const chunk of chunks) {
      if (!chunk.trim().startsWith('- id:')) continue;
      if (chunk.trim().startsWith('#')) continue;
      const a = parseAthleteBlock(chunk);
      if (a && a.id) athletes.push(a);
    }
  }
  return athletes;
}

function parseAthleteBlock(chunk) {
  const out = {};
  for (const line of chunk.split('\n')) {
    if (line.trim().startsWith('#')) continue;
    const m = line.match(/^\s*-?\s*(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, key, valRaw] = m;
    let val = valRaw.trim();
    if (val === 'null' || val === '') val = null;
    else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map((v) => v.trim()).filter(Boolean);
    }
    out[key] = val;
  }
  return out;
}

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
