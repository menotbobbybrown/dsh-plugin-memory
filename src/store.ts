import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { MemoryNode, MemoryRelation } from './types.js';

export class MemoryStore {
  private filePath: string;
  private nodes: Map<string, MemoryNode> = new Map();
  private relations: MemoryRelation[] = [];

  constructor(customPath?: string) {
    this.filePath =
      customPath || path.join(os.homedir(), '.dsh', 'memory.json');
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.nodes)) {
          for (const node of data.nodes) {
            this.nodes.set(node.id, node);
          }
        }
        if (Array.isArray(data.relations)) {
          this.relations = data.relations;
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
