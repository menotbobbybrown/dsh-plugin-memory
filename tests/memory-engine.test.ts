import { describe, it, expect } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { MemoryStore } from '../src/store.js';
import { MemoryEngine } from '../src/memory-engine.js';

describe('MemoryEngine', () => {
  it('should remember facts and recall by semantic keywords', () => {
    const testPath = path.join(os.tmpdir(), `test-engine-${Date.now()}.json`);
    const store = new MemoryStore(testPath);
    const engine = new MemoryEngine(store);

    engine.remember('DeepSeek Harness uses Cordis plugin framework', { tags: ['dsh', 'architecture'], importance: 9 });
    engine.remember('PostgreSQL database connection is postgresql://localhost:5432/main', { tags: ['database'], importance: 7 });

    const results = engine.recall('cordis architecture');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].node.content).toContain('Cordis plugin framework');

    try {
      fs.unlinkSync(testPath);
    } catch {}
  });
});
