#!/usr/bin/env node
/**
 * Turn the designer's raw floor-plan exports into SVGs that can be inlined into
 * the venue page, and generate the font stylesheet they depend on.
 *
 *   app/assets/venue/raw/*.svg   (Affinity Designer exports, committed as-is)
 *     -> app/assets/venue/*.svg  (optimized, id-namespaced, ready to v-html)
 *     -> app/assets/venue/fonts.css
 *
 * Three problems are solved here:
 *
 * 1. Size. The raw exports carry full float precision and a lot of Affinity
 *    bookkeeping. SVGO roughly halves them.
 *
 * 2. Colliding ids. Every export names its first clip path `_clip1`. As separate
 *    `<img>` documents that was harmless, but inlined into one page every
 *    `clip-path="url(#_clip1)"` would resolve to whichever came first and the
 *    plans would render wrong. `prefixIds` namespaces them per file.
 *
 * 3. Uneven letter spacing. The exports hard-code a per-glyph `x` offset for
 *    every character, computed from Noto Sans TC. Without that exact font the
 *    fallback's glyph widths disagree with the baked-in offsets and the text
 *    comes out unevenly spaced. `@nuxt/fonts` only loads weight 400, while these
 *    files need 100/500/700, so we subset exactly the glyphs used and emit them
 *    as one stylesheet shared by all the plans.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/prepare-venue-svg.mjs
 * (NODE_USE_ENV_PROXY is only needed behind an HTTP proxy; Node's fetch ignores
 * the proxy environment variables without it.)
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { optimize } from 'svgo'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const RAW_DIR = join(ROOT, 'app/assets/venue/raw')
const OUT_DIR = join(ROOT, 'app/assets/venue')
const FONTS_CSS = join(OUT_DIR, 'fonts.css')

/**
 * RB-AU.svg is a single base64 PNG in an `<svg>` wrapper — zero `<path>`
 * elements, so SVGO cannot touch it and it weighs 1.1 MB against 235 KB for the
 * equivalent webp. The venue page keeps using RB-AU.webp instead.
 */
const SKIP = new Set(['RB-AU.svg'])

/**
 * SVG font-family token -> Google Fonts family + weight.
 * Only the fonts that drive the baked-in per-glyph offsets need embedding.
 * `URW DIN` and `DIN 2014` are commercially licensed and appear only on
 * single-character labels (booth numbers, floor letters) that carry no per-glyph
 * offsets, so falling back there costs nothing but the typeface look.
 */
const FONT_MAP = {
  'NotoSansTC-Thin': { family: 'Noto Sans TC', weight: 100 },
  'NotoSansTC-Medium': { family: 'Noto Sans TC', weight: 500 },
  'NotoSansTC-Bold': { family: 'Noto Sans TC', weight: 700 },
}

// Chrome UA, otherwise the Google Fonts API serves TrueType instead of WOFF2.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function svgoConfig(id) {
  return {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // prefixIds does the renaming; letting cleanupIds also minify them
            // first only makes the diff noisier.
            cleanupIds: false,
          },
        },
      },
      // Namespace every id so multiple plans can coexist in one document.
      { name: 'prefixIds', params: { prefix: id, delim: '__', prefixClassNames: false } },
      // Drop width/height="100%" so CSS controls the size; viewBox stays.
      'removeDimensions',
    ],
  }
}

function decodeEntities(text) {
  return text
    .replace(/&apos;/g, '\'')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&')
}

/** Add every character rendered with an embeddable font into `glyphs`. */
function collectGlyphs(svg, glyphs) {
  for (const [, attrs, body] of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const token = attrs.match(/font-family:\s*'([^']+)'/)?.[1]
    if (!token || !(token in FONT_MAP)) {
      continue
    }

    const set = glyphs.get(token) ?? new Set()
    for (const char of decodeEntities(body.replace(/<[^>]*>/g, ''))) {
      // Whitespace has no outline; leaving it out keeps the subset smaller.
      if (!/\s/.test(char)) {
        set.add(char)
      }
    }
    glyphs.set(token, set)
  }
}

/** Fetch a WOFF2 subset containing exactly `chars`. */
async function fetchSubset(family, weight, chars) {
  const url = new URL('https://fonts.googleapis.com/css2')
  url.searchParams.set('family', `${family}:wght@${weight}`)
  url.searchParams.set('text', chars.join(''))

  const cssRes = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!cssRes.ok) {
    throw new Error(`Google Fonts CSS request failed: ${cssRes.status} ${url}`)
  }

  const css = await cssRes.text()
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)\s*format\('woff2'\)/)?.[1]
  if (!fontUrl) {
    throw new Error(`No WOFF2 source in CSS for ${family} ${weight}:\n${css}`)
  }

  const fontRes = await fetch(fontUrl, { headers: { 'User-Agent': UA } })
  if (!fontRes.ok) {
    throw new Error(`Font download failed: ${fontRes.status} ${fontUrl}`)
  }

  return Buffer.from(await fontRes.arrayBuffer())
}

const files = (await readdir(RAW_DIR)).filter((f) => f.endsWith('.svg') && !SKIP.has(f)).sort()
const glyphs = new Map()
let rawTotal = 0
let outTotal = 0

for (const file of files) {
  const raw = await readFile(join(RAW_DIR, file), 'utf8')
  const id = basename(file, '.svg')

  // Read the glyphs off the raw export: SVGO rewrites the quoting in `style`
  // attributes (`'Foo'` becomes `&quot;Foo&quot;`), which the matcher below
  // would miss. Optimizing does not change the text content itself.
  collectGlyphs(raw, glyphs)

  const { data, error } = optimize(raw, svgoConfig(id))
  if (error) {
    throw new Error(`SVGO failed on ${file}: ${error}`)
  }

  await writeFile(join(OUT_DIR, file), data)

  rawTotal += raw.length
  outTotal += data.length
  const pct = ((1 - data.length / raw.length) * 100).toFixed(1)
  console.log(`${file.padEnd(14)} ${(raw.length / 1024).toFixed(0).padStart(5)} KB -> ${(data.length / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`)
}

console.log(`${'total'.padEnd(14)} ${(rawTotal / 1024).toFixed(0).padStart(5)} KB -> ${(outTotal / 1024).toFixed(0).padStart(5)} KB  (-${((1 - outTotal / rawTotal) * 100).toFixed(1)}%)\n`)

if (glyphs.size === 0) {
  console.log('No embeddable text found; skipping fonts.css')
} else {
  const faces = []
  for (const [token, set] of [...glyphs].sort(([a], [b]) => a.localeCompare(b))) {
    const { family, weight } = FONT_MAP[token]
    const chars = [...set].sort()
    const font = await fetchSubset(family, weight, chars)
    faces.push(
      `@font-face {\n` +
      `  font-family: '${token}';\n` +
      `  font-style: normal;\n` +
      `  font-weight: ${weight};\n` +
      // The glyph offsets are baked in, so rendering with a fallback is worse
      // than rendering nothing for a moment.
      `  font-display: block;\n` +
      `  src: url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');\n` +
      `}`,
    )
    console.log(`${token.padEnd(18)} ${String(chars.length).padStart(3)} glyphs, ${(font.length / 1024).toFixed(1)} KB`)
  }

  const header = '/* Generated by scripts/prepare-venue-svg.mjs. Do not edit by hand. */\n' +
    '/* Subsets of Noto Sans TC (SIL Open Font License 1.1) covering only the\n' +
    '   glyphs used by the floor plans, so their baked-in per-glyph offsets line\n' +
    '   up with the actual glyph widths. */\n'
  await writeFile(FONTS_CSS, `${header}\n${faces.join('\n\n')}\n`)
  console.log(`\nfonts.css written (${(faces.join('').length / 1024).toFixed(0)} KB)`)
}
