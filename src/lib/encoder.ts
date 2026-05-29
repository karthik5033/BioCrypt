// BioCrypt-X DNA Encoder + Huffman Compressor
// Converts file bytes → binary → DNA sequence, then applies Huffman compression

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

// ─── RLE Encoding ───────────────────────────────────────────────────────────

function rleEncode(data: Uint8Array): number[] {
  const result: number[] = [];
  let i = 0;
  while (i < data.length) {
    let runLength = 1;
    while (
      i + runLength < data.length &&
      data[i] === data[i + runLength] &&
      runLength < 255
    ) {
      runLength++;
    }
    if (runLength >= 3) {
      // 256 is our RLE escape token
      result.push(256);
      result.push(runLength);
      result.push(data[i]);
      i += runLength;
    } else {
      result.push(data[i]);
      i++;
    }
  }
  return result;
}

// ─── LZW Encoding ───────────────────────────────────────────────────────────

function lzwEncode(data: number[]): number[] {
  if (data.length === 0) return [];
  const dict = new Map<string, number>();
  // Initialize dict with 0-256 (0-255 bytes + 256 RLE token)
  for (let i = 0; i <= 256; i++) {
    dict.set(String.fromCharCode(i), i);
  }
  let dictSize = 257;

  let current = String.fromCharCode(data[0]);
  const result: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const next = String.fromCharCode(data[i]);
    const combined = current + next;
    if (dict.has(combined)) {
      current = combined;
    } else {
      result.push(dict.get(current)!);
      // Optional: limit dict size to prevent infinite growth (e.g., 12-bit = 4096)
      if (dictSize < 4096) {
        dict.set(combined, dictSize++);
      }
      current = next;
    }
  }
  if (current !== "") {
    result.push(dict.get(current)!);
  }
  return result;
}

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

// ─── Huffman Encoding ───────────────────────────────────────────────────────

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
  const freqMap = buildFrequencyMap(data);
  const tree = buildHuffmanTree(freqMap);
  const codeTable = buildCodeTable(tree);

  let encoded = "";
  for (const token of data) {
    encoded += codeTable.get(token) || "";
  }

  return { encoded, codeTable, tree };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface EncoderStats {
  originalSizeBytes: number;
  binaryLength: number;
  dnaLength: number;
  rleTokenCount: number;
  lzwTokenCount: number;
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
  // Pad to even length
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
 * Full encode pipeline: File bytes → RLE → LZW → Huffman Compress → DNA
 */
export async function encodeFile(file: File): Promise<EncoderResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // 1. RLE Compress
  const rleTokens = rleEncode(bytes);

  // 2. LZW Compress
  const lzwTokens = lzwEncode(rleTokens);

  // 3. Huffman compress the LZW tokens
  const { encoded: huffmanEncoded, codeTable } = huffmanEncode(lzwTokens);

  // 4. Convert compressed bitstring to DNA
  const rawDNA = binaryToDNA(huffmanEncoded);
  
  // Get full binary string for UI preview purposes
  const binaryString = await fileToBinary(file);

  const codeTableObj: Record<string, string> = {};
  codeTable.forEach((code, token) => {
    // Determine how to display the token. Tokens <= 255 are hex bytes. 256 is RLE. >256 are LZW dict entries.
    let display = "";
    if (token <= 255) {
      display = `0x${token.toString(16).padStart(2, "0").toUpperCase()}`;
    } else if (token === 256) {
      display = "[RLE_ESC]";
    } else {
      display = `[LZW_${token}]`;
    }
    codeTableObj[display] = code;
  });

  const huffmanByteSize = Math.ceil(huffmanEncoded.length / 8);
  const originalSizeBytes = file.size;

  const stats: EncoderStats = {
    originalSizeBytes,
    binaryLength: binaryString.length,
    dnaLength: rawDNA.length,
    rleTokenCount: rleTokens.length,
    lzwTokenCount: lzwTokens.length,
    huffmanBitLength: huffmanEncoded.length,
    huffmanByteSize,
    compressionRatio:
      huffmanByteSize > 0
        ? parseFloat((originalSizeBytes / huffmanByteSize).toFixed(2))
        : 0,
    codeTable: codeTableObj,
  };

  return { binaryString, rawDNA, huffmanEncoded, stats };
}
