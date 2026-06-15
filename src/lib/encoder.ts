// BioCrypt-X DNA Encoder + Block-Based BWT→MTF→RLE→Huffman Compressor
// Converts file bytes → binary → DNA sequence, then applies BWT→MTF→RLE→Huffman compression

// ─── Binary → DNA Mapping ───────────────────────────────────────────────────

const BINARY_TO_DNA: Record<string, string> = {
  "00": "A",
  "01": "T",
  "10": "C",
  "11": "G",
};

const DNA_TO_BINARY: Record<string, string> = {
  A: "00",
  T: "01",
  C: "10",
  G: "11",
};

// ─── Huffman Tree Node ──────────────────────────────────────────────────────

interface HuffmanNode {
  token: number | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

function createNode(
  token: number | null,
  freq: number,
  left: HuffmanNode | null = null,
  right: HuffmanNode | null = null
): HuffmanNode {
  return { token, freq, left, right };
}

// ─── Constants ──────────────────────────────────────────────────────────────

const BWT_EOF = 256;         // unique EOF marker outside byte range [0..255]
const RLE_ZERO_ESC = 257;    // escape symbol for zero-runs in RLE output
const BWT_BLOCK_SIZE = 900000; // 900KB per block for maximum clustering (matching bzip2 -9)

// ─── Stage 1: BWT (Burrows-Wheeler Transform) — Suffix Array Approach ──────

/**
 * Forward BWT on a single block using Prefix Doubling Suffix Array Construction.
 * Runs in O(N log^2 N) time, making it highly robust even for 100KB of worst-case 
 * highly repetitive data, unlike naive string comparison which degrades to O(N^2 log N).
 */
function bwtBlock(block: number[]): { bwtOutput: number[]; originalIndex: number } {
  const data = [...block, BWT_EOF];
  const n = data.length;

  const sa = new Int32Array(n);
  const rank = new Int32Array(n);
  const tempRank = new Int32Array(n);
  
  for (let i = 0; i < n; i++) {
    sa[i] = i;
    rank[i] = data[i];
  }
  
  for (let k = 1; k < n; k *= 2) {
    sa.sort((a, b) => {
      if (rank[a] !== rank[b]) {
        return rank[a] - rank[b];
      }
      const rankA = a + k < n ? rank[a + k] : -1;
      const rankB = b + k < n ? rank[b + k] : -1;
      return rankA - rankB;
    });
    
    tempRank[sa[0]] = 0;
    for (let i = 1; i < n; i++) {
      const a = sa[i];
      const b = sa[i - 1];
      const rankA1 = rank[a];
      const rankA2 = a + k < n ? rank[a + k] : -1;
      const rankB1 = rank[b];
      const rankB2 = b + k < n ? rank[b + k] : -1;
      
      if (rankA1 === rankB1 && rankA2 === rankB2) {
        tempRank[a] = tempRank[b];
      } else {
        tempRank[a] = tempRank[b] + 1;
      }
    }
    
    for (let i = 0; i < n; i++) {
      rank[i] = tempRank[i];
    }
    
    // Optimization: if all ranks are unique, sorting is complete
    if (rank[sa[n - 1]] === n - 1) {
      break;
    }
  }

  // Extract last column
  const bwtOutput: number[] = new Array(n);
  let originalIndex = -1;

  for (let i = 0; i < n; i++) {
    bwtOutput[i] = data[(sa[i] + n - 1) % n];
    if (sa[i] === 0) {
      originalIndex = i;
    }
  }

  return { bwtOutput, originalIndex };
}

/**
 * Inverse BWT using LF-mapping on a single block.
 * Reconstructs the original block data (strips the EOF marker).
 */
export function inverseBWT(
  bwtOutput: number[],
  originalIndex: number
): number[] {
  const n = bwtOutput.length;
  if (n === 0) return [];

  // Count occurrences of each symbol (0..256 + EOF)
  const maxSym = 257;
  const count = new Int32Array(maxSym + 1);
  for (let i = 0; i < n; i++) {
    count[bwtOutput[i]]++;
  }

  // Cumulative counts → first occurrence of each symbol in the sorted (first) column
  const firstOcc = new Int32Array(maxSym + 1);
  let sum = 0;
  for (let s = 0; s <= maxSym; s++) {
    firstOcc[s] = sum;
    sum += count[s];
  }

  // Build LF-mapping
  const lf = new Int32Array(n);
  const running = new Int32Array(maxSym + 1);
  for (let i = 0; i < n; i++) {
    const sym = bwtOutput[i];
    lf[i] = firstOcc[sym] + running[sym];
    running[sym]++;
  }

  // Walk LF from originalIndex — produces chars in reverse order
  const result: number[] = [];
  let idx = originalIndex;
  for (let i = 0; i < n; i++) {
    idx = lf[idx];
    const sym = bwtOutput[idx];
    if (sym !== BWT_EOF) {
      result.push(sym);
    }
  }

  result.reverse();
  return result;
}

export const ibwt = inverseBWT;

// ─── Stage 2: MTF (Move-to-Front Encoding) ─────────────────────────────────

/**
 * MTF encode: maintains a list [0..256]. For each symbol, outputs its current
 * index in the list, then moves that symbol to the front.
 * After a good BWT, the output will be heavily weighted toward small values (0, 1, 2).
 */
function mtfEncode(data: number[]): number[] {
  const list: number[] = Array.from({ length: 257 }, (_, i) => i);
  const result: number[] = new Array(data.length);

  for (let i = 0; i < data.length; i++) {
    const sym = data[i];
    const idx = list.indexOf(sym);
    result[i] = idx;
    // Move to front
    if (idx > 0) {
      list.splice(idx, 1);
      list.unshift(sym);
    }
  }

  return result;
}

/**
 * MTF decode: inverse of mtfEncode.
 */
export function mtfDecode(encoded: number[]): number[] {
  const list: number[] = Array.from({ length: 257 }, (_, i) => i);
  const result: number[] = new Array(encoded.length);

  for (let i = 0; i < encoded.length; i++) {
    const idx = encoded[i];
    const sym = list[idx];
    result[i] = sym;
    if (idx > 0) {
      list.splice(idx, 1);
      list.unshift(sym);
    }
  }

  return result;
}

// ─── Stage 3: RLE (Run-Length Encoding on MTF output) ───────────────────────

// After BWT+MTF, zeros cluster heavily. We aggressively encode zero-runs:
//   - Non-zero value V → emit V directly (V is in range 1..256)
//   - Run of k consecutive zeros → emit [RLE_ZERO_ESC (257), k]
//
// Since MTF output values are 0..256, and RLE_ZERO_ESC = 257, there's no
// collision. Non-zero MTF values pass through directly — no offset needed.

function rleEncode(data: number[]): number[] {
  const result: number[] = [];
  let i = 0;

  while (i < data.length) {
    if (data[i] === 0) {
      // Count consecutive zeros
      let runLen = 0;
      while (i < data.length && data[i] === 0 && runLen < 255) {
        runLen++;
        i++;
      }
      result.push(RLE_ZERO_ESC);
      result.push(runLen);
    } else {
      // Non-zero MTF index: emit directly (range 1..256, never collides with 257)
      result.push(data[i]);
      i++;
    }
  }

  return result;
}

/**
 * RLE decode: inverse of rleEncode.
 */
export function rleDecode(encoded: number[]): number[] {
  const result: number[] = [];
  let i = 0;

  while (i < encoded.length) {
    if (encoded[i] === RLE_ZERO_ESC) {
      const runLen = encoded[i + 1];
      for (let j = 0; j < runLen; j++) {
        result.push(0);
      }
      i += 2;
    } else {
      // Non-zero MTF value, passed through directly
      result.push(encoded[i]);
      i++;
    }
  }

  return result;
}

// ─── Stage 4: Huffman Coding ────────────────────────────────────────────────

function buildFrequencyMap(data: number[]): Map<number, number> {
  const freq = new Map<number, number>();
  for (const token of data) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

function buildHuffmanTree(freqMap: Map<number, number>): HuffmanNode | null {
  if (freqMap.size === 0) return null;

  const nodes: HuffmanNode[] = [];
  freqMap.forEach((freq, token) => {
    nodes.push(createNode(token, freq));
  });

  // Handle single-symbol edge case
  if (nodes.length === 1) {
    return createNode(null, nodes[0].freq, nodes[0], null);
  }

  nodes.sort((a, b) => a.freq - b.freq);

  while (nodes.length > 1) {
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent = createNode(null, left.freq + right.freq, left, right);

    let inserted = false;
    for (let i = 0; i < nodes.length; i++) {
      if (parent.freq <= nodes[i].freq) {
        nodes.splice(i, 0, parent);
        inserted = true;
        break;
      }
    }
    if (!inserted) nodes.push(parent);
  }

  return nodes[0] || null;
}

function buildCodeTable(
  node: HuffmanNode | null,
  prefix: string = "",
  table: Map<number, string> = new Map()
): Map<number, string> {
  if (!node) return table;

  if (node.token !== null) {
    table.set(node.token, prefix || "0");
    return table;
  }

  buildCodeTable(node.left, prefix + "0", table);
  buildCodeTable(node.right, prefix + "1", table);
  return table;
}

function huffmanEncode(data: number[]): {
  encoded: string;
  codeTable: Map<number, string>;
  tree: HuffmanNode | null;
} {
  if (data.length === 0) {
    return { encoded: "", codeTable: new Map(), tree: null };
  }

  const freqMap = buildFrequencyMap(data);
  const tree = buildHuffmanTree(freqMap);
  const codeTable = buildCodeTable(tree);

  let encoded = "";
  for (const token of data) {
    encoded += codeTable.get(token) || "";
  }

  return { encoded, codeTable, tree };
}

/**
 * Huffman decode: walks the tree bit-by-bit to recover the original tokens.
 */
export function huffmanDecode(
  bits: string,
  tree: HuffmanNode | null
): number[] {
  if (!tree || bits.length === 0) return [];

  const result: number[] = [];
  let node = tree;

  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === "0") {
      node = node.left!;
    } else {
      node = node.right!;
    }

    if (node.token !== null) {
      result.push(node.token);
      node = tree;
    }
  }

  return result;
}

// ─── CompressionResult ──────────────────────────────────────────────────────

export interface CompressionResult {
  compressedBits: string;
  huffmanTree: HuffmanNode | null;
  codeTable: Map<number, string>;
  bwtIndex: number;               // kept for backward compat — first block index
  bwtIndices: number[];            // one originalIndex per BWT block
  blockSize: number;               // block size used (for decompression)
  stats: {
    originalSize: number;
    bwtMtfTokenCount: number;
    rleTokenCount: number;
    compressedSize: number;
    ratio: number;
  };
}

// ─── Forward Pipeline: Block-Based BWT → MTF → RLE → Huffman ────────────────

/**
 * Full compression pipeline with block-based BWT.
 * Input is split into blocks of BWT_BLOCK_SIZE bytes.
 * Each block: BWT → MTF → RLE, then all RLE outputs are concatenated
 * and Huffman-encoded together for a single shared code table.
 */
export function compressBytes(input: Uint8Array): CompressionResult {
  if (input.length === 0) {
    return {
      compressedBits: "",
      huffmanTree: null,
      codeTable: new Map(),
      bwtIndex: 0,
      bwtIndices: [],
      blockSize: BWT_BLOCK_SIZE,
      stats: { originalSize: 0, bwtMtfTokenCount: 0, rleTokenCount: 0, compressedSize: 0, ratio: 0 },
    };
  }

  const data = Array.from(input);
  const numBlocks = Math.ceil(data.length / BWT_BLOCK_SIZE);

  const bwtIndices: number[] = [];
  let allMtfOutput: number[] = [];
  let allRleOutput: number[] = [];

  let totalMtfLen = 0;
  let totalRleLen = 0;

  for (let b = 0; b < numBlocks; b++) {
    const start = b * BWT_BLOCK_SIZE;
    const end = Math.min(start + BWT_BLOCK_SIZE, data.length);
    const block = data.slice(start, end);

    // 1. BWT on this block
    const { bwtOutput, originalIndex } = bwtBlock(block);
    bwtIndices.push(originalIndex);

    // 2. MTF on this block's BWT output
    const mtfOutput = mtfEncode(bwtOutput);

    // Diagnostic: count zeros to verify BWT+MTF clustering
    let zeros = 0;
    for (let j = 0; j < mtfOutput.length; j++) {
      if (mtfOutput[j] === 0) zeros++;
    }
    const zerosPercent = ((zeros / mtfOutput.length) * 100).toFixed(1);

    // 3. RLE on this block's MTF output
    const rleOutput = rleEncode(mtfOutput);

    console.log(
      `Block ${b}: Original=${block.length}, BWT done, MTF zeros%=${zerosPercent}%, After RLE=${rleOutput.length}`
    );

    totalMtfLen += mtfOutput.length;
    totalRleLen += rleOutput.length;

    allMtfOutput = allMtfOutput.concat(mtfOutput);
    allRleOutput = allRleOutput.concat(rleOutput);
  }

  // 4. Huffman on concatenated RLE output (shared code table across all blocks)
  const { encoded, codeTable, tree } = huffmanEncode(allRleOutput);

  const compressedSize = Math.ceil(encoded.length / 8);

  console.log(
    `Pipeline total: Original=${input.length}, MTF tokens=${totalMtfLen}, RLE tokens=${totalRleLen}, Huffman bits=${encoded.length}, Compressed=${compressedSize} bytes, Ratio=${
      compressedSize > 0 ? (input.length / compressedSize).toFixed(2) : 0
    }x`
  );

  return {
    compressedBits: encoded,
    huffmanTree: tree,
    codeTable,
    bwtIndex: bwtIndices[0] ?? 0,
    bwtIndices,
    blockSize: BWT_BLOCK_SIZE,
    stats: {
      originalSize: input.length,
      bwtMtfTokenCount: totalMtfLen,
      rleTokenCount: totalRleLen,
      compressedSize,
      ratio:
        compressedSize > 0
          ? parseFloat((input.length / compressedSize).toFixed(2))
          : 0,
    },
  };
}

// ─── Public API (Backward-Compatible Exports) ───────────────────────────────

export interface EncoderStats {
  originalSizeBytes: number;
  binaryLength: number;
  dnaLength: number;
  bwtMtfTokenCount: number;
  rleTokenCount: number;
  huffmanBitLength: number;
  huffmanByteSize: number;
  compressionRatio: number;
  codeTable: Record<string, string>;
}

export interface EncoderResult {
  binaryString: string;
  rawDNA: string;
  huffmanEncoded: string;
  stats: EncoderStats;
}

/**
 * Convert a File/Blob to its full binary string representation.
 */
export async function fileToBinary(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += byte.toString(2).padStart(8, "0");
  }
  return binary;
}

/**
 * Convert a binary string (sequence of 0s and 1s) to a DNA string.
 * Pads with trailing 0s if length is not a multiple of 2.
 */
export function binaryToDNA(binary: string): string {
  const padded = binary.length % 2 !== 0 ? binary + "0" : binary;
  let dna = "";
  for (let i = 0; i < padded.length; i += 2) {
    const pair = padded.substring(i, i + 2);
    dna += BINARY_TO_DNA[pair] || "A";
  }
  return dna;
}

/**
 * Convert a DNA string back to its binary representation.
 */
export function dnaToBinary(dna: string): string {
  let binary = "";
  for (const nucleotide of dna) {
    binary += DNA_TO_BINARY[nucleotide] || "00";
  }
  return binary;
}

/**
 * Full encode pipeline: File bytes → Block BWT → MTF → RLE → Huffman → DNA
 */
export async function encodeFile(file: File): Promise<EncoderResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Run the block-based BWT → MTF → RLE → Huffman pipeline
  const compressed = compressBytes(bytes);

  // Convert compressed bitstring to DNA
  const rawDNA = binaryToDNA(compressed.compressedBits);

  // Get full binary string for UI preview purposes
  const binaryString = await fileToBinary(file);

  // Build a human-readable code table
  const codeTableObj: Record<string, string> = {};
  compressed.codeTable.forEach((code, token) => {
    let display = "";
    if (token === RLE_ZERO_ESC) {
      display = "[ZERO_RUN]";
    } else if (token <= 255) {
      display = `0x${token.toString(16).padStart(2, "0").toUpperCase()}`;
    } else {
      display = `[SYM_${token}]`;
    }
    codeTableObj[display] = code;
  });

  const huffmanByteSize = compressed.stats.compressedSize;
  const originalSizeBytes = file.size;

  const stats: EncoderStats = {
    originalSizeBytes,
    binaryLength: binaryString.length,
    dnaLength: rawDNA.length,
    bwtMtfTokenCount: compressed.stats.bwtMtfTokenCount,
    rleTokenCount: compressed.stats.rleTokenCount,
    huffmanBitLength: compressed.compressedBits.length,
    huffmanByteSize,
    compressionRatio:
      huffmanByteSize > 0
        ? parseFloat((originalSizeBytes / huffmanByteSize).toFixed(2))
        : 0,
    codeTable: codeTableObj,
  };

  return { binaryString, rawDNA, huffmanEncoded: compressed.compressedBits, stats };
}
