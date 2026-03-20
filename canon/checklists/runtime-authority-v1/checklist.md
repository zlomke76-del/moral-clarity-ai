# Runtime Authority Checklist (v1.0)

**Status:** Active  
**Classification:** Canonical Evaluation Aid  
**Audience:** Executives, risk leaders, compliance teams, regulators, auditors  
**Scope:** Regulated and high-consequence AI deployments  

---

## Purpose

This checklist evaluates whether an AI system possesses **runtime authority** — the enforceable ability to limit, refuse, pause, or escalate its own behavior at the moment of action.

It is designed to be used **before deployment or scale-up**, not as a post-incident justification.

This document defines **outcome-level requirements only**.  
It does **not** prescribe technical architecture, model choice, or implementation details.

Unchecked items indicate **deployment-blocking risk**.

---

## 1. Authority & Scope

- Are the system’s allowed domains of action defined in **measurable, runtime-enforceable terms**?
- Are there explicit boundaries on what the system is **not permitted** to do?
- Are these limits enforced **at runtime**, not only documented in policy?
- Can the system detect when a request falls **outside its authorized scope**?

**Failure signal:**  
The system attempts to answer or act outside its intended jurisdiction.

---

## 2. Stop, Refuse, Escalate

- Can the system explicitly **refuse** to respond when confidence is insufficient?
- Are there defined, testable thresholds that trigger **refusal, pause, or escalation**?
- Can the system escalate to a **human reviewer** when limits are reached?
- Is refusal treated as a **valid, expected outcome** — not an error state?

**Failure signal:**  
The system proceeds by default, filling gaps with plausible output.

---

## 3. Uncertainty Handling

- Does the system detect and quantify **uncertainty at runtime**?
- Are uncertainty thresholds **testable and reviewable**?
- Does rising uncertainty **reduce or suspend system action**, rather than merely producing cautionary language?
- Can the system halt output when uncertainty crosses a defined boundary?

**Failure signal:**  
The system continues operating under uncertainty with no behavioral change.

---

## 4. Predictability Under Stress

- Does the system behave **consistently** under edge cases or adversarial inputs?
- Can the system be stress-tested in **production-relevant conditions** without bypassing safeguards?
- Are adversarial and edge-case scenarios part of **testing practice and outcome review**?
- Are failure modes known, documented, and **intentionally designed**?

**Failure signal:**  
The system becomes more permissive or erratic under stress.

---

## 5. Explainability & Reconstruction

- Can the system explain **why** it responded, refused, or escalated?
- Are decisions traceable to **inputs, thresholds, and rules** in effect at the time?
- Can behavior be **reconstructed after an incident**?
- Is explanation output targeted for **technical and regulatory oversight**, enabling forensic review?

**Failure signal:**  
Explanations rely on generic statements rather than specific causes.

---

## 6. Memory & Continuity Controls

- Does the system retain information **deliberately rather than by default**?
- Is memory classified and governed?
- Can memory be **reviewed, corrected, or constrained**?
- Is long-term drift **monitored and addressed**?
- Are there scheduled processes for **memory audit, correction, and decommissioning**?

**Failure signal:**  
The system accumulates unreviewed memory that affects future behavior.

---

## 7. Oversight & Governance Alignment

- Is system behavior **inspectable** by compliance or risk teams?
- Are authority limits aligned with **regulatory and organizational requirements**?
- Can oversight bodies **directly test** refusal and stop conditions?
- Is there an interface or protocol allowing authorized oversight to **invoke or simulate halt, refusal, or escalation**?

**Failure signal:**  
Oversight exists only at policy or documentation level.

---

## Bottom Line

Runtime authority is **not an enhancement**.  
It is a **prerequisite** for trust, defensibility, and long-term viability.

Each unchecked item represents a **mitigation requirement** that should be resolved **before deployment or scale-up**.

---

## Canonical Notes

- This checklist is **fixed at publication**.
- Revisions require explicit versioning.
- Interpretations are **out of scope** for this document.

