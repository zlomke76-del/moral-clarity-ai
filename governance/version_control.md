# Moral Clarity AI • Governance & Version Control Guidelines v1
*Defines ratification, change management, and archival standards for all doctrinal and operational documents.*

---

## 0) Purpose
This document establishes the governing process for issuing, amending, and archiving official Moral Clarity AI materials.  
Its aim is to protect **continuity, authorship integrity, and moral fidelity** across all canonical documents.

---

## 1) Scope
These rules apply to all files under `/docs`, `/core`, `/governance`, `/tools`, and any directory containing:
- “canon”, “policy”, “charter”, “spec”, or “stewardship” in its filename, or  
- YAML front-matter declaring `project: "Moral Clarity AI"`.

---

## 2) Roles & Responsibilities
| Role | Authority | Primary Duties |
|------|------------|----------------|
| **Founder (Timothy Zlomke)** | Final moral and structural authority. | Approves Canon-level documents; resolves interpretive disputes. |
| **Model Steward(s)** | Editorial and compliance oversight. | Ensure changes align with Canon, perform checksum verification. |
| **Contributors** | Draft and propose updates. | Submit pull requests with full metadata and Canon references. |

---

## 3) Document Lifecycle

### 3.1. Creation
1. All new documents must include YAML front-matter with:  
   - `title`, `author`, `version`, `issued`, `license`, and `related_version`.  
2. Drafts use suffix `-draft.md`.  
3. A pull request labeled `Canon Proposal` or `Policy Proposal` is required.  
4. CI must pass `canon-lint` and metadata validation.

### 3.2. Ratification
A document becomes **official** when:
- It receives one approval from **Timothy Zlomke**, and  
- One from a designated **Model Steward**, and  
- CI confirms Canon alignment (no failed Canon tags).

The commit message must follow:
