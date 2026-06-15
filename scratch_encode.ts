import { compressBytes } from "./src/lib/encoder";

const text = "HELLO";
const bytes = new TextEncoder().encode(text);
const result = compressBytes(bytes);
console.log("Bits:", result.compressedBits);
