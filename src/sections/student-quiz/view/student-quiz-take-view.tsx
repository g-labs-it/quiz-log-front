import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';
import { getImageUrl } from 'src/utils/image-url';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Option {
  id: number;
  option_text: string;
  option_image: string | null;
}

interface Question {
  id: number;
  question_text: string;
  question_image: string | null;
  marks: string | number;
  allow_multiple_answers: boolean;
  options: Option[];
}

interface QuizData {
  id: number;
  title: string;
  duration_minutes: number;
  total_marks: string | number;
  pass_marks: string | number;
  remaining_seconds: number;
}

export function StudentQuizTakeView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Selected answers: map questionId -> array of optionIds
  const [answers, setAnswers] = useState<Record<number, number[]>>({});

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Submit ref to prevent double submission
  const isSubmittingRef = useRef(false);

  // Start / resume quiz attempt
  const initAttempt = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.post(`/student/quizzes/${id}/start`);
      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        const data = response.data.data;
        setAttemptId(data.attempt_id);
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
        setTimeLeft(Math.max(0, Math.floor(Number(data.quiz.remaining_seconds) || 0)));

        // Restore saved draft answers from localStorage if any
        try {
          const savedAnswers = localStorage.getItem(`quiz_attempt_${data.attempt_id}_answers`);
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }
        } catch {
          // ignore parsing error
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to start quiz attempt.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    initAttempt();
  }, [initAttempt]);

  // Persist answers to localStorage as student selects options
  useEffect(() => {
    if (attemptId && Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(`quiz_attempt_${attemptId}_answers`, JSON.stringify(answers));
      } catch {
        // ignore storage quota error
      }
    }
  }, [attemptId, answers]);

  // Actual submit handler
  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmittingRef.current || !attemptId) return;
    isSubmittingRef.current = true;
    setSubmitting(true);

    // Format answers array
    const formattedAnswers = questions.map((q) => ({
      question_id: q.id,
      selected_option_ids: answers[q.id] || [],
    }));

    try {
      const response = await axiosInstance.post(`/student/quiz-attempts/${attemptId}/submit`, {
        answers: formattedAnswers,
      });

      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        try {
          localStorage.removeItem(`quiz_attempt_${attemptId}_answers`);
        } catch {
          // ignore
        }
        navigate(`/student/quiz-attempts/${attemptId}/review`, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit quiz attempt.');
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  }, [attemptId, questions, answers, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!loading && quiz && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-submit when time expires
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    return undefined;
  }, [loading, quiz, timeLeft, handleSubmitQuiz]);

  const formatTimer = (rawSeconds: number) => {
    const totalSecs = Math.max(0, Math.floor(Number(rawSeconds) || 0));
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Option selection handlers
  const handleSingleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  const handleMultipleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const updated = current.includes(optionId)
        ? current.filter((idVal) => idVal !== optionId)
        : [...current, optionId];
      return {
        ...prev,
        [questionId]: updated,
      };
    });
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(answers).filter((arr) => arr.length > 0).length;

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Preparing your quiz session...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (errorMsg && !quiz) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ my: 4 }}>
          {errorMsg}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/student/quizzes')}>
          Back to Quizzes
        </Button>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3}>
        {/* Top bar with title and countdown */}
        <Card sx={{ p: 2.5, boxShadow: '0 2px 10px 0 rgba(0,0,0,0.06)' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {quiz?.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Questions: <strong>{questions.length}</strong> | Total Marks: <strong>{quiz?.total_marks}</strong>
              </Typography>
            </Box>

            {/* Timer chip */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: timeLeft < 120 ? 'error.lighter' : 'warning.lighter',
                  color: timeLeft < 120 ? 'error.darker' : 'warning.darker',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  fontFamily: 'monospace',
                }}
              >
                <Iconify
                  icon="solar:alarm-play-bold"
                  width={24}
                  color={timeLeft < 120 ? 'error.main' : 'warning.main'}
                />
                {formatTimer(timeLeft)}
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => setConfirmSubmitOpen(true)}
                disabled={submitting}
                startIcon={<Iconify icon="solar:check-circle-bold" />}
              >
                Submit Quiz
              </Button>
            </Stack>
          </Stack>
        </Card>

        {!!errorMsg && (
          <Alert severity="error" onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Question display area */}
          <Grid size={{ xs: 12, md: 8 }}>
            {currentQuestion ? (
              <Card sx={{ p: 4, minHeight: 450, display: 'flex', flexDirection: 'column' }}>
                {/* Question meta */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Chip
                    label={`Question ${currentIndex + 1} of ${questions.length}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Stack direction="row" spacing={1}>
                    {currentQuestion.allow_multiple_answers && (
                      <Chip label="Multiple Answers" size="small" variant="outlined" color="info" />
                    )}
                    <Chip label={`${currentQuestion.marks} Marks`} size="small" variant="outlined" />
                  </Stack>
                </Stack>

                {/* Question content */}
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, lineHeight: 1.6 }}>
                  {currentQuestion.question_text}
                </Typography>

                {currentQuestion.question_image && (
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Box
                      component="img"
                      src={getImageUrl(currentQuestion.question_image)}
                      alt="Question Image"
                      sx={{ maxHeight: 240, maxWidth: '100%', borderRadius: 1.5, objectFit: 'contain' }}
                    />
                  </Box>
                )}

                {/* Question Options */}
                <Box sx={{ flexGrow: 1 }}>
                  {currentQuestion.allow_multiple_answers ? (
                    // Checkbox Group
                    <Stack spacing={1.5}>
                      {currentQuestion.options.map((option) => {
                        const isChecked = (answers[currentQuestion.id] || []).includes(option.id);
                        return (
                          <Card
                            key={option.id}
                            variant="outlined"
                            onClick={() => handleMultipleSelect(currentQuestion.id, option.id)}
                            sx={{
                              p: 1.5,
                              cursor: 'pointer',
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              bgcolor: isChecked ? 'primary.lighter' : 'background.paper',
                              borderColor: isChecked ? 'primary.main' : 'divider',
                              '&:hover': { bgcolor: isChecked ? 'primary.lighter' : 'action.hover' },
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => handleMultipleSelect(currentQuestion.id, option.id)}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  {option.option_image && (
                                    <Box
                                      component="img"
                                      src={getImageUrl(option.option_image)}
                                      alt="Option"
                                      sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                                    />
                                  )}
                                  <Typography variant="body1" fontWeight={isChecked ? 600 : 400}>
                                    {option.option_text}
                                  </Typography>
                                </Box>
                              }
                              sx={{ m: 0, width: '100%' }}
                            />
                          </Card>
                        );
                      })}
                    </Stack>
                  ) : (
                    // Radio Group
                    <RadioGroup
                      value={(answers[currentQuestion.id] || [])[0] || ''}
                      onChange={(e) => handleSingleSelect(currentQuestion.id, Number(e.target.value))}
                    >
                      <Stack spacing={1.5}>
                        {currentQuestion.options.map((option) => {
                          const isSelected = (answers[currentQuestion.id] || [])[0] === option.id;
                          return (
                            <Card
                              key={option.id}
                              variant="outlined"
                              onClick={() => handleSingleSelect(currentQuestion.id, option.id)}
                              sx={{
                                p: 1.5,
                                cursor: 'pointer',
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                '&:hover': { bgcolor: isSelected ? 'primary.lighter' : 'action.hover' },
                              }}
                            >
                              <FormControlLabel
                                value={option.id}
                                control={<Radio />}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {option.option_image && (
                                      <Box
                                        component="img"
                                        src={getImageUrl(option.option_image)}
                                        alt="Option"
                                        sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                                      />
                                    )}
                                    <Typography variant="body1" fontWeight={isSelected ? 600 : 400}>
                                      {option.option_text}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, width: '100%' }}
                              />
                            </Card>
                          );
                        })}
                      </Stack>
                    </RadioGroup>
                  )}
                </Box>

                {/* Bottom Navigation Buttons */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="solar:arrow-left-bold" />}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </Button>

                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setAnswers((prev) => {
                        const copy = { ...prev };
                        delete copy[currentQuestion.id];
                        return copy;
                      });
                    }}
                    disabled={!(answers[currentQuestion.id]?.length > 0)}
                  >
                    Clear Selection
                  </Button>

                  <Button
                    variant="contained"
                    endIcon={<Iconify icon="solar:arrow-right-bold" />}
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                      } else {
                        setConfirmSubmitOpen(true);
                      }
                    }}
                  >
                    {currentIndex === questions.length - 1 ? 'Review & Submit' : 'Next'}
                  </Button>
                </Stack>
              </Card>
            ) : null}
          </Grid>

          {/* Right question palette */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Questions Navigator
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: 'primary.main' }} />
                  <Typography variant="caption">Answered ({answeredCount})</Typography>
                </Stack>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ width: 14, height: 14, borderRadius: 0.5, bgcolor: 'action.disabledBackground', border: '1px solid', borderColor: 'divider' }} />
                  <Typography variant="caption">Unanswered ({questions.length - answeredCount})</Typography>
                </Stack>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 1.5,
                }}
              >
                {questions.map((q, idx) => {
                  const isAnswered = (answers[q.id] || []).length > 0;
                  const isCurrent = idx === currentIndex;

                  return (
                    <Button
                      key={q.id}
                      variant={isCurrent ? 'outlined' : isAnswered ? 'contained' : 'text'}
                      color={isAnswered ? 'primary' : 'inherit'}
                      onClick={() => setCurrentIndex(idx)}
                      sx={{
                        minWidth: 0,
                        height: 40,
                        fontWeight: 700,
                        borderWidth: isCurrent ? 2 : 1,
                        borderColor: isCurrent ? 'primary.main' : undefined,
                        bgcolor: !isAnswered && !isCurrent ? 'action.hover' : undefined,
                      }}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </Box>

              <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  onClick={() => setConfirmSubmitOpen(true)}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="solar:check-circle-bold" />}
                >
                  {submitting ? 'Submitting...' : 'Submit Answers'}
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog open={confirmSubmitOpen} onClose={() => setConfirmSubmitOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Submit Quiz</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to finish and submit your quiz?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
          </Typography>
          {answeredCount < questions.length && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You have unanswered questions. Unanswered questions will receive 0 marks.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmitOpen(false)} color="inherit">
            Continue Answering
          </Button>
          <Button
            onClick={() => {
              setConfirmSubmitOpen(false);
              handleSubmitQuiz();
            }}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            Yes, Submit Now
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
