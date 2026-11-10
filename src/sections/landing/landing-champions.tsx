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
      pedestalColor: 'linear-gradient(180deg, #4361F2 0%, #2A45D4 100%)',
      medalColor: '#FFFFFF',
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
      pedestalColor: 'linear-gradient(180deg, #36B37E 0%, #0B4E41 100%)',
      medalColor: '#FDC745',
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
      pedestalColor: 'linear-gradient(180deg, #9C5AFF 0%, #7546FF 100%)',
      medalColor: '#FFFFFF',
      medalIcon: 'solar:medal-ribbon-bold',
      medalLabel: '3rd Place',
    },
  ];

  return (
    <Box
      id="champions"
      sx={{
        py: { xs: 9, md: 14 },
        bgcolor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(10, 10, 10, 0.06)',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header - 100% Centered */}
        <Stack
          spacing={1.75}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, width: '100%' }}
        >
          <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                bgcolor: '#F5F4EB',
                border: '1px solid rgba(10, 10, 10, 0.08)',
                color: '#0A0A0A',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Iconify icon="solar:crown-bold" width={16} color="#FDC745" />
              Hall of Fame
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2.2rem', md: '2.9rem' },
              color: '#0A0A0A',
              letterSpacing: '-0.035em',
              textAlign: 'center',
              width: '100%',
            }}
          >
            mcqpro Champions
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: '#637381',
              maxWidth: 580,
              mx: 'auto',
              textAlign: 'center',
              width: '100%',
              fontSize: { xs: '15px', md: '16.5px' },
            }}
          >
            Celebrate this week&apos;s highest test scorers. Consistent practice turns knowledge into victory.
          </Typography>
        </Stack>

        {/* 3D Bauhaus Podium Visualization */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: { xs: 1.5, sm: 3, md: 4 },
            maxWidth: 780,
            mx: 'auto',
            mb: 7,
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
                    mb: 2.5,
                    textAlign: 'center',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  {/* Medal Icon Badge */}
                  <Box
                    sx={{
                      width: isFirst ? 42 : 36,
                      height: isFirst ? 42 : 36,
                      borderRadius: '50%',
                      bgcolor: isFirst ? '#FDC745' : '#011738',
                      color: isFirst ? '#0A0A0A' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 16px rgba(1, 23, 56, 0.15)',
                      mb: -1,
                      zIndex: 2,
                    }}
                  >
                    <Iconify icon={champ.medalIcon} width={isFirst ? 22 : 18} />
                  </Box>

                  {/* Avatar */}
                  <Avatar
                    src={champ.avatar}
                    alt={champ.name}
                    sx={{
                      width: isFirst ? 86 : 70,
                      height: isFirst ? 86 : 70,
                      border: '4px solid #FFFFFF',
                      boxShadow: isFirst
                        ? '0 12px 28px rgba(253, 199, 69, 0.35)'
                        : '0 8px 20px rgba(1, 23, 56, 0.12)',
                    }}
                  />

                  {/* Name & Subject */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 800,
                        fontSize: { xs: 13, sm: 15 },
                        lineHeight: 1.25,
                        color: '#0A0A0A',
                      }}
                    >
                      {champ.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        color: '#637381',
                        display: 'block',
                        fontSize: 12,
                        mt: 0.25,
                      }}
                    >
                      {champ.subject}
                    </Typography>
                  </Box>

                  {/* Score Tag */}
                  <Chip
                    label={champ.score}
                    size="small"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      borderRadius: '999px',
                      fontSize: 12,
                      bgcolor: '#FFFFFF',
                      color: '#0A0A0A',
                      border: '1px solid rgba(10, 10, 10, 0.08)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                </Stack>

                {/* Pedestal Pillar */}
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: champ.height * 0.7, sm: champ.height },
                    background: champ.pedestalColor,
                    borderRadius: '24px 24px 6px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isFirst
                      ? '0 20px 44px rgba(253, 199, 69, 0.3)'
                      : '0 14px 32px rgba(1, 23, 56, 0.14)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
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
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', sm: '3.6rem' },
                      color: isFirst ? '#0A0A0A' : 'rgba(255, 255, 255, 0.95)',
                      textShadow: isFirst ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.2)',
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
            onClick={isAuthenticated ? onScrollToQuizzes : () => navigate('/sign-up')}
            sx={{
              bgcolor: '#0A0A0A',
              color: '#FFFFFF',
              borderRadius: '999px',
              px: 4.5,
              py: 1.6,
              height: 54,
              fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(10, 10, 10, 0.08)',
              transition: 'all 0.25s ease',
              '&:hover': {
                bgcolor: '#222222',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(10, 10, 10, 0.2)',
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
