
// src/languages/common/operators.ts

// Operadores Aritméticos e de Atribuição
export const arithmeticOperators = [
  '+', '-', '*', '/', '%', '**', // Aritméticos
  '=', '+=', '-=', '*=', '/=', '%=', '**=', // Atribuição
  '++', '--' // Incremento/Decremento
];

// Operadores de Comparação e Lógicos
export const logicalOperators = [
  '==', '===', '!=', '!==', // Igualdade
  '>', '<', '>=', '<=', // Comparação
  '&&', '||', '!' // Lógicos
];

// Operadores Bitwise
export const bitwiseOperators = [
  '&', '|', '^', '~', '<<', '>>', '>>>', // Bitwise
  '&=', '|=', '^=', '<<=', '>>=', '>>>=' // Atribuição Bitwise
];

// Outros operadores e símbolos comuns
export const otherOperators = [
  '=>', '.', '...', '?.', // Acesso e spread
  '?', ':' // Ternário
];

// Combina todos os operadores em um único array para facilitar a importação
export const allOperators = [
  ...arithmeticOperators,
  ...logicalOperators,
  ...bitwiseOperators,
  ...otherOperators,
];
