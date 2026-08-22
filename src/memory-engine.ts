import { MemoryStore } from './store.js';
import type { MemoryNode, MemoryType } from './types.js';

export interface RecallResult {
  node: MemoryNode;
  score: number;
}

export class MemoryEngine {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  /**
   * Stores a new memory fact, preference, or rule.
   */
  public remember(content: string, options: { type?: MemoryType; tags?: string[]; importance?: number } = {}): MemoryNode {
    const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const node: MemoryNode = {
      id,
      type: options.type || 'fact',
      content,
      tags: options.tags || [],
      createdAt: now,
      updatedAt: now,
      accessCount: 0,
      importance: options.importance || 5,
    };

    this.store.putNode(node);
    return node;
  }

  /**
   * Recalls top-K relevant memories matching a query.
   */
  public recall(query: string, topK = 5): RecallResult[] {
    const nodes = this.store.getAllNodes();
    if (!query.trim() || nodes.length === 0) {
      return nodes.slice(0, topK).map((node) => ({ node, score: 1.0 }));
    }

    const queryTerms = query
      .toLowerCase()
      .replace(/[^a-z0-9_\-\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);

    const scored: RecallResult[] = [];

    for (const node of nodes) {
      const text = `${node.content} ${node.tags.join(' ')} ${node.type}`.toLowerCase();
      let matches = 0;

      for (const term of queryTerms) {
        if (text.includes(term)) {
          matches++;
        }
      }

      if (matches > 0) {
        // Score based on term overlap + importance weight + access frequency
        const relevance = matches / queryTerms.length;
        const score = relevance * 0.7 + (node.importance / 10) * 0.2 + Math.min(node.accessCount / 50, 0.1);
        scored.push({ node, score });
      }
    }

    const results = scored.sort((a, b) => b.score - a.score).slice(0, topK);

    // Increment access count
    for (const res of results) {
      res.node.accessCount++;
      this.store.putNode(res.node);
    }

    return results;
  }

  /**
   * Deletes a memory by ID.
   */
  public forget(id: string): boolean {
    return this.store.deleteNode(id);
  }

  public listAll(): MemoryNode[] {
    return this.store.getAllNodes();
  }
}
