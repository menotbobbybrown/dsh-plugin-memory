# dsh-plugin-memory

> **Persistent Knowledge Graph & Long-Term Memory Plugin for DeepSeek Harness (`dsh`)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DeepSeek Harness](https://img.shields.io/badge/dsh-plugin-brightgreen.svg)](https://github.com/deepseek-ai/deepseek-harness)

`dsh-plugin-memory` gives DeepSeek Harness agents persistent long-term memory, episodic recall, and user preference tracking across multiple conversation sessions and workspace lifecycles.

---

## Features

- 🧠 **Long-Term Fact & Preference Storage**: Remember user coding preferences, architectural decisions, and project conventions.
- 🔍 **Semantic & Keyword Recall**: Ranked relevance matching retrieves the right context for the prompt.
- 💻 **CLI Management (`dsh-memory`)**: List, search, add, and forget memories directly from your terminal.
- 🧩 **Cordis Native**: Automatically exposes `memory_remember` and `memory_recall` tools to the agent.

---

## Installation

```bash
# Add from GitHub
dsh plugin --profile web add "github:menotbobbybrown/dsh-plugin-memory"
```

---

## CLI Usage

```bash
# List all remembered items
npx dsh-memory list

# Remember a new preference or fact
npx dsh-memory add "User prefers TypeScript and strict ESLint rules" --type preference --tags coding,style

# Search and recall
npx dsh-memory search "coding style"

# Delete a memory
npx dsh-memory forget <id>
```

---

## Programmatic Usage (Cordis API)

```typescript
import { Context } from 'cordis';
import * as MemoryPlugin from 'dsh-plugin-memory';

const ctx = new Context();
ctx.plugin(MemoryPlugin);

// Save to memory
ctx.memory.remember('Target database is PostgreSQL 16');

// Recall from memory
const results = ctx.memory.recall('database version');
```

---

## License

MIT © DeepSeek Harness Community
