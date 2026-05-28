export interface RecoveryStats {
  editDistance: number;
  charsRecovered: number;
  recoveryAccuracy: number;
}

export interface DPMatrixCell {
  val: number;
  source: "diag" | "up" | "left" | "none";
}

export interface RecoveryResult {
  recoveredSequence: string;
  dpMatrix: DPMatrixCell[][];
  stats: RecoveryStats;
}

export function needlemanWunsch(
  seqA: string, // Corrupted sequence
  seqB: string  // Reference fragment
): RecoveryResult {
  const matchScore = 2;
  const mismatchScore = -1;
  const gapScore = -2;

  const m = seqA.length;
  const n = seqB.length;

  const dp: DPMatrixCell[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill({ val: 0, source: "none" })
  );

  // Initialize DP matrix
  for (let i = 0; i <= m; i++) {
    dp[i][0] = { val: i * gapScore, source: i === 0 ? "none" : "up" };
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = { val: j * gapScore, source: j === 0 ? "none" : "left" };
  }

  // Fill DP matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charA = seqA[i - 1];
      const charB = seqB[j - 1];

      // A '?' in corrupted DNA is a wildcard, we treat it as a match to encourage alignment
      let score = mismatchScore;
      if (charA === charB || charA === "?") {
        score = matchScore;
      }

      const match = dp[i - 1][j - 1].val + score;
      const deleteA = dp[i - 1][j].val + gapScore; // up
      const insertA = dp[i][j - 1].val + gapScore; // left

      const maxVal = Math.max(match, deleteA, insertA);

      let source: "diag" | "up" | "left" = "diag";
      if (maxVal === match) source = "diag";
      else if (maxVal === deleteA) source = "up";
      else source = "left";

      dp[i][j] = { val: maxVal, source };
    }
  }

  // Backtracking to find alignment and recover
  let i = m;
  let j = n;
  let recoveredChars = 0;
  let editDistance = 0;
  const recoveredArr: string[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j].source === "diag") {
      const charA = seqA[i - 1];
      const charB = seqB[j - 1];

      if (charA === "?") {
        recoveredArr.unshift(`[${charB}]`);
        recoveredChars++;
        editDistance++;
      } else if (charA !== charB) {
        recoveredArr.unshift(charA);
        editDistance++;
      } else {
        recoveredArr.unshift(charA);
      }
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j].source === "up")) {
      recoveredArr.unshift(seqA[i - 1]);
      editDistance++;
      i--;
    } else {
      // Missing in sequence A (corrupted) but present in B (reference)
      // Since it's a gap in A, we can "recover" it by inserting the reference char
      recoveredArr.unshift(`[${seqB[j - 1]}]`);
      recoveredChars++;
      editDistance++;
      j--;
    }
  }

  const recoveredSequence = recoveredArr.join("");
  const totalQuestionMarks = (seqA.match(/\?/g) || []).length;
  
  // If no '?' were present, accuracy is basically 100% (or N/A)
  const recoveryAccuracy =
    totalQuestionMarks > 0
      ? Math.min((recoveredChars / totalQuestionMarks) * 100, 100)
      : 100;

  return {
    recoveredSequence,
    dpMatrix: dp,
    stats: {
      editDistance,
      charsRecovered: recoveredChars,
      recoveryAccuracy: parseFloat(recoveryAccuracy.toFixed(2)),
    },
  };
}
