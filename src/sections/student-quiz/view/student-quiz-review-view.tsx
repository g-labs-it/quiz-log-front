import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ReviewOption {
  id: number;
  option_text: string;
  option_image: string | null;
  is_correct: boolean;
}

interface ReviewQuestion {
  id: number;
  question_text: string;
  question_image: string | null;
  explanation: string | null;
  marks: string | number;
  marks_awarded: string | number;
  is_correct: boolean;
  chosen_option_ids: number[];
  options: ReviewOption[];
}

interface ReviewData {
  attempt: {
    id: number;
    status: string;
    score: number;
    total_marks: number;
    percentage: number;
    is_passed: boolean;
    duration_taken_seconds: number;
    started_at: string;
    completed_at: string;
  };
  quiz: {
    id: number;
    title: string;
    duration_minutes: number;
    total_marks: number;
    pass_marks: number;
  };
  questions: ReviewQuestion[];
}

export function StudentQuizReviewView() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<ReviewData | null>(null);

  const fetchReview = useCallback(async () => {
    if (!attemptId) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get(`/student/quiz-attempts/${attemptId}/review`);
      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch quiz review.');
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading result summary...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (errorMsg || !data) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ my: 4 }}>
          {errorMsg || 'Review data not found.'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/student/quizzes')}>
          Back to My Quizzes
        </Button>
      </DashboardContent>
    );
  }

  const { attempt, quiz, questions } = data;

  return (
    <DashboardContent>
      <Stack spacing={4}>
        {/* Header bar */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">{quiz.title} — Results</Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted on {new Date(attempt.completed_at).toLocaleString()}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
            onClick={() => navigate('/student/quizzes')}
          >
            Back to Quizzes
          </Button>
        </Stack>

        {/* Score Overview Card */}
        <Card
          sx={{
            p: 4,
            boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
            borderTop: '6px solid',
            borderColor: attempt.is_passed ? 'success.main' : 'error.main',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: attempt.is_passed ? 'success.lighter' : 'error.lighter',
                  color: attempt.is_passed ? 'success.dark' : 'error.dark',
                  mb: 1.5,
                }}
              >
                <Iconify
                  icon={attempt.is_passed ? 'solar:cup-star-bold' : 'solar:close-circle-bold'}
                  width={48}
                />
              </Box>
              <Typography variant="h4" fontWeight={800}>
                {attempt.percentage}%
              </Typography>
              <Chip
                label={attempt.is_passed ? 'PASSED' : 'FAILED'}
                color={attempt.is_passed ? 'success' : 'error'}
                sx={{ fontWeight: 700, mt: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Score
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {attempt.score} / {attempt.total_marks}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Pass Mark
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {quiz.pass_marks}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Time Taken
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatDuration(attempt.duration_taken_seconds)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Questions
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {questions.length}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Correct Answers
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    {questions.filter((q) => q.is_correct).length}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Incorrect / Missed
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    {questions.filter((q) => !q.is_correct).length}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* Detailed Questions Review */}
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={700}>
            Question Review
          </Typography>

          {questions.map((q, idx) => (
              <Card
                key={q.id}
                sx={{
                  p: 3,
                  borderLeft: '4px solid',
                  borderColor: q.is_correct ? 'success.main' : 'error.main',
                }}
              >
                {/* Question header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Question {idx + 1}
                  </Typography>
                  <Chip
                    label={
                      q.is_correct
                        ? `Correct (+${q.marks_awarded} marks)`
                        : `Incorrect (0 / ${q.marks} marks)`
                    }
                    color={q.is_correct ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>

                {/* Question text */}
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                  {q.question_text}
                </Typography>

                {q.question_image && (
                  <Box sx={{ mb: 2 }}>
                    <Box
                      component="img"
                      src={q.question_image}
                      alt="Question"
                      sx={{ maxHeight: 200, maxWidth: '100%', borderRadius: 1 }}
                    />
                  </Box>
                )}

                {/* Options List */}
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {q.options.map((opt) => {
                    const wasChosen = q.chosen_option_ids.includes(opt.id);
                    const isCorrect = opt.is_correct;

                    let bg = 'background.paper';
                    let border = 'divider';
                    let color = 'text.primary';

                    if (isCorrect && wasChosen) {
                      bg = 'success.lighter';
                      border = 'success.main';
                      color = 'success.darker';
                    } else if (isCorrect && !wasChosen) {
                      bg = 'success.lighter';
                      border = 'success.light';
                      color = 'success.darker';
                    } else if (!isCorrect && wasChosen) {
                      bg = 'error.lighter';
                      border = 'error.main';
                      color = 'error.darker';
                    }

                    return (
                      <Box
                        key={opt.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: border,
                          bgcolor: bg,
                          color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Iconify
                            icon={
                              wasChosen
                                ? isCorrect
                                  ? 'solar:check-circle-bold'
                                  : 'solar:close-circle-bold'
                                : isCorrect
                                ? 'solar:check-circle-linear'
                                : 'solar:record-minimalistic-linear'
                            }
                            width={20}
                            color={
                              wasChosen
                                ? isCorrect
                                  ? 'success.main'
                                  : 'error.main'
                                : isCorrect
                                ? 'success.main'
                                : 'text.disabled'
                            }
                          />
                          <Typography variant="body2" fontWeight={wasChosen || isCorrect ? 600 : 400}>
                            {opt.option_text}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          {wasChosen && (
                            <Chip
                              label="Your Choice"
                              size="small"
                              variant="outlined"
                              color={isCorrect ? 'success' : 'error'}
                              sx={{ fontSize: '0.75rem' }}
                            />
                          )}
                          {isCorrect && (
                            <Chip
                              label="Correct Answer"
                              size="small"
                              color="success"
                              variant="filled"
                              sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>

                {/* Explanation */}
                {q.explanation && (
                  <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </Alert>
                )}
              </Card>
            ))}
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
