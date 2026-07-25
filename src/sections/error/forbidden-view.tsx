import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ForbiddenView() {
  return (
    <>
      <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Iconify
          icon="solar:shield-keyhole-bold-duotone"
          sx={{
            width: 140,
            height: 140,
            color: 'warning.main',
            mb: 4,
          }}
        />

        <Typography variant="h3" sx={{ mb: 2 }}>
          Access Denied
        </Typography>

        <Typography sx={{ color: 'text.secondary', maxWidth: 480, textAlign: 'center', mb: 5 }}>
          You do not have permission to access this page. Please contact your system administrator
          if you believe this is an error.
        </Typography>

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Go to Dashboard
        </Button>
      </Container>
    </>
  );
}
