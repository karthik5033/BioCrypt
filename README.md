<div align="center">

# 🧬 BioCrypt-X

### DNA-Inspired Self-Healing Encryption Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-0D9488?style=for-the-badge)](LICENSE)

*A file encryption system where data is encoded as DNA sequences, encrypted via controlled biological mutations, and recovered from corruption using sequence alignment algorithms.*

</div>

---

## 🔬 What is BioCrypt-X?

**BioCrypt-X** is a bio-inspired resilient storage engine that models data corruption and recovery using sequence alignment algorithms from computational biology. It demonstrates how biological concepts — DNA encoding, mutations, and genomic alignment — can be applied to build a novel encryption and data-recovery pipeline.

```
File → Binary → DNA Strand → Compress → Mutate (Encrypt) → Store
                                                             ↓
File ← Binary ← DNA Strand ← Decompress ← Recover ← Corrupted DNA
```

---

## ✨ Key Features

### 🔡 DNA Encoding & Compression
Convert any file into a DNA sequence (`A`, `T`, `C`, `G`) using binary-to-nucleotide mapping, then compress with **Huffman Coding** for optimal space efficiency.

### 🔐 Mutation Cipher
Encrypt DNA strands using biologically-inspired mutations — **substitution**, **inversion**, and **deletion-insertion** — driven by a deterministic key-seeded mutation map. Fully reversible.

### 🩹 Self-Healing Recovery Engine *(Killer Feature)*
Reconstruct corrupted DNA segments using **Needleman-Wunsch** global sequence alignment and **Longest Common Subsequence (LCS)** dynamic programming, with a live-animated DP table visualization.

```
Original:    ATCGGCTAAGT
Corrupted:   ATCG??TAAGT
Recovered:   ATCGGCTAAGT  ✓
```

### 📊 Complexity Analysis Dashboard
Real-time metrics for every operation — compression ratios, encryption overhead, recovery accuracy, and **KMP pattern search** — all visualized with interactive charts and Big-O annotations.

---

## 🧪 Algorithm Coverage

| Stage | Algorithm | Complexity |
|---|---|---|
| DNA Encoding | Binary → Nucleotide Mapping | `O(n)` |
| Compression | Huffman Coding (Greedy) | `O(n log n)` |
| Pattern Indexing | Trie Construction | `O(n × m)` |
| Encryption | Key-Seeded Mutation Cipher | `O(n)` |
| Corruption Detection | KMP / Rabin-Karp | `O(n + m)` |
| Recovery | LCS + Needleman-Wunsch (DP) | `O(m × n)` |

---

## 🏗️ Architecture

```
biocrypt-x/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with navbar & sidebar
│   │   ├── page.tsx            # Landing page
│   │   ├── encode/             # File → DNA conversion + Huffman compression
│   │   ├── encrypt/            # Mutation cipher engine
│   │   ├── recover/            # DP-based recovery with live alignment table
│   │   └── analyze/            # Complexity metrics dashboard
│   │
│   ├── lib/                    # Core algorithm implementations
│   │   ├── encoder.ts          # Binary → DNA + Huffman coding
│   │   ├── mutationCipher.ts   # Key-seeded mutation encryption/decryption
│   │   ├── recoveryEngine.ts   # LCS + Needleman-Wunsch alignment
│   │   └── patternSearch.ts    # KMP + Rabin-Karp pattern matching
│   │
│   ├── components/             # Reusable UI components
│   └── context/                # Global state management
│
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0
- **npm** ≥ 9.0

### Installation

```bash
# Clone the repository
git clone https://github.com/karthik5033/BioCrypt.git
cd BioCrypt

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**

### Build for Production

```bash
npm run build
npm start
```

---

## 🖥️ Usage Workflow

```
1. Upload file         →  Drag & drop any file
2. Convert to DNA      →  View the DNA strand (color-coded nucleotides)
3. Compress            →  See Huffman compression ratio
4. Encrypt             →  Apply mutation cipher with your secret key
5. Corrupt manually    →  Introduce ? characters to simulate damage
6. Recovery engine     →  Watch Needleman-Wunsch reconstruct the strand ✓
7. Analyze             →  View complexity metrics & pattern search
```

---

## 🎨 Design Language

| Element | Specification |
|---|---|
| Theme | Pure white (`#FFFFFF`) — clinical biotech aesthetic |
| Accent | Deep teal (`#0D9488`) |
| Code Font | DM Mono — for DNA sequences & code |
| UI Font | DM Sans — for headings & body text |
| Borders | Ultra-light gray (`#E5E7EB`) |
| Shadows | Minimal (`0 1px 3px rgba(0,0,0,0.06)`) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** |
| Styling | Vanilla CSS (no utility frameworks) |
| Charts | Recharts |
| State | React Context API |
| Algorithms | Pure TypeScript (no external libraries) |

---

## 📁 Module Breakdown

### Module 1 — Encoder + Compressor
- Binary → DNA conversion (`00→A`, `01→T`, `10→C`, `11→G`)
- Huffman tree construction & encoding
- Real-time compression ratio visualization

### Module 2 — Mutation Cipher
- Deterministic key-seeded mutation map (LCG random)
- Substitution (`A↔T`, `C↔G`) at seeded positions
- Segment inversion at seeded positions
- Fully reversible decryption

### Module 3 — Recovery Engine ⭐
- Needleman-Wunsch global sequence alignment
  - Match: `+2` | Mismatch: `-1` | Gap: `-2`
- LCS-based gap inference for `?` characters
- Animated DP table heatmap (row-by-row fill)
- Recovery accuracy metrics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**BioCrypt-X** — Where biology meets cryptography. 🧬🔐

*Built with Next.js, TypeScript, and pure algorithmic thinking.*

</div>
