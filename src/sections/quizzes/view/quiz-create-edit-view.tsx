import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type OptionType = {
  id?: number;
  option_text: string;
  is_correct: boolean;
};

type QuestionType = {
  id?: number;
  question_text: string;
  explanation: string;
  marks: number;
  options: OptionType[];
};

export function QuizCreateEditView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const urlClassId = searchParams.get('class_id');
  const isEditing = Boolean(id);

  const { user } = useAuth();
  const userRoles = (user as any)?.role || [];
  const isTeacher =
    Array.isArray(userRoles) &&
    userRoles.includes('Teacher') &&
    !userRoles.includes('Super-Admin') &&
    !userRoles.includes('Admin') &&
    !userRoles.includes('Institute Owner');

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown lists
  const [classes, setClasses] = useState<any[]>([]);
  const [institutes, setInstitutes] = useState<any[]>([]);

  // Form State
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    class_id: urlClassId ? String(urlClassId) : '',
    institute_id: '',
    scheduled_at: '',
    duration_minutes: 30,
    pass_marks: '',
    status: 'DRAFT',
    randomize_questions: false,
    randomize_options: false,
  });

  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      question_text: '',
      explanation: '',
      marks: 1,
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    },
  ]);

  // Fetch dropdown data (Classes & Institutes safely via Promise.allSettled)
  const fetchData = useCallback(async () => {
    try {
      const [classRes, instRes] = await Promise.allSettled([
        axiosInstance.get('/classes', { params: { per_page: 500 } }),
        axiosInstance.get('/institutes', { params: { per_page: 500 } }),
      ]);

      if (classRes.status === 'fulfilled' && classRes.value.data) {
        const raw = classRes.value.data.data;
        const list = Array.isArray(raw) ? raw : raw?.data || [];
        setClasses(list);

        if (urlClassId) {
          setQuizData((prev) => ({ ...prev, class_id: String(urlClassId) }));
        }
      }

      if (instRes.status === 'fulfilled' && instRes.value.data) {
        const raw = instRes.value.data.data;
        const list = Array.isArray(raw) ? raw : raw?.data || [];
        setInstitutes(list);
      }
    } catch (err) {
      console.error('Failed to fetch dropdown options', err);
    }
  }, [urlClassId]);

  // Fetch existing quiz if editing
  const fetchQuizDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/quizzes/${id}`);
      if (res.data && res.data.data) {
        const q = res.data.data;
        setQuizData({
          title: q.title || '',
          description: q.description || '',
          class_id: q.class_id ? String(q.class_id) : '',
          institute_id: q.institute_id ? String(q.institute_id) : '',
          scheduled_at: q.scheduled_at ? q.scheduled_at.slice(0, 16) : '',
          duration_minutes: q.duration_minutes || 30,
          pass_marks: q.pass_marks !== null && q.pass_marks !== undefined ? String(q.pass_marks) : '',
          status: q.status || 'DRAFT',
          randomize_questions: Boolean(q.randomize_questions),
          randomize_options: Boolean(q.randomize_options),
        });

        if (q.questions && q.questions.length > 0) {
          setQuestions(
            q.questions.map((quest: any) => ({
              id: quest.id,
              question_text: quest.question_text || '',
              explanation: quest.explanation || '',
              marks: Number(quest.marks) || 1,
              options: quest.options
                ? quest.options.map((opt: any) => ({
                    id: opt.id,
                    option_text: opt.option_text || '',
                    is_correct: Boolean(opt.is_correct),
                  }))
                : [],
            }))
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load quiz details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    if (isEditing) {
      fetchQuizDetail();
    }
  }, [fetchData, fetchQuizDetail, isEditing]);

  // Question & Option Handlers (Immutable State Updates)
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question_text: '',
        explanation: '',
        marks: 1,
        options: [
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      setErrorMsg('A quiz must have at least 1 question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx !== qIndex) return q;
        return {
          ...q,
          options: [...q.options, { option_text: '', is_correct: false }],
        };
      })
    );
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length <= 2) {
      setErrorMsg('A question must have at least 2 options.');
      return;
    }
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx !== qIndex) return q;
        return {
          ...q,
          options: q.options.filter((_, oIdx) => oIdx !== oIndex),
        };
      })
    );
  };

  const handleOptionCorrectToggle = (qIndex: number, oIndex: number, forcedVal?: boolean) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx !== qIndex) return q;
        return {
          ...q,
          options: q.options.map((opt, oIdx) => {
            if (oIdx !== oIndex) return opt;
            return {
              ...opt,
              is_correct: forcedVal !== undefined ? forcedVal : !opt.is_correct,
            };
          }),
        };
      })
    );
  };

  const handleOptionTextChange = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx !== qIndex) return q;
        return {
          ...q,
          options: q.options.map((opt, oIdx) => {
            if (oIdx !== oIndex) return opt;
            return { ...opt, option_text: value };
          }),
        };
      })
    );
  };

  const handleQuestionChange = (qIndex: number, field: keyof QuestionType, value: any) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx !== qIndex) return q;
        return { ...q, [field]: value };
      })
    );
  };

  // Calculate Total Marks
  const calculatedTotalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitLoading(true);

    try {
      if (isTeacher && !quizData.class_id) {
        setErrorMsg('Please select a class for this quiz.');
        setSubmitLoading(false);
        return;
      }

      for (let i = 0; i < questions.length; i += 1) {
        const hasCorrect = questions[i].options.some((opt) => opt.is_correct);
        if (!hasCorrect) {
          setErrorMsg(`Question ${i + 1} must have at least one correct option checked.`);
          setSubmitLoading(false);
          return;
        }
      }

      const payload = {
        title: quizData.title,
        description: quizData.description,
        class_id: quizData.class_id || null,
        institute_id: quizData.institute_id || null,
        scheduled_at: quizData.scheduled_at || null,
        duration_minutes: Number(quizData.duration_minutes),
        pass_marks: quizData.pass_marks ? Number(quizData.pass_marks) : null,
        status: quizData.status,
        randomize_questions: quizData.randomize_questions,
        randomize_options: quizData.randomize_options,
        questions,
      };

      if (isEditing) {
        await axiosInstance.put(`/quizzes/${id}`, payload);
      } else {
        await axiosInstance.post('/quizzes', payload);
      }

      navigate('/quizzes');
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Validation failed. Please check inputs.');
      } else {
        setErrorMsg(err.message || 'Failed to save quiz.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* Top Header */}
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
          <Box>
            <Typography variant="h4">{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {questions.length} Questions • Total {calculatedTotalMarks} Marks
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSubmit}
          disabled={submitLoading}
          startIcon={<Iconify icon="solar:pen-bold" />}
          sx={{ px: 3, fontWeight: 'bold' }}
        >
          {submitLoading ? 'Saving...' : 'Save Quiz'}
        </Button>
      </Box>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: General Configuration */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
              <Iconify icon="solar:settings-bold-duotone" width={24} sx={{ color: 'success.main' }} />
              <Typography variant="h6">Quiz Configuration</Typography>
            </Stack>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Quiz Title"
                placeholder="e.g. Mathematics Mid-Term Evaluation"
                value={quizData.title}
                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                required
                helperText="Enter a clear title for students to identify this quiz"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description / Instructions"
                placeholder="e.g. Answer all questions within the allocated time. No calculators allowed."
                value={quizData.description}
                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
              />

              <FormControl fullWidth required={isTeacher}>
                <InputLabel>Class {isTeacher ? '(Required for Teachers)' : ''}</InputLabel>
                <Select
                  label={`Class ${isTeacher ? '(Required for Teachers)' : ''}`}
                  value={quizData.class_id}
                  onChange={(e) => setQuizData({ ...quizData, class_id: e.target.value })}
                >
                  <MenuItem value="">Select Target Class</MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {!isTeacher && (
                <FormControl fullWidth>
                  <InputLabel>Institute (Optional)</InputLabel>
                  <Select
                    label="Institute (Optional)"
                    value={quizData.institute_id}
                    onChange={(e) => setQuizData({ ...quizData, institute_id: e.target.value })}
                  >
                    <MenuItem value="">Select Institute</MenuItem>
                    {institutes.map((inst) => (
                      <MenuItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                type="datetime-local"
                label="Scheduled Start Date & Time"
                value={quizData.scheduled_at}
                onChange={(e) => setQuizData({ ...quizData, scheduled_at: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText="When the quiz will open for students"
              />

              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (Mins)"
                    value={quizData.duration_minutes}
                    onChange={(e) =>
                      setQuizData({ ...quizData, duration_minutes: Number(e.target.value) })
                    }
                    required
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Pass Marks"
                    value={quizData.pass_marks}
                    onChange={(e) => setQuizData({ ...quizData, pass_marks: e.target.value })}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={quizData.status}
                  onChange={(e) => setQuizData({ ...quizData, status: e.target.value as any })}
                >
                  <MenuItem value="DRAFT">DRAFT (Hidden from Students)</MenuItem>
                  <MenuItem value="PUBLISHED">PUBLISHED (Active)</MenuItem>
                  <MenuItem value="ARCHIVED">ARCHIVED (Closed)</MenuItem>
                </Select>
              </FormControl>

              <Divider />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={quizData.randomize_questions}
                    onChange={(e) =>
                      setQuizData({ ...quizData, randomize_questions: e.target.checked })
                    }
                    color="success"
                  />
                }
                label="Randomize Questions Order"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={quizData.randomize_options}
                    onChange={(e) =>
                      setQuizData({ ...quizData, randomize_options: e.target.checked })
                    }
                    color="success"
                  />
                }
                label="Randomize Answer Options"
              />
            </Stack>
          </Card>
        </Grid>

        {/* Right Column: Dynamic Questions Builder */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Alert severity="info" icon={<Iconify icon="solar:eye-bold" />}>
              <strong>How to set correct answers:</strong> Check the box next to an option to mark it as correct. If multiple boxes are checked, students must select all correct answers.
            </Alert>

            {questions.map((q, qIndex) => {
              const correctCount = q.options.filter((o) => o.is_correct).length;

              return (
                <Card
                  key={qIndex}
                  sx={{
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 6px 20px 0 rgba(0,0,0,0.09)',
                    },
                  }}
                >
                  {/* Question Header Bar */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip
                        label={`Question ${qIndex + 1}`}
                        color="success"
                        size="medium"
                        sx={{ fontWeight: 'bold' }}
                      />

                      {correctCount > 1 && (
                        <Chip
                          label="Multiple Correct Answers"
                          color="info"
                          size="small"
                          variant="filled"
                        />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        size="small"
                        type="number"
                        label="Marks"
                        value={q.marks}
                        onChange={(e) =>
                          handleQuestionChange(qIndex, 'marks', Number(e.target.value))
                        }
                        sx={{ width: 90 }}
                      />

                      <Tooltip title="Delete Question">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          disabled={questions.length <= 1}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Question Prompt *"
                    placeholder="Enter question text here..."
                    value={q.question_text}
                    onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                    required
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Explanation / Answer Key Notes (Optional)"
                    placeholder="Provide context or explanation for why the answer is correct"
                    value={q.explanation}
                    onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Options list — check the correct answer(s):
                  </Typography>

                  <Stack spacing={1.5}>
                    {q.options.map((opt, oIndex) => {
                      const letterLabel = String.fromCharCode(65 + oIndex); // A, B, C, D...

                      return (
                        <Box
                          key={oIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.25,
                            borderRadius: 1.5,
                            bgcolor: opt.is_correct ? 'rgba(0, 167, 111, 0.08)' : 'background.neutral',
                            border: opt.is_correct ? '1.5px solid #00a76f' : '1px solid transparent',
                            transition: 'all 0.15s ease-in-out',
                          }}
                        >
                          {/* Option Letter Badge */}
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: 13,
                              bgcolor: opt.is_correct ? 'success.main' : 'grey.300',
                              color: opt.is_correct ? 'common.white' : 'text.primary',
                            }}
                          >
                            {letterLabel}
                          </Box>

                          <Tooltip title={opt.is_correct ? 'Marked as Correct Answer' : 'Click checkbox to set as correct answer'}>
                            <Checkbox
                              checked={Boolean(opt.is_correct)}
                              onChange={(e) => handleOptionCorrectToggle(qIndex, oIndex, e.target.checked)}
                              color="success"
                            />
                          </Tooltip>

                          <TextField
                            fullWidth
                            size="small"
                            placeholder={`Option ${letterLabel} text...`}
                            value={opt.option_text}
                            onChange={(e) => handleOptionTextChange(qIndex, oIndex, e.target.value)}
                            required
                          />

                          <Tooltip title="Remove Option">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveOption(qIndex, oIndex)}
                                disabled={q.options.length <= 2}
                              >
                                <Iconify icon="mingcute:close-line" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      );
                    })}
                  </Stack>

                  <Box sx={{ mt: 2.5 }}>
                    <Button
                      size="small"
                      color="success"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                      onClick={() => handleAddOption(qIndex)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Add Option Choice
                    </Button>
                  </Box>
                </Card>
              );
            })}

            <Button
              fullWidth
              variant="outlined"
              color="success"
              size="large"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddQuestion}
              sx={{ py: 2, borderStyle: 'dashed', borderWidth: 2, fontWeight: 'bold' }}
            >
              Add Question
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
