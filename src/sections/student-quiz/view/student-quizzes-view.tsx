import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface StudentQuiz {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  total_marks: string | number;
  pass_marks: string | number;
  questions_count: number;
  class: {
    id: number;
    name: string;
  };
  institute: {
    id: number;
    name: string;
  };
  teacher: {
    id: number;
    name: string;
  };
  attempt?: {
    id: number;
    status: 'IN_PROGRESS' | 'COMPLETED';
    score: number;
    total_marks: number;
    percentage: number;
    is_passed: boolean;
    duration_taken_seconds: number;
    completed_at: string | null;
  } | null;
}

export function StudentQuizzesView() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<StudentQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/student/quizzes');
      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        setQuizzes(response.data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const filteredQuizzes = quizzes.filter((q) => {
    const term = search.toLowerCase();
    return (
      q.title.toLowerCase().includes(term) ||
      (q.class?.name && q.class.name.toLowerCase().includes(term)) ||
      (q.teacher?.name && q.teacher.name.toLowerCase().includes(term))
    );
  });

  return (
    <DashboardContent>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">My Quizzes</Typography>
            <Typography variant="body2" color="text.secondary">
              Take scheduled quizzes and track your performance
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search quiz, class or teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:magnifer-bold" width={18} color="text.secondary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:refresh-bold" />}
              onClick={fetchQuizzes}
              disabled={loading}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {!!errorMsg && (
          <Alert severity="error" onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty state */}
        {!loading && filteredQuizzes.length === 0 && (
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
              <Iconify icon="solar:file-text-bold-duotone" width={64} sx={{ color: 'text.disabled' }} />
            </Box>
            <Typography variant="h6" color="text.secondary">
              No quizzes available
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              {search ? 'Try adjusting your search criteria.' : 'Your teachers have not published any quizzes for your classes yet.'}
            </Typography>
          </Card>
        )}

        {/* Quiz list grid */}
        {!loading && filteredQuizzes.length > 0 && (
          <Grid container spacing={3}>
            {filteredQuizzes.map((quiz) => {
              const attempt = quiz.attempt;
              const isCompleted = attempt?.status === 'COMPLETED';
              const isInProgress = attempt?.status === 'IN_PROGRESS';

              return (
                <Grid key={quiz.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 3,
                      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    {/* Header info */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Chip
                        label={quiz.class?.name || 'Class'}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                      {isCompleted ? (
                        <Chip
                          label={attempt.is_passed ? `Passed (${attempt.percentage}%)` : `Failed (${attempt.percentage}%)`}
                          size="small"
                          color={attempt.is_passed ? 'success' : 'error'}
                          variant="filled"
                        />
                      ) : isInProgress ? (
                        <Chip label="In Progress" size="small" color="warning" variant="filled" />
                      ) : (
                        <Chip label="Available" size="small" color="default" variant="outlined" />
                      )}
                    </Stack>

                    {/* Title & description */}
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                      {quiz.title}
                    </Typography>

                    {quiz.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {quiz.description}
                      </Typography>
                    )}

                    {/* Quiz meta details */}
                    <Stack spacing={1} sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:clock-circle-bold" width={16} color="text.secondary" />
                        <Typography variant="caption" color="text.secondary">
                          Duration: <strong>{quiz.duration_minutes} minutes</strong>
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:question-circle-bold" width={16} color="text.secondary" />
                        <Typography variant="caption" color="text.secondary">
                          Questions: <strong>{quiz.questions_count}</strong> | Total Marks: <strong>{quiz.total_marks}</strong>
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify icon="solar:user-bold" width={16} color="text.secondary" />
                        <Typography variant="caption" color="text.secondary">
                          Teacher: <strong>{quiz.teacher?.name || 'Instructor'}</strong>
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Action button */}
                    <Box sx={{ mt: 3 }}>
                      {isCompleted ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          startIcon={<Iconify icon="solar:document-text-bold" />}
                          onClick={() => navigate(`/student/quiz-attempts/${attempt.id}/review`)}
                        >
                          Review Results
                        </Button>
                      ) : isInProgress ? (
                        <Button
                          fullWidth
                          variant="contained"
                          color="warning"
                          startIcon={<Iconify icon="solar:play-circle-bold" />}
                          onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                        >
                          Resume Quiz
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<Iconify icon="solar:play-circle-bold" />}
                          onClick={() => navigate(`/student/quizzes/${quiz.id}/take`)}
                        >
                          Start Quiz
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Stack>
    </DashboardContent>
  );
}
