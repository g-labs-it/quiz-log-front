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

export function SignUpView() {
  const router = useRouter();
  const { register } = useAuth();

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
        router.push('/');
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
    [formData, register, router]
  );

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSignUp}
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

      <TextField
        fullWidth
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

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
        name="phone"
        label="Phone number (10 digits)"
        value={formData.phone}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        fullWidth
        name="address"
        label="Address (Optional)"
        value={formData.address}
        onChange={handleChange}
        sx={{ mb: 2 }}
        slotProps={{ inputLabel: { shrink: true } }}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
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
        <Typography variant="h5">Sign up</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Already have an account?
          <Link component={RouterLink} to="/sign-in" variant="subtitle2" sx={{ ml: 0.5 }}>
            Sign in
          </Link>
        </Typography>
      </Box>

      {renderForm}
    </>
  );
}
