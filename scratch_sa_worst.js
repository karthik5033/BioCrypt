const crypto = require('crypto');

function buildSuffixArray(data) {
  const n = data.length;
  let str = "";
  for(let i = 0; i < n; i++) {
    str += String.fromCharCode(data[i]);
  }
  str += String.fromCharCode(256);
  
  const sa = new Int32Array(n + 1);
  for(let i = 0; i <= n; i++) {
    sa[i] = i;
  }
  
  sa.sort((a, b) => {
    const sA = str.substring(a);
    const sB = str.substring(b);
    if (sA < sB) return -1;
    if (sA > sB) return 1;
    return 0;
  });
  
  return sa;
}

console.log("Generating 900KB of repetitive data...");
const data = new Uint8Array(900000);
data.fill(65);
console.log("Sorting...");
const start = performance.now();
buildSuffixArray(data);
const end = performance.now();
console.log(`Sorted in ${end - start} ms`);
