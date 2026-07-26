# Step 01: API Contract, Validation, and Error Behavior

## Status

Complete.

## Changes

- Added `StudentsQueryDto` for `search` and `department` query parameters.
- Trimmed query values and limited them to 100 characters.
- Rejected empty `PATCH /students/:id` request bodies.
- Mapped Prisma unique-constraint errors (`P2002`) to HTTP `409 Conflict`.
- Added focused service tests for empty updates and duplicate-email behavior.

## Production reasoning

- Query parameters now have an explicit contract instead of being accepted as untyped controller arguments.
- Empty updates fail at the application boundary rather than reaching the database as a no-op.
- Duplicate email behavior is consistent for both create and update operations when the database has the expected unique constraint.
- The database constraint remains authoritative; application checks alone would be vulnerable to concurrent requests.

## Verification

- `npm.cmd test -- --runInBand src/students/students.service.spec.ts src/students/students.controller.spec.ts`
- Result: 2 test suites passed, 4 tests passed.
- The repository-wide type-check/build remains a later validation task.

## Remaining risks

- Pagination is not implemented yet; `GET /students` can still return an unbounded result set.
- Query filtering still uses an untyped Prisma `where` object; this is addressed in Step 03.
- The application must enable NestJS `ValidationPipe` for DTO decorators to be enforced at runtime.
