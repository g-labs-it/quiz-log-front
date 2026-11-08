import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type PublicQuizItem = {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  duration_minutes: number;
  total_marks: number;
  pass_marks?: number;
  questions_count: number;
  is_public: boolean;
  institute?: { id?: number; name?: string } | null;
  teacher?: { id?: number; name?: string } | null;
  attempt?: {
    id: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
    score: number;
    total_marks: number;
    percentage: number;
    is_passed: boolean;
  } | null;
};

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function LandingQuizzesShowcase({ searchQuery, onSearchChange }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [quizzes, setQuizzes] = useState<PublicQuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [guestDialogQuiz, setGuestDialogQuiz] = useState<PublicQuizItem | null>(null);

  useEffect(() => {
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

  // Filtered quizzes
  const filteredQuizzes = useMemo(() => quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Quick Tests') return quiz.duration_minutes <= 20;
      if (selectedCategory === 'Standard Exams') return quiz.duration_minutes > 20 && quiz.duration_minutes <= 45;
      if (selectedCategory === 'Full Length') return quiz.duration_minutes > 45;

      return true;
    }), [quizzes, searchQuery, selectedCategory]);

  const handleStartQuiz = (quiz: PublicQuizItem) => {
    if (isAuthenticated) {
      if (quiz.attempt?.status === 'COMPLETED') {
        navigate(`/student/quizzes/${quiz.attempt.id}/review`);
      } else {
        navigate(`/student/quizzes/${quiz.id}/take`);
      }
    } else {
      // Prompt guest modal with instant sign in or direct registration
      setGuestDialogQuiz(quiz);
    }
  };

  return (
    <Box
      id="quizzes"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.neutral',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Heading */}
        <Stack spacing={2} sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', justifyContent: 'center' }}>
            <Chip
              label="Open to Everyone"
              size="small"
              sx={{
                px: 1,
                py: 0.5,
                fontWeight: 700,
                borderRadius: 1,
                bgcolor: 'primary.lighter',
                color: 'primary.darker',
                fontSize: 12,
              }}
            />
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Featured Public Quizzes
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 620, mx: 'auto', fontSize: 16 }}>
            Browse and take practice exams created by educators. Select any quiz below to test your
            knowledge immediately.
          </Typography>

          {/* Search & Category Filter Row */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 3 }}
          >
            {/* Category Filter Chips */}
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', maxWidth: '100%', py: 0.5 }}>
              {['All', 'Quick Tests', 'Standard Exams', 'Full Length'].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setSelectedCategory(cat)}
                  color={selectedCategory === cat ? 'primary' : 'default'}
                  variant={selectedCategory === cat ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: 1,
                    fontWeight: 700,
                    px: 0.5,
                  }}
                />
              ))}
            </Stack>

            {/* In-Section Search Bar */}
            <TextField
              size="small"
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:magnifer-linear" width={18} sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: { xs: '100%', sm: 260 }, bgcolor: 'background.paper', borderRadius: 1 }}
            />
          </Stack>
        </Stack>

        {/* Quizzes Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map((n) => (
              <Grid key={n} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ p: 2.5, borderRadius: 2 }}>
                  <Skeleton variant="rounded" height={160} sx={{ borderRadius: 1.5, mb: 2 }} />
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rounded" height={42} sx={{ mt: 3, borderRadius: 1 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredQuizzes.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1.5px dashed',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Iconify icon="solar:document-text-bold-duotone" width={36} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              No public quizzes found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 440, mx: 'auto', mb: 3 }}>
              {searchQuery
                ? `No quizzes matched "${searchQuery}". Try searching with a different keyword or filter.`
                : 'There are currently no public quizzes published yet. Check back soon!'}
            </Typography>
            {searchQuery && (
              <Button variant="outlined" color="primary" onClick={() => onSearchChange('')}>
                Clear Search Filter
              </Button>
            )}
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredQuizzes.map((quiz) => {
              const hasCover = Boolean(quiz.image);

              return (
                <Grid key={quiz.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
                        borderColor: 'primary.light',
                      },
                    }}
                  >
                    {/* Header Chips Row */}
                    <Box sx={{ p: 2, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label="Public Quiz"
                        size="small"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          color: '#7928CA',
                          bgcolor: 'rgba(121, 40, 202, 0.08)',
                          border: '1px solid rgba(121, 40, 202, 0.2)',
                        }}
                      />

                      {quiz.attempt && (
                        <Chip
                          label={
                            quiz.attempt.status === 'COMPLETED'
                              ? `${quiz.attempt.is_passed ? 'Passed' : 'Failed'} (${Number(quiz.attempt.percentage).toFixed(0)}%)`
                              : 'In Progress'
                          }
                          size="small"
                          color={
                            quiz.attempt.status === 'COMPLETED'
                              ? quiz.attempt.is_passed
                                ? 'success'
                                : 'error'
                              : 'warning'
                          }
                          sx={{ borderRadius: 1, fontWeight: 700, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>

                    {/* Quiz Cover Image or Elegant Sample Fallback */}
                    <Box sx={{ px: 2 }}>
                      {hasCover ? (
                        <Box
                          component="img"
                          src={quiz.image!}
                          alt={quiz.title}
                          sx={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: '#000000',
                          }}
                        />
                      ) : (
                        /* Sophisticated Sample Cover Placeholder */
                        <Box
                          sx={{
                            width: '100%',
                            height: 150,
                            borderRadius: 1.5,
                            background: 'linear-gradient(135deg, #111928 0%, #1F2A37 50%, #007867 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 1.5,
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(8px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1,
                              color: '#5BE49B',
                            }}
                          >
                            <Iconify icon="solar:document-text-bold-duotone" width={28} />
                          </Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: 'common.white',
                              fontWeight: 700,
                              textAlign: 'center',
                              maxWidth: '90%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {quiz.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 600 }}>
                            mcqpro • Practice Exam
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Card Body */}
                    <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 0.75,
                          fontSize: '1.05rem',
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
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mb: 2,
                          flexGrow: 1,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: 40,
                          lineHeight: 1.45,
                        }}
                      >
                        {quiz.description || 'Test your knowledge and practice your exam skills with this quiz.'}
                      </Typography>

                      {/* Info Metadata */}
                      <Stack spacing={0.75} sx={{ mb: 2.5, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:clock-circle-bold" width={16} sx={{ color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Duration: <strong>{quiz.duration_minutes} minutes</strong>
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon="solar:question-circle-bold" width={16} sx={{ color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Questions: <strong>{quiz.questions_count}</strong> • Total Marks:{' '}
                            <strong>{Number(quiz.total_marks).toFixed(2)}</strong>
                          </Typography>
                        </Stack>

                        {/* Teacher Attribution (respects rule: hidden if created by admin) */}
                        {quiz.teacher?.name && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Iconify icon="solar:user-bold" width={16} sx={{ color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Teacher: <strong>{quiz.teacher.name}</strong>
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      {/* Card Action Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        color={
                          quiz.attempt?.status === 'COMPLETED'
                            ? 'inherit'
                            : quiz.attempt?.status === 'IN_PROGRESS'
                            ? 'warning'
                            : 'primary'
                        }
                        size="medium"
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
                          fontWeight: 700,
                          borderRadius: 1.25,
                          py: 1,
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

      {/* Guest Sign-In / Registration Dialog */}
      <Dialog
        open={Boolean(guestDialogQuiz)}
        onClose={() => setGuestDialogQuiz(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <Iconify icon="solar:lock-keyhole-minimalistic-bold-duotone" width={32} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Sign In to Start Quiz
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            To begin <strong>{guestDialogQuiz?.title}</strong> and have your answers automatically graded with saved results, please sign in or create a quick free student account.
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                const targetQuizId = guestDialogQuiz?.id;
                setGuestDialogQuiz(null);
                navigate(`/sign-in?redirect=/student/quizzes/${targetQuizId}/take`);
              }}
              sx={{ fontWeight: 700, borderRadius: 1.25 }}
            >
              Sign In to Take Quiz
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => {
                setGuestDialogQuiz(null);
                navigate('/sign-up');
              }}
              sx={{ fontWeight: 600, borderRadius: 1.25 }}
            >
              Create Free Account
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setGuestDialogQuiz(null)} color="inherit" size="small">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
