# Sanket Setu — RAG Knowledge Base

## Objective

Build a small and trustworthy government-information
knowledge base for the Sanket Setu RAG system.

## RAG Flow

User Query
    ↓
Query Embedding
    ↓
Vector Retrieval
    ↓
Top-K Relevant Chunks
    ↓
Context
    ↓
LLM
    ↓
Grounded Answer + Source

## Knowledge Base Services

1. Pension
2. Scholarship
3. Disability Certificate
4. UDID

## Metadata

Each knowledge-base chunk contains:

- title
- service
- section
- content
- source_url
- source_type
- last_checked

## Source Policy

Primary sources should be official government
websites or official government departments.

## Chunking Strategy

Documents are divided according to meaningful
semantic sections such as:

- Eligibility
- Required Documents
- Application Process
- Benefits

## Grounding Rule

The LLM should answer factual questions using
retrieved knowledge-base context.

If verified information is unavailable,
the system should not guess.