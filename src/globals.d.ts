// Ambient declaration so tsc recognises `global` used in vitest test files.
// At runtime vitest/Node provide the actual value.
declare var global: typeof globalThis
