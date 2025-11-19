# API Contracts (Medicaid Community Engagement POC)

All endpoints are under `/api/v1` and require JWT-based authentication unless explicitly noted.

## Common

- Header: `Authorization: Bearer <token>`
- Standard response envelope:

```json
{
  "data": { },
  "error": {
    "code": null,
    "message": null
  }
}
```

## Entities

### Beneficiary

- `id` (uuid)
- `tenant_id` (uuid)
- `medicaid_id` (string)
- `first_name` (string)
- `last_name` (string)
- `engagement_status` (string: 'active' | 'non_compliant' | 'exempt' | 'unknown')
- `created_at`, `updated_at`

### Employment Activity

- `id` (uuid)
- `beneficiary_id` (uuid)
- `tenant_id` (uuid)
- `employer_name` (string)
- `hours_worked` (number)
- `activity_date` (date)
- `verification_status` (string: 'pending' | 'verified' | 'failed')
- `created_at`, `updated_at`

## Example Endpoints

### GET /api/v1/beneficiaries

Returns a paginated list of beneficiaries for the tenant.

**Query Params**

- `page` (number, optional, default 1)
- `pageSize` (number, optional, default 20)
- `search` (string, optional)

**Response**

```json
{
  "data": {
    "items": [ { /* Beneficiary */ } ],
    "page": 1,
    "pageSize": 20,
    "total": 42
  },
  "error": null
}
```

### POST /api/v1/beneficiaries/:id/employment-activities

Creates a new employment activity for a beneficiary.

**Request Body**

```json
{
  "employer_name": "ACME Corp",
  "hours_worked": 20,
  "activity_date": "2025-01-15"
}
```

**Response**

```json
{
  "data": {
    "id": "uuid",
    "verification_status": "pending"
  },
  "error": null
}
```

### POST /api/v1/employment-activities/:id/verify

Triggers an employment verification with the configured provider.

**Response**

```json
{
  "data": {
    "id": "uuid",
    "verification_status": "pending"
  },
  "error": null
}
```

### POST /api/v1/webhooks/employment

Employment verification vendor webhook endpoint.

- Validates signature and payload.
- Normalizes payload to an internal event.
- Updates relevant employment activity records.

**Response**

- `200 OK` with empty `data` on success.
