# 🧬 BioCrypt-X — Complete AI Context Document

> **Purpose:** This document is a single-file knowledge dump of the BioCrypt-X project. Feed this to any AI assistant (Claude, ChatGPT, Gemini, Copilot, etc.) so it can immediately understand the project's architecture, codebase, design decisions, current status, known issues, and future plans — without needing to read every source file.

> **Last Updated:** May 31, 2026  
> **Version:** v1.0.0-beta  
> **Repository:** https://github.com/karthik5033/BioCrypt

---

## 1. Project Overview

### One-Line Pitch
> *A file encryption system where data is encoded as DNA sequences, encrypted via controlled biological mutations, and recovered from corruption using sequence alignment algorithms.*

### What It Is
BioCrypt-X is a **DAA (Design and Analysis of Algorithms) academic project** that demonstrates how biological concepts — DNA encoding, mutations, and genomic alignment — can be applied to build a novel encryption and data-recovery pipeline. It is a fully functional, production-quality Next.js web application with a premium glassmorphic UI.

### Core Pipeline
```
File → Binary → RLE → LZW → Huffman → DNA Strand → Mutate (Encrypt) → Store
                                                                         ↓
File ← Binary ← DNA Strand ← Decompress ← Recover ← Corrupted DNA
```

### Academic Purpose (DAA Coverage)
This project was designed to cover the following DAA topics:
1. **String Algorithms** — KMP, Rabin-Karp (pattern matching & corruption detection)
2. **Greedy Algorithms** — Huffman Coding (compression)
3. **Dynamic Programming** — LCS, Edit Distance, Needleman-Wunsch (recovery)
4. **Tree Data Structures** — Huffman Tree, Trie (indexing)
5. **Lossless Compression** — RLE (Run-Length Encoding), LZW (Lempel-Ziv-Welch)
6. **Complexity Analysis** — Time/space analysis for all operations

---

## 2. Tech Stack

| Layer            | Technology                                    |
|------------------|-----------------------------------------------|
| **Framework**    | Next.js 16 (App Router + Turbopack)           |
| **Language**     | TypeScript (Strict Mode, target ES2017)       |
| **Styling**      | Vanilla CSS Modules (zero utility frameworks) |
| **State**        | React Context API (`BioCryptContext`)          |
| **Icons**        | Lucide React                                  |
| **Fonts**        | Google Fonts: DM Sans (UI) + DM Mono (code)   |
| **Algorithms**   | Pure TypeScript (zero external libraries)     |
| **Node**         | ≥ 18.0                                        |
| **Package Mgr**  | npm (package-lock.json present)               |
| **Build**        | `next build` / `npm run dev`                  |
| **Deployment**   | Vercel-ready                                  |

### Dependencies (package.json)
```json
{
  "dependencies": {
    "lucide-react": "^1.17.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "typescript": "^5"
  }
}
```

---

## 3. Architecture & File Tree

```
BioCrypt/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout (fonts, metadata, ClientShell)
│   │   ├── globals.css                   # Global CSS variables, base styles, animations
│   │   ├── page.tsx                      # Landing page (~817 lines, full marketing page)
│   │   ├── page.module.css               # Landing page styles
│   │   ├── icon.svg                      # Favicon
│   │   │
│   │   ├── encode/                       # Step 1: File → DNA Encoding
│   │   │   ├── page.tsx                  # Encode page component (318 lines)
│   │   │   └── encode.module.css         # Encode page styles
│   │   │
│   │   ├── encrypt/                      # Step 2: DNA → Mutation Cipher
│   │   │   ├── page.tsx                  # Encrypt page component
│   │   │   └── encrypt.module.css        # Encrypt page styles
│   │   │
│   │   ├── recover/                      # Step 3: DP-based Recovery (KILLER FEATURE)
│   │   │   ├── page.tsx                  # Recovery page component (456 lines)
│   │   │   └── recover.module.css        # Recovery page styles
│   │   │
│   │   ├── analyze/                      # Step 4: Complexity Dashboard + KMP Search
│   │   │   ├── page.tsx                  # Analyze page component (504 lines)
│   │   │   └── analyze.module.css        # Analyze page styles
│   │   │
│   │   └── algorithms/                   # Algorithm explainer pages
│   │       ├── layout.tsx                # Shared layout for algorithm pages
│   │       ├── huffman/
│   │       │   └── page.tsx              # Huffman Coding explainer with interactive demo
│   │       └── needleman-wunsch/
│   │           └── page.tsx              # Needleman-Wunsch explainer with interactive demo
│   │
│   ├── lib/                              # Core algorithm implementations (PURE TYPESCRIPT)
│   │   ├── encoder.ts                    # Binary→DNA + RLE + LZW + Huffman (289 lines)
│   │   ├── mutationCipher.ts             # Key-seeded LCG mutation cipher (127 lines)
│   │   └── recoveryEngine.ts            # Needleman-Wunsch DP alignment (125 lines)
│   │
│   ├── components/layout/                # UI Shell components
│   │   ├── ClientShell.tsx               # BioCryptProvider + video bg + Navbar + Pipeline + Footer
│   │   ├── Navbar.tsx                    # Top navigation bar with route links
│   │   ├── PipelineStage.tsx             # Visual step tracker (Encode→Encrypt→Recover→Analyze)
│   │   └── Footer.tsx                    # Footer component
│   │
│   └── context/
│       └── BioCryptContext.tsx            # React Context for cross-page global state (117 lines)
│
├── public/
│   ├── dna-video.mp4                     # Background video (3 MB, DNA helix animation)
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│
├── BioCrypt-X.md                         # Original project blueprint & build prompts
├── PROJECT_STATUS.md                     # Current status & roadmap document
├── README.md                             # GitHub README with badges, usage, architecture
├── AGENTS.md                             # Auto-generated Next.js agent rules
├── CLAUDE.md                             # Points to AGENTS.md
├── package.json
├── tsconfig.json
├── next.config.ts                        # Empty/default Next.js config
└── eslint.config.mjs
```

---

## 4. Routing & Page Map

| Route               | Page                    | Description                                                                 |
|----------------------|-------------------------|-----------------------------------------------------------------------------|
| `/`                  | Landing / Home          | Full marketing landing page with hero, pipeline cards, algorithm cards, stats, CTA |
| `/encode`            | DNA Encoder             | File upload → Binary → DNA conversion + Huffman compression stats           |
| `/encrypt`           | Mutation Cipher         | Encrypt DNA via key-seeded substitution/inversion mutations                 |
| `/recover`           | Recovery Engine ⭐       | Needleman-Wunsch DP alignment to recover corrupted `?` characters           |
| `/analyze`           | Analysis Dashboard      | Complexity benchmarks + KMP pattern search demo                             |
| `/algorithms/huffman`| Huffman Explainer       | Interactive clickable card explaining Huffman Coding algorithm              |
| `/algorithms/needleman-wunsch` | NW Explainer | Interactive clickable card explaining Needleman-Wunsch algorithm            |

---

## 5. Global State Architecture

All cross-page data flows through a single React Context: `BioCryptContext`.

### State Shape
```typescript
interface BioCryptState {
  // Pipeline visual tracker
  pipeline: PipelineState;           // { encode, encrypt, recover, analyze } → "pending" | "in-progress" | "complete"
  setPipelineStep: (step, status) => void;

  // Encode step
  originalFile: File | null;
  encoderResult: EncoderResult | null;   // Contains: binaryString, rawDNA, huffmanEncoded, stats

  // Encrypt step
  encryptionKey: string;
  cipherResult: CipherResult | null;     // Contains: encryptedDNA, mutationMap[]

  // Recover step
  recoveryResult: RecoveryResult | null; // Contains: recoveredSequence, dpMatrix[][], stats

  // Analyze step
  analysisStats: AnalysisStats;          // Contains: compressionRatio, mutationsApplied, recoveryAccuracy, executionTimeMs
}
```

### Data Flow Between Pages
1. **Encode** → sets `encoderResult` (rawDNA, stats) → marks pipeline "encode" as "complete"
2. **Encrypt** → reads `encoderResult.rawDNA` as input → sets `cipherResult` (encryptedDNA, mutationMap)
3. **Recover** → reads `cipherResult.encryptedDNA` (as corrupted) and `encoderResult.rawDNA` (as reference) → sets `recoveryResult`
4. **Analyze** → reads all results from context → computes benchmarks

### Important: ClientShell Wrapper
`ClientShell.tsx` wraps the entire app with:
- `<BioCryptProvider>` — global state context
- `<video>` — persistent background DNA video (fixed, `z-index: 0`)
- Translucent overlay on non-landing pages (`rgba(255,255,255,0.4)` + `blur(4px)`)
- `<Navbar>` — top navigation
- `<PipelineStage>` — visual step tracker (hidden on landing page `/`)
- `<Footer>` — bottom footer

---

## 6. Algorithm Implementations (Detailed)

### 6.1 Encoder (`src/lib/encoder.ts`) — 289 lines

**Pipeline:** `File Bytes → RLE → LZW → Huffman → DNA`

#### Binary → DNA Mapping
```
00 → A    01 → T    10 → C    11 → G
```

#### Compression Pipeline (3-stage)
1. **RLE (Run-Length Encoding):** Detects runs of ≥3 identical bytes, replaces with `[ESC_TOKEN=256][count][byte]`. Max run length: 255.
2. **LZW (Lempel-Ziv-Welch):** Dictionary-based compression on the RLE output. Dictionary size capped at 4096 entries (12-bit). Initial dictionary: 0-256 (0-255 bytes + RLE escape token).
3. **Huffman Coding:** Builds frequency map → priority queue → Huffman tree → prefix-free binary codes → encodes LZW tokens.

#### Final Step
The Huffman bitstring is converted to DNA using the binary→nucleotide mapping.

#### Exported Types
```typescript
interface EncoderResult {
  binaryString: string;      // Raw binary for UI preview
  rawDNA: string;            // DNA from compressed bitstring
  huffmanEncoded: string;    // The Huffman bitstring itself
  stats: EncoderStats;       // All metrics
}

interface EncoderStats {
  originalSizeBytes: number;
  binaryLength: number;
  dnaLength: number;
  rleTokenCount: number;
  lzwTokenCount: number;
  huffmanBitLength: number;
  huffmanByteSize: number;
  compressionRatio: number;  // originalSize / huffmanByteSize
  codeTable: Record<string, string>;  // Token → Huffman code
}
```

---

### 6.2 Mutation Cipher (`src/lib/mutationCipher.ts`) — 127 lines

**Purpose:** Encrypt DNA strands using biologically-inspired mutations.

#### LCG (Linear Congruential Generator)
```typescript
class LCG {
  seed = keyHash % 2147483647;
  next(): seed = (seed * 16807) % 2147483647;
  nextFloat(): (next() - 1) / 2147483646;  // Returns 0-1
}
```

#### Key Hashing
Uses a simple `(hash << 5) - hash + charCode` rolling hash.

#### Mutation Types
1. **Substitution:** A↔T, C↔G swap at seeded positions
2. **Inversion:** Reverse a segment of 2-5 characters at seeded position
3. **Deletion-Insertion (Indel):** Replace a character with a random base (keeps length consistent for alignment)

#### Mutation Rate
10-20% of the DNA strand length, determined by LCG.

#### Important: Encryption is ONE-WAY only in current implementation
There is NO `decryptDNA()` function exported. The mutation map is generated and displayed but decryption (reverse application) is not implemented.

#### Exported Types
```typescript
type MutationType = "Substitution" | "Inversion" | "Deletion-Insertion";

interface MutationRecord {
  position: number;
  original: string;
  mutated: string;
  type: MutationType;
}

interface CipherResult {
  encryptedDNA: string;
  mutationMap: MutationRecord[];
}
```

---

### 6.3 Recovery Engine (`src/lib/recoveryEngine.ts`) — 125 lines

**Purpose:** Reconstruct corrupted DNA using Needleman-Wunsch global sequence alignment.

#### Scoring Parameters
```
Match:    +2
Mismatch: -1
Gap:      -2
```

#### Wildcard Handling
`?` characters in the corrupted sequence are treated as wildcard matches (score = +2 when aligned with any reference character).

#### Algorithm Flow
1. **Initialize** DP matrix with gap penalties
2. **Fill** matrix row-by-row using max(diagonal, up, left)
3. **Backtrack** from `dp[m][n]` to `dp[0][0]` to reconstruct alignment
4. **Recover** `?` characters by substituting the aligned reference character

#### Output Format
Recovered characters are wrapped in brackets: `ATCG[G][C]TAAGT`

#### Exported Types
```typescript
interface DPMatrixCell {
  val: number;
  source: "diag" | "up" | "left" | "none";
}

interface RecoveryResult {
  recoveredSequence: string;      // e.g. "ATCG[G]CTAAGT"
  dpMatrix: DPMatrixCell[][];     // Full DP table for visualization
  stats: RecoveryStats;
}

interface RecoveryStats {
  editDistance: number;
  charsRecovered: number;
  recoveryAccuracy: number;       // percentage (0-100)
}
```

---

### 6.4 KMP Pattern Search (inline in `/analyze/page.tsx`)

**Not in a separate lib file** — implemented directly in the Analyze page component.

```typescript
function computeFailureFunction(pattern: string): number[]
function kmpSearch(text: string, pattern: string): number[]
```

Used for searching DNA patterns in the strand with O(N+M) complexity.

---

## 7. UI/UX Design System

### Visual Theme
| Element         | Value                                           |
|-----------------|-------------------------------------------------|
| **Theme**       | Glassmorphism — translucent cards over live DNA video |
| **Background**  | Fixed DNA helix video (`dna-video.mp4`, 3 MB)   |
| **Accent**      | Amber/Bronze `#F59E0B` (hover: `#D97706`)       |
| **Foreground**  | Dark slate `#0F172A`                            |
| **Muted Text**  | `#64748B`                                       |
| **Borders**     | `#E2E8F0`                                       |
| **Cards**       | `rgba(255,255,255,0.7)` + `backdrop-filter: blur(12px)` |

### Typography
| Usage          | Font     | Weight | Size          |
|----------------|----------|--------|---------------|
| UI Headings    | DM Sans  | 600-800| clamp responsive |
| Body text      | DM Sans  | 400    | 0.9-1rem      |
| DNA sequences  | DM Mono  | 400-500| 0.85-0.95rem  |
| Labels/badges  | DM Mono  | 600-700| 0.65-0.75rem  |

### CSS Architecture
- **Global styles:** `src/app/globals.css` — CSS custom properties, base components (`.btn-primary`, `.btn-secondary`, `.clinical-card`, `.nav-link`), animations, mobile tab bar
- **Page styles:** CSS Modules (`.module.css`) per page
- **No utility frameworks** (no Tailwind)

### Key CSS Classes
| Class            | Purpose                                          |
|------------------|--------------------------------------------------|
| `.clinical-card` | Glassmorphic card with blur, translucent bg, border |
| `.btn-primary`   | Amber filled button with hover lift              |
| `.btn-secondary` | White outlined button                            |
| `.fade-in`       | Entry animation (opacity + translateY)           |
| `.spinner`       | White loading spinner                            |
| `.spinner-teal`  | Amber loading spinner                            |
| `.pipeline-bar`  | Desktop step indicator (sticky below navbar)     |
| `.mobile-tab-bar`| Mobile bottom tab navigation (fixed)             |

### Responsiveness
- Desktop: Pipeline bar (sticky) below navbar
- Mobile (≤768px): Pipeline bar hidden → bottom tab bar appears, nav links hidden, main content has bottom padding for tab bar
- All tables scroll horizontally on mobile

### Animations
- `fadeIn` — opacity 0→1, translateY 10→0 (0.5s)
- `spin` — rotate 360deg (1s, infinite)
- `blink` — cursor blink on landing page DNA typing
- Scroll-reveal — IntersectionObserver hooks on landing page sections
- DP table row-by-row fill animation (50ms per row)
- DNA typing animation on encode page (20ms per char)
- Animated counter on landing page stats

---

## 8. Component Inventory

### Layout Components (`src/components/layout/`)

| Component          | File              | Description                                      |
|--------------------|-------------------|--------------------------------------------------|
| `ClientShell`      | ClientShell.tsx    | Root wrapper: Context + video bg + overlay + nav + pipeline + footer |
| `Navbar`           | Navbar.tsx         | Top bar with logo + Encode/Encrypt/Recover/Analyze links (Lucide icons) |
| `PipelineStage`    | PipelineStage.tsx  | Visual step tracker with progress line, desktop + mobile variants |
| `Footer`           | Footer.tsx         | Simple footer: "DAA Project | DNA-Inspired Encryption Engine" |

### Page Components

| Page      | Key UI Features                                                            |
|-----------|---------------------------------------------------------------------------|
| Landing   | Hero with typing DNA, pipeline cards (4), feature cards (3), algorithm cards (6, clickable → `/algorithms/[id]`), animated stats, live recovery preview, CTA |
| Encode    | Drag-drop upload, file info, convert button, binary vs DNA side-by-side panels (color-coded nucleotides), compression stats with visual bar, Huffman code table |
| Encrypt   | DNA textarea (auto-populated from encode), key input, mutation type checkboxes, original vs encrypted strand comparison, mutation map table, .biocrypt download |
| Recover   | Corrupted/reference inputs (max 64 chars), preset buttons (3 demos), stats row, alignment comparison, recovered strand with brackets, animated DP heatmap table with traceback path |
| Analyze   | Benchmark button, 4 metric cards (compression, time complexity, mutation entropy ring, algorithm coverage table), KMP search with failure function visualizer + highlighted matches |

---

## 9. Current Project Status

### ✅ What's Working
- Full 4-stage pipeline (Encode → Encrypt → Recover → Analyze) with global state
- 3-stage compression (RLE → LZW → Huffman) produces actual compression for text files
- Key-seeded deterministic mutation cipher with substitution, inversion, indel
- Needleman-Wunsch DP recovery with animated heatmap and traceback path
- KMP pattern search with failure function visualization
- Interactive algorithm explainer pages (Huffman, Needleman-Wunsch)
- Premium glassmorphic UI with live DNA video background
- Fully responsive (desktop pipeline bar + mobile bottom tabs)
- Zero TypeScript/linting errors, Vercel deployment ready

### ⚠️ Known Issues & Limitations

1. **No Decryption Function:** `mutationCipher.ts` only has `encryptDNA()`. There is no `decryptDNA()` to reverse the mutations. The mutation map is generated but never used to decrypt.

2. **Recovery Engine 64-Char Limit:** The recover page hard-caps input at 64 characters to prevent browser OOM crashes from the O(N×M) DP matrix. This is a deliberate safety measure, not a bug.

3. **Compression Ratio on High-Entropy Files:** For already-compressed files (JPGs, PDFs, ZIPs), the compression ratio may be ≤1.0x (expansion). This is expected because high-entropy data has uniform byte distribution. Text files compress well.

4. **No File-to-File Round-Trip:** You cannot upload a file, encrypt it, and then download the original file back. The pipeline is for *demonstration* of algorithms, not production encryption.

5. **Benchmark Metrics are Approximations:** The Analyze page shows hardcoded approximate times (0.3ms, 0.5ms, 1.2ms) instead of measuring actual `performance.now()` for encoding and encryption steps.

6. **Algorithm Detail Pages Incomplete:** Only Huffman and Needleman-Wunsch have detail pages under `/algorithms/`. The landing page links to LCS, KMP, Trie, and LCG pages that don't exist yet (will 404).

7. **No Web Workers:** All computation runs on the main thread. Large files can freeze the UI.

8. **Video Background Performance:** The 3MB DNA video plays on all pages, which may impact performance on low-end devices.

---

## 10. Design Decisions & Rationale

| Decision                          | Rationale                                                    |
|-----------------------------------|--------------------------------------------------------------|
| Pure TypeScript algorithms        | Academic project — must demonstrate understanding, no black-box libraries |
| 64-char recovery limit            | O(N×M) DP matrix causes OOM above ~200 chars in browser JS   |
| Glassmorphic + video bg           | "Premium startup-grade" aesthetic for project presentation   |
| CSS Modules (no Tailwind)         | Full control over styling, zero dependencies                 |
| React Context (not Redux/Zustand) | Simplicity — only 4 state slices, no complex async flows     |
| 3-stage compression pipeline      | Original design only had Huffman on DNA bases (useless for high-entropy). RLE→LZW→Huffman applied to raw bytes first gives real compression |
| `?` as wildcard in recovery       | Intuitive representation of "unknown" characters in corrupted DNA |
| Amber accent (not teal)           | Original design spec was teal (#0D9488) but was changed to amber (#F59E0B) during development for better visual contrast against the video background |

---

## 11. How to Run

```bash
# Clone
git clone https://github.com/karthik5033/BioCrypt.git
cd BioCrypt

# Install
npm install

# Dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start
```

---

## 12. Future Roadmap

### Phase 2: Performance & Scalability
- [ ] Web Workers for heavy computations (DP, encryption, KMP)
- [ ] Stream processing with ReadableStream API for GB-scale files
- [ ] Banded Needleman-Wunsch to limit DP matrix memory

### Phase 3: Advanced Features
- [ ] Implement `decryptDNA()` function (reverse mutation map)
- [ ] Complete remaining algorithm detail pages (LCS, KMP, Trie, LCG)
- [ ] Codon-level encryption (3-base codons instead of single-base mutations)
- [ ] Intron/Exon splicing (inject junk data with secondary key)
- [ ] CRISPR pattern deletion (KMP-based target excision)

### Phase 4: Export & Integration
- [ ] FASTA file export for encrypted DNA
- [ ] WebAssembly (Rust → WASM) for recovery engine performance
- [ ] Full file round-trip (encrypt → store → decrypt → original file)

---

## 13. Key Files Quick Reference

| What You Need                     | File Path                                       |
|-----------------------------------|-------------------------------------------------|
| Root layout & fonts               | `src/app/layout.tsx`                            |
| Global CSS variables              | `src/app/globals.css`                           |
| Global state context              | `src/context/BioCryptContext.tsx`                |
| App shell (video, nav, pipeline)  | `src/components/layout/ClientShell.tsx`          |
| Encoding algorithm                | `src/lib/encoder.ts`                            |
| Encryption algorithm              | `src/lib/mutationCipher.ts`                     |
| Recovery algorithm                | `src/lib/recoveryEngine.ts`                     |
| KMP algorithm                     | `src/app/analyze/page.tsx` (lines 18-44)        |
| Landing page                      | `src/app/page.tsx`                              |
| Encode page                       | `src/app/encode/page.tsx`                       |
| Encrypt page                      | `src/app/encrypt/page.tsx`                      |
| Recover page                      | `src/app/recover/page.tsx`                      |
| Analyze page                      | `src/app/analyze/page.tsx`                      |

---

## 14. Coding Conventions

- **All pages are `"use client"`** — every page uses React hooks (useState, useEffect, useCallback, useRef, useContext)
- **CSS Modules** for page-specific styles (`.module.css`)
- **Import aliases** — `@/*` maps to `./src/*` (tsconfig paths)
- **Component naming** — PascalCase, default exports
- **Algorithm functions** — pure functions, no side effects, return typed result objects
- **DNA convention** — always uppercase (`ATCG`), `?` for unknowns
- **No backend** — everything runs client-side in the browser
- **No database** — state is ephemeral (in-memory React Context, lost on refresh)
- **No tests** — no test files, no testing framework configured

---

## 15. Important Context for AI Assistants

1. **This is Next.js 16** with React 19 — some APIs may differ from training data. Check `AGENTS.md` which warns about this.
2. **The video background** is served from `public/dna-video.mp4` (also duplicated as `dna video.mp4` in project root — only the one in `/public/` is used).
3. **The landing page is massive** (817 lines) — it contains the scroll-reveal hook, animated counter, typing DNA animation, and 6 full sections all in one component.
4. **Every algorithm is implemented from scratch** in pure TypeScript. No external algorithm libraries. This is intentional for academic demonstration.
5. **The accent color in the code is amber (#F59E0B)** even though the CSS variable is named `--accent-primary` and some class names reference "teal" (legacy naming from the original design spec).
6. **State persistence:** There is NO localStorage or sessionStorage. All state is lost on page refresh. Data must flow through the pipeline in a single session.
7. **Recover page auto-populates** from encrypt/encode results when available, but also has preset demo buttons for standalone use.
