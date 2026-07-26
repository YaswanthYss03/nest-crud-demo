# Step 00: Production Implementation Roadmap

## Objective

Define a repeatable, measurable path for taking the students module toward production readiness without making unrelated changes outside the module scope.

## Planned sequence

1. Stabilize the API contract, validation, and error behavior.
2. Add meaningful unit and integration tests for all CRUD paths.
3. Add pagination, typed query filters, database indexes, and query measurements.
4. Run the service and PostgreSQL locally in a production-like Docker setup.
5. Provision AWS staging infrastructure with private networking and least-privilege IAM.
6. Build GitHub Actions CI/CD using short-lived AWS OIDC credentials.
7. Load-test the module, test failure scenarios, and complete a production-readiness review.

## Target deployment shape

- NestJS container on Amazon ECS Fargate.
- Application Load Balancer for HTTPS traffic and health checks.
- PostgreSQL on Amazon RDS in private subnets.
- Multi-AZ database deployment for production availability.
- Amazon ECR for immutable application images.
- AWS Secrets Manager for database and application secrets.
- CloudWatch logs, metrics, alarms, and dashboards.
- Route 53 and ACM for DNS and TLS.
- GitHub Actions with AWS IAM OIDC for deployment authentication.

RDS Proxy, read replicas, ElastiCache, WAF, and CloudFront remain conditional additions. They will be introduced only when requirements or measured bottlenecks justify them.

## Completion standard

A step is complete only when:

- The implementation is finished.
- Relevant tests pass.
- The behavior is documented.
- Risks and follow-up work are recorded.
- A new step record is added under this directory.

## Current status

Step 00 is complete. Step 01 is the next implementation checkpoint.
