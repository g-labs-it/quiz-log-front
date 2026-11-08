import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function LandingStudentMosaic() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        {/* Header (Matching Design 1) */}
        <Stack spacing={1.5} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'text.primary',
              letterSpacing: -0.5,
            }}
          >
            Be the top on the list
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontSize: 16 }}>
            Top scores are made in daily practice. Join a community of thousands of students aiming for
            the highest percentiles.
          </Typography>
        </Stack>

        {/* Asymmetrical Masonry Photo Grid (Exact Design 1 look) */}
        <Box sx={{ maxWidth: 880, mx: 'auto' }}>
          <Grid container spacing={2.5}>
            {/* Col 1 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  component="img"
                  src="/assets/images/cover/cover-5.webp"
                  alt="Student achiever"
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  }}
                />
                <Box
                  sx={{
                    height: 140,
                    borderRadius: 3,
                    bgcolor: '#7928CA',
                    background: 'linear-gradient(135deg, #7928CA 0%, #4C1D95 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'common.white',
                    p: 2,
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(121, 40, 202, 0.25)',
                  }}
                >
                  <Iconify icon="solar:medal-ribbons-star-bold" width={32} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1 }}>
                    Grade A Pass
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Island Rank #12
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Col 2 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    height: 140,
                    borderRadius: 3,
                    bgcolor: '#00A76F',
                    background: 'linear-gradient(135deg, #00A76F 0%, #007867 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'common.white',
                    p: 2,
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0, 167, 111, 0.25)',
                  }}
                >
                  <Iconify icon="solar:stars-bold" width={32} color="#FEE140" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1 }}>
                    100% Mastery
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Science Stream
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/images/cover/cover-6.webp"
                  alt="Student study session"
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  }}
                />
              </Stack>
            </Grid>

            {/* Col 3 */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    height: 110,
                    borderRadius: 3,
                    bgcolor: '#FFC107',
                    background: 'linear-gradient(135deg, #FFE066 0%, #FFC107 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#07271E',
                    p: 2,
                    boxShadow: '0 8px 24px rgba(255, 193, 7, 0.3)',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    ★ 5.0
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/images/cover/cover-7.webp"
                  alt="Exam top scorer"
                  sx={{
                    width: '100%',
                    height: 210,
                    objectFit: 'cover',
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  }}
                />
              </Stack>
            </Grid>

            {/* Col 4 (Tallest portrait like in Design 1) */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box
                component="img"
                src="/assets/images/cover/cover-8.webp"
                alt="Smiling triumphant student"
                sx={{
                  width: '100%',
                  height: 345,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

