import { varAlpha } from 'minimal-shared/utils';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';
import { getImageUrl } from 'src/utils/image-url';

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
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<ReviewData | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'correct' | 'incorrect'>('all');

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
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const scrollToQuestion = (id: number) => {
    const el = document.getElementById(`question-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
          <CircularProgress size={44} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading quiz results and answer review...
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:arrow-left-linear" />}
          onClick={() => navigate('/student/quizzes')}
        >
          Back to My Quizzes
        </Button>
      </DashboardContent>
    );
  }

  const { attempt, quiz, questions } = data;

  const correctQuestions = questions.filter((q) => q.is_correct);
  const incorrectQuestions = questions.filter((q) => !q.is_correct);

  const filteredQuestions = questions.filter((q) => {
    if (filterTab === 'correct') return q.is_correct;
    if (filterTab === 'incorrect') return !q.is_correct;
    return true;
  });

  const accuracyRate =
    questions.length > 0 ? Math.round((correctQuestions.length / questions.length) * 100) : 0;

  return (
    <DashboardContent>
      <Stack spacing={3}>
        {/* Top Breadcrumb & Action Bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => navigate('/student/quizzes')}
                startIcon={<Iconify icon="solar:arrow-left-linear" width={16} />}
                sx={{ px: 1, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                My Quizzes
              </Button>
              <Typography variant="body2" color="text.disabled">
                /
              </Typography>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                Quiz Results
              </Typography>
            </Stack>
            <Typography variant="h4" fontWeight={700}>
              {quiz.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Completed on {fDateTime(attempt.completed_at)}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:arrow-left-linear" />}
            onClick={() => navigate('/student/quizzes')}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            Back to Quizzes
          </Button>
        </Stack>

        {/* Hero Performance Card */}
        <Card
          sx={{
            p: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: attempt.is_passed
              ? `linear-gradient(135deg, ${varAlpha(theme.vars.palette.success.lighterChannel, 0.45)}, ${varAlpha(theme.vars.palette.success.lightChannel, 0.15)})`
              : `linear-gradient(135deg, ${varAlpha(theme.vars.palette.error.lighterChannel, 0.45)}, ${varAlpha(theme.vars.palette.error.lightChannel, 0.15)})`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size="small"
                    icon={
                      <Iconify
                        icon={attempt.is_passed ? 'solar:cup-star-bold' : 'solar:info-circle-bold'}
                        width={16}
                      />
                    }
                    label={
                      attempt.is_passed
                        ? 'Congratulations! You Passed'
                        : 'Assessment Completed — Needs Improvement'
                    }
                    color={attempt.is_passed ? 'success' : 'error'}
                    sx={{ fontWeight: 700, px: 0.5 }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${attempt.percentage}% Score`}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: -0.5 }}>
                  {attempt.score} / {attempt.total_marks} Marks
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                  {attempt.is_passed
                    ? `Great job! You met the passing requirement of ${quiz.pass_marks} marks (${Math.round((Number(quiz.pass_marks) / Number(quiz.total_marks)) * 100)}%). Review your detailed question feedback below.`
                    : `You scored below the passing requirement of ${quiz.pass_marks} marks (${Math.round((Number(quiz.pass_marks) / Number(quiz.total_marks)) * 100)}%). Review the detailed explanations below to improve on your next attempt.`}
                </Typography>
              </Stack>
            </Grid>

            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.5,
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
                  border: '1px solid',
                  borderColor: 'divider',
                  minWidth: { xs: '100%', sm: 240 },
                }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: attempt.is_passed ? 'success.lighter' : 'error.lighter',
                    color: attempt.is_passed ? 'success.main' : 'error.main',
                  }}
                >
                  <Iconify
                    icon={attempt.is_passed ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                    width={32}
                  />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', fontWeight: 700 }}
                  >
                    Result Status
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color={attempt.is_passed ? 'success.main' : 'error.main'}
                  >
                    {attempt.is_passed ? 'PASSED' : 'FAILED'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Min. pass: {quiz.pass_marks} marks
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* 4 Stat Cards */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Final Score
                </Typography>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: attempt.is_passed ? 'success.lighter' : 'warning.lighter',
                    color: attempt.is_passed ? 'success.dark' : 'warning.dark',
                  }}
                >
                  <Iconify icon="solar:cup-star-bold" width={20} />
                </Avatar>
              </Stack>
              <Typography variant="h4" fontWeight={700}>
                {attempt.score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Out of {attempt.total_marks} total marks ({attempt.percentage}%)
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Accuracy
                </Typography>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'info.lighter',
                    color: 'info.dark',
                  }}
                >
                  <Iconify icon="solar:check-circle-bold" width={20} />
                </Avatar>
              </Stack>
              <Typography variant="h4" fontWeight={700}>
                {correctQuestions.length} / {questions.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {accuracyRate}% of questions answered correctly
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Incorrect / Missed
                </Typography>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'error.lighter',
                    color: 'error.dark',
                  }}
                >
                  <Iconify icon="solar:close-circle-bold" width={20} />
                </Avatar>
              </Stack>
              <Typography variant="h4" fontWeight={700} color="error.main">
                {incorrectQuestions.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Needs review in questions below
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Time Spent
                </Typography>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: 'secondary.lighter',
                    color: 'secondary.dark',
                  }}
                >
                  <Iconify icon="solar:clock-circle-bold" width={20} />
                </Avatar>
              </Stack>
              <Typography variant="h4" fontWeight={700}>
                {formatDuration(attempt.duration_taken_seconds)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Allowed time: {quiz.duration_minutes} minutes
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Question Jump & Filter Card */}
        <Card
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
          }}
        >
          <Stack spacing={2}>
            {/* Filter Tabs */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={2}
            >
              <Tabs
                value={filterTab}
                onChange={(_, val) => setFilterTab(val)}
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': {
                    minHeight: 40,
                    py: 0.5,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  },
                }}
              >
                <Tab label={`All Questions (${questions.length})`} value="all" />
                <Tab
                  label={`Correct (${correctQuestions.length})`}
                  value="correct"
                  icon={
                    <Iconify icon="solar:check-circle-bold" color="success.main" width={16} />
                  }
                  iconPosition="start"
                />
                <Tab
                  label={`Incorrect (${incorrectQuestions.length})`}
                  value="incorrect"
                  icon={<Iconify icon="solar:close-circle-bold" color="error.main" width={16} />}
                  iconPosition="start"
                />
              </Tabs>

              <Typography variant="caption" color="text.secondary">
                Click any question number to jump to its feedback
              </Typography>
            </Stack>

            <Divider />

            {/* Quick jump pills */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {questions.map((q, idx) => {
                const isSelectedTabMatch =
                  filterTab === 'all' ||
                  (filterTab === 'correct' && q.is_correct) ||
                  (filterTab === 'incorrect' && !q.is_correct);

                return (
                  <Tooltip
                    key={q.id}
                    title={`Question ${idx + 1}: ${q.is_correct ? 'Correct' : 'Incorrect'} (${q.marks_awarded}/${q.marks} marks)`}
                  >
                    <Box
                      component="button"
                      type="button"
                      onClick={() => scrollToQuestion(q.id)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: '1px solid',
                        transition: 'all 0.15s ease',
                        opacity: isSelectedTabMatch ? 1 : 0.35,
                        borderColor: q.is_correct ? 'success.main' : 'error.main',
                        bgcolor: q.is_correct ? 'success.lighter' : 'error.lighter',
                        color: q.is_correct ? 'success.darker' : 'error.darker',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      {idx + 1}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Stack>
        </Card>

        {/* Detailed Questions Review List */}
        <Stack spacing={3}>
          {filteredQuestions.length === 0 ? (
            <Card
              sx={{
                p: 6,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                No questions match the selected filter.
              </Typography>
            </Card>
          ) : (
            filteredQuestions.map((q) => {
              const originalIndex = questions.findIndex((orig) => orig.id === q.id);

              return (
                <Card
                  key={q.id}
                  id={`question-card-${q.id}`}
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {/* Question Header */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ mb: 2 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={`Question ${originalIndex + 1}`}
                        size="small"
                        color="default"
                        sx={{ fontWeight: 700, bgcolor: 'background.neutral' }}
                      />
                      <Chip
                        icon={
                          <Iconify
                            icon={
                              q.is_correct ? 'solar:check-circle-bold' : 'solar:close-circle-bold'
                            }
                            width={16}
                          />
                        }
                        label={
                          q.is_correct
                            ? `Earned +${q.marks_awarded} Marks`
                            : `0 / ${q.marks} Marks`
                        }
                        size="small"
                        color={q.is_correct ? 'success' : 'error'}
                        variant="filled"
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>

                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Total: {q.marks} Marks
                    </Typography>
                  </Stack>

                  {/* Question Text */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2.5, fontWeight: 600, lineHeight: 1.6 }}
                  >
                    {q.question_text}
                  </Typography>

                  {/* Question Image (if present) */}
                  {q.question_image && (
                    <Box
                      sx={{
                        mb: 3,
                        p: 1.5,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.neutral',
                        display: 'inline-block',
                        maxWidth: '100%',
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(q.question_image)}
                        alt="Question context"
                        sx={{
                          maxHeight: 280,
                          maxWidth: '100%',
                          borderRadius: 1,
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}

                  {/* Options List */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', fontWeight: 700, display: 'block', mb: 1.5 }}
                  >
                    Answer Options
                  </Typography>

                  <Stack spacing={1.5}>
                    {q.options.map((opt, oIdx) => {
                      const wasChosen = q.chosen_option_ids.includes(opt.id);
                      const isCorrect = opt.is_correct;
                      const letter = String.fromCharCode(65 + oIdx);

                      let cardBg = 'background.paper';
                      let cardBorder = theme.palette.divider;
                      let badgeColor: 'success' | 'error' | 'default' = 'default';

                      if (isCorrect && wasChosen) {
                        cardBg = varAlpha(theme.vars.palette.success.lighterChannel, 0.4);
                        cardBorder = theme.palette.success.main;
                        badgeColor = 'success';
                      } else if (!isCorrect && wasChosen) {
                        cardBg = varAlpha(theme.vars.palette.error.lighterChannel, 0.4);
                        cardBorder = theme.palette.error.main;
                        badgeColor = 'error';
                      } else if (isCorrect && !wasChosen) {
                        cardBg = varAlpha(theme.vars.palette.success.lighterChannel, 0.15);
                        cardBorder = theme.palette.success.light;
                        badgeColor = 'success';
                      }

                      return (
                        <Box
                          key={opt.id}
                          sx={{
                            p: 2,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: cardBorder,
                            bgcolor: cardBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ minWidth: 0, flexGrow: 1 }}
                          >
                            {/* Option Letter Circle */}
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                flexShrink: 0,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                bgcolor: isCorrect
                                  ? 'success.main'
                                  : wasChosen
                                    ? 'error.main'
                                    : 'background.neutral',
                                color: isCorrect || wasChosen ? 'white' : 'text.secondary',
                              }}
                            >
                              {letter}
                            </Box>

                            {/* Option Image thumbnail if available */}
                            {opt.option_image && (
                              <Box
                                component="img"
                                src={getImageUrl(opt.option_image)}
                                alt="Option"
                                sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 1,
                                  objectFit: 'cover',
                                  flexShrink: 0,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              />
                            )}

                            {/* Option Text */}
                            <Typography
                              variant="body2"
                              fontWeight={wasChosen || isCorrect ? 600 : 400}
                              sx={{ wordBreak: 'break-word' }}
                            >
                              {opt.option_text}
                            </Typography>
                          </Stack>

                          {/* Choice status badges */}
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ flexShrink: 0 }}
                          >
                            {wasChosen && (
                              <Chip
                                label={
                                  isCorrect ? 'Your Choice (Correct)' : 'Your Choice (Incorrect)'
                                }
                                size="small"
                                color={badgeColor}
                                variant={isCorrect ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                              />
                            )}

                            {isCorrect && !wasChosen && (
                              <Chip
                                label="Correct Answer"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                              />
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>

                  {/* Teacher's Explanation Callout */}
                  {q.explanation && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: varAlpha(theme.vars.palette.info.lighterChannel, 0.25),
                        border: '1px solid',
                        borderColor: varAlpha(theme.vars.palette.info.mainChannel, 0.2),
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Iconify
                          icon="solar:lightbulb-bold"
                          width={22}
                          color="info.main"
                          sx={{ flexShrink: 0, mt: 0.25 }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="info.darker"
                            sx={{ mb: 0.5 }}
                          >
                            Teacher&apos;s Explanation
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {q.explanation}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Card>
              );
            })
          )}
        </Stack>

        {/* Footer Navigation */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 2, pb: 4 }}
        >
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:arrow-left-linear" />}
            onClick={() => navigate('/student/quizzes')}
          >
            Back to My Quizzes
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:arrow-up-linear" />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Scroll to Top
          </Button>
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
