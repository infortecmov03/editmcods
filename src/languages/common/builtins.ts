
// src/languages/common/builtins.ts

/**
 * Cria um mapa de built-ins para pesquisa rápida.
 * @param builtins A lista de nomes de built-ins.
 * @returns Um mapa onde cada chave é um built-in.
 */
function createBuiltinMap(builtins: string[]) {
  const map = new Map<string, boolean>();
  builtins.forEach(b => map.set(b, true));
  return map;
}

// Funções e objetos globais comuns em ambientes JavaScript/Browser
const commonBuiltins = [
  // Objetos Globais
  'Object', 'Function', 'Boolean', 'Symbol', 'Error', 'EvalError', 'RangeError',
  'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'Number', 'BigInt',
  'Math', 'Date', 'String', 'RegExp', 'Array', 'Int8Array', 'Uint8Array',
  'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
  'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array', 'Map', 'Set',
  'WeakMap', 'WeakSet', 'JSON', 'Promise', 'Reflect', 'Proxy', 'ArrayBuffer',
  'SharedArrayBuffer', 'Atomics', 'DataView', 'globalThis',

  // Funções Globais
  'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'decodeURI',
  'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape', 'unescape',

  // Outros ambientes (ex: Node.js, Browser)
  'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'window',
  'document', 'navigator', 'process', 'require', 'module', 'exports', '__dirname',
  '__filename'
];

// Exporta o mapa para ser usado pelos tokenizers
export const builtinMap = createBuiltinMap(commonBuiltins);
