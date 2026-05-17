# Backend

This is the Express/MongoDB backend for Event Hub.

## Admin bootstrap

If there is no admin user in the database, the server will automatically create or promote one at startup when the following environment variables are set:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME` (optional)

Example:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecureAdminPassword123!
ADMIN_NAME=EventHub Admin
```

If an account already exists with the configured email, it will be promoted to the `admin` role.
