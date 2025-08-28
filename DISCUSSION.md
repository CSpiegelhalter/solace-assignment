# Improvements I Would Make With More Time
1. Search performance

Currently using multiple ILIKE conditions for fuzzy matching. This is fine for small datasets, but it has drawbacks like:

- Scaling: Each ILIKE '%term%' requires a sequential scan without indexes. With large datasets, this can become very slow.
- Poor ranking: Results aren’t scored by relevance, so someone searching for "John Smith" may get noisy matches.

## Better options:

### Postgres Full Text Search (tsvector):

- Allows stemming (so "issue" matches "issues").
- Supports ranking (ts_rank) so results are ordered by relevance, not just alphabetically.
- Uses GIN indexes, making queries much faster at scale.
- Good tradeoff if staying inside Postgres.

### Elasticsearch / OpenSearch:

- Designed for advanced text search (fuzzy matches, synonyms, typo tolerance).
- Better if we need cross-field scoring, autocomplete, or very large datasets.

Tradeoff: adds operational overhead (extra infra to maintain).

2. Pagination strategy

- Currently using offset pagination. This is simple and fine for smaller datasets, but can get expensive with large OFFSET values (Postgres still scans through skipped rows).
- Could improve with cursor-based pagination using (last_name, first_name, id) as a stable cursor. Much more efficient for infinite scroll UIs.


3. Frontend improvements

- The mobile and desktop layouts are split, but the table could use sorting and column resizing.
- The mobile card view could support collapsible sections for specialties or contact info.
- Add skeleton loaders for a polished feel.

4. Testing

- Unit tests for the GET /api/advocates route (pagination edge cases, invalid query params, etc).
- Snapshot tests for the components (MobileCard, DesktopTable).
- Integration tests against a seeded Postgres database.

5. Security & Validation

- Add rate limiting (avoid abuse of search endpoint).
- Sanitize and constrain search input more aggressively (prevent extremely broad queries).
- Add row-level security if advocates data is multi-tenant.

6. Observability

- Enable Drizzle’s built-in query logging for debugging.
- Add structured logging with request IDs.
- Expose metrics (total queries, latency, cache hit rate) if deployed in production.