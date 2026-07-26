# Students Project: GitHub Actions and AWS Setup

This document is the operational guide for building the NestJS application and pushing the students image to Amazon ECR.

The current phase ends at ECR. ECS, RDS, Secrets Manager, and production networking are the next deployment phase and must not be mixed into the image-build role.

## Fixed project values

| Item | Value |
| --- | --- |
| GitHub owner | `YaswanthYss03` |
| GitHub repository | `nest-crud-demo` |
| Deployment branch | `manish-awsdeploy/students` |
| AWS account ID | `<AWS_ACCOUNT_ID>` |
| AWS region | `us-east-1` |
| ECR repository | `students-nestjsapi` |
| IAM role | `github-students-ecr-role` |
| Image platform | `linux/amd64` |

If any of these values change, update the IAM trust policy, GitHub variables, ECR policy, and workflow together.

## Phase 1: AWS ECR repository

Create or verify a private ECR repository with this configuration:

- Repository name: `students-nestjsapi`
- Region: `us-east-1`
- Image tag mutability: `Immutable`
- Scan on push: enabled
- Encryption: AES-256 or an approved customer-managed KMS key
- Repository visibility: private

The workflow pushes immutable commit-SHA tags. It intentionally does not overwrite `latest`.

## Phase 2: AWS GitHub OIDC provider

In AWS Console, open `IAM → Identity providers` and create an OpenID Connect provider:

- Provider URL: `https://token.actions.githubusercontent.com`
- Audience: `sts.amazonaws.com`

Do not create AWS access keys for GitHub Actions.

## Phase 3: IAM role trust policy

Create this role:

```text
github-students-ecr-role
```

Use this trust relationship. It permits only the configured repository and branch to assume the role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GitHubActionsStudentsRepository",
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:YaswanthYss03/nest-crud-demo:ref:refs/heads/manish-awsdeploy/students"
        }
      }
    }
  ]
}
```

The role ARN is:

```text
arn:aws:iam::<AWS_ACCOUNT_ID>:role/github-students-ecr-role
```

## Phase 4: IAM ECR push policy

Create a customer-managed or inline policy and attach only this policy to `github-students-ecr-role`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EcrAuthorization",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "*"
    },
    {
      "Sid": "StudentsEcrPush",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart"
      ],
      "Resource": "arn:aws:ecr:us-east-1:<AWS_ACCOUNT_ID>:repository/students-nestjsapi"
    }
  ]
}
```

Do not attach `AdministratorAccess`, `AmazonEC2ContainerRegistryFullAccess`, ECS, RDS, S3, or Secrets Manager permissions to this build role.

## Phase 5: GitHub repository variables

Open `GitHub → Settings → Secrets and variables → Actions → Variables` and add these repository variables:

```text
AWS_REGION=us-east-1
ECR_REPOSITORY=students-nestjsapi
IMAGE_PLATFORM=linux/amd64
AWS_ROLE_TO_ASSUME=arn:aws:iam::<AWS_ACCOUNT_ID>:role/github-students-ecr-role
```

For the current ECR-only workflow, add no GitHub Secrets.

Do not store these as GitHub Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL`

Database credentials belong in AWS Secrets Manager when ECS is introduced.

## Phase 6: Docker build files

The repository must contain these root-level files:

```text
Dockerfile
.dockerignore
```

The Dockerfile must:

- Install dependencies with `npm ci`.
- Generate Prisma Client during the build.
- Build with `npm run build`.
- Run with `node dist/main`.
- Keep runtime database credentials outside the image.
- Run the production process as a non-root user.

The current Prisma configuration requires `DIRECT_URL` during client generation. The Docker build uses a dummy build-time URL; it does not connect to production and does not contain production credentials.

## Phase 7: GitHub Actions workflow

The workflow file is `.github/workflows/DeployApp.yml` and must contain these important settings:

```yaml
on:
  push:
    branches:
      - manish-awsdeploy/students
  workflow_dispatch:

permissions:
  contents: read
  id-token: write
```

The workflow must use:

```yaml
uses: aws-actions/configure-aws-credentials@v4
```

with:

```yaml
role-to-assume: ${{ vars.AWS_ROLE_TO_ASSUME }}
aws-region: ${{ env.AWS_REGION }}
```

It must log in using:

```yaml
uses: aws-actions/amazon-ecr-login@v2
```

and push an image tagged with:

```text
${{ github.sha }}
```

## Phase 8: First deployment test

Check the current branch:

```bash
git branch --show-current
```

It must output:

```text
manish-awsdeploy/students
```

Commit and push the deployment files:

```bash
git add Dockerfile .dockerignore .github/workflows/DeployApp.yml src/students/doc
git commit -m "configure students ecr deployment"
git push origin manish-awsdeploy/students
```

Then open `GitHub → Actions → Build and Push Students Image`.

Expected job sequence:

1. Checkout repository.
2. Assume the AWS role through GitHub OIDC.
3. Log in to Amazon ECR.
4. Build the Docker image.
5. Generate Prisma Client.
6. Build the NestJS application.
7. Push the image to ECR.

Expected image format:

```text
<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/students-nestjsapi:<commit-sha>
```

## Failure diagnosis

### `Not authorized to perform sts:AssumeRoleWithWebIdentity`

Check:

- OIDC provider URL is exact.
- Audience is `sts.amazonaws.com`.
- Trust policy repository is `YaswanthYss03/nest-crud-demo`.
- Trust policy branch is `manish-awsdeploy/students`.
- GitHub variable contains the complete role ARN.

### `AccessDeniedException` from ECR

Check:

- ECR region is `us-east-1`.
- Repository is `students-nestjsapi`.
- The ECR policy is attached to `github-students-ecr-role`.
- The repository ARN matches the policy exactly.

### Dockerfile not found

Check that `Dockerfile` is at the repository root and was committed to the deployment branch.

### Docker build fails during Prisma generation

Check that these files are present at the repository root:

```text
prisma.config.ts
prisma/schema.prisma
```

## Phase 9: Next AWS production phase

After ECR succeeds, create separate resources and roles for ECS:

- ECS task execution role for pulling from ECR and writing CloudWatch logs.
- ECS task role for application runtime permissions.
- ECS Fargate service across multiple Availability Zones.
- Application Load Balancer with HTTPS.
- RDS PostgreSQL in private subnets.
- AWS Secrets Manager for `DATABASE_URL` and application secrets.
- CloudWatch logs, metrics, alarms, and dashboards.
- Prisma migration deployment before application rollout.

The GitHub ECR push role must not be reused as the ECS task execution role or application task role.

## Completion criteria

This ECR phase is complete when:

- GitHub Actions passes.
- The image exists in `students-nestjsapi`.
- The image has a commit-SHA tag.
- No long-lived AWS credentials are stored in GitHub.
- The IAM role is restricted to the exact repository and branch.
- The ECR policy is restricted to the exact repository.
- The Docker image build succeeds in CI.
