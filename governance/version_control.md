---
project: "Moral Clarity AI"
title: "Governance & Version Control Guidelines"
author: "Timothy Zlomke"
version: "v1.0"
issued: "2026-01-01"
license: "Moral Clarity AI Stewardship License"
related_version: null
status: "canon"
---

# Moral Clarity AI • Governance & Version Control Guidelines v1  
*Defines ratification, change management, and archival standards for all doctrinal and operational documents.*

---

## 0) Purpose
This document establishes the governing process for issuing, amending, and archiving official Moral Clarity AI materials.  
Its aim is to protect **continuity, authorship integrity, and moral fidelity** across all canonical documents.

These rules exist to prevent:
- Silent drift  
- Fragmented authorship  
- Retroactive reinterpretation  
- Tool-driven mutation of doctrine  

---

## 1) Scope
These rules apply to all files under `/docs`, `/core`, `/governance`, `/tools`, and any directory containing:
- “canon”, “policy”, “charter”, “spec”, or “stewardship” in its filename, or  
- YAML front-matter declaring `project: "Moral Clarity AI"`.

They apply equally to:
- Human-authored documents  
- AI-assisted drafts  
- Generated artifacts that influence behavior, governance, or ethics  

---

## 2) Roles & Responsibilities

| Role | Authority | Primary Duties |
|------|------------|----------------|
| **Founder (Timothy Zlomke)** | Final moral and structural authority | Approves Canon-level documents; resolves interpretive disputes |
| **Model Steward(s)** | Editorial and compliance oversight | Ensure Canon alignment; perform checksum verification; block drift |
| **Contributors** | Proposal and drafting authority | Submit changes with full metadata, rationale, and Canon references |

No automated system may self-ratify or modify Canon-scoped documents.

---

## 3) Document Lifecycle

### 3.1 Creation
All new documents must:
1. Include YAML front-matter with:  
   - `title`  
   - `author`  
   - `version`  
   - `issued` (ISO-8601)  
   - `license`  
   - `related_version` (if applicable)  
2. Use suffix `-draft.md` until ratified  
3. Be submitted via pull request labeled:
   - `Canon Proposal` **or**
   - `Policy Proposal`  
4. Pass CI checks:
   - `canon-lint`
   - Metadata completeness
   - Canon reference validation

---

### 3.2 Ratification
A document becomes **official** only when **all** conditions are met:
- Explicit approval by **Timothy Zlomke**
- Explicit approval by **one Model Steward**
- CI confirms Canon alignment with **zero failed Canon tags**

#### Required Commit Message Format
