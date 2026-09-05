# Security Policy & Vulnerability Reporting

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

The BimaNyaya team takes security vulnerabilities seriously. If you discover a vulnerability or security flaw, please **do not open a public GitHub issue**.

Instead, please send a responsible disclosure email to **security@bimanyaya.in** or contact the repository owner directly.

### What to include in your report:
- Type of issue (e.g., Auth bypass, SQL/Injection, XSS, PII leakage, DoS vulnerability).
- Step-by-step instructions to reproduce the issue.
- Potential impact and proof of concept (PoC) if available.

We will acknowledge receipt of your vulnerability report within 48 hours and work with you to remediate the issue promptly.

---

## Security Architecture Highlights

- **Asymmetric Token Verification**: Uses RS256 public key caching via Clerk JWKS endpoints.
- **Request Size Boundaries**: All endpoints strictly cap incoming body payloads at 10MB.
- **PII Scrubbing**: Automated regex redact guards for Aadhaar, PAN, and phone numbers.
- **Zero Raw Secret Logging**: Structured JSON logger (`slog`) ensures authentication tokens and keys are never printed to stdout.
