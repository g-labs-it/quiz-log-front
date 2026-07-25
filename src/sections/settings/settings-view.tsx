import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function SettingsView() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [settings, setSettings] = useState({
    site_name: 'OneBill',
    nav_color: '#1890FF',
    self_registration_enable: false,
    forgot_password_enable: true,
    admin_approvel_for_new_user: true,
    delete_own_profile: false,
    restore_users: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setErrorMsg('');
        const response = await axiosInstance.get('/settings');
        if (response.data && response.data.data) {
          const data = response.data.data;
          setSettings({
            site_name: data.site_name || 'OneBill',
            nav_color: data.nav_color || '#1890FF',
            self_registration_enable: !!data.self_registration_enable,
            forgot_password_enable: !!data.forgot_password_enable,
            admin_approvel_for_new_user: !!data.admin_approvel_for_new_user,
            delete_own_profile: !!data.delete_own_profile,
            restore_users: !!data.restore_users,
          });
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axiosInstance.put('/settings', settings);
      setSuccessMsg('Settings updated successfully!');
      if (response.data && response.data.data) {
        const data = response.data.data;
        if (data.site_name) {
          localStorage.setItem('siteName', data.site_name);
        }
        if (data.nav_color) {
          localStorage.setItem('navColor', data.nav_color);
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('settings-updated'));
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to update settings');
      } else {
        setErrorMsg(err.message || 'Failed to update settings');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress color="inherit" />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">System Settings</Typography>
        </Box>

        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Left Side: General / Site Configuration */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={3}>
                    <Typography variant="h6">General Information</Typography>

                    <TextField
                      fullWidth
                      name="site_name"
                      label="Site Name / App Name"
                      value={settings.site_name}
                      onChange={handleChange}
                      required
                      slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        fullWidth
                        name="nav_color"
                        label="Navigation Menu Color (Hex)"
                        value={settings.nav_color}
                        onChange={handleChange}
                        required
                        slotProps={{ inputLabel: { shrink: true } }}
                        placeholder="#1890FF"
                      />
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: settings.nav_color,
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          flexShrink: 0,
                          '& input': {
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            width: 80,
                            height: 80,
                            opacity: 0,
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <input
                          type="color"
                          value={settings.nav_color}
                          onChange={(e) =>
                            setSettings((prev) => ({ ...prev, nav_color: e.target.value }))
                          }
                        />
                      </Box>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Right Side: Features / Toggle Controls */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6">Access & Security Settings</Typography>

                    <FormControlLabel
                      control={
                        <Switch
                          name="self_registration_enable"
                          checked={settings.self_registration_enable}
                          onChange={handleChange}
                        />
                      }
                      label="Enable User Self-Registration"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="forgot_password_enable"
                          checked={settings.forgot_password_enable}
                          onChange={handleChange}
                        />
                      }
                      label="Enable Forgot Password Recovery"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="admin_approvel_for_new_user"
                          checked={settings.admin_approvel_for_new_user}
                          onChange={handleChange}
                        />
                      }
                      label="Require Admin Approval for New Users"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="delete_own_profile"
                          checked={settings.delete_own_profile}
                          onChange={handleChange}
                        />
                      }
                      label="Allow Users to Delete Own Profile"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          name="restore_users"
                          checked={settings.restore_users}
                          onChange={handleChange}
                        />
                      }
                      label="Allow Restoring Deleted Users"
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="inherit"
                      size="large"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
