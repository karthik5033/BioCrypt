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

// ─── Huffman Tree Node ──────────────────────────────────────────────────────

interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

function createNode(
  char: string | null,
  freq: number,
  left: HuffmanNode | null = null,
  right: HuffmanNode | null = null
): HuffmanNode {
  return { char, freq, left, right };
}

// ─── Huffman Encoding ───────────────────────────────────────────────────────

function buildFrequencyMap(data: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of data) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  return freq;
}

function buildHuffmanTree(freqMap: Map<string, number>): HuffmanNode | null {
  if (freqMap.size === 0) return null;

  // Priority queue (min-heap) — simple array-based for clarity
  const nodes: HuffmanNode[] = [];
  freqMap.forEach((freq, char) => {
    nodes.push(createNode(char, freq));
  });

  // Sort ascending by frequency
  nodes.sort((a, b) => a.freq - b.freq);

  while (nodes.length > 1) {
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent = createNode(null, left.freq + right.freq, left, right);

    // Insert parent back in sorted position
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
  table: Map<string, string> = new Map()
): Map<string, string> {
  if (!node) return table;

  if (node.char !== null) {
    // Leaf node — if only one unique char, assign "0"
    table.set(node.char, prefix || "0");
    return table;
  }

  buildCodeTable(node.left, prefix + "0", table);
  buildCodeTable(node.right, prefix + "1", table);
  return table;
}

function huffmanEncode(data: string): {
  encoded: string;
  codeTable: Map<string, string>;
  tree: HuffmanNode | null;
} {
  const freqMap = buildFrequencyMap(data);
  const tree = buildHuffmanTree(freqMap);
  const codeTable = buildCodeTable(tree);

  let encoded = "";
  for (const ch of data) {
    encoded += codeTable.get(ch) || "";
  }

  return { encoded, codeTable, tree };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface EncoderStats {
  originalSizeBytes: number;
  binaryLength: number;
  dnaLength: number;
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
 * Full encode pipeline: File → Binary → DNA → Huffman Compress
 */
export async function encodeFile(file: File): Promise<EncoderResult> {
  const binaryString = await fileToBinary(file);
  const rawDNA = binaryToDNA(binaryString);
  const { encoded: huffmanEncoded, codeTable } = huffmanEncode(rawDNA);

  const codeTableObj: Record<string, string> = {};
  codeTable.forEach((code, char) => {
    codeTableObj[char] = code;
  });

  const huffmanByteSize = Math.ceil(huffmanEncoded.length / 8);
  const originalSizeBytes = file.size;

  const stats: EncoderStats = {
    originalSizeBytes,
    binaryLength: binaryString.length,
    dnaLength: rawDNA.length,
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
