<div align="center">

# 🧬 BioCrypt-X

### DNA-Inspired Self-Healing Encryption Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

*A premium, high-performance file encryption system where data is encoded as DNA sequences, encrypted via controlled biological mutations, and recovered from corruption using dynamic programming sequence alignment algorithms.*

</div>

---

## 🔬 What is BioCrypt-X?

**BioCrypt-X** is a bio-inspired resilient storage engine that models data corruption and recovery using sequence alignment algorithms from computational biology. It demonstrates how biological concepts — DNA encoding, mutations, and genomic alignment — can be applied to build a novel encryption and data-recovery pipeline.

The application features a fully responsive, state-driven pipeline where data flows seamlessly from one stage to the next, wrapped in a beautiful glassmorphic UI with a live DNA video background.

```text
File → Binary → DNA Strand → Compress → Mutate (Encrypt) → Store
                                                             ↓
File ← Binary ← DNA Strand ← Decompress ← Recover ← Corrupted DNA
```

---

## ✨ Key Features

### 🔡 DNA Encoding & Compression
Convert any file into a DNA sequence (`A`, `T`, `C`, `G`) using binary-to-nucleotide mapping, then compress with **Huffman Coding** for optimal space efficiency. Features a live typing animation of the generated nucleotide string.

### 🔐 Mutation Cipher
Encrypt DNA strands using biologically-inspired mutations — **substitution**, **inversion**, and **deletion-insertion** — driven by a deterministic key-seeded mutation map. Fully reversible.

### 🩹 Self-Healing Recovery Engine *(Killer Feature)*
Reconstruct corrupted DNA segments (with missing `?` bases) using **Needleman-Wunsch** global sequence alignment and **Longest Common Subsequence (LCS)** dynamic programming. Watch the algorithm build the DP scoring matrix live, row-by-row, and trace back the optimal alignment path.

### 📊 Complexity Analysis Dashboard
Real-time metrics for every operation in the pipeline. View benchmark data for your run, explore algorithmic time complexities via Big-O notation, and use the **KMP (Knuth-Morris-Pratt)** pattern search tool to instantly locate genetic markers in your 90k+ base DNA strands.

---

## 🧪 Algorithm Coverage

| Stage | Algorithm | Complexity |
|---|---|---|
| **DNA Encoding** | Binary → Nucleotide Mapping | `O(N)` |
| **Compression** | Huffman Coding (Greedy) | `O(N log K)` (K=4) |
| **Encryption** | Key-Seeded LCG Mutation Cipher | `O(N)` |
| **Corruption Detection** | KMP / Rabin-Karp | `O(N + M)` |
| **Recovery** | LCS + Needleman-Wunsch (DP) | `O(N × M)` |

---

## 🏗️ Architecture

```text
biocrypt-x/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── encode/             # File → DNA conversion + Huffman
│   │   ├── encrypt/            # Mutation cipher engine
│   │   ├── recover/            # DP-based recovery with live alignment
│   │   └── analyze/            # Metrics dashboard & KMP search
│   │
│   ├── lib/                    # Core algorithm implementations
│   │   ├── encoder.ts          # Binary → DNA + Huffman coding
│   │   ├── mutationCipher.ts   # Key-seeded mutation encryption
│   │   └── recoveryEngine.ts   # Needleman-Wunsch DP alignment
│   │
│   ├── components/layout/      # UI Shell (Navbar, Footer, Pipeline Stage)
│   └── context/                # React Context for global state flow
│
├── public/                     # Static assets & dna-video.mp4
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

The application uses global state context. To see the full magic, progress through the pipeline in order:

1. **Encode** → Upload a file and convert it to a DNA strand.
2. **Encrypt** → The generated DNA automatically carries over. Enter a secret key and apply biological mutations.
3. **Recover** → The mutated string is passed as corrupted data. Run the DP matrix to dynamically heal the sequence back to the original.
4. **Analyze** → Review the actual time, memory, and complexity benchmarks of your run. 

---

## 🎨 Design Language & Aesthetics

BioCrypt-X was designed to look like a premium, startup-grade web application with a focus on modern web design principles.

| Element | Specification |
|---|---|
| **Theme** | Pristine Glassmorphism — Translucent cards over a live video background |
| **Accent** | Vibrant Amber / Bronze (`#F59E0B`) |
| **Typography** | `DM Sans` (Clean UI/Headings) & `DM Mono` (DNA sequences, tables, metrics) |
| **Animations** | Scroll-reveal observer hooks, animated DP matrix fills, CSS micro-interactions |
| **Responsiveness** | Fluid grids and a sleek mobile tab-bar navigation for smaller screens |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS Modules (Zero Utility Frameworks) |
| **State** | React Context API |
| **Icons** | Lucide React |
| **Algorithms** | Pure TypeScript (Zero External Libraries) |

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
