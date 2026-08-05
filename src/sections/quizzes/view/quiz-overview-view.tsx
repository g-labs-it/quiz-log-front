import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { QuizItem } from '../quiz-table-row';

// ----------------------------------------------------------------------

export function QuizOverviewView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [quiz, setQuiz] = useState<QuizItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/quizzes/${id}`);
      if (res.data && res.data.data) {
        setQuiz(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch quiz overview.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (errorMsg || !quiz) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg || 'Quiz not found.'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          onClick={() => navigate('/quizzes')}
        >
          Back to Quizzes
        </Button>
      </DashboardContent>
    );
  }

  const statusColor =
    quiz.status === 'PUBLISHED' ? 'success' : quiz.status === 'DRAFT' ? 'warning' : 'default';

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={() => navigate('/quizzes')}
          >
            Back
          </Button>
          <Typography variant="h4">{quiz.title}</Typography>
          <Chip label={quiz.status} color={statusColor} />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
        >
          Edit Quiz
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quiz Details
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Target Class / Institute
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {quiz.class?.name ? `Class: ${quiz.class.name}` : quiz.institute?.name ? `Institute: ${quiz.institute.name}` : 'General / Global'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Scheduled Date & Time
                </Typography>
                <Typography variant="body1">
                  {quiz.scheduled_at ? new Date(quiz.scheduled_at).toLocaleString() : 'Not Scheduled'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1">{quiz.duration_minutes} Minutes</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Questions & Marks
                </Typography>
                <Typography variant="body1">
                  {quiz.questions?.length || 0} Questions ({quiz.total_marks} Marks)
                </Typography>
              </Box>

              {quiz.pass_marks !== null && quiz.pass_marks !== undefined && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pass Marks
                  </Typography>
                  <Typography variant="body1">{quiz.pass_marks} Marks</Typography>
                </Box>
              )}

              {quiz.description && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Description / Instructions
                    </Typography>
                    <Typography variant="body2">{quiz.description}</Typography>
                  </Box>
                </>
              )}
            </Stack>
          </Card>
        </Grid>

        {/* Right Column: Questions Preview */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {quiz.questions?.map((q: any, index: number) => (
              <Card key={q.id || index} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6">
                    Q{index + 1}. {q.question_text}
                  </Typography>
                  <Chip label={`${q.marks} Marks`} size="small" variant="outlined" />
                </Box>

                {q.explanation && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fst: 'italic' }}>
                    Note: {q.explanation}
                  </Typography>
                )}

                <Stack spacing={1} sx={{ mt: 2 }}>
                  {q.options?.map((opt: any, oIndex: number) => (
                    <Box
                      key={opt.id || oIndex}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: opt.is_correct ? 'success.lighter' : 'background.neutral',
                        border: opt.is_correct ? '1px solid #00a76f' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="body2">
                        <strong>{String.fromCharCode(65 + oIndex)}.</strong> {opt.option_text}
                      </Typography>

                      {opt.is_correct && (
                        <Chip label="Correct Answer" color="success" size="small" />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
