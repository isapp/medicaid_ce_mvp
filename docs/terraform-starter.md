# Terraform Starter Notes

Recommended modules for production-like environments:

- `networking/` – VPC, subnets, security groups.
- `ecs/` – ECS cluster, services, task definitions for backend.
- `rds/` – Postgres instance.
- `iam/` – Roles and policies for ECS tasks and CI/CD.

For the POC, Terraform is optional. Start with Docker Compose locally, then promote to Terraform as needed.
