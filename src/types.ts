export type MemoryType = 'fact' | 'preference' | 'entity' | 'rule' | 'episodic';

export interface MemoryNode {
  id: string;
  type: MemoryType;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  accessCount: number;
  importance: number; // 1 to 10
}

export interface MemoryRelation {
  fromId: string;
  toId: string;
  relationType: string;
  weight: number;
}

export interface DshMemoryPluginConfig {
  /**
   * Storage file path for persistent memories.
   * Default: ~/.dsh/memory.json
   */
  storagePath?: string;

  /**
   * Maximum memories returned per recall query.
   * Default: 5
   */
  maxRecallResults?: number;

  /**
   * Auto-inject relevant memories into agent prompt context.
   * Default: true
   */
  autoInjectContext?: boolean;
}
