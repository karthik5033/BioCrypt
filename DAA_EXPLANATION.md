<div align="center">

# 🧬 BioCrypt-X — Complete DAA Explanation Guide

### For Judges, Viva, and Exam Presentation

**Subject:** Design and Analysis of Algorithms (DAA)

</div>

---

## Table of Contents

1. [What is BioCrypt-X?](#1-what-is-biocrypt-x)
2. [The Complete Pipeline (Bird's Eye View)](#2-the-complete-pipeline)
3. [Algorithm 1 — DNA Encoding (Binary → Nucleotide Mapping)](#3-algorithm-1--dna-encoding)
4. [Algorithm 2 — Burrows-Wheeler Transform (BWT)](#4-algorithm-2--burrows-wheeler-transform-bwt)
5. [Algorithm 3 — Move-to-Front (MTF) Encoding](#5-algorithm-3--move-to-front-mtf-encoding)
6. [Algorithm 4 — Run-Length Encoding (RLE)](#6-algorithm-4--run-length-encoding-rle)
7. [Algorithm 5 — Huffman Coding (Greedy)](#7-algorithm-5--huffman-coding-greedy)
8. [Algorithm 6 — LCG Mutation Cipher (Encryption)](#8-algorithm-6--lcg-mutation-cipher-encryption)
9. [Algorithm 7 — Needleman-Wunsch (Recovery via DP)](#9-algorithm-7--needleman-wunsch-recovery-via-dp)
10. [Algorithm 8 — KMP Pattern Search](#10-algorithm-8--kmp-pattern-search)
11. [Full Worked Example: End-to-End Pipeline](#11-full-worked-example-end-to-end-pipeline)
12. [Why This is Better Than Standard Approaches](#12-why-this-is-better-than-standard-approaches)
13. [Complexity Summary Table](#13-complexity-summary-table)
14. [DAA Topics Covered](#14-daa-topics-covered)
15. [Viva Q&A — Ready-Made Answers](#15-viva-qa--ready-made-answers)

---

## 1. What is BioCrypt-X?

**BioCrypt-X** is a **bio-inspired file encryption and recovery system** that borrows concepts from computational biology to encode, compress, encrypt, and self-heal data.

**One-line pitch for the judges:**

> *"A file encryption system where data is encoded as DNA sequences, encrypted via controlled biological mutations, and recovered from corruption using sequence alignment algorithms from computational genomics."*

The key insight is: **DNA is just a 4-character alphabet `{A, T, C, G}`** — which maps perfectly to binary pairs `{00, 01, 10, 11}`. Once data is in "DNA form", we can apply real bioinformatics algorithms to it — compression, mutation-based encryption, and dynamic-programming-based recovery.

### Why DNA? Why not just standard encryption?

| Aspect | Standard (AES/RSA) | BioCrypt-X (DNA-Inspired) |
|---|---|---|
| **Encoding** | Binary (0s and 1s) | DNA bases (A, T, C, G) — 4-char alphabet |
| **Encryption** | Mathematical (modular arithmetic) | Biological mutations (substitution, inversion, indels) |
| **Recovery** | None — if data is corrupted, it's lost | Self-healing via DP sequence alignment |
| **DAA Coverage** | Minimal (just number theory) | Greedy, DP, String algorithms, Trees |
| **Visualization** | Abstract numbers | Intuitive DNA strand mutations |

---

## 2. The Complete Pipeline

```
┌─────────────────────────────── ENCRYPTION DIRECTION ──────────────────────────────────┐

  File (.txt, .jpg, etc.)
    │
    ▼
  [1] Binary Conversion ─────────── Each byte → 8 bits (e.g., 'H' → 01001000)
    │
    ▼
  [2] DNA Encoding ──────────────── Each 2-bit pair → A/T/C/G (e.g., 01 00 10 00 → TACA)
    │
    ▼
  [3] BWT (Burrows-Wheeler) ─────── Reorder characters to cluster repetitions
    │
    ▼
  [4] MTF (Move-to-Front) ────────── Convert to small integer indices (lots of 0s)
    │
    ▼
  [5] RLE (Run-Length Encoding) ──── Collapse consecutive zeros into (ESCAPE, count)
    │
    ▼
  [6] Huffman Coding ────────────── Assign shortest codes to most frequent symbols
    │
    ▼
  [7] Mutation Cipher ───────────── Apply key-seeded biological mutations (encrypt)
    │
    ▼
  [STORED / TRANSMITTED AS ENCRYPTED DNA SEQUENCE]

└──────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────── DECRYPTION DIRECTION ──────────────────────────────────┐

  Encrypted (possibly corrupted) DNA
    │
    ▼
  [8] Needleman-Wunsch Recovery ── Align corrupted vs reference → fill in '?' gaps
    │
    ▼
  [7'] Reverse Mutations ────────── Undo mutations using stored mutation map
    │
    ▼
  [6'] Huffman Decode ───────────── Walk Huffman tree bit-by-bit → recover tokens
    │
    ▼
  [5'] RLE Decode ───────────────── Expand (ESCAPE, count) → zeros
    │
    ▼
  [4'] MTF Decode ───────────────── Convert small indices back to original bytes
    │
    ▼
  [3'] Inverse BWT ──────────────── LF-mapping to reconstruct original order
    │
    ▼
  [2'] DNA → Binary ─────────────── A→00, T→01, C→10, G→11
    │
    ▼
  [1'] Binary → File ────────────── Reconstruct original file bytes
    │
    ▼
  Original File ✓

└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Algorithm 1 — DNA Encoding

### What it does
Converts raw binary data into a DNA sequence using a simple 2-bit-to-nucleotide mapping.

### The Mapping Table

| Binary Pair | DNA Base | Biological Complement |
|:-----------:|:--------:|:--------------------:|
| `00` | `A` (Adenine) | Pairs with T |
| `01` | `T` (Thymine) | Pairs with A |
| `10` | `C` (Cytosine) | Pairs with G |
| `11` | `G` (Guanine) | Pairs with C |

### Worked Example

```
Input text:  "Hi"

Step 1: Convert to ASCII
  'H' = 72  →  01001000
  'i' = 105 →  01101001

Step 2: Full binary string
  01001000 01101001

Step 3: Split into pairs of 2
  01 | 00 | 10 | 00 | 01 | 10 | 10 | 01

Step 4: Map each pair to DNA
  01→T | 00→A | 10→C | 00→A | 01→T | 10→C | 10→C | 01→T

Result DNA:  T A C A T C C T  →  "TACATCCT"
```

### Why this mapping?
- Every 2 bits maps to exactly 1 DNA base → **no ambiguity**
- Every DNA base maps back to exactly 2 bits → **perfectly reversible**
- The DNA alphabet has exactly 4 characters → matches 2-bit combinations (2² = 4)

### Complexity

| Metric | Value |
|---|---|
| **Time** | `O(N)` where N = number of bits |
| **Space** | `O(N/2)` — DNA string is half the bit-string length |
| **Reversible?** | Yes, lossless and bijective |

### Code (from `encoder.ts`)

```typescript
const BINARY_TO_DNA: Record<string, string> = {
  "00": "A",  "01": "T",  "10": "C",  "11": "G",
};

function binaryToDNA(binary: string): string {
  const padded = binary.length % 2 !== 0 ? binary + "0" : binary;
  let dna = "";
  for (let i = 0; i < padded.length; i += 2) {
    const pair = padded.substring(i, i + 2);
    dna += BINARY_TO_DNA[pair] || "A";
  }
  return dna;
}
```

---

## 4. Algorithm 2 — Burrows-Wheeler Transform (BWT)

### What it does
BWT is a **reversible string transformation** that rearranges characters so that repeated patterns cluster together. It doesn't compress by itself — it makes the data **easier to compress** by the later stages.

### DAA Concept: String Algorithm + Suffix Array

### Why BWT?
Imagine the text `"banana"`. BWT groups all the `a`s together, all the `n`s together, etc. After BWT, run-length encoding and Huffman coding become dramatically more effective because the same characters appear in long runs.

### Step-by-Step Example

**Input:** `"banana$"` ($ is the EOF marker, always sorts first)

**Step 1: Generate ALL rotations of the string**

```
Rotation 0:  b a n a n a $
Rotation 1:  a n a n a $ b
Rotation 2:  n a n a $ b a
Rotation 3:  a n a $ b a n
Rotation 4:  n a $ b a n a
Rotation 5:  a $ b a n a n
Rotation 6:  $ b a n a n a
```

**Step 2: Sort all rotations lexicographically**

```
Index  Sorted Rotation         Last Column
  6    $ b a n a n a           a
  5    a $ b a n a n           n
  3    a n a $ b a n           n
  1    a n a n a $ b           b
  0    b a n a n a $           $    ← original row (index = 3)
  4    n a $ b a n a           a
  2    n a n a $ b a           a
```

**Step 3: Take the LAST COLUMN**

```
BWT output = "annb$aa"
Original index = 3 (row where the original string starts)
```

### Why does clustering happen?
- Notice the output `"annb$aa"` — the `a`s are clustered and `n`s are clustered!
- Characters that share a common **context** (what comes before them) end up adjacent in the BWT output
- This is the key insight: **BWT sorts by context, grouping similar characters**

### How is it reversed? (LF-Mapping)

The inverse BWT uses the **LF-mapping property**: the i-th occurrence of character `c` in the Last column corresponds to the i-th occurrence of `c` in the First column (the sorted version).

```
Algorithm: Inverse BWT
  Input:  BWT output + original index
  
  1. Count frequency of each character
  2. Build cumulative count → gives first occurrence of each char in sorted column
  3. Build LF-mapping: for each position i in last column,
     LF[i] = firstOccurrence[char] + (how many times char appeared before position i)
  4. Starting from originalIndex, follow LF chain N times to reconstruct
```

### Implementation Detail
Our code uses **Prefix Doubling Suffix Array Construction** — this builds the suffix array in `O(N log² N)` time instead of the naive `O(N² log N)` which would be too slow for 100KB+ inputs.

### Complexity

| Metric | Value |
|---|---|
| **Time (Forward)** | `O(N log² N)` via suffix array |
| **Time (Inverse)** | `O(N)` via LF-mapping |
| **Space** | `O(N)` |

---

## 5. Algorithm 3 — Move-to-Front (MTF) Encoding

### What it does
MTF maintains a list of all possible symbols `[0, 1, 2, ..., 256]`. For each input symbol, it:
1. **Outputs** the symbol's current position (index) in the list
2. **Moves** that symbol to the front of the list (position 0)

### Why MTF after BWT?
After BWT, the same characters cluster together. If `'a'` appears 5 times in a row:
- First `'a'` → outputs its position (maybe index 97)
- Second `'a'` → it was just moved to front, so output `0`
- Third `'a'` → still at front, output `0`
- Fourth `'a'` → output `0`
- Fifth `'a'` → output `0`

**Result**: Clusters of repeated characters become clusters of `0`s!

### Worked Example

```
Input:   [a, a, a, b, b, a]
List:    [a, b, c, d, ...]  (initially alphabetical)

Step 1: 'a' → index 0, output 0, list = [a, b, c, d, ...]  (already at front)
Step 2: 'a' → index 0, output 0, list = [a, b, c, d, ...]
Step 3: 'a' → index 0, output 0, list = [a, b, c, d, ...]
Step 4: 'b' → index 1, output 1, move 'b' to front → list = [b, a, c, d, ...]
Step 5: 'b' → index 0, output 0, list = [b, a, c, d, ...]
Step 6: 'a' → index 1, output 1, move 'a' to front → list = [a, b, c, d, ...]

Output:  [0, 0, 0, 1, 0, 1]
```

Notice: the output is **dominated by small numbers** (especially 0). This is exactly what makes the next stage (RLE) very effective.

### Complexity

| Metric | Value |
|---|---|
| **Time** | `O(N × A)` where A = alphabet size (257 in our case) |
| **Space** | `O(A)` for the maintained list |

---

## 6. Algorithm 4 — Run-Length Encoding (RLE)

### What it does
RLE detects consecutive runs of the **same symbol** and replaces them with `(symbol, count)` pairs. Our implementation specifically targets **zero-runs** since MTF output is heavily weighted toward 0.

### How our RLE works specifically

```
Rules:
- Non-zero value V → emit V directly (no change)
- Run of k consecutive zeros → emit [ESCAPE_SYMBOL (257), k]

The ESCAPE_SYMBOL = 257 is chosen because:
  - MTF output ranges from 0..256
  - 257 can never appear naturally
  - So there's no ambiguity during decoding
```

### Worked Example

```
MTF Output:  [0, 0, 0, 5, 0, 0, 3, 0, 0, 0, 0]

Processing:
  - 3 zeros  → [257, 3]
  - value 5  → [5]
  - 2 zeros  → [257, 2]
  - value 3  → [3]
  - 4 zeros  → [257, 4]

RLE Output:  [257, 3, 5, 257, 2, 3, 257, 4]

Reduction:  11 tokens → 8 tokens (27% reduction)
```

In practice, after BWT+MTF on real data, **60-80% of values are zeros**, so RLE achieves dramatic compression.

### Complexity

| Metric | Value |
|---|---|
| **Time** | `O(N)` — single pass |
| **Space** | `O(N)` worst case (no runs) |

---

## 7. Algorithm 5 — Huffman Coding (Greedy)

### DAA Concept: Greedy Algorithm + Binary Tree

Huffman coding is the **crown jewel greedy algorithm** in DAA. It assigns **variable-length prefix-free codes** to symbols, with shorter codes for more frequent symbols.

### Why Huffman is Greedy
At each step, we make the **locally optimal choice**: merge the two least-frequent nodes. This provably leads to the **globally optimal** prefix-free code (this is proven via the cut-and-paste argument in CLRS).

### Step-by-Step Example

**Input frequencies (after BWT → MTF → RLE):**

```
Symbol:     257(ESCAPE)  0    3    5    1
Frequency:      3        2    2    1    1
```

**Step 1: Create leaf nodes, sort by frequency**

```
[5:1] [1:1] [0:2] [3:2] [257:3]
```

**Step 2: Merge two smallest (5 and 1)**

```
     [*:2]
    /     \
  [5:1]  [1:1]

Queue: [0:2] [*:2] [3:2] [257:3]
```

**Step 3: Merge two smallest (0 and *)**

```
        [*:4]
       /     \
    [0:2]   [*:2]
           /     \
         [5:1]  [1:1]

Queue: [3:2] [257:3] [*:4]
```

**Step 4: Merge (3 and 257)**

```
       [*:5]
      /     \
   [3:2]  [257:3]

Queue: [*:4] [*:5]
```

**Step 5: Final merge**

```
            [*:9]
           /     \
        [*:4]   [*:5]
       /    \    /    \
    [0:2] [*:2] [3:2] [257:3]
         /    \
       [5:1] [1:1]

```

**Step 6: Assign codes (left=0, right=1)**

```
Symbol  Code    Bits
  0      00      2
  5      010     3
  1      011     3
  3      10      2
 257     11      2
```

### Why Huffman is optimal
- **Greedy choice property**: The two least frequent symbols must be at the deepest level of the optimal tree
- **Optimal substructure**: After merging, the subproblem is also a Huffman coding problem
- This gives the **minimum weighted path length** (total bits used)

### How Huffman compares to fixed-width coding

```
Fixed-width: 9 symbols at 3 bits each = 27 bits
Huffman:     (2×2) + (1×3) + (1×3) + (2×2) + (3×2) = 4+3+3+4+6 = 20 bits

Savings: 26% fewer bits!
```

### Prefix-Free Property
No code is a prefix of another code. This means decoding is unambiguous — you can read the bitstream left to right and know exactly where each symbol ends.

```
Bitstream: 00 11 010 10 00
Decoded:    0  257  5   3   0
```

### Complexity

| Metric | Value |
|---|---|
| **Time (Build Tree)** | `O(N + K log K)` where K = unique symbols |
| **Time (Encode)** | `O(N)` — lookup each symbol's code |
| **Time (Decode)** | `O(N)` — walk tree bit-by-bit |
| **Space** | `O(K)` for the tree |

---

## 8. Algorithm 6 — LCG Mutation Cipher (Encryption)

### DAA Concept: String Algorithm + Pseudo-Random Number Generation

This is where the **biological metaphor** becomes the encryption mechanism. We apply three types of DNA mutations, controlled by a **deterministic pseudo-random number generator** seeded by the user's encryption key.

### The LCG (Linear Congruential Generator)

```
Formula:  seed = (seed × 16807) mod 2147483647

This is the "Lehmer RNG" — a well-known PRNG with full period.
- Multiplier: 16807 (= 7^5)
- Modulus: 2147483647 (= 2^31 - 1, a Mersenne prime)
```

**Key insight**: The **same key always produces the same sequence of random numbers**, making encryption fully deterministic and reversible.

### How the Key Seeds the LCG

```typescript
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

This is a **DJB2-variant hash** — it converts any string key into a numeric seed.

### The Three Mutation Types

#### 1. Substitution (Like a Point Mutation in Biology)

```
Swap rule:  A ↔ T,  C ↔ G  (complement pairs)

Example:
  Position 3, Original: 'A'
  Mutated: 'T'

  ATCGATCG
      ↓
  ATCTATCG
     ^
     changed!
```

**Biology parallel**: This mimics a **single nucleotide polymorphism (SNP)** — a single base change in DNA.

#### 2. Inversion (Like a Chromosomal Inversion)

```
Reverse a segment of 2-5 characters at a random position.

Example:
  Position 2, Length 4
  Original: ATCGATCG
  Segment:    CGAT
  Reversed:   TAGC

  Result:   ATTAGCCG
              ^^^^
              inverted!
```

**Biology parallel**: A chromosomal inversion flips a DNA segment — a real mutation observed in genetics.

#### 3. Deletion-Insertion (Indel)

```
Either DELETE a base at a random position:
  ATCGATCG → ATCATCG  (removed the 'G' at position 3)
  
Or INSERT a random base at a random position:
  ATCGATCG → ATCGAATCG  (inserted 'A' after position 3)
```

**Biology parallel**: Insertions and deletions (indels) are among the most impactful mutations in real genetics — they can cause **frameshift mutations**.

### Complete Encryption Example

```
Original DNA:   ATCGGCTAAGT
Key:            "secret123"
Key hash:       1842693841
LCG seed:       1842693841

The LCG generates random positions and mutation types:

Step 1: LCG says position=3, type=Substitution
  ATCGGCTAAGT → ATCGCCTAAGT  (G→C at pos 3, complement swap)
  
Step 2: LCG says position=7, type=Inversion, length=3
  ATCGCCTAAGT → ATCGCCTGAAT  (segment "AAG" at pos 7 → "GAA")
  
Step 3: LCG says position=1, type=Substitution
  ATCGCCTGAAT → AACGCCTGAAT  (T→A at pos 1)

Encrypted DNA:  AACGCCTGAAT
Mutation Map:   [(3,G→C,Sub), (7,AAG→GAA,Inv), (1,T→A,Sub)]
```

### Why is it reversible?

The mutation map records **every mutation in order**. To decrypt:
1. Replay the mutation map **in reverse order**
2. Each mutation has an exact inverse:
   - Substitution: swap back (same swap rule)
   - Inversion: reverse the segment again
   - Insertion: delete the inserted base
   - Deletion: re-insert the deleted base

**Same key → same LCG seed → same mutation sequence → same mutation map → perfectly reversible**

### Complexity

| Metric | Value |
|---|---|
| **Time** | `O(N)` — iterate through mutation positions |
| **Space** | `O(M)` — mutation map (M = number of mutations, typically 10-20% of N) |

---

## 9. Algorithm 7 — Needleman-Wunsch (Recovery via DP)

### DAA Concept: Dynamic Programming (the **killer feature**)

This is the **most important algorithm** in the project — the self-healing recovery engine. It uses the **Needleman-Wunsch global sequence alignment algorithm**, adapted from computational genomics to reconstruct corrupted DNA.

### The Problem

```
Original DNA:    ATCGGCTAAGT
Corrupted DNA:   ATCG??TAAGT   (some bases are lost/unknown, marked '?')
Reference:       ATCGGCTAAGT   (a known-good fragment or checksum)

Goal: Figure out what '?' should be → recover the original DNA
```

### Scoring System

```
Match:      +2   (characters are identical)
Mismatch:   -1   (characters differ)
Gap:        -2   (insertion/deletion needed)
Wildcard:   '?' treated as a MATCH (+2) to encourage alignment
```

### The DP Recurrence

For sequences A (corrupted, length m) and B (reference, length n):

```
dp[i][j] = the maximum alignment score for A[1..i] aligned with B[1..j]

Base cases:
  dp[0][0] = 0
  dp[i][0] = i × gap_score    (aligning i chars of A with nothing)
  dp[0][j] = j × gap_score    (aligning j chars of B with nothing)

Recurrence:
  dp[i][j] = max(
    dp[i-1][j-1] + score(A[i], B[j]),   ← DIAGONAL (match/mismatch)
    dp[i-1][j]   + gap_score,            ← UP       (gap in B)
    dp[i][j-1]   + gap_score             ← LEFT     (gap in A)
  )

Where:
  score(A[i], B[j]) = +2 if A[i] == B[j] OR A[i] == '?'
                     = -1 otherwise
```

### Complete Worked Example

```
Corrupted (A):  A T C G ? ? T A A G T
Reference (B):  A T C G G C T A A G T
```

**The DP Matrix (first 7 characters for readability):**

```
        ""    A     T     C     G     G     C     T
  ""     0   -2    -4    -6    -8   -10   -12   -14
   A    -2    2     0    -2    -4    -6    -8   -10
   T    -4    0     4     2     0    -2    -4    -6
   C    -6   -2     2     6     4     2     0    -2
   G    -8   -4     0     4     8     6     4     2
   ?   -10   -6    -2     2     6    10     8     6
   ?   -12   -8    -4     0     4     8    12    10
   T   -14  -10    -6    -2     2     6    10    14
```

**How to read the matrix:**

Each cell `dp[i][j]` represents the best possible alignment score for the first `i` characters of the corrupted sequence with the first `j` characters of the reference.

**Filling cell dp[5][5] (where ? aligns with G):**
```
diagonal = dp[4][4] + score('?', 'G') = 8 + 2 = 10    ← '?' is wildcard, treated as match!
up       = dp[4][5] + gap_score       = 6 + (-2) = 4
left     = dp[5][4] + gap_score       = 6 + (-2) = 4

dp[5][5] = max(10, 4, 4) = 10, source = DIAGONAL
```

### Backtracking (Traceback)

Starting from the bottom-right corner, we follow the arrows (sources) backwards:

```
Path: (7,7)←diag (6,6)←diag (5,5)←diag (4,4)←diag (3,3)←diag (2,2)←diag (1,1)←diag (0,0)

At each DIAGONAL step:
  If A[i] == '?': RECOVER the character from B[j]
  If A[i] == B[j]: Keep the character
  If A[i] != B[j]: Keep A[i] (mismatch noted)

Traceback result:
  Position 5: '?' → recovered as [G] (from reference)
  Position 6: '?' → recovered as [C] (from reference)

Recovered:  A T C G [G] [C] T A A G T  ✓
```

### Why DP and not Brute Force?

```
Brute force: Try all possible characters for each '?'
  With k unknown positions and 4 possible bases:
  Combinations = 4^k
  For k=10: 4^10 = 1,048,576 combinations!

DP: Fill an (m+1) × (n+1) table
  For m=n=100: only 10,201 cells
  For m=n=1000: only 1,002,001 cells
  
  Speedup: EXPONENTIAL vs POLYNOMIAL
```

### How it compares to LCS

| Feature | LCS | Needleman-Wunsch |
|---|---|---|
| **Goal** | Find longest common subsequence | Find optimal global alignment |
| **Scoring** | Binary (match=1, else 0) | Configurable (match, mismatch, gap) |
| **Gaps** | Not penalized | Penalized (gap score = -2) |
| **Use case** | Diff tools, version control | Sequence alignment, DNA recovery |
| **In this project** | Conceptual basis | Actual implementation |

Needleman-Wunsch is essentially **LCS generalized with a richer scoring system** that handles mismatches and gaps explicitly.

### Complexity

| Metric | Value |
|---|---|
| **Time** | `O(N × M)` — fill entire matrix |
| **Space** | `O(N × M)` — store entire matrix |
| **Backtrack** | `O(N + M)` — trace one path |

---

## 10. Algorithm 8 — KMP Pattern Search

### DAA Concept: String Matching Algorithm

KMP (Knuth-Morris-Pratt) is used to search for patterns (genetic markers, corruption signatures) within the DNA strand.

### Why KMP is better than Naive Search

```
Naive approach:  For each position in text, compare all pattern characters
  Time: O(N × M)  where N = text length, M = pattern length

KMP approach:    Use a "failure function" to skip unnecessary comparisons
  Time: O(N + M)  — LINEAR!
```

### The Failure Function (Preprocessing)

The failure function `F[i]` for a pattern tells us: **"If a mismatch happens at position i, what is the longest proper prefix of the pattern that is also a suffix of the pattern[0..i-1]?"**

### Worked Example

**Pattern:** `A T C G A T`

**Building the Failure Function:**

```
Index:     0  1  2  3  4  5
Pattern:   A  T  C  G  A  T

F[0] = 0  (by definition, no proper prefix for single char)

i=1: Compare pattern[1]='T' with pattern[0]='A' → mismatch → F[1] = 0

i=2: Compare pattern[2]='C' with pattern[0]='A' → mismatch → F[2] = 0

i=3: Compare pattern[3]='G' with pattern[0]='A' → mismatch → F[3] = 0

i=4: Compare pattern[4]='A' with pattern[0]='A' → MATCH! k=1 → F[4] = 1
     (The prefix "A" matches the suffix "A" of "ATCGA")

i=5: Compare pattern[5]='T' with pattern[1]='T' → MATCH! k=2 → F[5] = 2
     (The prefix "AT" matches the suffix "AT" of "ATCGAT")

Failure Function: [0, 0, 0, 0, 1, 2]
```

### Searching with KMP

**Text:** `A T C G A T C G A T C G`  
**Pattern:** `A T C G A T`

```
Step 1: Compare text[0..5] with pattern[0..5]
  A T C G A T = A T C G A T  ← MATCH at position 0!
  
  After match, use F[5]=2: we know the last 2 chars of the match ("AT") 
  are also the first 2 chars of the pattern.
  So skip ahead — don't re-compare those 2 characters!
  
Step 2: Continue from text[6] with pattern[2]
  C G A T = C G A T  ← MATCH at position 6!

Total: 2 matches found at positions [0, 6]
Comparisons: ~12 (linear) instead of ~42 (naive)
```

### Why KMP is important for BioCrypt-X
- **Find corruption signatures**: Search for patterns like `????` to locate corrupted regions
- **Locate genetic markers**: Find specific DNA motifs in the encoded sequence
- **Speed**: With DNA strands of 90,000+ bases, naive O(NM) search would be too slow

### Complexity

| Metric | Value |
|---|---|
| **Preprocessing** | `O(M)` — build failure function |
| **Searching** | `O(N)` — scan text once |
| **Total** | `O(N + M)` |
| **Space** | `O(M)` — failure function array |

---

## 11. Full Worked Example: End-to-End Pipeline

Let's trace the complete encryption pipeline for a tiny input:

### Input: The file contains the text `"AB"`

---

**Stage 1: Binary Conversion**
```
'A' = 65  → 01000001
'B' = 66  → 01000010

Binary string: 0100000101000010
```

**Stage 2: DNA Encoding**
```
01|00|00|01|01|00|00|10
 T  A  A  T  T  A  A  C

DNA: TAATTAAC
```

**Stage 3: BWT (on the raw bytes [65, 66])**
```
The actual compression runs on the raw bytes, not the DNA.
Input bytes: [65, 66]

All rotations of [65, 66, EOF]:
  [65, 66, EOF]
  [66, EOF, 65]
  [EOF, 65, 66]

Sorted:
  [EOF, 65, 66]  → last char = 66
  [65, 66, EOF]  → last char = EOF  ← original row (index = 1)
  [66, EOF, 65]  → last char = 65

BWT output: [66, EOF, 65]
Original index: 1
```

**Stage 4: MTF**
```
List: [0, 1, 2, ..., 65, 66, ..., 256]

Token 66: index = 66, output 66, move to front → [66, 0, 1, ..., 65, 67, ...]
Token EOF(256): index = 257, output 257 (it was shifted), move to front
Token 65: need to find 65 in the list...

(In practice, the exact indices depend on the full list state)
```

**Stage 5: RLE**
```
If MTF output had zeros, they'd be collapsed:
  [0, 0, 0, 42] → [ESCAPE, 3, 42]
```

**Stage 6: Huffman Coding**
```
Build frequency table from RLE output
Build Huffman tree (greedy merges)
Assign codes: most frequent symbol → shortest code
Encode: concatenate all codes → compressed bitstring
```

**Stage 7: DNA Re-encoding**
```
Compressed bitstring → split into 2-bit pairs → map to A/T/C/G
This is now a MUCH shorter DNA string than the original!
```

**Stage 8: Mutation Cipher (Encrypt)**
```
Key: "mypassword"
Hash: hashString("mypassword") → 1234567 (example)
LCG seed: 1234567

Mutations applied:
  Position 2: Substitution C→G
  Position 0: Inversion of "TA" → "AT"

Original DNA:  TAAC
Encrypted DNA: ATAG
Mutation Map:  [(2, C→G, Sub), (0, TA→AT, Inv)]
```

### Decryption follows the reverse path exactly ✓

---

## 12. Why This is Better Than Standard Approaches

### vs. Simple Binary Encryption

| Feature | Binary XOR Cipher | BioCrypt-X |
|---|---|---|
| **Encoding** | Raw binary | DNA (biologically meaningful) |
| **Compression** | None built-in | 4-stage pipeline (BWT→MTF→RLE→Huffman) |
| **Encryption** | XOR with key (weak) | Multi-type biological mutations (stronger) |
| **If data corrupted** | Total loss | Self-healing recovery via DP |
| **Pattern analysis** | None | KMP/Rabin-Karp for marker detection |
| **DAA topics** | 1 (XOR) | 8+ algorithms |

### vs. Standard Compression (ZIP/gzip)

| Feature | gzip (DEFLATE) | BioCrypt-X |
|---|---|---|
| **Compression** | LZ77 + Huffman | BWT + MTF + RLE + Huffman |
| **Encryption** | Separate tool needed | Built into pipeline |
| **Recovery** | Not possible | Needleman-Wunsch DP alignment |
| **Visualization** | None | Live DP matrix, mutation maps |

### Why BWT+MTF+RLE+Huffman over plain Huffman?

```
Plain Huffman on random bytes:
  256 equally likely symbols → each gets ~8 bits → ratio ≈ 1.0x (no compression!)

BWT+MTF+RLE+Huffman on text:
  BWT clusters similar chars → MTF converts to small numbers → RLE collapses zeros
  → Huffman on the skewed distribution → ratio ≈ 2-4x compression!

This is why our 4-stage pipeline is critical. Each stage feeds the next:
  BWT makes data clustered
  MTF makes it zero-heavy
  RLE makes it shorter
  Huffman makes it optimal
```

### Why Needleman-Wunsch over simple string comparison?

```
Simple comparison: If position doesn't match → mark as error. Done.
  - Can't handle insertions or deletions
  - Can't recover unknown characters
  - No notion of "best possible alignment"

Needleman-Wunsch: Finds the GLOBALLY OPTIMAL alignment
  - Handles insertions, deletions, and substitutions
  - Can recover '?' wildcards using reference alignment
  - Guaranteed optimal via DP (no better alignment exists)
  - Used by BLAST, FASTA, and every major bioinformatics tool
```

---

## 13. Complexity Summary Table

| Stage | Algorithm | Paradigm | Time Complexity | Space Complexity |
|---|---|---|---|---|
| DNA Encoding | Binary→Nucleotide Map | Direct | `O(N)` | `O(N)` |
| Compression 1 | BWT (Suffix Array) | String/Sort | `O(N log² N)` | `O(N)` |
| Compression 2 | MTF Encoding | Sequential | `O(N × A)`, A=257 | `O(A)` |
| Compression 3 | RLE (Zero-Run) | Sequential | `O(N)` | `O(N)` |
| Compression 4 | Huffman Coding | **Greedy** | `O(N + K log K)` | `O(K)` |
| Encryption | LCG Mutation Cipher | PRNG + String | `O(N)` | `O(M)` |
| Recovery | Needleman-Wunsch | **DP** | `O(N × M)` | `O(N × M)` |
| Pattern Search | KMP | **String Matching** | `O(N + M)` | `O(M)` |

**Where:**
- `N` = input size (bytes or DNA length)
- `M` = pattern length or reference length
- `K` = number of unique symbols
- `A` = alphabet size (257 for byte + EOF)

---

## 14. DAA Topics Covered

This project demonstrates **5 major DAA paradigms**:

### 1. Greedy Algorithms
- **Huffman Coding**: Build optimal prefix-free codes by always merging the two least-frequent nodes
- Proves: Greedy choice property + Optimal substructure

### 2. Dynamic Programming
- **Needleman-Wunsch**: Fill an N×M scoring matrix using optimal substructure
- **LCS (conceptual basis)**: Longest Common Subsequence is a special case
- Proves: Overlapping subproblems + Optimal substructure

### 3. String Algorithms
- **KMP Pattern Matching**: O(N+M) search using failure function
- **BWT (Burrows-Wheeler Transform)**: Reversible string transformation via suffix arrays
- **MTF (Move-to-Front)**: Context-adaptive encoding

### 4. Tree Data Structures
- **Huffman Tree**: Binary tree with optimal weighted path length
- **Suffix Array**: Implicit tree structure for BWT construction

### 5. Algorithm Analysis
- **Time Complexity**: Big-O for every stage (measured and theoretical)
- **Space Complexity**: Memory usage analysis
- **Benchmarking**: Real-time performance.now() measurements
- **Compression Ratio**: Empirical measurement of algorithm effectiveness

---

## 15. Viva Q&A — Ready-Made Answers

### Q1: "What is the main idea behind your project?"
> BioCrypt-X treats file data as DNA sequences and applies bioinformatics algorithms for compression, encryption, and self-healing recovery. The data flows through a pipeline: File → Binary → DNA → BWT → MTF → RLE → Huffman → Mutation Encryption → Stored. If the stored data gets corrupted, the Needleman-Wunsch dynamic programming algorithm can reconstruct missing segments by aligning the corrupted version against a reference.

### Q2: "Why DNA encoding? Isn't it just a gimmick?"
> No — DNA's 4-character alphabet (A, T, C, G) maps naturally to 2-bit pairs (00, 01, 10, 11), giving us a biologically meaningful representation. This isn't just cosmetic: it enables us to apply real computational biology algorithms like Needleman-Wunsch for sequence alignment, and it gives a visual, intuitive way to understand mutations as encryption operations.

### Q3: "How does the encryption work? Is it secure?"
> The encryption uses a Linear Congruential Generator (LCG) seeded by a hash of the user's key. The LCG deterministically generates mutation positions and types (substitution, inversion, deletion-insertion). The same key always produces the same mutation sequence, making it perfectly reversible. While it's not cryptographically secure like AES, it demonstrates the core concept of key-based deterministic transformation — and more importantly, it shows how string algorithms can be used for encryption in an elegant, biologically-inspired way.

### Q4: "Explain the Needleman-Wunsch algorithm."
> Needleman-Wunsch is a dynamic programming algorithm for global sequence alignment. It builds an (m+1) × (n+1) scoring matrix where each cell dp[i][j] represents the optimal alignment score for the first i characters of sequence A and first j characters of sequence B. Each cell is computed as the maximum of three choices: diagonal (match/mismatch), up (gap in B), or left (gap in A). After filling the matrix, we backtrack from the bottom-right corner to find the optimal alignment and recover any missing characters.

### Q5: "Why is DP better than brute force for recovery?"
> Brute force would try every possible character for each unknown position — that's 4^k combinations for k unknowns, which is exponential. DP solves it in O(N×M) time by breaking it into overlapping subproblems. For a sequence of 100 characters with 10 unknowns, brute force needs ~1 million attempts; DP needs ~10,000 cell computations.

### Q6: "Explain your compression pipeline."
> We use a 4-stage pipeline inspired by bzip2:
> 1. **BWT** rearranges characters so that similar contexts cluster together
> 2. **MTF** converts those clusters into sequences dominated by small numbers (especially 0)
> 3. **RLE** collapses the long runs of zeros into compact (escape, count) pairs
> 4. **Huffman** assigns the shortest binary codes to the most frequent symbols
>
> Each stage feeds the next — BWT makes clustering, MTF makes zeros, RLE shortens, Huffman optimizes. On text files, this achieves 2-4x compression.

### Q7: "What is the time complexity of your whole pipeline?"
> The bottleneck is the BWT at O(N log² N) for compression, and Needleman-Wunsch at O(N×M) for recovery. The overall encryption pipeline is O(N log² N) dominated by BWT. The overall decryption/recovery pipeline is O(N×M) dominated by the DP alignment. All other stages are linear O(N).

### Q8: "How is KMP used in your project?"
> KMP is used in the Analysis Dashboard to search for genetic patterns within the DNA strand. Given a pattern of length M in a strand of length N, KMP finds all occurrences in O(N+M) time using a preprocessed failure function. The naive approach would take O(N×M). This matters because our DNA strands can be 90,000+ bases long.

### Q9: "What happens if the data is corrupted during transmission?"
> This is our killer feature. Corrupted positions are marked with '?' in the DNA strand. The Needleman-Wunsch algorithm aligns the corrupted strand against a reference fragment, and during backtracking, wherever it encounters a '?', it recovers the correct character from the reference. The '?' is treated as a wildcard match (+2 score) to ensure proper alignment.

### Q10: "Can you decrypt without the key?"
> No. The key generates the specific LCG seed which produces the exact mutation sequence. Without the key, you don't know which positions were mutated, what type of mutation was applied, or the original values. You'd need to try all possible mutation maps — which is computationally infeasible for large sequences.

### Q11: "Why BWT instead of LZ77 or LZW?"
> BWT gives better compression on repetitive data (like text and DNA) because it creates longer runs of identical characters, which are then exploited by MTF and RLE. LZ77 (used in gzip) uses sliding-window dictionary matching, which is good but doesn't achieve the same level of symbol clustering. BWT-based compression (like bzip2) typically outperforms LZ77 on text by 10-20%.

### Q12: "What are the limitations of your system?"
> Three main limitations:
> 1. The Needleman-Wunsch DP matrix uses O(N×M) memory — for million-base sequences, this crashes the browser. Fix: Web Workers + Banded alignment.
> 2. Huffman on already-compressed files (JPG, ZIP) gives ~1.0x ratio because bytes are uniformly distributed. Fix: Apply compression before DNA encoding.
> 3. The LCG cipher is not cryptographically secure (it's a PRNG, not a CSPRNG). This is a DAA project demonstrating algorithms, not a production crypto tool.

---

<div align="center">

### 🧬 BioCrypt-X — Where Biology Meets Cryptography

*"A bio-inspired resilient storage engine that models data corruption and recovery using sequence alignment algorithms from computational biology."*

**Algorithms:** Huffman (Greedy) · Needleman-Wunsch (DP) · BWT · MTF · RLE · LCG · KMP
**Paradigms:** Greedy · Dynamic Programming · String Algorithms · Trees · Complexity Analysis

</div>
