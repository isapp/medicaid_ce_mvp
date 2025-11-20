# Authentication Flows

This document defines the complete authentication and authorization implementation for both Admin and Member experiences.

## Overview

The application supports two distinct authentication flows:

- **Admin Authentication**: Email/password login for case workers and administrators
- **Member Authentication**: Phone-based SMS code verification for Medicaid beneficiaries

Both flows use JWT-based authentication with multi-tenant context derived from token claims.

## Technology Stack

- **Authentication**: JWT (JSON Web Tokens)
- **Token Storage**: localStorage for access tokens
- **Session Management**: Sliding session (30-minute timeout, extends on activity)
- **Demo Mode**: Optional bypass for development/testing environments
- **SMS Provider**: Twilio for member authentication codes

## Admin Authentication Flow

### Login Flow

```
1. User visits /admin
   ↓
2. Not authenticated → Redirect to /admin/login
   ↓
3. User enters email + password
   ↓
4. POST /api/v1/auth/admin/login
   ↓
5. Server validates credentials (or bypasses if DEMO_MODE=true)
   ↓
6. Server returns { accessToken, user, tenant }
   ↓
7. Client stores accessToken in localStorage
   ↓
8. Client sets auth context (user, tenant)
   ↓
9. Redirect to /admin/participants (or original destination)
```

### Demo Mode

For development and testing environments, authentication can be bypassed using demo mode:

**Environment Variable**:
```bash
# Backend
DEMO_MODE=true

# Frontend
VITE_DEMO_MODE=true
```

**Implementation**:
```typescript
// Backend: auth middleware
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  // Check if demo mode is enabled
  if (process.env.DEMO_MODE === 'true') {
    // Bypass authentication, use demo user
    req.user = {
      id: 'demo-admin-id',
      tenantId: 'demo-tenant-id',
      role: 'admin',
      email: 'demo@example.com',
      name: 'Demo Admin',
    };
    return next();
  }
  
  // Normal authentication flow
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
}
```

**Frontend Demo Mode**:
```typescript
// components/DemoModeBanner.tsx
export function DemoModeBanner() {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  
  if (!isDemoMode) return null;
  
  return (
    <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Demo Mode Active - Authentication is bypassed
      </AlertDescription>
    </Alert>
  );
}
```

**Security Considerations**:
- Demo mode should NEVER be enabled in production
- Add environment checks to prevent accidental production use
- Display prominent warning banner when demo mode is active
- Log all demo mode access for audit purposes

### Implementation

```typescript
// pages/admin/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminLoginFormSchema, AdminLoginFormData } from '../../types/forms';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminLoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data);
      
      // Redirect to original destination or default
      const from = location.state?.from?.pathname || '/admin/participants';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                aria-invalid={!!form.formState.errors.email}
                aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
              />
              {form.formState.errors.email && (
                <span id="email-error" className="text-sm text-destructive" role="alert">
                  {form.formState.errors.email.message}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register('password')}
                aria-invalid={!!form.formState.errors.password}
                aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
              />
              {form.formState.errors.password && (
                <span id="password-error" className="text-sm text-destructive" role="alert">
                  {form.formState.errors.password.message}
                </span>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Logout Flow

```
1. User clicks "Logout"
   ↓
2. POST /api/v1/auth/admin/logout (optional)
   ↓
3. Client removes accessToken from localStorage
   ↓
4. Client clears auth context
   ↓
5. Redirect to /admin/login
```

```typescript
// components/admin/layout/AdminHeader.tsx
export function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1>Medicaid Community Engagement</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Avatar>
                <AvatarFallback>
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

## Member Authentication Flow

### Phone Number Entry

```
1. User visits /m
   ↓
2. Not authenticated → Redirect to /m/auth
   ↓
3. User enters phone number (+1XXXXXXXXXX)
   ↓
4. POST /api/v1/auth/member/request-code
   Body: { phone: "+15551234567" }
   ↓
5. Server sends SMS code to phone
   ↓
6. Server returns { requestId, expiresAt }
   ↓
7. Navigate to /m/auth/code with requestId in state
```

### Implementation: Phone Entry

```typescript
// pages/member/AuthScreen.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { PhoneAuthFormSchema, PhoneAuthFormData } from '../../types/forms';
import { api } from '../../api/client';

export function AuthScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<PhoneAuthFormData>({
    resolver: zodResolver(PhoneAuthFormSchema),
    defaultValues: {
      phone: '',
    },
  });
  
  const onSubmit = async (data: PhoneAuthFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post<{ requestId: string; expiresAt: string }>(
        '/auth/member/request-code',
        { phone: data.phone }
      );
      
      navigate('/m/auth/code', {
        state: {
          requestId: response.requestId,
          phone: data.phone,
          expiresAt: response.expiresAt,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ScreenLayout showHeader={false}>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome</h1>
            <p className="text-muted-foreground">
              Enter your phone number to get started
            </p>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+15551234567"
                {...form.register('phone')}
                style={{ fontSize: '16px' }} // Prevent iOS zoom
                aria-invalid={!!form.formState.errors.phone}
                aria-describedby={form.formState.errors.phone ? 'phone-error' : undefined}
              />
              {form.formState.errors.phone && (
                <span id="phone-error" className="text-sm text-destructive" role="alert">
                  {form.formState.errors.phone.message}
                </span>
              )}
              <p className="text-xs text-muted-foreground">
                Format: +1 followed by 10 digits
              </p>
            </div>
            
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? 'Sending code...' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
    </ScreenLayout>
  );
}
```

### SMS Code Verification

```
1. User receives SMS code
   ↓
2. User enters 6-digit code
   ↓
3. POST /api/v1/auth/member/verify-code
   Body: { requestId, code }
   ↓
4. Server validates code
   ↓
5. Server returns { accessToken, user, tenant }
   ↓
6. Client stores accessToken in localStorage
   ↓
7. Client sets auth context (user, tenant)
   ↓
8. Navigate to /m (dashboard)
```

### Implementation: Code Verification

```typescript
// pages/member/AuthCodeScreen.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { VerifyCodeFormSchema, VerifyCodeFormData } from '../../types/forms';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';

export function AuthCodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { requestId, phone, expiresAt } = location.state || {};
  
  // Redirect if no requestId
  useEffect(() => {
    if (!requestId) {
      navigate('/m/auth', { replace: true });
    }
  }, [requestId, navigate]);
  
  const form = useForm<VerifyCodeFormData>({
    resolver: zodResolver(VerifyCodeFormSchema),
    defaultValues: {
      code: '',
    },
  });
  
  const onSubmit = async (data: VerifyCodeFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login({
        requestId,
        code: data.code,
      });
      
      navigate('/m', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    try {
      const response = await api.post<{ requestId: string; expiresAt: string }>(
        '/auth/member/request-code',
        { phone }
      );
      
      // Update state with new requestId
      navigate('/m/auth/code', {
        state: {
          requestId: response.requestId,
          phone,
          expiresAt: response.expiresAt,
        },
        replace: true,
      });
      
      toast.success('New code sent');
    } catch (err) {
      toast.error('Failed to resend code');
    }
  };
  
  return (
    <ScreenLayout
      showHeader={true}
      headerTitle="Verify Code"
      onHeaderBack={() => navigate('/m/auth')}
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Enter Code</h1>
            <p className="text-muted-foreground">
              We sent a 6-digit code to {phone}
            </p>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={form.watch('code')}
                onChange={(value) => form.setValue('code', value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {form.formState.errors.code && (
                <span className="text-sm text-destructive" role="alert">
                  {form.formState.errors.code.message}
                </span>
              )}
            </div>
            
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleResendCode}
            >
              Resend Code
            </Button>
          </form>
        </div>
      </div>
    </ScreenLayout>
  );
}
```

## Auth Context Implementation

### Context Provider

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { User, Tenant } from '../types';

interface LoginCredentials {
  // Admin login
  email?: string;
  password?: string;
  // Member login
  requestId?: string;
  code?: string;
}

interface AuthContextValue {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Bootstrap auth on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Validate token and fetch user
      api.get<{ user: User; tenant: Tenant }>('/auth/me')
        .then((data) => {
          setUser(data.user);
          setTenant(data.tenant);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('accessToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    let endpoint: string;
    let body: unknown;
    
    if (credentials.email && credentials.password) {
      // Admin login
      endpoint = '/auth/admin/login';
      body = {
        email: credentials.email,
        password: credentials.password,
      };
    } else if (credentials.requestId && credentials.code) {
      // Member login
      endpoint = '/auth/member/verify-code';
      body = {
        requestId: credentials.requestId,
        code: credentials.code,
      };
    } else {
      throw new Error('Invalid credentials');
    }
    
    const data = await api.post<{
      accessToken: string;
      refreshToken?: string;
      user: User;
      tenant: Tenant;
    }>(endpoint, body);
    
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    setUser(data.user);
    setTenant(data.tenant);
  }, []);
  
  const logout = useCallback(() => {
    // Optional: Call logout endpoint
    api.post('/auth/logout').catch(() => {
      // Ignore errors
    });
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setTenant(null);
  }, []);
  
  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const data = await api.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    localStorage.setItem('accessToken', data.accessToken);
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Protected Routes

### Route Protection Component

```typescript
// components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton } from './ui/skeleton';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'case_worker' | 'member';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to appropriate login
    const loginPath = requiredRole === 'member' ? '/m/auth' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    // Role mismatch - redirect to appropriate home
    const homePath = user?.role === 'member' ? '/m' : '/admin';
    return <Navigate to={homePath} replace />;
  }
  
  return <Outlet />;
}
```

### Usage in Routes

```typescript
// routes/AdminRoutes.tsx
<Routes>
  <Route element={<ProtectedRoute requiredRole="admin" />}>
    <Route element={<AdminShell />}>
      <Route path="participants" element={<ParticipantsIndex />} />
      {/* ... other admin routes */}
    </Route>
  </Route>
</Routes>

// routes/MemberRoutes.tsx
<Routes>
  {/* Public routes */}
  <Route path="auth" element={<AuthScreen />} />
  <Route path="auth/code" element={<AuthCodeScreen />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute requiredRole="member" />}>
    <Route index element={<DashboardScreen />} />
    {/* ... other member routes */}
  </Route>
</Routes>
```

## Token Refresh Strategy

### Automatic Token Refresh

```typescript
// api/client.ts
class APIClient {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      return await this.makeRequest<T>(endpoint, options);
    } catch (error) {
      if (error instanceof APIError && error.code === 'UNAUTHORIZED') {
        // Attempt token refresh
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken()
            .finally(() => {
              this.isRefreshing = false;
              this.refreshPromise = null;
            });
        }
        
        try {
          await this.refreshPromise;
          // Retry original request
          return await this.makeRequest<T>(endpoint, options);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth';
          throw refreshError;
        }
      }
      throw error;
    }
  }
  
  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const data = await this.makeRequest<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
    localStorage.setItem('accessToken', data.accessToken);
  }
}
```

## Session Persistence

### Sliding Session Strategy

The application uses a sliding session approach where the session extends automatically on user activity:

**Configuration**:
- **Session Timeout**: 30 minutes for both admin and member users
- **Extension**: Session extends on any API call
- **Inactivity**: Session expires after 30 minutes of no activity

**Backend Implementation**:
```typescript
// middleware/session.ts
export function extendSession(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    // Generate new token with extended expiry
    const newToken = jwt.sign(
      {
        userId: req.user.id,
        tenantId: req.user.tenantId,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // 30 minutes from now
    );
    
    // Send new token in response header
    res.setHeader('X-New-Token', newToken);
  }
  next();
}
```

**Frontend Implementation**:
```typescript
// api/client.ts
class APIClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
    });
    
    // Check for new token in response
    const newToken = response.headers.get('X-New-Token');
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    }
    
    // ... rest of request handling
  }
}
```

### Token Storage

```typescript
// utils/tokenStorage.ts
export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },
  
  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  },
  
  clearTokens(): void {
    localStorage.removeItem('accessToken');
  },
};
```

### Session Timeout

With sliding session, the session automatically extends on API calls. However, we still need to handle the case where the user is inactive for 30 minutes:

```typescript
// hooks/useSessionTimeout.ts
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

export function useSessionTimeout() {
  const { logout, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Check token expiry every minute
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        logout();
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        const expiresAt = decoded.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        // If token expires in less than 1 minute, show warning
        if (expiresAt - now < 60000) {
          toast.warning('Your session is about to expire');
        }
        
        // If token is expired, logout
        if (expiresAt < now) {
          logout();
          toast.info('Session expired. Please log in again.');
        }
      } catch (error) {
        // Invalid token, logout
        logout();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, logout]);
}
```

**Note**: With sliding session, the token is automatically refreshed on each API call, so the user will only be logged out if they are truly inactive for 30 minutes.

## Multi-Tenancy Context

### Tenant Context Derivation

Multi-tenancy is handled server-side via JWT claims. The client does not need to send a tenant ID with requests.

```typescript
// Server-side JWT payload structure
interface JWTPayload {
  userId: string;
  tenantId: string;
  role: 'admin' | 'case_worker' | 'member';
  exp: number;
  iat: number;
}

// All API requests automatically include tenant context from JWT
// No client-side tenant selection required
```

### Tenant Display

```typescript
// components/TenantBadge.tsx
export function TenantBadge() {
  const { tenant } = useAuth();
  
  if (!tenant) return null;
  
  return (
    <Badge variant="outline" className="ml-2">
      {tenant.name}
    </Badge>
  );
}
```

## Security Considerations

### Token Security

1. **Access Token**: Short-lived (15-60 minutes), stored in localStorage
2. **Refresh Token**: Long-lived (7-30 days), stored in localStorage
3. **HTTPS Only**: All authentication endpoints require HTTPS in production
4. **CSRF Protection**: Not required for JWT-based auth (no cookies)

### Alternative: HttpOnly Cookies

For enhanced security, consider using httpOnly cookies instead of localStorage:

```typescript
// Server sets httpOnly cookie with JWT
// Client doesn't need to manage tokens
// Requires CSRF protection

// api/client.ts
class APIClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // No Authorization header needed - cookie sent automatically
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.getCsrfToken(), // CSRF protection
        ...options.headers,
      },
    });
    
    // ... rest of request logic
  }
  
  private getCsrfToken(): string {
    // Read CSRF token from meta tag or cookie
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  }
}
```

## Testing Authentication

### Mock Auth Context

```typescript
// __tests__/mocks/AuthContext.tsx
export const mockAuthContext: AuthContextValue = {
  user: {
    id: '1',
    tenantId: 'tenant-1',
    role: 'admin',
    email: 'admin@example.com',
    name: 'Test Admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  tenant: {
    id: 'tenant-1',
    name: 'Test Agency',
    slug: 'test-agency',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
};

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Testing Protected Routes

```typescript
// __tests__/ProtectedRoute.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { MockAuthProvider } from './mocks/AuthContext';

test('redirects to login when not authenticated', () => {
  const mockContext = {
    ...mockAuthContext,
    isAuthenticated: false,
    user: null,
  };
  
  render(
    <MemoryRouter initialEntries={['/admin/participants']}>
      <AuthContext.Provider value={mockContext}>
        <Routes>
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/participants" element={<div>Protected</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Login</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

## Summary

The authentication flows provide:

- **Dual authentication**: Email/password for admins, phone/SMS for members
- **JWT-based auth**: Secure token-based authentication
- **Token refresh**: Automatic token refresh for seamless sessions
- **Protected routes**: Role-based access control
- **Multi-tenancy**: Tenant context derived from JWT claims
- **Session management**: Automatic session timeout and cleanup
- **Security best practices**: HTTPS, short-lived tokens, optional httpOnly cookies

Both flows are fully implemented with type-safe forms, error handling, and accessibility support.
