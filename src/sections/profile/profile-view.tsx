import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function ProfileView() {
  const { user, updateProfile, changePassword } = useAuth();

  const [currentTab, setCurrentTab] = useState('profile');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Security Form State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Populate profile fields from auth state
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      if (user.profile_picture) {
        setPreviewUrl(
          user.profile_picture.startsWith('http://') || user.profile_picture.startsWith('https://')
            ? user.profile_picture
            : `${import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'}/${user.profile_picture}`
        );
      }
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const dataToSubmit: any = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
      };

      if (selectedFile) {
        dataToSubmit.profile_picture = selectedFile;
      }

      await updateProfile(dataToSubmit);
      setSuccessMsg('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to update profile');
      } else {
        setErrorMsg(err.message || 'Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (passwordData.password !== passwordData.password_confirmation) {
      setErrorMsg('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await changePassword({
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });
      setSuccessMsg('Password updated successfully!');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
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
    <DashboardContent maxWidth="xl">
      <Stack spacing={4}>
        <Typography variant="h4">Account Settings</Typography>

        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile Info" value="profile" />
          <Tab label="Security & Password" value="security" />
        </Tabs>

        {currentTab === 'profile' && (
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleProfileSubmit}>
                <Grid container spacing={4}>
                  {/* Left Side: Photo upload */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ height: 1 }}
                    >
                      <Avatar
                        src={previewUrl || undefined}
                        alt={profileData.name}
                        sx={{ width: 140, height: 140, fontSize: 40 }}
                      >
                        {profileData.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Button variant="outlined" component="label" size="small">
                        Upload Picture
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                      </Button>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Allowed *.jpeg, *.jpg, *.png. Max size of 2MB
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Right Side: Form Inputs */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Full Name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        fullWidth
                        name="email"
                        label="Email address (Cannot be changed)"
                        value={profileData.email}
                        disabled
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        fullWidth
                        name="phone"
                        label="Phone number"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <TextField
                        fullWidth
                        name="address"
                        label="Address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        multiline
                        rows={3}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          type="submit"
                          variant="contained"
                          color="inherit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}

        {currentTab === 'security' && (
          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSecuritySubmit}>
                <Stack spacing={3} sx={{ maxWidth: 560, mx: 'auto', py: 2 }}>
                  <Typography variant="h6">Change Password</Typography>
                  <TextField
                    fullWidth
                    type="password"
                    name="current_password"
                    label="Current Password"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData((p) => ({ ...p, current_password: e.target.value }))
                    }
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Divider />
                  <TextField
                    fullWidth
                    type="password"
                    name="password"
                    label="New Password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData((p) => ({ ...p, password: e.target.value }))}
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    name="password_confirmation"
                    label="Confirm New Password"
                    value={passwordData.password_confirmation}
                    onChange={(e) =>
                      setPasswordData((p) => ({ ...p, password_confirmation: e.target.value }))
                    }
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="inherit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Change Password'}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}
      </Stack>
    </DashboardContent>
  );
}
