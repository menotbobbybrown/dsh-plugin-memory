import type { Context } from 'cordis';
import { MemoryStore } from './store.js';
import { MemoryEngine } from './memory-engine.js';
import type { DshMemoryPluginConfig, MemoryNode } from './types.js';

export * from './types.js';
export * from './store.js';
export * from './memory-engine.js';

export const name = 'memory';

export interface DshMemoryService {
  store: MemoryStore;
  engine: MemoryEngine;
  remember: (content: string, options?: { type?: any; tags?: string[]; importance?: number }) => MemoryNode;
  recall: (query: string, topK?: number) => Array<{ node: MemoryNode; score: number }>;
  forget: (id: string) => boolean;
  listAll: () => MemoryNode[];
}

declare module 'cordis' {
  interface Context {
    memory?: DshMemoryService;
  }
}

export function apply(ctx: Context, config?: DshMemoryPluginConfig): void {
  const store = new MemoryStore(config?.storagePath);
  const engine = new MemoryEngine(store);

  const service: DshMemoryService = {
    store,
    engine,
    remember: (content, options) => engine.remember(content, options),
    recall: (query, topK) => engine.recall(query, topK || config?.maxRecallResults || 5),
    forget: (id) => engine.forget(id),
    listAll: () => engine.listAll(),
  };

  ctx.provide('memory');
  ctx.memory = service;

  ctx.on('ready', () => {
    console.info(`[dsh-plugin-memory] Long-term memory subsystem loaded with ${store.getAllNodes().length} memory node(s).`);

    // Register built-in memory tools if tool registry exists
    if ((ctx as any).tools && typeof (ctx as any).tools.register === 'function') {
      (ctx as any).tools.register({
        name: 'memory_remember',
        description: 'Save an important user preference, project fact, architectural decision, or rule into long-term memory',
        parameters: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'The fact or preference to remember' },
            type: { type: 'string', enum: ['fact', 'preference', 'rule', 'entity'], default: 'fact' },
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['content'],
        },
        execute: async (args: any) => service.remember(args.content, { type: args.type, tags: args.tags }),
      });

      (ctx as any).tools.register({
        name: 'memory_recall',
        description: 'Search long-term memory for relevant past context, architectural decisions, and user preferences',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The search query to match against long-term memories' },
            topK: { type: 'number', default: 5 },
          },
          required: ['query'],
        },
        execute: async (args: any) => service.recall(args.query, args.topK),
      });
    }
  });
}

export default {
  name,
  apply,
};
