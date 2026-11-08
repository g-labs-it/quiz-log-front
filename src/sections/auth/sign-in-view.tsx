import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { login, loginWithGoogle, resendVerification } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification resend state
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  // Google sign in loading state
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle Google Token Credential
  const handleGoogleCredential = useCallback(
    async (response: any) => {
      if (!response?.credential) return;
      setGoogleLoading(true);
      setErrorMsg('');
      setIsUnverified(false);
      setResendSuccess('');
      try {
        const loggedUser = await loginWithGoogle(response.credential);
        const roles: string[] = Array.isArray(loggedUser?.role)
          ? loggedUser.role
          : loggedUser?.role
          ? [loggedUser.role]
          : [];
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (roles.includes('Student') || roles.includes('User')) {
          router.push('/student/quizzes');
        } else {
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.error('Google sign in error:', err);
        setErrorMsg(err.message || 'Google sign in failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    [loginWithGoogle, redirectUrl, router]
  );

  // Initialize Google Identity Services
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId) {
      let intervalId: any = null;

      const initGsi = () => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(intervalId);
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredential,
          });

          const container = document.getElementById('googleSignInBtn');
          if (container) {
            const btnWidth = Math.min(container.clientWidth || 360, 400);
            (window as any).google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: btnWidth,
              logo_alignment: 'left',
              locale: 'en',
            });
          }
        }
      };

      intervalId = setInterval(initGsi, 200);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
    return undefined;
  }, [handleGoogleCredential]);

  const handleSignIn = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMsg('');
      setIsUnverified(false);
      setResendSuccess('');

      try {
        const loggedUser = await login({ email, password });
        if (redirectUrl) {
          router.push(redirectUrl);
          return;
        }
        const roles: string[] = Array.isArray(loggedUser?.role)
          ? loggedUser.role
          : loggedUser?.role
          ? [loggedUser.role]
          : [];
        if (roles.includes('Student') || roles.includes('User')) {
          router.push('/student/quizzes');
        } else {
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.error(err);
        let message = 'Invalid email or password';
        if (err && typeof err === 'object') {
          if (typeof err.errors === 'string') {
            message = err.errors;
          } else if (err.errors && typeof err.errors === 'object') {
            const firstError = Object.values(err.errors)[0];
            if (Array.isArray(firstError)) {
              message = firstError[0];
            } else if (typeof firstError === 'string') {
              message = firstError;
            }
          } else if (err.message) {
            message = err.message;
          }
        }

        if (message.toLowerCase().includes('verify your email')) {
          setIsUnverified(true);
        }

        setErrorMsg(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, login, redirectUrl, router]
  );

  const handleResendVerification = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address to resend the verification link.');
      return;
    }
    setResendLoading(true);
    setResendSuccess('');
    try {
      await resendVerification(email);
      setResendSuccess('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const renderForm = (
    <Box component="form" onSubmit={handleSignIn} sx={{ width: 1 }}>
      {!!errorMsg && (
        <Alert
          severity={isUnverified ? 'warning' : 'error'}
          sx={{ width: 1, mb: 2.5, borderRadius: 1.5 }}
          action={
            isUnverified ? (
              <Button
                color="inherit"
                size="small"
                disabled={resendLoading}
                onClick={handleResendVerification}
                sx={{ textDecoration: 'underline', fontWeight: 600 }}
              >
                {resendLoading ? 'Sending...' : 'Resend Email'}
              </Button>
            ) : undefined
          }
        >
          {errorMsg}
        </Alert>
      )}

      {!!resendSuccess && (
        <Alert severity="success" sx={{ width: 1, mb: 2.5, borderRadius: 1.5 }}>
          {resendSuccess}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          fullWidth
          name="email"
          label="Email or Student Code"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:user-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:lock-password-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: 13,
              textDecoration: 'none',
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
            }}
          >
            Forgot password?
          </Link>
        </Box>

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{
            height: 48,
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 1.5,
            boxShadow: (theme) => `0 8px 16px -4px ${theme.vars.palette.primary.main}40`,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: (theme) => `0 12px 20px -4px ${theme.vars.palette.primary.main}60`,
            },
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
        </Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <Stack spacing={1} alignItems="center" sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            boxShadow: '0 4px 12px rgba(0, 167, 111, 0.16)',
          }}
        >
          <Iconify icon="solar:shield-check-bold-duotone" width={28} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          Sign in
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Don’t have an account?{' '}
          <Link
            component={RouterLink}
            to="/sign-up"
            variant="subtitle2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Get started
          </Link>
        </Typography>
      </Stack>

      {renderForm}

      <Divider
        sx={{
          my: 3,
          typography: 'overline',
          color: 'text.disabled',
          fontWeight: 700,
          letterSpacing: 1.5,
          '&::before, &::after': { borderColor: 'divider' },
        }}
      >
        OR
      </Divider>

      {/* Google Sign-In */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: 44,
          '& iframe': {
            borderRadius: '8px !important',
          },
        }}
      >
        <Box id="googleSignInBtn" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }} />
        {googleLoading && <CircularProgress size={24} sx={{ mt: 1.5 }} />}
      </Box>
    </>
  );
}
