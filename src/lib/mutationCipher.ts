export type MutationType = "Substitution" | "Inversion" | "Deletion-Insertion";

export interface MutationRecord {
  position: number;
  original: string;
  mutated: string;
  type: MutationType;
}

export interface CipherResult {
  encryptedDNA: string;
  mutationMap: MutationRecord[];
}

// Simple deterministic random number generator (LCG) seeded by key hash
class LCG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed;
  }
  nextFloat(): number {
    return (this.next() - 1) / 2147483646;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash !== 0 ? Math.abs(hash) : 1;
}

/**
 * Encrypt DNA using a mutation cipher seeded by the key.
 */
export function encryptDNA(
  dna: string,
  key: string,
  useSubstitution: boolean = true,
  useInversion: boolean = true,
  useIndel: boolean = false
): CipherResult {
  if (!dna || !key) return { encryptedDNA: dna, mutationMap: [] };

  const lcg = new LCG(hashString(key));
  const dnaArray = dna.split("");
  const mutationMap: MutationRecord[] = [];
  
  // Apply mutations to roughly 10% to 20% of the sequence
  const mutationFraction = 0.1 + lcg.nextFloat() * 0.1;
  const mutationCount = Math.max(1, Math.floor(dna.length * mutationFraction));

  // Determine available mutation types
  const availableTypes: MutationType[] = [];
  if (useSubstitution) availableTypes.push("Substitution");
  if (useInversion) availableTypes.push("Inversion");
  if (useIndel) availableTypes.push("Deletion-Insertion");
  
  if (availableTypes.length === 0) return { encryptedDNA: dna, mutationMap: [] };

  for (let i = 0; i < mutationCount; i++) {
    const pos = Math.floor(lcg.nextFloat() * dnaArray.length);
    const typeRoll = Math.floor(lcg.nextFloat() * availableTypes.length);
    const type = availableTypes[typeRoll];

    if (type === "Substitution") {
      const orig = dnaArray[pos];
      // A<->T, C<->G swap
      let mut = orig;
      if (orig === "A") mut = "T";
      else if (orig === "T") mut = "A";
      else if (orig === "C") mut = "G";
      else if (orig === "G") mut = "C";
      
      dnaArray[pos] = mut;
      mutationMap.push({ position: pos, original: orig, mutated: mut, type: "Substitution" });
    } 
    else if (type === "Inversion") {
      // Invert a small segment of 2-5 chars
      const len = Math.floor(lcg.nextFloat() * 4) + 2;
      const end = Math.min(pos + len, dnaArray.length);
      const segment = dnaArray.slice(pos, end);
      const reversed = [...segment].reverse();
      
      for (let j = 0; j < reversed.length; j++) {
        dnaArray[pos + j] = reversed[j];
      }
      
      mutationMap.push({
        position: pos,
        original: segment.join(""),
        mutated: reversed.join(""),
        type: "Inversion"
      });
    }
    else if (type === "Deletion-Insertion") {
      // True Indel implementation
      const isInsertion = lcg.nextFloat() > 0.5;
      
      if (isInsertion) {
        const bases = ["A", "T", "C", "G"];
        const randomBase = bases[Math.floor(lcg.nextFloat() * bases.length)];
        dnaArray.splice(pos, 0, randomBase);
        
        // Shift previous mutation positions that are at or after the insertion point
        for (const m of mutationMap) {
          if (m.position >= pos) m.position++;
        }
        
        mutationMap.push({
          position: pos,
          original: "-",
          mutated: randomBase,
          type: "Deletion-Insertion"
        });
      } else {
        // Deletion
        const orig = dnaArray[pos];
        dnaArray.splice(pos, 1);
        
        // Shift previous mutation positions that are after the deletion point
        for (const m of mutationMap) {
          if (m.position > pos) m.position--;
        }
        
        mutationMap.push({
          position: pos,
          original: orig,
          mutated: "-",
          type: "Deletion-Insertion"
        });
      }
    }
  }

  // Sort mutations by position for cleaner display
  mutationMap.sort((a, b) => a.position - b.position);

  return {
    encryptedDNA: dnaArray.join(""),
    mutationMap,
  };
}
