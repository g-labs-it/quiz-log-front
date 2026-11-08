import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  onScrollToQuizzes?: () => void;
}

export function LandingChampions({ onScrollToQuizzes }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const champions = [
    {
      rank: 2,
      name: 'Kamal Perera',
      subject: 'Physical Science',
      score: '98%',
      marks: '49/50 pts',
      avatar: '/assets/images/avatar/avatar-2.webp',
      height: 180,
      pedestalColor: 'linear-gradient(180deg, #A2B9C8 0%, #768F9F 100%)',
      medalColor: '#9E9E9E',
      medalIcon: 'solar:medal-star-bold',
      medalLabel: '2nd Place',
    },
    {
      rank: 1,
      name: 'Sarah Fernando',
      subject: 'Biology & Chemistry',
      score: '100%',
      marks: '50/50 pts',
      avatar: '/assets/images/avatar/avatar-1.webp',
      height: 230,
      pedestalColor: 'linear-gradient(180deg, #5BE49B 0%, #007867 100%)',
      medalColor: '#FFC107',
      medalIcon: 'solar:crown-bold',
      medalLabel: 'Champion • 1st',
    },
    {
      rank: 3,
      name: 'Dilshan Silva',
      subject: 'Combined Maths',
      score: '96%',
      marks: '48/50 pts',
      avatar: '/assets/images/avatar/avatar-4.webp',
      height: 150,
      pedestalColor: 'linear-gradient(180deg, #D4AF37 0%, #A67C1E 100%)',
      medalColor: '#CD7F32',
      medalIcon: 'solar:medal-ribbon-bold',
      medalLabel: '3rd Place',
    },
  ];

  return (
    <Box
      id="champions"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.neutral',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Background Radial Aura (Matching Design 1) */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 167, 111, 0.12) 0%, rgba(91, 228, 155, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header (Design 1 vibe) */}
        <Stack spacing={1.5} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Chip
              icon={<Iconify icon="solar:crown-bold" width={18} color="#FFC107" />}
              label="Hall of Fame"
              size="small"
              sx={{
                px: 1.25,
                py: 0.5,
                fontWeight: 800,
                borderRadius: '999px',
                bgcolor: 'primary.lighter',
                color: 'primary.darker',
                fontSize: 12,
              }}
            />
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: 'text.primary',
              letterSpacing: -0.5,
            }}
          >
            mcqpro Champions
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 620, mx: 'auto', fontSize: 16 }}>
            Celebrate this week&apos;s highest test scorers. Consistent practice turns knowledge into victory.
          </Typography>
        </Stack>

        {/* 3D Podium Visualization */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: { xs: 1.5, sm: 3, md: 4 },
            maxWidth: 780,
            mx: 'auto',
            mb: 6,
            pt: 4,
          }}
        >
          {champions.map((champ) => {
            const isFirst = champ.rank === 1;

            return (
              <Box
                key={champ.rank}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Floating Avatar & Details */}
                <Stack
                  alignItems="center"
                  spacing={1}
                  sx={{
                    mb: 2,
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  {/* Medal Icon Badge */}
                  <Box
                    sx={{
                      width: isFirst ? 42 : 36,
                      height: isFirst ? 42 : 36,
                      borderRadius: '50%',
                      bgcolor: isFirst ? '#FFC107' : 'background.paper',
                      color: isFirst ? '#07271E' : champ.medalColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                      border: '2px solid',
                      borderColor: champ.medalColor,
                      mb: -1,
                      zIndex: 2,
                    }}
                  >
                    <Iconify icon={champ.medalIcon} width={isFirst ? 24 : 20} />
                  </Box>

                  {/* Avatar */}
                  <Avatar
                    src={champ.avatar}
                    alt={champ.name}
                    sx={{
                      width: isFirst ? 84 : 68,
                      height: isFirst ? 84 : 68,
                      border: '4px solid',
                      borderColor: isFirst ? '#FFC107' : '#FFFFFF',
                      boxShadow: isFirst
                        ? '0 10px 24px rgba(255, 193, 7, 0.4)'
                        : '0 6px 18px rgba(0, 0, 0, 0.12)',
                    }}
                  />

                  {/* Name & Subject */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: 13, sm: 15 },
                        lineHeight: 1.2,
                        color: 'text.primary',
                      }}
                    >
                      {champ.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: 11 }}>
                      {champ.subject}
                    </Typography>
                  </Box>

                  {/* Score Tag */}
                  <Chip
                    label={champ.score}
                    size="small"
                    sx={{
                      fontWeight: 900,
                      borderRadius: '999px',
                      fontSize: 12,
                      bgcolor: isFirst ? '#FEE140' : 'background.paper',
                      color: isFirst ? '#07271E' : 'text.primary',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    }}
                  />
                </Stack>

                {/* 3D Pedestal Pillar (Design 1 vibe) */}
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: champ.height * 0.7, sm: champ.height },
                    background: champ.pedestalColor,
                    borderRadius: '20px 20px 4px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isFirst
                      ? '0 16px 36px rgba(0, 120, 103, 0.35)'
                      : '0 10px 24px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255, 255, 255, 0.35)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '24px',
                      background: 'rgba(255, 255, 255, 0.25)',
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', sm: '3.5rem' },
                      color: 'rgba(255, 255, 255, 0.92)',
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {champ.rank}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Action Button */}
        <Stack direction="row" justifyContent="center">
          <Button
            size="large"
            variant="contained"
            onClick={isAuthenticated ? onScrollToQuizzes : () => navigate('/sign-up')}
            endIcon={<Iconify icon="solar:arrow-right-bold" />}
            sx={{
              py: 1.5,
              px: 4,
              fontWeight: 800,
              fontSize: 15,
              borderRadius: '999px',
              bgcolor: 'primary.main',
              color: 'common.white',
              boxShadow: '0 10px 24px rgba(0, 167, 111, 0.4)',
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 14px 32px rgba(0, 167, 111, 0.55)',
              },
            }}
          >
            Claim Your Spot on the Podium →
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
