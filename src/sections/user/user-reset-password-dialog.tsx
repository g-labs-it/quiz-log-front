import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';

import type { UserProps } from './user-table-row';

// ----------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserProps | null;
  onSuccess: (message: string) => void;
}

function generateRandomPassword(length = 10): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const nums = '23456789';
  const specials = '@#$%&!';

  let pwd =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    nums[Math.floor(Math.random() * nums.length)] +
    specials[Math.floor(Math.random() * specials.length)];

  const all = upper + lower + nums + specials;
  for (let i = pwd.length; i < length; i += 1) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  return pwd
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

export function UserResetPasswordDialog({ open, onClose, user, onSuccess }: Props) {
  const [tab, setTab] = useState<'random' | 'custom'>('random');
  const [randomPassword, setRandomPassword] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Initialize or re-generate when opened
  useEffect(() => {
    if (open) {
      setRandomPassword(generateRandomPassword(10));
      setCustomPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setCopied(false);
      setShowPassword(false);
      setNeedsPasswordChange(true);
      setTab('random');
    }
  }, [open, user]);

  const handleCopy = () => {
    const textToCopy = tab === 'random' ? randomPassword : customPassword;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setErrorMsg('');

    const passwordToSet = tab === 'random' ? randomPassword : customPassword;

    if (!passwordToSet || passwordToSet.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (tab === 'custom' && passwordToSet !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/users/${user.id}/reset-password`, {
        password: passwordToSet,
        password_confirmation: passwordToSet,
        needs_password_change: needsPasswordChange,
      });

      const message =
        response.data?.message ||
        (user.email
          ? `Password reset successfully and sent to ${user.email}!`
          : `Password reset successfully!`);

      onSuccess(message);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const first = Object.values(err.errors)[0] as string[];
        setErrorMsg(first[0] || 'Failed to reset password.');
      } else {
        setErrorMsg(err.message || 'Failed to reset password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reset password for <strong>{user?.name}</strong>{' '}
          {user?.student_code ? `(${user.student_code})` : user?.email ? `(${user.email})` : ''}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {!!errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}

          {/* Mode Tabs */}
          <Tabs
            value={tab}
            onChange={(e, val) => setTab(val)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              value="random"
              label="Random Password"
              icon={<Iconify icon="solar:magic-stick-3-bold" width={18} />}
              iconPosition="start"
            />
            <Tab
              value="custom"
              label="Custom Password"
              icon={<Iconify icon="solar:pen-bold" width={18} />}
              iconPosition="start"
            />
          </Tabs>

          {/* Tab 1: Random Password */}
          {tab === 'random' && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                A secure random password has been generated below:
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1.5,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'monospace',
                    letterSpacing: 2,
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  {randomPassword}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Regenerate password">
                    <IconButton
                      size="small"
                      onClick={() => setRandomPassword(generateRandomPassword(10))}
                    >
                      <Iconify icon="solar:refresh-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton size="small" color={copied ? 'success' : 'default'} onClick={handleCopy}>
                      <Iconify icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Stack>
          )}

          {/* Tab 2: Custom Password */}
          {tab === 'custom' && (
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Stack>
          )}

          {/* Toggle: Require password change on next login */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1.5,
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={needsPasswordChange}
                  onChange={(e) => setNeedsPasswordChange(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2">
                    Require password change on next login
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    User will be prompted to choose their own password upon first logging in.
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Email Notification Status Notice */}
          {user?.email ? (
            <Alert severity="info" icon={<Iconify icon="solar:letter-bold" />}>
              The new password will be automatically emailed to <strong>{user.email}</strong>.
            </Alert>
          ) : (
            <Alert severity="warning" icon={<Iconify icon="solar:bell-bing-bold" />}>
              This user has no email registered. Please make sure to copy and provide this password to the student directly.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Iconify icon="solar:key-bold" />}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

