# Contributing to BimaNyaya

Thank you for your interest in contributing to **BimaNyaya (बीमान्याय)**! This document outlines our development standards and contribution guidelines.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all contributors and maintainers with respect.

---

## How to Contribute

### 1. Reporting Bugs
- Search existing issues to ensure the bug hasn't already been reported.
- If not, open a new issue with a clear title, description, steps to reproduce, expected vs actual behavior, and environment details.

### 2. Suggesting Enhancements
- Open a feature request issue detailing the motivation, proposed solution, and potential impact on existing workflows.

### 3. Submitting Pull Requests
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Implement your changes following our coding conventions.
3. Write or update tests covering your changes:
   - Frontend: `apps/web/src/**/__tests__/*.test.tsx`
   - Go API: `apps/api/internal/**/*_test.go`
   - Python AI-Worker: `apps/ai-worker/tests/test_*.py`
4. Run the entire test suite locally:
   ```bash
   npm test
   ```
5. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```text
   feat(api): implement IRDAI 2024 cashless mandate check
   ```
6. Push to your fork and submit a Pull Request targeting `main`.

---

## Coding Standards

- **TypeScript / React**: Use strict TypeScript without `any`. Follow modern functional React patterns with hooks.
- **Go**: Adhere to standard Go idioms (`gofmt`, `go vet`). Handle all errors explicitly.
- **Python**: Follow PEP 8 style guidelines and type annotations with Pydantic models.
- **Convex**: Follow the guidelines in `convex/_generated/ai/guidelines.md`. Always provide runtime validators (`v.string()`, etc.).
