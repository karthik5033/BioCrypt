# Prompt: Generate Visual Statistics & Diagrams for BioCrypt-X

> Copy everything below and paste it into ChatGPT / Claude / any AI with image generation or chart capabilities.

---

## Context

I built a project called **BioCrypt-X** — a bio-inspired file encryption and compression engine. It converts any file into DNA sequences (A, T, C, G), compresses them, encrypts via biological mutations, and can recover corrupted sequences. It's a web app built with Next.js 16 + TypeScript.

I need you to generate **visual statistics diagrams, charts, and infographics** that I can include in my project report and presentation. Make them clean, modern, and professional — dark theme preferred with amber/gold (#f59e0b) as accent color and slate/navy (#0f172a) as background.

---

## 1. COMPRESSION PIPELINE FLOW DIAGRAM

Create a **horizontal pipeline flow diagram** showing:

```
Input File (bytes) → BWT → MTF → RLE → Huffman → DNA Mapping → Output DNA Strand
```

**Details for each stage:**
- **BWT (Burrows-Wheeler Transform):** Suffix Array construction using Prefix Doubling, O(N log² N) time, O(N) space. Clusters repeated byte patterns together. Block size: 900KB.
- **MTF (Move-to-Front):** Converts BWT output to low-valued indices. O(N × 257) time, O(257) space. Alphabet size = 257 (0–255 + EOF marker 256).
- **RLE (Run-Length Encoding):** Collapses consecutive zero-runs from MTF output. O(N) time, O(N) space.
- **Huffman Coding:** Greedy optimal prefix-free binary codes. O(N log K) time, O(K) space. K = unique symbols.
- **DNA Mapping:** Binary pairs → nucleotides (00=A, 01=T, 10=C, 11=G). O(N) time.

Show arrows between stages with the data transformation at each step. Use icons or color coding per stage.

---

## 2. COMPRESSION RATIO BAR CHART — Multiple File Types

Create a **grouped bar chart** comparing compression ratios across different file types:

| File Type         | Original Size | After BWT+MTF (tokens) | After RLE (tokens) | Final Compressed | Ratio  |
|-------------------|---------------|------------------------|---------------------|------------------|--------|
| Python script (.py)| 214 B        | 215 tokens             | 178 tokens          | 99 B             | 2.16x  |
| Plain text (.txt) | ~10 KB        | ~10,200 tokens         | ~4,800 tokens       | ~2.5 KB          | ~4.0x  |
| PDF document      | 32.91 KB      | 33,700 tokens          | 32,500 tokens       | 24.12 KB         | 1.36x  |
| Word document (.docx)| 13.19 KB   | 13,503 tokens          | 12,970 tokens       | 12.48 KB         | 1.06x  |
| HTML file         | ~15 KB        | ~15,300 tokens         | ~6,200 tokens       | ~4.1 KB          | ~3.7x  |

**Key insight to annotate:** PDFs and DOCX are already internally compressed (Deflate/ZIP), so BWT cannot cluster their high-entropy data effectively. Raw text, code, and HTML are highly compressible.

X-axis: File type. Y-axis: Compression ratio (1x to 5x). Color the bars: amber for ratio, with a dashed red line at 1.0x (no compression baseline).

---

## 3. PIPELINE STAGE TOKEN REDUCTION WATERFALL CHART

Create a **waterfall/funnel chart** showing how a Python file (214 bytes) shrinks through each stage:

```
Original:     214 bytes (100%)
After BWT+MTF: 215 tokens (slight increase due to EOF marker)
After RLE:    178 tokens (17% reduction — zero-runs collapsed)
After Huffman: 99 bytes  (44% of original — variable-length codes)
DNA Strand:   198 bases  (2 bits per base = 99 bytes × 8 bits ÷ 2)
```

Use a descending waterfall where each bar shows the size at that stage, with annotations showing percentage reduction.

---

## 4. ALGORITHM COMPLEXITY COMPARISON TABLE (Visual)

Create a **styled comparison table/infographic** with these algorithms and their complexities:

| Algorithm | Time Complexity | Space Complexity | Category | Used In |
|-----------|----------------|-----------------|----------|---------|
| BWT (Suffix Array, Prefix Doubling) | O(N log² N) | O(N) | String Algorithms | Compression Stage 1 |
| Move-to-Front (MTF) | O(N × A), A=257 | O(A) | Lossless Coding | Compression Stage 2 |
| Run-Length Encoding (RLE) | O(N) | O(N) | Lossless Coding | Compression Stage 3 |
| Huffman Coding | O(N log K) | O(K) | Greedy Algorithm | Compression Stage 4 |
| LCG (Park-Miller) | O(1) per call | O(1) | Number Theory | Encryption (seed) |
| Substitution Mutation | O(N) | O(M) | String Manipulation | Encryption |
| Inversion Mutation | O(N) | O(M) | String Manipulation | Encryption |
| Deletion-Insertion (Indel) | O(N) | O(M) | String Manipulation | Encryption |
| Needleman-Wunsch | O(N × M) | O(N × M) | Dynamic Programming | Recovery |
| KMP Pattern Search | O(N + M) | O(M) | String Matching | Analysis |
| Suffix Array Construction | O(N log² N) | O(N) | String Algorithms | BWT internal |

Make it visually appealing — maybe with category color coding (green for Greedy, blue for DP, purple for String, orange for Lossless).

---

## 5. MUTATION CIPHER STATISTICS PIE CHART

Create a **pie/donut chart** showing the mutation type distribution when encrypting a ~3000-base DNA strand with all three mutation types enabled:

- **Substitution (A↔T, C↔G):** ~40% of mutations
- **Inversion (reverse 2-5 base segment):** ~35% of mutations
- **Deletion-Insertion (true indels — inserts/deletes bases):** ~25% of mutations

Total mutations: 10–20% of strand length (300–600 mutations on a 3000-base strand).

Also show: Mutation fraction is itself determined by the LCG: `fraction = 0.10 + lcg.nextFloat() × 0.10`

---

## 6. NEEDLEMAN-WUNSCH RECOVERY HEATMAP

Create a **visual heatmap of a small DP matrix** for this example:

```
Corrupted: A T C G ? ? T A A G T
Reference: A T C G G C T A A G T
```

Scoring: Match = +2, Mismatch = -1, Gap = -2, Wildcard `?` = +2 (always matches)

Show the filled DP matrix with:
- White → Amber color gradient based on cell value
- The optimal traceback path highlighted
- Recovered characters marked: `ATCG[G][C]TAAGT`
- Stats: Edit Distance = 2, Recovery Accuracy = 100%

---

## 7. FULL SYSTEM ARCHITECTURE DIAGRAM

Create a **layered architecture diagram** with three layers:

```
┌─────────────────────────────────────────────────┐
│  PRESENTATION LAYER                              │
│  Next.js 16 App Router · React 19 · CSS Modules │
│  Pages: / · /encode · /encrypt · /recover ·     │
│         /analyze · /algorithms/*                 │
├─────────────────────────────────────────────────┤
│  STATE MANAGEMENT LAYER                          │
│  React Context API (BioCryptContext)             │
│  Pipeline: encode → encrypt → recover → analyze │
│  Stores: file, encoderResult, cipherResult,     │
│          recoveryResult, encryptionKey           │
├─────────────────────────────────────────────────┤
│  ALGORITHM LAYER (Pure TypeScript, 0 libraries) │
│  encoder.ts: BWT → MTF → RLE → Huffman + DNA   │
│  mutationCipher.ts: LCG + Sub/Inv/Indel         │
│  recoveryEngine.ts: Needleman-Wunsch DP         │
└─────────────────────────────────────────────────┘
```

Make it look like a professional software architecture diagram with clean boxes, connecting arrows, and icons.

---

## 8. DAA TOPIC COVERAGE RADAR/SPIDER CHART

Create a **radar chart** showing which DAA (Design and Analysis of Algorithms) topics BioCrypt covers:

| Topic | Coverage Level (1-5) |
|-------|---------------------|
| Greedy Algorithms | 5 (Huffman Coding) |
| Dynamic Programming | 5 (Needleman-Wunsch, Edit Distance) |
| String Algorithms | 5 (BWT, Suffix Arrays, KMP, String Rotation) |
| Divide & Conquer | 3 (Prefix Doubling in Suffix Array) |
| Tree Data Structures | 4 (Huffman Tree) |
| Complexity Analysis | 5 (Big-O for all stages) |
| Number Theory | 3 (LCG PRNG, Park-Miller) |
| Lossless Compression | 5 (MTF, RLE, Huffman) |

---

## 9. EXECUTION TIME BENCHMARK BAR CHART

Create a **horizontal bar chart** of real execution times for a ~32KB file:

| Stage | Time (ms) |
|-------|-----------|
| BWT Transform | ~15 ms |
| MTF Transform | ~2 ms |
| RLE Encoding | ~1 ms |
| Huffman Encoding | ~5 ms |
| DNA Mapping | ~1 ms |
| Mutation Cipher | ~3 ms |
| Needleman-Wunsch (64-base sample) | ~1 ms |
| KMP Search | < 0.1 ms |

Show total pipeline time as a summary bar at the bottom.

---

## 10. BEFORE vs AFTER COMPARISON — Old vs New Pipeline

Create a **side-by-side comparison infographic:**

| Aspect | OLD Pipeline | NEW Pipeline |
|--------|-------------|-------------|
| Compression | RLE → LZW → Huffman | BWT → MTF → RLE → Huffman |
| BWT | ❌ Not present | ✅ Suffix Array O(N log² N) |
| MTF | ❌ Not present | ✅ Move-to-Front O(N×A) |
| LZW | ✅ Dictionary-based | ❌ Replaced by BWT+MTF |
| Indexing | Trie (prefix tree) | Suffix Arrays |
| Indels | Mocked (just substitution) | True insert/delete with array splicing |
| Ratio on .py | ~1.5x | 2.16x |
| Ratio on .txt | ~2x | ~4.0x |

---

## Style Guidelines

- **Color palette:** Dark navy background (#0f172a), amber accent (#f59e0b), slate text (#94a3b8), emerald for success (#10b981), red for errors (#ef4444)
- **Font:** Inter or DM Sans (modern, clean)
- **Style:** Minimalist, data-forward, no unnecessary decorations
- **Resolution:** High-res (at least 1920×1080 for slides, 800×600 for report)
- **Format:** PNG preferred, SVG if possible
- **Branding:** Include "BioCrypt-X" or "🧬 BioCrypt" in corner of each diagram
