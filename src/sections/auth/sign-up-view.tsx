import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignUpView() {
  const router = useRouter();
  const { register, resendVerification } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification state
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSignUp = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMsg('');

      if (formData.password !== formData.password_confirmation) {
        setErrorMsg('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      try {
        await register(formData);
        // Switch to verification pending state
        setRegisteredEmail(formData.email);
      } catch (err: any) {
        console.error(err);
        if (err.errors) {
          const firstError = Object.values(err.errors)[0] as string[];
          setErrorMsg(firstError[0] || 'Registration failed');
        } else {
          setErrorMsg(err.message || 'Registration failed');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, register]
  );

  const handleResend = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setResendNotice('');
    try {
      await resendVerification(registeredEmail);
      setResendNotice('Verification email resent! Please check your inbox.');
    } catch (err: any) {
      setResendNotice(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  // If successfully registered, show verification instructions
  if (registeredEmail) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', width: 1, borderRadius: 2 }}>
        <Stack spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 167, 111, 0.2)',
            }}
          >
            <Iconify icon="solar:letter-bold" width={36} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Verify Your Email Address
          </Typography>

          <Typography variant="body2" color="text.secondary">
            We have sent an activation link to <strong>{registeredEmail}</strong>. Please check your inbox and click the link to activate your student account before logging in.
          </Typography>

          {!!resendNotice && (
            <Alert severity="info" sx={{ width: '100%', textAlign: 'left', borderRadius: 1.5 }}>
              {resendNotice}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={() => router.push('/sign-in')}
            sx={{
              height: 48,
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 1.5,
              mt: 2,
            }}
          >
            Go to Sign In
          </Button>

          <Button
            variant="text"
            color="inherit"
            disabled={resendLoading}
            onClick={handleResend}
            sx={{ textDecoration: 'underline' }}
          >
            {resendLoading ? 'Sending...' : 'Did not receive email? Resend'}
          </Button>
        </Stack>
      </Card>
    );
  }

  const renderForm = (
    <Box component="form" onSubmit={handleSignUp} sx={{ width: 1 }}>
      {!!errorMsg && (
        <Alert severity="error" sx={{ width: 1, mb: 2.5, borderRadius: 1.5 }}>
          {errorMsg}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          fullWidth
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
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
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:letter-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          name="phone"
          label="Phone number (10 digits)"
          value={formData.phone}
          onChange={handleChange}
          required
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:phone-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          name="address"
          label="Address (Optional)"
          value={formData.address}
          onChange={handleChange}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:map-point-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
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

        <TextField
          fullWidth
          name="password_confirmation"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:lock-password-bold-duotone" width={22} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 1 }}
        />

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
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
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
          <Iconify icon="solar:user-plus-bold-duotone" width={28} />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
          Create an account
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/sign-in"
            variant="subtitle2"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Stack>

      {renderForm}
    </>
  );
}
