import { describe, it, expect } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { MemoryStore } from '../src/store.js';

describe('MemoryStore', () => {
  it('should store and retrieve memory nodes from disk', () => {
    const testPath = path.join(os.tmpdir(), `test-mem-${Date.now()}.json`);
    const store = new MemoryStore(testPath);

    store.putNode({
      id: 'node_1',
      type: 'fact',
      content: 'User prefers dark mode and TypeScript',
      tags: ['ui', 'preference'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessCount: 0,
      importance: 8,
    });

    expect(store.getNode('node_1')).toBeDefined();
    expect(store.getNode('node_1')?.content).toContain('dark mode');

    store.deleteNode('node_1');
    expect(store.getNode('node_1')).toBeUndefined();

    try {
      fs.unlinkSync(testPath);
    } catch {}
  });
});
