# Near-Zero-Cost Infrastructure Plan

## Objective

Launch the Prism MVP with an infrastructure cost floor close to zero while preserving a clean migration path. This is not a promise of unlimited free hosting. Free-tier capacity, regional availability, provider policy, domain fees, backups, and growth can create costs.

## Reference topology

```text
Browser
  -> Cloudflare Free
  -> Oracle Cloud Always Free VM
  -> Nginx
  -> PHP-FPM
  -> MariaDB on the same VM
```

Use one VM for the MVP. Do not add Redis, a managed database, object storage, a queue service, Kubernetes, or a separate analytics pipeline before measured load requires it.

## Current free-tier planning assumption

Plan for an Oracle Ampere A1 allocation of up to 2 OCPUs and 12 GB RAM in total for Always Free use. Treat capacity as subject to region availability and provider policy. Do not base the business model on a previously advertised 4 OCPU and 24 GB figure.

Use Cloudflare Free for DNS, Universal SSL, CDN caching of public static assets, and baseline DDoS protection. Dynamic vote, comment, moderation, and admin traffic will still reach the origin.

## Cost boundaries

The following may not remain free:

- Public domain registration and renewal
- Off-site backups
- Email delivery
- SMS or identity verification
- AI APIs
- Large media storage
- Monitoring retention
- Additional bandwidth or compute after growth

For an invite-only validation run, a temporary hostname can be used. A public launch should use an owned domain and HTTPS.

## Local development

Use Docker Compose for repeatable local development:

- Nginx
- PHP-FPM
- MariaDB 11.8

Do not use the production VM as the primary development environment.

## Production baseline

- Ubuntu LTS or another currently supported Linux distribution
- Nginx and PHP-FPM
- MariaDB bound to localhost only
- SSH key authentication only
- Root login disabled
- Host firewall allowing only required ports
- Cloudflare proxy enabled for the public web hostname
- Daily logical database backup
- Weekly restore test during MVP validation
- Application logs with rotation and no raw visitor tokens
- Secrets outside Git

## ARM compatibility gate

Oracle Ampere instances use ARM. Before deployment verify that:

- The selected PHP packages are architecture independent or ARM compatible
- Container images support `linux/arm64`
- Any native extensions build successfully on ARM
- Playwright E2E runs in CI or on a compatible test environment if production does not need browser binaries

## Cache policy

Cache only public and non-personalized assets at first:

- CSS
- JavaScript
- Images
- Public Open Graph images

Do not edge-cache vote results, personalized states, admin pages, CSRF tokens, or comment submission responses without an explicit cache design.

## Backup policy

A free server without a tested backup is not a business platform.

Minimum MVP policy:

1. Create a daily encrypted database dump.
2. Keep at least seven daily copies.
3. Store at least one copy outside the production VM.
4. Document a restore command.
5. Run a restore drill before public launch.

If off-site backup cannot be provided at zero cost, treat it as the first justified operating expense.

## Observability without a paid stack

Start with:

- Nginx access and error logs
- PHP application logs
- MariaDB slow query log with a conservative threshold
- A simple health endpoint that does not expose secrets
- GA4 for user behavior where consent requirements are satisfied
- Scheduled database integrity queries from `database/integrity_audit.sql`

Do not collect more personal data merely to improve observability.

## Scaling triggers

Do not scale because of imagined traffic. Revisit the architecture when one or more measured conditions persist:

- Origin CPU saturation
- Memory pressure or swap use
- Database lock waits
- Slow query growth
- P95 page latency above the agreed target
- Disk usage above 70 percent
- Backup duration or restore time outside the recovery objective
- A single popular topic creating write contention
- Moderation volume exceeding the operator's capacity

Potential next steps are query optimization, cached public counters, a read replica or managed database, object storage for media, or a queue for non-critical jobs. WebSocket infrastructure is not an automatic next step.

## Failure policy

If the free VM is reclaimed or unavailable, the project must be recoverable from Git, environment templates, database backups, and the deployment runbook. Provider-specific convenience must not become an undocumented dependency.

## Decision

The MVP optimizes for low fixed cost and reversibility rather than unlimited scale. Revenue validation comes before infrastructure expansion. Reliability and recoverability still take priority over preserving a literal zero-dollar bill.
