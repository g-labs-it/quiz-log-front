import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/auth';

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        await forgotPassword(email);
        setSuccessMsg('Password reset token has been sent to your email.');
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to submit forgot password request');
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, forgotPassword]
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send request'}
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
        <Typography variant="h5">Forgot Password</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          Enter your email and we&apos;ll send you a password reset link/token.
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
