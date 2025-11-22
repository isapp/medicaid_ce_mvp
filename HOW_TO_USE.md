# Medicaid Community Engagement MVP - User Guide

This guide provides instructions for accessing and using both the Admin Portal and Member Portal of the Medicaid Community Engagement application.

## Application URL

**Public Access:** https://continuity-orbit-months-potter.trycloudflare.com

---

## Admin Portal

### Accessing the Admin Portal

1. Navigate to: https://continuity-orbit-months-potter.trycloudflare.com/admin
2. You will be presented with the admin login screen

### Admin Login Credentials

**Administrator Account:**
- Email: `admin@demo.com`
- Password: `Admin123!`

**Case Worker Account:**
- Email: `worker@demo.com`
- Password: `Worker123!`

### Admin Portal Features

After logging in, you'll have access to:

- **Dashboard** - Overview of system activity and key metrics
- **Participants** - View and manage beneficiaries enrolled in the program
  - Search and filter beneficiaries
  - View detailed participant information
  - Track engagement status
- **Cases** - Manage community engagement cases
  - Create and assign cases
  - Track case progress
  - Document case activities
- **Broadcasts** - Send communications to beneficiaries
  - Create new broadcast messages
  - View broadcast history
- **Reporting** - Access analytics and reports
  - Engagement statistics
  - Compliance reports
  - Program metrics
- **Settings** - Configure application settings
- **Volunteer Network** - Manage volunteer opportunities

### Sample Data Available

The system includes 3 pre-loaded beneficiaries for testing:

1. **John Doe**
   - Medicaid ID: MCD-001-2024
   - Phone: 555-555-0101
   - Status: Pending Verification

2. **Jane Smith**
   - Medicaid ID: MCD-002-2024
   - Phone: 555-555-0102
   - Status: Verified

3. **Robert Johnson**
   - Medicaid ID: MCD-003-2024
   - Phone: 555-555-0103
   - Status: Not Engaged

---

## Member Portal

### Accessing the Member Portal

1. Navigate to: https://continuity-orbit-months-potter.trycloudflare.com/m
2. You will be presented with the member login screen

### Member Login Process

The member portal uses phone number verification for authentication:

1. **Enter Phone Number:**
   - Enter one of the test phone numbers below
   - Format: You can enter as `5555550101` or `555-555-0101` (both work)

2. **Enter Verification Code:**
   - The system will display a screen to enter a 6-digit code
   - For demo purposes, always use: `123456`
   - In production, this would be sent via SMS

3. **Access Dashboard:**
   - After successful verification, you'll be logged in and redirected to your dashboard

### Test Phone Numbers

Use any of these phone numbers to test the member portal:

- `555-555-0101` - John Doe
- `555-555-0102` - Jane Smith
- `555-555-0103` - Robert Johnson

**Verification Code (for all accounts):** `123456`

### Member Portal Features

After logging in, members can:

- **View Dashboard** - See overview of engagement activities
- **Employment Verification** - Submit employment documentation
- **Education Verification** - Submit education/training documentation
- **Volunteer/Community Service** - Log volunteer hours and activities
- **Request Exemption** - Submit exemption requests if unable to meet requirements

---

## Technical Information

### Architecture

- **Frontend:** React with TypeScript, served via Nginx
- **Backend:** Node.js with Express
- **Database:** PostgreSQL
- **Authentication:** JWT-based authentication
  - Admin: Email/password authentication
  - Member: Phone-based verification (SMS in production)

### API Endpoints

**Admin Authentication:**
- POST `/api/v1/auth/admin/login`

**Member Authentication:**
- POST `/api/v1/auth/member/request-code`
- POST `/api/v1/auth/member/verify-code`

**System Health:**
- GET `/health` - Root health check
- GET `/api/v1/health` - API health check

---

## Common Issues & Troubleshooting

### Issue: "Failed to fetch" error

**Solution:** The application requires the Cloudflare Tunnel to be running. Ensure the tunnel is active at the URL provided above.

### Issue: Login redirects to wrong portal

**Solution:** The application uses role-based routing. If you're logged in with one role and try to access the other portal, log out first:
- Clear browser localStorage
- Refresh the page
- Log in with the correct credentials

### Issue: Phone number not recognized

**Solution:** Only the three test phone numbers listed above are pre-loaded in the demo system:
- 555-555-0101
- 555-555-0102
- 555-555-0103

### Issue: Verification code not working

**Solution:** The demo system accepts only one verification code: `123456`

---

## Development Notes

### Demo vs Production

**Current Demo Configuration:**
- Verification codes are hardcoded to `123456`
- The request-code endpoint returns the code in the response (for testing)
- SSL/HTTPS is handled by Cloudflare Tunnel
- CORS is configured for the Cloudflare tunnel URL

**For Production Deployment:**
- Integrate Twilio or similar SMS service for real verification codes
- Remove the `demoCode` from API responses
- Generate random 6-digit codes with expiration
- Store verification codes securely (Redis recommended)
- Add rate limiting for code requests
- Implement code retry limits
- Configure proper SSL certificates
- Update CORS settings for production domain

### Running Locally

If running the application locally (without the tunnel):

1. Admin Portal: http://localhost:5173/admin
2. Member Portal: http://localhost:5173/m
3. API: http://localhost:4000

---

## Support

For issues or questions about the application:
- Check the GitHub repository for updates
- Review application logs via Docker: `docker-compose logs backend frontend`
- Verify all services are running: `docker-compose ps`

---

## Security Considerations

**Important Security Notes:**
- The demo credentials should be changed before any production use
- JWT secrets should be rotated and kept secure
- Phone verification codes should be truly random and expire quickly
- Implement rate limiting on authentication endpoints
- Add CAPTCHA for public-facing authentication
- Enable audit logging for all sensitive operations
- Follow HIPAA compliance guidelines for production deployments

---

## Quick Reference

### Login Quick Reference Table

| Portal | URL Path | Test Credential 1 | Test Credential 2 | Password/Code |
|--------|----------|-------------------|-------------------|---------------|
| Admin  | `/admin` | admin@demo.com    | worker@demo.com   | Admin123! / Worker123! |
| Member | `/m`     | 555-555-0101      | 555-555-0102      | 123456 |

---

**Last Updated:** November 21, 2025
**Version:** 1.0.0
