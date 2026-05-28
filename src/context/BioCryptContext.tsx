"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { EncoderResult } from "@/lib/encoder";
import type { CipherResult } from "@/lib/mutationCipher";
import type { RecoveryResult } from "@/lib/recoveryEngine";

/* ── Pipeline step status ── */
export type StepStatus = "pending" | "in-progress" | "complete";

export interface PipelineState {
  encode: StepStatus;
  encrypt: StepStatus;
  recover: StepStatus;
  analyze: StepStatus;
}

/* ── Full context shape ── */
interface BioCryptState {
  // Pipeline status
  pipeline: PipelineState;
  setPipelineStep: (step: keyof PipelineState, status: StepStatus) => void;

  // Encode
  originalFile: File | null;
  setOriginalFile: (f: File | null) => void;
  encoderResult: EncoderResult | null;
  setEncoderResult: (r: EncoderResult | null) => void;

  // Encrypt
  encryptionKey: string;
  setEncryptionKey: (k: string) => void;
  cipherResult: CipherResult | null;
  setCipherResult: (r: CipherResult | null) => void;

  // Recover
  recoveryResult: RecoveryResult | null;
  setRecoveryResult: (r: RecoveryResult | null) => void;

  // Analyze
  analysisStats: AnalysisStats;
  setAnalysisStats: (s: AnalysisStats) => void;
}

export interface AnalysisStats {
  compressionRatio: number;
  mutationsApplied: number;
  recoveryAccuracy: number;
  executionTimeMs: number;
}

const DEFAULT_ANALYSIS: AnalysisStats = {
  compressionRatio: 0,
  mutationsApplied: 0,
  recoveryAccuracy: 0,
  executionTimeMs: 0,
};

const BioCryptContext = createContext<BioCryptState | null>(null);

export function BioCryptProvider({ children }: { children: ReactNode }) {
  // Pipeline
  const [pipeline, setPipeline] = useState<PipelineState>({
    encode: "pending",
    encrypt: "pending",
    recover: "pending",
    analyze: "pending",
  });

  const setPipelineStep = useCallback((step: keyof PipelineState, status: StepStatus) => {
    setPipeline((prev) => ({ ...prev, [step]: status }));
  }, []);

  // Encode
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [encoderResult, setEncoderResult] = useState<EncoderResult | null>(null);

  // Encrypt
  const [encryptionKey, setEncryptionKey] = useState("");
  const [cipherResult, setCipherResult] = useState<CipherResult | null>(null);

  // Recover
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult | null>(null);

  // Analyze
  const [analysisStats, setAnalysisStats] = useState<AnalysisStats>(DEFAULT_ANALYSIS);

  return (
    <BioCryptContext.Provider
      value={{
        pipeline,
        setPipelineStep,
        originalFile,
        setOriginalFile,
        encoderResult,
        setEncoderResult,
        encryptionKey,
        setEncryptionKey,
        cipherResult,
        setCipherResult,
        recoveryResult,
        setRecoveryResult,
        analysisStats,
        setAnalysisStats,
      }}
    >
      {children}
    </BioCryptContext.Provider>
  );
}

export function useBioCrypt() {
  const ctx = useContext(BioCryptContext);
  if (!ctx) throw new Error("useBioCrypt must be used within BioCryptProvider");
  return ctx;
}
