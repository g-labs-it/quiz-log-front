import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { LandingFooter } from './landing-footer';
import { type PublicQuizItem } from './landing-quizzes-showcase';

// ----------------------------------------------------------------------

export function AllQuizzesView() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [quizzes, setQuizzes] = useState<PublicQuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [guestDialogQuiz, setGuestDialogQuiz] = useState<PublicQuizItem | null>(null);

  const roles = (user as any)?.role || [];
  const isStudent = Array.isArray(roles) && roles.includes('Student');
  const dashboardPath = isStudent ? '/student/quizzes' : '/dashboard';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const fetchPublicQuizzes = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/public/quizzes');
        if (Array.isArray(res.data?.data)) {
          setQuizzes(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load public quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicQuizzes();
  }, []);

  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter((quiz) => {
        const matchesSearch =
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'Quick Tests') return quiz.duration_minutes <= 20;
        if (selectedCategory === 'Standard Exams')
          return quiz.duration_minutes > 20 && quiz.duration_minutes <= 45;
        if (selectedCategory === 'Full Length') return quiz.duration_minutes > 45;

        return true;
      }),
    [quizzes, searchQuery, selectedCategory]
  );

  const handleStartQuiz = (quiz: PublicQuizItem) => {
    if (isAuthenticated) {
      if (quiz.attempt?.status === 'COMPLETED') {
        navigate(`/student/quizzes/${quiz.attempt.id}/review`);
      } else {
        navigate(`/student/quizzes/${quiz.id}/take`);
      }
    } else {
      setGuestDialogQuiz(quiz);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F4EB' }}>
      {/* Top Navbar */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'rgba(245, 244, 235, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(10, 10, 10, 0.08)',
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* Logo + Back to Home */}
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => navigate('/')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <Logo sx={{ width: 30, height: 30 }} />
                <Typography
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: '#0A0A0A',
                    letterSpacing: '-0.03em',
                  }}
                >
                  mcqpro
                </Typography>
              </Stack>

              <Button
                size="small"
                onClick={() => navigate('/')}
                startIcon={<Iconify icon="solar:arrow-left-linear" width={18} />}
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  color: '#14142B',
                  textTransform: 'none',
                  borderRadius: '999px',
                  px: 1.5,
                  '&:hover': { bgcolor: 'rgba(10, 10, 10, 0.05)' },
                }}
              >
                Back to Home
              </Button>
            </Stack>

            {/* Auth Buttons */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate(dashboardPath)}
                  sx={{
                    bgcolor: '#36B37E',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    px: 3,
                    py: 1,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1B806A' },
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/sign-in')}
                    sx={{
                      color: '#0A0A0A',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      textTransform: 'none',
                      borderRadius: '999px',
                      px: 2,
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => navigate('/sign-up')}
                    sx={{
                      bgcolor: '#0A0A0A',
                      color: '#FFFFFF',
                      borderRadius: '999px',
                      px: 3,
                      py: 1,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '14px',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#36B37E' },
                    }}
                  >
                    Start Free
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          {/* Page Heading - 100% Centered */}
          <Stack
            spacing={1.75}
            alignItems="center"
            justifyContent="center"
            sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, width: '100%' }}
          >
            <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: '999px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(10, 10, 10, 0.08)',
                  color: '#0A0A0A',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.85,
                }}
              >
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#36B37E' }} />
                Public Examination Library
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", "DM Sans Variable", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '2.4rem', sm: '3.1rem', md: '3.6rem' },
                color: '#0A0A0A',
                letterSpacing: '-0.035em',
                textAlign: 'center',
                width: '100%',
              }}
            >
              Explore All Quizzes
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: '#637381',
                maxWidth: 620,
                mx: 'auto',
                textAlign: 'center',
                width: '100%',
                fontSize: { xs: '15px', md: '17px' },
              }}
            >
              Search, filter, and practice from our complete catalog of educator-verified multiple choice exams.
            </Typography>

            {/* Filter and Search Bar Row (Clean Pill, NO white square corners) */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ pt: 3.5, width: '100%' }}
            >
              {/* Category Pills */}
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', maxWidth: '100%', py: 0.5 }}>
                {['All', 'Quick Tests', 'Standard Exams', 'Full Length'].map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <Button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      sx={{
                        borderRadius: '999px',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        px: 2.5,
                        py: 0.75,
                        height: 40,
                        textTransform: 'none',
                        bgcolor: isActive ? '#0A0A0A' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#14142B',
                        border: isActive ? '1px solid #0A0A0A' : '1px solid rgba(10, 10, 10, 0.08)',
                        boxShadow: isActive ? '0 4px 12px rgba(10, 10, 10, 0.15)' : 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: isActive ? '#222222' : 'rgba(10, 10, 10, 0.04)',
                          borderColor: '#0A0A0A',
                        },
                      }}
                    >
                      {cat}
                    </Button>
                  );
                })}
              </Stack>

              {/* Clean Seamless Search Input Pill (100% bug-free) */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: '#FFFFFF',
                  borderRadius: '999px',
                  px: 2.25,
                  py: 0.65,
                  height: 44,
                  border: '1.5px solid rgba(10, 10, 10, 0.08)',
                  boxShadow: '0 2px 8px rgba(1, 23, 56, 0.04)',
                  width: { xs: '100%', md: 320 },
                  transition: 'all 0.25s ease',
                  '&:focus-within': {
                    borderColor: '#0A0A0A',
                    boxShadow: '0 6px 18px rgba(10, 10, 10, 0.12)',
                  },
                }}
              >
                <Iconify icon="solar:magnifer-linear" width={20} sx={{ color: '#637381', mr: 1, flexShrink: 0 }} />
                <InputBase
                  placeholder="Search by keyword, title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '14.5px',
                    width: '100%',
                    color: '#0A0A0A',
                  }}
                />
                {searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.5, color: '#637381' }}>
                    <Iconify icon="solar:close-circle-bold" width={16} />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Stack>

          {/* Results Summary */}
          {!loading && (
            <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '14px', color: '#637381' }}>
                Showing <strong>{filteredQuizzes.length}</strong> {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
                {searchQuery && ` matching "${searchQuery}"`}
              </Typography>
            </Box>
          )}

          {/* Full Quizzes Grid */}
          {loading ? (
            <Grid container spacing={3.5}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Grid key={n} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ p: 2.5, borderRadius: '26px', bgcolor: '#FFFFFF', border: '1px solid rgba(10, 10, 10, 0.06)' }}>
                    <Skeleton variant="rounded" height={160} sx={{ borderRadius: '18px', mb: 2 }} />
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="rounded" height={46} sx={{ mt: 3, borderRadius: '999px' }} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : filteredQuizzes.length === 0 ? (
            <Card
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: '30px',
                bgcolor: '#FFFFFF',
                border: '1.5px dashed rgba(10, 10, 10, 0.15)',
                boxShadow: 'none',
              }}
            >
              <Box
                sx={{
                  width: 68,
                  height: 68,
                  borderRadius: '22px',
                  bgcolor: '#F5F4EB',
                  color: '#0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2.5,
                }}
              >
                <Iconify icon="solar:document-text-bold-duotone" width={36} />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.35rem',
                  color: '#0A0A0A',
                  mb: 1,
                }}
              >
                No matching quizzes found
              </Typography>
              <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#637381', maxWidth: 440, mx: 'auto', mb: 3, fontSize: '14.5px' }}>
                {searchQuery
                  ? `No quizzes matched "${searchQuery}". Try searching with a different keyword or category.`
                  : 'There are currently no public quizzes in this category.'}
              </Typography>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  sx={{
                    borderRadius: '999px',
                    bgcolor: '#0A0A0A',
                    color: '#FFFFFF',
                    px: 3.5,
                    py: 1.2,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#36B37E' },
                  }}
                >
                  Clear Search Filter
                </Button>
              )}
            </Card>
          ) : (
            <Grid container spacing={3.5}>
              {filteredQuizzes.map((quiz) => {
                const hasCover = Boolean(quiz.image);

                return (
                  <Grid key={quiz.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '26px',
                        bgcolor: '#FFFFFF',
                        boxShadow: '0 8px 24px rgba(1, 23, 56, 0.05)',
                        border: '1px solid rgba(10, 10, 10, 0.08)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 18px 36px rgba(1, 23, 56, 0.1)',
                          borderColor: 'rgba(10, 10, 10, 0.2)',
                        },
                      }}
                    >
                      {/* Header Chips Row */}
                      <Box sx={{ p: 2.25, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.4,
                            borderRadius: '999px',
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 700,
                            fontSize: '11px',
                            color: '#4361F2',
                            bgcolor: 'rgba(67, 97, 242, 0.08)',
                            border: '1px solid rgba(67, 97, 242, 0.2)',
                          }}
                        >
                          Public Quiz
                        </Box>

                        {quiz.attempt && (
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.4,
                              borderRadius: '999px',
                              fontFamily: '"Plus Jakarta Sans", sans-serif',
                              fontWeight: 700,
                              fontSize: '11px',
                              bgcolor:
                                quiz.attempt.status === 'COMPLETED'
                                  ? quiz.attempt.is_passed
                                    ? 'rgba(54, 179, 126, 0.15)'
                                    : 'rgba(239, 68, 68, 0.12)'
                                  : 'rgba(253, 199, 69, 0.25)',
                              color:
                                quiz.attempt.status === 'COMPLETED'
                                  ? quiz.attempt.is_passed
                                    ? '#1B806A'
                                    : '#B91C1C'
                                  : '#B45309',
                            }}
                          >
                            {quiz.attempt.status === 'COMPLETED'
                              ? `${quiz.attempt.is_passed ? 'Passed' : 'Failed'} (${Number(quiz.attempt.percentage).toFixed(0)}%)`
                              : 'In Progress'}
                          </Box>
                        )}
                      </Box>

                      {/* Quiz Cover Image or Bauhaus Placeholder */}
                      <Box sx={{ px: 2.25 }}>
                        {hasCover ? (
                          <Box
                            component="img"
                            src={quiz.image!}
                            alt={quiz.title}
                            sx={{
                              width: '100%',
                              height: 160,
                              objectFit: 'cover',
                              borderRadius: '18px',
                              bgcolor: '#011738',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 160,
                              borderRadius: '18px',
                              bgcolor: '#011738',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 2,
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255, 255, 255, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1.25,
                                color: '#FDC745',
                              }}
                            >
                              <Iconify icon="solar:document-text-bold-duotone" width={28} />
                            </Box>
                            <Typography
                              sx={{
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                color: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: '14px',
                                textAlign: 'center',
                                maxWidth: '90%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {quiz.title}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#77E7B3', fontSize: '11px', fontWeight: 600 }}>
                              mcqpro • Verified Exam
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Card Body */}
                      <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          sx={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 800,
                            mb: 0.75,
                            fontSize: '1.1rem',
                            color: '#0A0A0A',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {quiz.title}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            color: '#637381',
                            mb: 2,
                            flexGrow: 1,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 38,
                            fontSize: '13.5px',
                            lineHeight: 1.45,
                          }}
                        >
                          {quiz.description || 'Test your knowledge and practice your exam skills with this quiz.'}
                        </Typography>

                        {/* Info Metadata */}
                        <Stack spacing={0.85} sx={{ mb: 2.5, pt: 1.5, borderTop: '1px dashed rgba(10, 10, 10, 0.08)' }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="solar:clock-circle-bold" width={16} sx={{ color: '#637381' }} />
                            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '12.5px', color: '#637381' }}>
                              Duration: <strong style={{ color: '#0A0A0A' }}>{quiz.duration_minutes} minutes</strong>
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="solar:question-circle-bold" width={16} sx={{ color: '#637381' }} />
                            <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '12.5px', color: '#637381' }}>
                              Questions: <strong style={{ color: '#0A0A0A' }}>{quiz.questions_count}</strong> • Total Marks:{' '}
                              <strong style={{ color: '#0A0A0A' }}>{Number(quiz.total_marks).toFixed(2)}</strong>
                            </Typography>
                          </Stack>

                          {quiz.teacher?.name && (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify icon="solar:user-bold" width={16} sx={{ color: '#637381' }} />
                              <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '12.5px', color: '#637381' }}>
                                Teacher: <strong style={{ color: '#0A0A0A' }}>{quiz.teacher.name}</strong>
                              </Typography>
                            </Stack>
                          )}
                        </Stack>

                        {/* Card Action Button */}
                        <Button
                          fullWidth
                          onClick={() => handleStartQuiz(quiz)}
                          startIcon={
                            <Iconify
                              icon={
                                quiz.attempt?.status === 'COMPLETED'
                                ? 'solar:clipboard-check-bold'
                                : 'solar:play-circle-bold'
                              }
                            />
                          }
                          sx={{
                            fontFamily: '"Plus Jakarta Sans", sans-serif',
                            fontWeight: 700,
                            fontSize: '14.5px',
                            borderRadius: '999px',
                            py: 1.25,
                            height: 48,
                            textTransform: 'none',
                            bgcolor:
                              quiz.attempt?.status === 'COMPLETED'
                                ? '#011738'
                                : quiz.attempt?.status === 'IN_PROGRESS'
                                ? '#FDC745'
                                : '#36B37E',
                            color:
                              quiz.attempt?.status === 'IN_PROGRESS'
                                ? '#0A0A0A'
                                : '#FFFFFF',
                            boxShadow:
                              quiz.attempt?.status === 'IN_PROGRESS' || quiz.attempt?.status === 'COMPLETED'
                                ? 'none'
                                : '0 6px 18px rgba(54, 179, 126, 0.3)',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              bgcolor:
                                quiz.attempt?.status === 'COMPLETED'
                                  ? '#022452'
                                  : quiz.attempt?.status === 'IN_PROGRESS'
                                  ? '#E5A817'
                                  : '#1B806A',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 10px 24px rgba(54, 179, 126, 0.4)',
                            },
                          }}
                        >
                          {quiz.attempt?.status === 'COMPLETED'
                            ? 'Review Results'
                            : quiz.attempt?.status === 'IN_PROGRESS'
                            ? 'Resume Quiz'
                            : 'Start Quiz Now'}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Guest Sign-In / Registration Dialog */}
      <Dialog
        open={Boolean(guestDialogQuiz)}
        onClose={() => setGuestDialogQuiz(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#F5F4EB',
              color: '#0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <Iconify icon="solar:lock-keyhole-minimalistic-bold-duotone" width={30} color="#36B37E" />
          </Box>
          <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: '1.35rem', color: '#0A0A0A' }}>
            Sign In to Start Quiz
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#637381', fontSize: '14px', mb: 2 }}>
            To begin <strong>{guestDialogQuiz?.title}</strong> and have your answers automatically graded with saved results, please sign in or create a quick free student account.
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Button
              fullWidth
              onClick={() => {
                const targetQuizId = guestDialogQuiz?.id;
                setGuestDialogQuiz(null);
                navigate(`/sign-in?redirect=/student/quizzes/${targetQuizId}/take`);
              }}
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700,
                fontSize: '14.5px',
                borderRadius: '999px',
                bgcolor: '#36B37E',
                color: '#FFFFFF',
                py: 1.3,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(54, 179, 126, 0.3)',
                '&:hover': { bgcolor: '#1B806A' },
              }}
            >
              Sign In to Take Quiz
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setGuestDialogQuiz(null);
                navigate('/sign-up');
              }}
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                fontSize: '14.5px',
                borderRadius: '999px',
                borderColor: '#9A9A92',
                color: '#0A0A0A',
                py: 1.3,
                textTransform: 'none',
                '&:hover': { borderColor: '#0A0A0A', bgcolor: 'rgba(10, 10, 10, 0.04)' },
              }}
            >
              Create Free Account
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setGuestDialogQuiz(null)} sx={{ color: '#637381', textTransform: 'none', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <LandingFooter onScrollToQuizzes={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </Box>
  );
}

