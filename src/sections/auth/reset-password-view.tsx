import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      if (formData.password !== formData.password_confirmation) {
        setErrorMsg('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      try {
        await resetPassword(formData);
        setSuccessMsg('Your password has been reset successfully. Redirecting to login...');
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(
          err.message || 'Failed to reset password. Please check your token and credentials.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, resetPassword, router]
  );

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 1,
      }}
    >
      {!!errorMsg && (
        <Alert severity="error" sx={{ width: 1, mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ width: 1, mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      <TextField
        fullWidth
        name="email"
        label="Email address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        fullWidth
        name="token"
        label="Reset Token"
        value={formData.token}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        fullWidth
        name="password"
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        required
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        name="password_confirmation"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password_confirmation}
        onChange={handleChange}
        required
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isSubmitting || !!successMsg}
      >
        {isSubmitting ? 'Resetting...' : 'Reset password'}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Reset Password</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Enter the token received in your email along with your new password.
        </Typography>
      </Box>

      {renderForm}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link component={RouterLink} to="/sign-in" variant="subtitle2" color="inherit">
          Back to sign in
        </Link>
      </Box>
    </>
  );
}
