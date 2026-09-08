# Contributing to @modelnorth/dsh-plugin-memory

Welcome! We are excited to have you contribute to `@modelnorth/dsh-plugin-memory` (Persistent Knowledge Graph & Long-Term Memory Plugin for DeepSeek Harness).

Whether you're fixing bugs, adding new MCP adapters, improving performance, writing documentation, or proposing new features — your contributions are welcome!

---

## 🌟 Quick Links

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Issue Tracker](https://github.com/menotbobbybrown/dsh-plugin-memory/issues)
- [Discussions & Roadmap](ROADMAP.md)

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: `>= 20.0.0` (Node 22 LTS recommended)
- **npm** or **pnpm**
- **Git**

### 2. Fork & Clone
```bash
# Fork the repo on GitHub, then clone your fork:
git clone https://github.com/<your-username>/dsh-plugin-memory.git
cd dsh-plugin-memory

# Install dependencies:
npm install
```

### 3. Build & Run Tests
```bash
# Run unit and integration tests
npm test

# Run TypeScript typechecks
npm run typecheck

# Build dual ESM & CJS distribution bundles
npm run build
```

---

## 🚀 How to Contribute

### 1. Finding Something to Work On
Look for open issues labeled:
- `good first issue` — Great starting points for newcomers.
- `help wanted` — Features or refactors that need extra hands.
- `bug` — Verified issues that need patches.

If you have a new feature idea, feel free to open a [Feature Request Issue](https://github.com/menotbobbybrown/dsh-plugin-memory/issues/new?template=feature_request.md) first to discuss architecture before writing code.

---

### 2. Developing Your Change

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Follow Coding & Architecture Guidelines:**
   - Write clean, modular TypeScript with strict type safety.
   - Ensure all public functions and classes have clear JSDoc docstrings.
   - Avoid external heavyweight dependencies — keep bundle sizes minimal.
   - Maintain security standards (prevent SSRF, path traversals, command injections, and input deserialization flaws).

3. **Add Automated Tests:**
   - Every bug fix must include a reproducing unit test in the `tests/` directory.
   - Every new feature must have high test coverage (>90%).
   - Verify that all tests pass locally:
     ```bash
     npm test
     npm run build
     ```

---

### 3. Submitting a Pull Request (PR)

1. **Commit your changes:**
   Use clear, conventional commit messages:
   - `feat: add support for streaming tool responses`
   - `fix: resolve edge-case in BM25 token allocation`
   - `docs: update quickstart instructions`
   - `test: add security unit test for path traversal`

2. **Push your branch to GitHub:**
   ```bash
   git push origin feat/your-feature-name
   ```

3. **Open a Pull Request:**
   - Go to your fork on GitHub and click **"Compare & pull request"**.
   - Fill out the provided [Pull Request Template](.github/pull_request_template.md).
   - Link any related issue (e.g. `Closes #12`).

4. **Code Review:**
   - Maintainers will review your PR, run CI/CD verification workflows, and provide feedback.
   - Once approved, your PR will be squash-merged into `main`!

---

## 📜 Code of Conduct
Please note that all participants in this project agree to abide by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

Thank you for building the future of autonomous AI agents with DeepSeek Harness! 🚀
