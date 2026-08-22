import { describe, it, expect } from 'vitest';
import { Context } from 'cordis';
import * as MemoryPlugin from '../src/index.js';

describe('MemoryPlugin (Cordis)', () => {
  it('should attach memory service onto cordis context', async () => {
    const ctx = new Context();
    ctx.plugin(MemoryPlugin);

    expect(ctx.memory).toBeDefined();
    expect(typeof ctx.memory.remember).toBe('function');
    expect(typeof ctx.memory.recall).toBe('function');

    const node = ctx.memory.remember('Agent test memory fact');
    expect(node.content).toBe('Agent test memory fact');

    const recalled = ctx.memory.recall('test memory');
    expect(recalled.length).toBeGreaterThan(0);
  });
});
