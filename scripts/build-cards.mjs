#!/usr/bin/env node
// build-cards.mjs — Canonical stat file → branded card pack + approval brief
//
// Reads data/stats/YYYY-WW.md (produced by parse-stats.mjs), reads each
// athlete's profile.md for consent + roster context, renders four card templates
// per qualifying athlete + one leaderboard + optional offer-add, writes the
// approval brief for Margin/Kyron to review.
//
// NEVER PUBLISHES. Writes to output/cards/YYYY-WW/ and output/reports/ only.
//
// Usage:
//   node scripts/build-cards.mjs --season 2025 --week 8 [--top 10] [--athlete kaydon-finley]
//
// Dependencies (global): playwright with chromium installed.
//   npx playwright install chromium   # one-time, per machine
//
// Fonts: embedded via @font-face using base64 data-URIs. NO Google Fonts fetch
// at runtime. Font woff2 files live in scripts/fonts/ — the build fails clean
// if any are missing (instructions in the error message).
//
// See skills/weekly-stats-cards/SKILL.md for the full contract.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// ─── args ───────────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
if (!args.season || !args.week) {
  console.error('Usage: build-cards.mjs --season YYYY --week N [--top 10] [--athlete ID]');
  process.exit(2);
}
const season = String(args.season);
const week = String(args.week).padStart(2, '0');
const weekKey = `${season}-W${week}`;
const topN = args.top ? parseInt(args.top, 10) : 10;
const filterAthlete = args.athlete || null;

// ─── load canonical stat file ───────────────────────────────────────────────
const statFile = path.join(REPO_ROOT, 'data/stats', `${weekKey}.md`);
if (!fs.existsSync(statFile)) {
  console.error(`Missing ${path.relative(REPO_ROOT, statFile)}. Run parse-stats.mjs first.`);
  process.exit(2);
}
const stats = parseStatFile(fs.readFileSync(statFile, 'utf8'));
if (stats.pending_match_count > 0 || stats.parse_failed_count > 0) {
  console.error(`Stat file has unresolved rows. Fix ${weekKey} in canonical-athletes.md, re-parse, and re-run.`);
  process.exit(1);
}

// ─── load canonical athletes for hooks_folder + consent lookup ──────────────
const canonicalRaw = fs.readFileSync(path.join(REPO_ROOT, 'data/stats/canonical-athletes.md'), 'utf8');
const canonical = extractCanonicalAthletes(canonicalRaw);
const canonicalById = new Map(canonical.map((a) => [a.id, a]));

// ─── prepare output dirs ────────────────────────────────────────────────────
const cardsDir = path.join(REPO_ROOT, 'output/cards', weekKey);
const pendingDir = path.join(cardsDir, '_pending-consent');
const offerAddDir = path.join(cardsDir, '_offer-add');
const reportsDir = path.join(REPO_ROOT, 'output/reports');
const portraitsDir = path.join(REPO_ROOT, 'assets/portraits');
fs.mkdirSync(cardsDir, { recursive: true });
fs.mkdirSync(pendingDir, { recursive: true });
fs.mkdirSync(offerAddDir, { recursive: true });
fs.mkdirSync(reportsDir, { recursive: true });

// ─── offer-add auto-trigger: read the last 4 weeks' athlete ids + statuses ──
const priorHistory = loadPriorHistory({ REPO_ROOT, season, week, lookback: 4 });

// ─── consent gate + row prep ────────────────────────────────────────────────
const brief = { generated: [], pendingConsent: [], blockedMinors: [] };
for (const row of stats.rows) {
  if (filterAthlete && row.athlete_id !== filterAthlete) continue;
  const a = canonicalById.get(row.athlete_id);
  if (!a) {
    // Should not happen — parse-stats.mjs guarantees a match. Defensive skip.
    console.warn(`No canonical entry for ${row.athlete_id} — skipping.`);
    continue;
  }
  const isMinor = String(a.hooks_folder || '').startsWith('_training-clients');
  const publicOk = a.consent_public_stats === true;
  const guardianOk = a.guardian_signed_release_on_file === true;

  if (isMinor && !(publicOk && guardianOk)) {
    brief.blockedMinors.push({ row, athlete: a, reason: !publicOk ? 'consent_public_stats missing' : 'guardian_signed_release_on_file missing' });
    continue;
  }
  if (!isMinor && !publicOk) {
    brief.pendingConsent.push({ row, athlete: a });
    continue;
  }
  brief.generated.push({ row, athlete: a });
}

// ─── render cards ───────────────────────────────────────────────────────────
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1200, height: 1350 }, deviceScaleFactor: 2 });

console.log(`\n▸ Rendering ${brief.generated.length} athlete card sets for ${weekKey}...`);
for (const item of brief.generated) {
  await renderAthleteCards(context, item, cardsDir);
}
for (const item of brief.pendingConsent) {
  await renderAthleteCards(context, item, pendingDir);
}

// ─── offer-add auto-trigger ─────────────────────────────────────────────────
brief.offerAdds = [];
for (const g of brief.generated) {
  const trigger = detectOfferAddTrigger(g, priorHistory);
  if (!trigger) continue;
  brief.offerAdds.push({ ...g, trigger });
  await renderOfferAddCard(context, g, trigger, offerAddDir);
}

// ─── leaderboard ────────────────────────────────────────────────────────────
const leaderboard = brief.generated
  .map((g) => ({ ...g, heroValue: heroValue(g.row) }))
  .sort((a, b) => b.heroValue - a.heroValue)
  .slice(0, topN);
if (leaderboard.length > 0) {
  await renderLeaderboard(context, leaderboard, cardsDir, week, season);
}

await browser.close();

// ─── write approval brief ───────────────────────────────────────────────────
const briefPath = path.join(reportsDir, `${weekKey}-card-brief.md`);
fs.writeFileSync(briefPath, renderBrief({ weekKey, season, week, brief, leaderboard, topN }), 'utf8');

console.log(`✓ Cards → ${path.relative(REPO_ROOT, cardsDir)}`);
if (brief.pendingConsent.length) console.log(`  ⚠ ${brief.pendingConsent.length} in _pending-consent/`);
if (brief.offerAdds.length) console.log(`  ★ ${brief.offerAdds.length} in _offer-add/ (auto-triggered)`);
if (brief.blockedMinors.length) console.log(`  ✗ ${brief.blockedMinors.length} blocked (minors, missing consent) — see brief`);
console.log(`✓ Brief → ${path.relative(REPO_ROOT, briefPath)}`);
console.log('\nApproval flow: Kyron reads the brief → approves cards → hands to Subject Media or posts himself.');

// ═══════════════════════════════════════════════════════════════════════════
// Rendering
// ═══════════════════════════════════════════════════════════════════════════

async function renderAthleteCards(context, item, outDir) {
  const { row, athlete } = item;
  const portrait = loadPortrait(row.athlete_id);
  const igHTML = buildAthleteHTML({ row, athlete, portrait, layout: 'ig' });
  const twHTML = buildAthleteHTML({ row, athlete, portrait, layout: 'twitter' });

  await renderTo(context, igHTML, 1080, 1350, path.join(outDir, `${row.athlete_id}-ig.png`));
  await renderTo(context, twHTML, 1200, 675, path.join(outDir, `${row.athlete_id}-twitter.png`));
}

async function renderOfferAddCard(context, item, trigger, outDir) {
  const { row, athlete } = item;
  const portrait = loadPortrait(row.athlete_id);
  const html = buildOfferAddHTML({ row, athlete, portrait, trigger });
  const filename = `${trigger.tag}-${row.athlete_id}-ig.png`;
  await renderTo(context, html, 1080, 1350, path.join(outDir, filename));
}

function loadPortrait(athleteId) {
  const exts = ['.jpg', '.jpeg', '.png', '.webp'];
  for (const ext of exts) {
    const p = path.join(portraitsDir, `${athleteId}${ext}`);
    if (fs.existsSync(p)) {
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'image/webp';
      const b64 = fs.readFileSync(p).toString('base64');
      return { dataUri: `data:${mime};base64,${b64}`, present: true };
    }
  }
  return { dataUri: null, present: false };
}

function loadPriorHistory({ REPO_ROOT, season, week, lookback }) {
  // Returns a Map: athlete_id → { last_seen_week: N, last_status: 'active' | ..., appearances: N }
  const history = new Map();
  const w = parseInt(week, 10);
  for (let i = 1; i <= lookback; i++) {
    const priorWeek = String(w - i).padStart(2, '0');
    const priorPath = path.join(REPO_ROOT, 'data/stats', `${season}-W${priorWeek}.md`);
    if (!fs.existsSync(priorPath)) continue;
    const md = fs.readFileSync(priorPath, 'utf8');
    const rows = parseStatFile(md).rows;
    for (const r of rows) {
      const cur = history.get(r.athlete_id) || { appearances: 0, last_seen_week: null };
      cur.appearances += 1;
      if (cur.last_seen_week === null) cur.last_seen_week = w - i;
      history.set(r.athlete_id, cur);
    }
  }
  return history;
}

function detectOfferAddTrigger(item, priorHistory) {
  const { row, athlete } = item;
  const prior = priorHistory.get(row.athlete_id);
  // First-appearance: no history in the last 4 weeks.
  if (!prior || prior.appearances === 0) {
    return { tag: 'first-appearance', headline: 'NEW ON THE BOARD', sub: 'First game we\'re tracking' };
  }
  // Status change: committed / signed.
  if (athlete.status === 'committed' || athlete.status === 'signed') {
    const priorStatus = prior.last_status || 'active';
    if (priorStatus !== athlete.status) {
      const verb = athlete.status === 'committed' ? 'COMMITTED' : 'SIGNED';
      const dest = athlete.committed_to ? ` · ${athlete.committed_to}` : '';
      return { tag: `${athlete.status}`, headline: verb + dest, sub: 'Trail marker' };
    }
  }
  return null;
}

async function renderLeaderboard(context, rows, outDir, week, season) {
  const html = buildLeaderboardHTML({ rows, week, season });
  await renderTo(context, html, 1080, 1350, path.join(outDir, 'leaderboard-top10-ig.png'));
}

async function renderTo(context, html, width, height, outPath) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(100); // let fonts settle
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width, height } });
  await page.close();
}

function heroStat(row) {
  // TD > APY > YDS > REC — pick the strongest single number for the hero card.
  if (row.td && Number(row.td) > 0) return { label: 'TD', value: row.td };
  if (row.apy && Number(row.apy) > 0) return { label: 'APY', value: row.apy };
  if (row.yds && Number(row.yds) > 0) return { label: 'YDS', value: row.yds };
  if (row.rec && Number(row.rec) > 0) return { label: 'REC', value: row.rec };
  return { label: '—', value: '—' };
}

function heroValue(row) {
  const h = heroStat(row);
  return Number(h.value) || 0;
}

function statLine(row) {
  const parts = [];
  if (row.rec) parts.push(`${row.rec} REC`);
  if (row.yds) parts.push(`${row.yds} YDS`);
  if (row.td) parts.push(`${row.td} TD`);
  if (row.apy) parts.push(`${row.apy} APY`);
  return parts.join(' · ');
}

function baseCss() {
  // Brand tokens locked per skills/weekly-stats-cards/SKILL.md.
  // Fonts loaded via @font-face — files expected at scripts/fonts/*.woff2.
  const fontsCss = loadFontsCss();
  return `
    ${fontsCss}
    :root {
      --navy: #0B1D3A;
      --gold: #E4B23C;
      --cream: #F5F1E8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: var(--navy); color: var(--cream); font-family: 'Manrope', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
    body::before {
      content: ''; position: fixed; inset: 0;
      background: radial-gradient(ellipse at top, rgba(228, 178, 60, 0.12), transparent 60%);
      pointer-events: none;
    }
  `;
}

function loadFontsCss() {
  const fontDir = path.join(__dirname, 'fonts');
  const map = {
    'Anton': 'Anton-Regular.woff2',
    'Fraunces': 'Fraunces-Regular.woff2',
    'JetBrains Mono': 'JetBrainsMono-Regular.woff2',
    'Manrope': 'Manrope-Regular.woff2',
  };
  const missing = [];
  const decl = [];
  for (const [family, file] of Object.entries(map)) {
    const p = path.join(fontDir, file);
    if (!fs.existsSync(p)) {
      missing.push(file);
      continue;
    }
    const b64 = fs.readFileSync(p).toString('base64');
    decl.push(`@font-face { font-family: '${family}'; src: url(data:font/woff2;base64,${b64}) format('woff2'); font-display: block; }`);
  }
  if (missing.length) {
    console.error(`\n✗ Missing font files in scripts/fonts/:\n  ${missing.join('\n  ')}`);
    console.error(`\nDownload the woff2 for each family (Anton, Fraunces, JetBrains Mono, Manrope) from the`);
    console.error(`family's official source and drop into scripts/fonts/ with the exact filenames above.`);
    console.error(`Cards will not render with fallback fonts — the brand demands the real typography.\n`);
    process.exit(2);
  }
  return decl.join('\n');
}

function buildAthleteHTML({ row, athlete, portrait, layout }) {
  const hero = heroStat(row);
  const isTw = layout === 'twitter';
  const w = isTw ? 1200 : 1080;
  const h = isTw ? 675 : 1350;
  const portraitSize = isTw ? 140 : 200;
  const portraitBlock = portrait && portrait.present
    ? `<img class="portrait" src="${portrait.dataUri}" alt="" />`
    : `<div class="portrait portrait--placeholder" aria-hidden="true"></div>`;

  return `<!doctype html><html><head><style>
${baseCss()}
.card { width: ${w}px; height: ${h}px; padding: ${isTw ? '48px 60px' : '80px 72px'}; display: flex; flex-direction: column; justify-content: space-between; }
.eyebrow { font-family: 'JetBrains Mono', monospace; font-size: ${isTw ? '14px' : '18px'}; letter-spacing: 0.24em; color: var(--gold); text-transform: uppercase; font-weight: 700; }
.top { display: flex; align-items: center; gap: ${isTw ? '24px' : '32px'}; margin-top: ${isTw ? '20px' : '32px'}; }
.portrait { width: ${portraitSize}px; height: ${portraitSize}px; border-radius: 50%; object-fit: cover; border: 3px solid var(--gold); box-shadow: 0 4px 24px rgba(228, 178, 60, 0.25); flex-shrink: 0; }
.portrait--placeholder { background: radial-gradient(ellipse at center, rgba(228, 178, 60, 0.35), rgba(228, 178, 60, 0.08) 60%, transparent 80%); border: 3px solid rgba(228, 178, 60, 0.5); }
.top-text .name { font-family: 'Fraunces', serif; font-size: ${isTw ? '44px' : '58px'}; color: var(--cream); line-height: 1.02; }
.top-text .school { font-family: 'Manrope', sans-serif; font-size: ${isTw ? '20px' : '24px'}; color: rgba(245, 241, 232, 0.75); margin-top: 6px; }
.hero { display: flex; flex-direction: column; align-items: ${isTw ? 'flex-start' : 'center'}; text-align: ${isTw ? 'left' : 'center'}; margin: ${isTw ? '20px 0' : '32px 0'}; }
.hero .num { font-family: 'Anton', sans-serif; font-size: ${isTw ? '280px' : '380px'}; line-height: 0.9; color: var(--gold); letter-spacing: -0.03em; }
.hero .label { font-family: 'JetBrains Mono', monospace; font-size: ${isTw ? '22px' : '28px'}; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; margin-top: 8px; font-weight: 700; }
.line { font-family: 'JetBrains Mono', monospace; font-size: ${isTw ? '18px' : '22px'}; letter-spacing: 0.16em; color: var(--gold); text-transform: uppercase; margin-top: ${isTw ? '8px' : '16px'}; font-weight: 700; text-align: ${isTw ? 'left' : 'center'}; }
.footer { display: flex; justify-content: space-between; align-items: flex-end; }
.brand { font-family: 'Anton', sans-serif; font-size: ${isTw ? '20px' : '24px'}; color: var(--gold); text-transform: uppercase; letter-spacing: 0.06em; }
.week { font-family: 'JetBrains Mono', monospace; font-size: ${isTw ? '14px' : '18px'}; color: rgba(245, 241, 232, 0.6); letter-spacing: 0.22em; font-weight: 700; }
</style></head><body>
<div class="card">
  <div>
    <div class="eyebrow">Week ${parseInt(week, 10)} · ${season}</div>
    <div class="top">
      ${portraitBlock}
      <div class="top-text">
        <div class="name">${escapeHtml(athlete.canonical_name)}</div>
        <div class="school">${escapeHtml(athlete.school || row.school_canonical || '')}</div>
      </div>
    </div>
    <div class="hero">
      <div class="num">${hero.value}</div>
      <div class="label">${hero.label}</div>
    </div>
    <div class="line">${statLine(row)}</div>
  </div>
  <div class="footer">
    <div class="brand">Coached by Hooks</div>
    <div class="week">W${week}</div>
  </div>
</div></body></html>`;
}

function buildOfferAddHTML({ row, athlete, portrait, trigger }) {
  const hero = heroStat(row);
  const portraitBlock = portrait && portrait.present
    ? `<img class="portrait" src="${portrait.dataUri}" alt="" />`
    : `<div class="portrait portrait--placeholder" aria-hidden="true"></div>`;
  return `<!doctype html><html><head><style>
${baseCss()}
.card { width: 1080px; height: 1350px; padding: 80px 72px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(180deg, var(--navy), #0a1a34); }
.stamp { display: inline-block; padding: 10px 18px; border: 2px solid var(--gold); font-family: 'JetBrains Mono', monospace; font-size: 16px; letter-spacing: 0.28em; color: var(--gold); text-transform: uppercase; font-weight: 700; }
.headline { font-family: 'Anton', sans-serif; font-size: 88px; color: var(--cream); text-transform: uppercase; letter-spacing: -0.02em; line-height: 0.95; margin-top: 22px; }
.sub { font-family: 'Fraunces', serif; font-style: italic; font-size: 30px; color: var(--gold); margin-top: 12px; }
.portrait-wrap { display: flex; justify-content: center; margin: 40px 0; }
.portrait { width: 260px; height: 260px; border-radius: 50%; object-fit: cover; border: 4px solid var(--gold); box-shadow: 0 6px 32px rgba(228, 178, 60, 0.28); }
.portrait--placeholder { background: radial-gradient(ellipse at center, rgba(228, 178, 60, 0.35), rgba(228, 178, 60, 0.08) 60%, transparent 80%); border: 4px solid rgba(228, 178, 60, 0.5); }
.name { font-family: 'Fraunces', serif; font-size: 68px; color: var(--cream); text-align: center; line-height: 1.02; }
.school { font-family: 'Manrope', sans-serif; font-size: 24px; color: rgba(245, 241, 232, 0.75); text-align: center; margin-top: 8px; }
.line { font-family: 'JetBrains Mono', monospace; font-size: 20px; letter-spacing: 0.16em; color: var(--gold); text-transform: uppercase; margin-top: 32px; text-align: center; font-weight: 700; }
.footer { display: flex; justify-content: space-between; align-items: flex-end; }
.brand { font-family: 'Anton', sans-serif; font-size: 24px; color: var(--gold); text-transform: uppercase; letter-spacing: 0.06em; }
.week { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: rgba(245, 241, 232, 0.6); letter-spacing: 0.22em; font-weight: 700; }
</style></head><body>
<div class="card">
  <div>
    <div class="stamp">${escapeHtml(trigger.tag.replace(/-/g, ' '))}</div>
    <div class="headline">${escapeHtml(trigger.headline)}</div>
    <div class="sub">${escapeHtml(trigger.sub)}</div>
    <div class="portrait-wrap">${portraitBlock}</div>
    <div class="name">${escapeHtml(athlete.canonical_name)}</div>
    <div class="school">${escapeHtml(athlete.school || row.school_canonical || '')}</div>
    <div class="line">${statLine(row)}</div>
  </div>
  <div class="footer">
    <div class="brand">Coached by Hooks</div>
    <div class="week">W${week}</div>
  </div>
</div></body></html>`;
}

function buildLeaderboardHTML({ rows, week, season }) {
  const items = rows
    .map(
      (r, i) => `
    <div class="row">
      <div class="rank">${String(i + 1).padStart(2, '0')}</div>
      <div class="body">
        <div class="rname">${escapeHtml(r.athlete.canonical_name)}</div>
        <div class="rschool">${escapeHtml(r.athlete.school_short || r.athlete.school || '')}</div>
      </div>
      <div class="rstat">${statLine(r.row)}</div>
    </div>`,
    )
    .join('');

  return `<!doctype html><html><head><style>
${baseCss()}
.card { width: 1080px; height: 1350px; padding: 80px 72px 60px; display: flex; flex-direction: column; }
.eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 18px; letter-spacing: 0.28em; color: var(--gold); text-transform: uppercase; font-weight: 700; }
h1 { font-family: 'Anton', sans-serif; font-size: 92px; color: var(--cream); text-transform: uppercase; letter-spacing: -0.02em; line-height: 0.95; margin: 12px 0 6px; }
.sub { font-family: 'Fraunces', serif; font-style: italic; font-size: 28px; color: var(--gold); margin-bottom: 32px; }
.row { display: grid; grid-template-columns: 72px 1fr auto; gap: 18px; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(228, 178, 60, 0.2); }
.rank { font-family: 'Anton', sans-serif; font-size: 48px; color: var(--gold); }
.rname { font-family: 'Fraunces', serif; font-size: 28px; color: var(--cream); line-height: 1.1; }
.rschool { font-family: 'Manrope', sans-serif; font-size: 16px; color: rgba(245, 241, 232, 0.65); margin-top: 4px; }
.rstat { font-family: 'JetBrains Mono', monospace; font-size: 15px; letter-spacing: 0.12em; color: var(--gold); text-transform: uppercase; font-weight: 700; }
.footer { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; }
.brand { font-family: 'Anton', sans-serif; font-size: 24px; color: var(--gold); text-transform: uppercase; letter-spacing: 0.06em; }
.week { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: rgba(245, 241, 232, 0.6); letter-spacing: 0.22em; font-weight: 700; }
</style></head><body>
<div class="card">
  <div class="eyebrow">Week ${parseInt(week, 10)} · ${season} · Top ${rows.length}</div>
  <h1>The Board</h1>
  <div class="sub">who did work</div>
  <div>${items}</div>
  <div class="footer">
    <div class="brand">Coached by Hooks · Sky's The Limit WR</div>
    <div class="week">W${week}</div>
  </div>
</div></body></html>`;
}

function renderBrief({ weekKey, season, week, brief, leaderboard, topN }) {
  const today = new Date().toISOString().slice(0, 10);
  const generatedCount = brief.generated.length;

  let out = `# Card Brief — ${weekKey}

**Generated:** ${today}
**Cards ready for approval:** ${generatedCount}
**Offer-add auto-triggered:** ${brief.offerAdds ? brief.offerAdds.length : 0}
**Pending consent (adults, held):** ${brief.pendingConsent.length}
**Blocked (minors, consent missing):** ${brief.blockedMinors.length}
**Leaderboard:** Top ${leaderboard.length} of ${generatedCount}

Approval flow:
1. Kyron reviews this brief.
2. Approve individual cards below (mark ✓ next to each).
3. Approved cards go to Subject Media for scheduling OR Margin posts himself.
4. **Nothing publishes automatically. Ever.**

---

## Cards ready for approval

`;

  for (const g of brief.generated) {
    const hero = heroStat(g.row);
    const portrait = loadPortrait(g.row.athlete_id);
    const tweetDraft = draftTweet(g);
    const igDraft = draftIg(g);
    const liDraft = draftLinkedIn(g);
    const thDraft = draftThreads(g);
    out += `### ${g.athlete.canonical_name} — ${g.athlete.school}

- **Cards:** \`${g.row.athlete_id}-ig.png\` · \`${g.row.athlete_id}-twitter.png\`
- **Portrait:** ${portrait.present ? '✓ on file' : '⚠ placeholder (upload to `assets/portraits/' + g.row.athlete_id + '.jpg`)'}
- **Hero stat:** ${hero.value} ${hero.label}
- **Line:** ${statLine(g.row)}
- **Class:** ${g.athlete.class_year || 'n/a'} · **Position:** ${g.athlete.position || 'n/a'} · **Status:** ${g.athlete.status || 'n/a'}

**Twitter draft:**
> ${tweetDraft}

**IG caption draft:**
> ${igDraft}

**LinkedIn draft:**
> ${liDraft.replace(/\n/g, '\n> ')}

**Threads draft:**
> ${thDraft.replace(/\n/g, '\n> ')}

- [ ] Approve · Twitter
- [ ] Approve · IG
- [ ] Approve · LinkedIn
- [ ] Approve · Threads

---

`;
  }

  if (leaderboard.length) {
    out += `## Leaderboard — Top ${leaderboard.length}

**Card:** \`leaderboard-top10-ig.png\`

`;
    leaderboard.forEach((r, i) => {
      out += `${String(i + 1).padStart(2, '0')}. **${r.athlete.canonical_name}** (${r.athlete.school_short || r.athlete.school}) — ${statLine(r.row)}\n`;
    });
    out += `

**Tweet draft:**
> Week ${parseInt(week, 10)} board. Real work, real routes. ↓

- [ ] Approve · Leaderboard

---

`;
  }

  if (brief.pendingConsent.length) {
    out += `## ⚠ Pending consent (adult athletes — cards held)

Cards for these athletes rendered into \`_pending-consent/\` because \`consent_public_stats: true\` is missing on their profile. Add the consent to \`data/stats/canonical-athletes.md\`, re-run build-cards.mjs, or hold indefinitely.

`;
    for (const p of brief.pendingConsent) {
      out += `- **${p.athlete.canonical_name}** (${p.athlete.school}) — ${statLine(p.row)}\n`;
    }
    out += `\n---\n\n`;
  }

  if (brief.blockedMinors.length) {
    out += `## ✗ Blocked — minors, consent missing

**Not rendered at all.** Missing \`consent_public_stats\` and/or \`guardian_signed_release_on_file\`. Secure both before next week's ingest.

`;
    for (const b of brief.blockedMinors) {
      out += `- **${b.athlete.canonical_name}** (${b.athlete.school}) — reason: ${b.reason}\n`;
    }
    out += `\n---\n\n`;
  }

  out += `## ★ Offer-add cards (auto-triggered)

Auto-generated when an athlete is new to the board (no appearance in the last 4 weeks) OR their status flipped to \`committed\` / \`signed\` this week. Rendered into \`_offer-add/\` — approve individually before Kyron/Margin ships.

`;
  if (brief.offerAdds.length === 0) {
    out += `_None triggered this week._\n\n---\n\n`;
  } else {
    for (const o of brief.offerAdds) {
      out += `### ${o.trigger.headline} · ${o.athlete.canonical_name}

- **Card:** \`${o.trigger.tag}-${o.row.athlete_id}-ig.png\`
- **Trigger:** ${o.trigger.tag}
- **School:** ${o.athlete.school}
- **Line:** ${statLine(o.row)}

**Twitter draft:**
> ${o.trigger.headline} — ${o.athlete.canonical_name}. ${o.athlete.school_short || o.athlete.school}. #CoachedByHooks

- [ ] Approve · Offer-add

---

`;
    }
  }

## Post-approval next step

1. Approved cards + drafts → Subject Media crew for scheduling per \`skills/subject-media-coordination/SKILL.md\`.
2. OR Margin posts himself. Log the post channels in \`data/engagement/${weekKey}-card-posts.md\`.
3. Monday: \`workflows/weekly-engagement-review.md\` reads this brief to score which cards drove engagement.
`;
  return out;
}

function draftTweet(g) {
  const line = statLine(g.row);
  return `${g.athlete.canonical_name}. ${g.athlete.school_short || g.athlete.school}. ${line}. #CoachedByHooks`;
}

function draftIg(g) {
  const hero = heroStat(g.row);
  const line = statLine(g.row);
  return `${g.athlete.canonical_name} — ${hero.value} ${hero.label} kind of night.\n\n${line}. ${g.athlete.school}. Week ${parseInt(week, 10)}.\n\nWork keeps talking.\n\n#CoachedByHooks · #SkysTheLimitWR`;
}

function draftLinkedIn(g) {
  const line = statLine(g.row);
  const pos = g.athlete.position ? `${g.athlete.position} · ` : '';
  const cls = g.athlete.class_year ? `Class of ${g.athlete.class_year} · ` : '';
  return `${g.athlete.canonical_name} — ${g.athlete.school}\n\n${pos}${cls}Week ${parseInt(week, 10)} line: ${line}.\n\nThe reps show up in the tape. The tape shows up on Sundays.`;
}

function draftThreads(g) {
  const hero = heroStat(g.row);
  const line = statLine(g.row);
  return `${g.athlete.canonical_name} put ${hero.value} ${hero.label} on the sheet this week.\n\n${line}. That's the work.`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Parsing helpers (shared with parse-stats.mjs conventions)
// ═══════════════════════════════════════════════════════════════════════════

function parseStatFile(md) {
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  const meta = {};
  if (fm) {
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
  }
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
  return {
    season: meta.season,
    week: meta.week,
    pending_match_count: parseInt(meta.pending_match_count || '0', 10),
    parse_failed_count: parseInt(meta.parse_failed_count || '0', 10),
    rows,
  };
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

function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
