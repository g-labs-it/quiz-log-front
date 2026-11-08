import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function VerifyEmailView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const { resendVerification } = useAuth();

  const id = searchParams.get('id');
  const hash = searchParams.get('hash');
  const expires = searchParams.get('expires');

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState('');

  const verifyToken = useCallback(async () => {
    if (!id || !hash || !expires) {
      setLoading(false);
      setErrorMsg('Invalid or missing verification parameters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axiosInstance.post('/auth/verify-email', {
        id: Number(id),
        hash,
        expires: Number(expires),
      });

      setVerified(true);
      setSuccessMsg(response.data?.message || 'Your email address has been successfully verified!');
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || 'Verification link has expired or is invalid.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, [id, hash, expires]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendLoading(true);
    setResendNotice('');
    try {
      await resendVerification(resendEmail);
      setResendNotice('A new verification link has been sent to your email.');
    } catch (err: any) {
      setResendNotice(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, textAlign: 'center', maxWidth: 480, mx: 'auto', borderRadius: 2 }}>
      {loading && (
        <Stack spacing={2.5} alignItems="center" sx={{ py: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="h6">Verifying your email address...</Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait a moment while we validate your activation link.
          </Typography>
        </Stack>
      )}

      {!loading && verified && (
        <Stack spacing={2.5} alignItems="center" sx={{ py: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'success.lighter',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={36} />
          </Box>

          <Typography variant="h5">Email Verified Successfully!</Typography>

          <Typography variant="body2" color="text.secondary">
            {successMsg} Your student account is now active and ready to take quizzes.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={() => router.push('/sign-in')}
            sx={{ mt: 2 }}
          >
            Proceed to Sign In
          </Button>
        </Stack>
      )}

      {!loading && !verified && (
        <Stack spacing={2.5} alignItems="center" sx={{ py: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'error.lighter',
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:close-circle-bold" width={36} />
          </Box>

          <Typography variant="h5">Verification Failed</Typography>

          {!!errorMsg && (
            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
              {errorMsg}
            </Alert>
          )}

          {!!resendNotice && (
            <Alert severity="info" sx={{ width: '100%', textAlign: 'left' }}>
              {resendNotice}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            Need a new link? Enter your email address below to receive another verification email.
          </Typography>

          <Box component="form" onSubmit={handleResend} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              size="small"
              type="email"
              label="Email Address"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="outlined"
              color="inherit"
              fullWidth
              disabled={resendLoading}
              sx={{ mb: 2 }}
            >
              {resendLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </Box>

          <Button
            variant="text"
            color="inherit"
            onClick={() => router.push('/sign-in')}
          >
            Back to Sign In
          </Button>
        </Stack>
      )}
    </Card>
  );
}
