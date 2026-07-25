import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useAuth } from 'src/auth';

export function ForceChangePasswordDialog() {
  const { changePassword, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    if (passwordData.password !== passwordData.password_confirmation) {
      setErrorMsg('New passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await changePassword({
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to change password');
      } else {
        setErrorMsg(err.message || 'Failed to change password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Change Password Required
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              For security reasons, you must change your password on your first login before you can proceed.
            </Typography>

            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordData.current_password}
              onChange={(e) =>
                setPasswordData((p) => ({ ...p, current_password: e.target.value }))
              }
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordData.password}
              onChange={(e) => setPasswordData((p) => ({ ...p, password: e.target.value }))}
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordData.password_confirmation}
              onChange={(e) =>
                setPasswordData((p) => ({ ...p, password_confirmation: e.target.value }))
              }
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={logout} disabled={isSubmitting}>
            Logout
          </Button>
          <Button type="submit" variant="contained" color="inherit" disabled={isSubmitting}>
            {isSubmitting ? 'Update Password' : 'Update Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
