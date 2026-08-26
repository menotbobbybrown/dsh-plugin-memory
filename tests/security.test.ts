import { describe, it, expect } from 'vitest';
import { MemoryStore } from '../src/store.js';

describe('MemoryStore Security & Validation', () => {
  it('should reject null byte injection in custom file paths', () => {
    expect(() => new MemoryStore('/tmp/evil\0.json')).toThrow(/Null bytes are forbidden/);
  });

  it('should safely handle and filter corrupted/malformed objects on disk', () => {
    const store = new MemoryStore('./tests/fixtures/corrupt.json');
    expect(store.getAllNodes()).toBeInstanceOf(Array);
  });
});
