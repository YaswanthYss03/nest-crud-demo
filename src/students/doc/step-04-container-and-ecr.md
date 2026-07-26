# Step 04: Container and ECR Build Preparation

## Status

Implementation complete; Docker runtime validation is pending on a machine with Docker available.

## Changes

- Added a multi-stage root `Dockerfile` for the NestJS production process.
- Generated Prisma Client during the build using a non-production build-time URL.
- Kept database credentials out of the image; runtime credentials must be supplied by ECS later.
- Runs the production container as the non-root `node` user.
- Added `.dockerignore` to reduce build context and prevent environment files from entering the image.
- Updated the students workflow path filter to include all Docker, Prisma, TypeScript, and build configuration inputs.

## Verification

- `npm.cmd run build` passed.
- `docker build --tag students-ecr-check .` could not run because Docker is unavailable or blocked in the current environment.

## Remaining action

Run the Docker build locally or through GitHub Actions before treating the container stage as production-verified.
