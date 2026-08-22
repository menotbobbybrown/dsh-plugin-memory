#!/usr/bin/env node

import { MemoryStore } from './store.js';
import { MemoryEngine } from './memory-engine.js';

export async function runCli(argv: string[]): Promise<void> {
  const args = argv.slice(2);
  const command = args[0] || 'help';

  const store = new MemoryStore();
  const engine = new MemoryEngine(store);

  switch (command) {
    case 'list': {
      const nodes = engine.listAll();
      console.log(`\n🧠 DeepSeek Harness Long-Term Memories (${nodes.length}):\n`);
      if (nodes.length === 0) {
        console.log('  No memories stored yet. Run: dsh-memory add "<fact>" to remember something.\n');
        return;
      }
      for (const node of nodes) {
        console.log(`  • [${node.id}] (${node.type.toUpperCase()}) ${node.content}`);
        if (node.tags.length) console.log(`    Tags: ${node.tags.join(', ')}`);
      }
      console.log('');
      break;
    }

    case 'add':
    case 'remember': {
      const content = args[1];
      if (!content) {
        console.error('Error: Content is required.');
        console.error('Usage: dsh-memory add "<fact/preference>" [--type fact|preference|rule] [--tags tag1,tag2]');
        process.exit(1);
      }
      const typeIdx = args.indexOf('--type');
      const type = typeIdx !== -1 ? args[typeIdx + 1] : 'fact';
      const tagsIdx = args.indexOf('--tags');
      const tags = tagsIdx !== -1 ? args[tagsIdx + 1].split(',') : [];

      const node = engine.remember(content, { type: type as any, tags });
      console.log(`\n✅ Remembered: [${node.id}] ${node.content}\n`);
      break;
    }

    case 'search':
    case 'recall': {
      const query = args[1];
      if (!query) {
        console.error('Error: Query is required.');
        console.error('Usage: dsh-memory search "<query>"');
        process.exit(1);
      }
      const results = engine.recall(query);
      console.log(`\n🔍 Search results for "${query}" (${results.length}):\n`);
      for (const res of results) {
        console.log(`  • [Score: ${res.score.toFixed(2)}] (${res.node.type}) ${res.node.content}`);
      }
      console.log('');
      break;
    }

    case 'forget':
    case 'delete': {
      const id = args[1];
      if (!id) {
        console.error('Error: Memory ID is required.');
        console.error('Usage: dsh-memory forget <id>');
        process.exit(1);
      }
      if (engine.forget(id)) {
        console.log(`\n🗑️ Forgot memory [${id}].\n`);
      } else {
        console.warn(`\n⚠️ Memory [${id}] not found.\n`);
      }
      break;
    }

    case 'help':
    default: {
      console.log(`
dsh-memory - DeepSeek Harness Long-Term Memory CLI

Usage:
  dsh-memory list
      List all stored memory nodes.

  dsh-memory add "<content>" [--type fact|preference|rule] [--tags tag1,tag2]
      Store a new memory.

  dsh-memory search "<query>"
      Search and recall memories by semantic relevance.

  dsh-memory forget <id>
      Delete a specific memory node.
      `);
      break;
    }
  }
}

const isDirectExecution =
  typeof process !== 'undefined' &&
  Boolean(
    process.argv[1] &&
      (process.argv[1].endsWith('cli.js') ||
        process.argv[1].endsWith('cli.cjs') ||
        process.argv[1].endsWith('dsh-memory'))
  );

if (isDirectExecution) {
  runCli(process.argv).catch((err) => {
    console.error('Fatal CLI Error:', err);
    process.exit(1);
  });
}
