import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { MemoryNode, MemoryRelation } from './types.js';

export class MemoryStore {
  private filePath: string;
  private nodes: Map<string, MemoryNode> = new Map();
  private relations: MemoryRelation[] = [];

  constructor(customPath?: string) {
    if (customPath) {
      if (customPath.includes('\0')) {
        throw new Error('[Security] Invalid memory file path: Null bytes are forbidden.');
      }
      this.filePath = path.resolve(customPath);
    } else {
      this.filePath = path.join(os.homedir(), '.dsh', 'memory.json');
    }
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
          if (Array.isArray(data.nodes)) {
            for (const node of data.nodes) {
              if (node && typeof node === 'object' && typeof node.id === 'string' && typeof node.content === 'string') {
                this.nodes.set(node.id, {
                  id: String(node.id),
                  type: node.type || 'fact',
                  content: String(node.content),
                  tags: Array.isArray(node.tags) ? node.tags.map(String) : [],
                  createdAt: String(node.createdAt || new Date().toISOString()),
                  updatedAt: String(node.updatedAt || new Date().toISOString()),
                  accessCount: Number(node.accessCount || 0),
                  importance: Number(node.importance || 5),
                });
              }
            }
          }
          if (Array.isArray(data.relations)) {
            this.relations = data.relations.filter(
              (r: any) => r && typeof r.fromId === 'string' && typeof r.toId === 'string' && typeof r.relation === 'string'
            );
          }
        }
      }
    } catch {
      // Clean fallback on corrupt or new file
    }
  }

  public saveToDisk(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const payload = {
        nodes: Array.from(this.nodes.values()),
        relations: this.relations,
      };
      fs.writeFileSync(this.filePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[dsh-plugin-memory] Failed to persist memory to disk:', err);
    }
  }

  public putNode(node: MemoryNode): void {
    this.nodes.set(node.id, node);
    this.saveToDisk();
  }

  public getNode(id: string): MemoryNode | undefined {
    return this.nodes.get(id);
  }

  public deleteNode(id: string): boolean {
    const deleted = this.nodes.delete(id);
    this.relations = this.relations.filter((r) => r.fromId !== id && r.toId !== id);
    if (deleted) this.saveToDisk();
    return deleted;
  }

  public getAllNodes(): MemoryNode[] {
    return Array.from(this.nodes.values());
  }

  public addRelation(relation: MemoryRelation): void {
    this.relations.push(relation);
    this.saveToDisk();
  }

  public getRelations(): MemoryRelation[] {
    return this.relations;
  }

  public clear(): void {
    this.nodes.clear();
    this.relations = [];
    this.saveToDisk();
  }
}
