import { useRef, useState, useEffect, useCallback } from 'react';
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
  option_image?: File | string | null;
};

type QuestionType = {
  id?: number;
  question_text: string;
  explanation: string;
  marks: number;
  question_image?: File | string | null;
  options: OptionType[];
};

// ----------------------------------------------------------------------
// Small reusable image upload zone
// ----------------------------------------------------------------------

type ImageUploaderProps = {
  label: string;
  value: File | string | null | undefined;
  onChange: (file: File | null) => void;
  onRemove: () => void;
  compact?: boolean;
  apiBaseUrl?: string;
};

function ImageUploader({ label, value, onChange, onRemove, compact = false, apiBaseUrl = '' }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewSrc =
    value instanceof File
      ? URL.createObjectURL(value)
      : value
        ? `${apiBaseUrl}/storage/${value}`
        : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
    // reset input so the same file can be reselected after removal
    e.target.value = '';
  };

  if (compact) {
    // Inline compact uploader for options
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {previewSrc ? (
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Box
              component="img"
              src={previewSrc}
              alt="option"
              sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
            />
            <IconButton
              size="small"
              onClick={onRemove}
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 16,
                height: 16,
                bgcolor: 'error.main',
                color: 'white',
                p: 0,
                '&:hover': { bgcolor: 'error.dark' },
              }}
            >
              <Iconify icon="mingcute:close-line" width={10} />
            </IconButton>
          </Box>
        ) : (
          <Tooltip title={label}>
            <IconButton
              size="small"
              onClick={() => inputRef.current?.click()}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                border: '1.5px dashed',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { borderColor: 'success.main', color: 'success.main' },
              }}
            >
              <Iconify icon="solar:camera-add-bold" width={18} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  // Full uploader for quiz cover & question images
  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {previewSrc ? (
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={previewSrc}
            alt={label}
            sx={{
              width: '100%',
              height: compact ? 80 : 160,
              objectFit: 'cover',
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              display: 'block',
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ position: 'absolute', bottom: 8, right: 8 }}
          >
            <Button
              size="small"
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="solar:pen-bold" width={14} />}
              onClick={() => inputRef.current?.click()}
              sx={{ py: 0.5, px: 1.5, fontSize: 12 }}
            >
              Change
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />}
              onClick={onRemove}
              sx={{ py: 0.5, px: 1.5, fontSize: 12 }}
            >
              Remove
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            width: '100%',
            height: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1.5,
            cursor: 'pointer',
            color: 'text.secondary',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'success.main',
              color: 'success.main',
              bgcolor: 'rgba(0, 167, 111, 0.04)',
            },
          }}
        >
          <Iconify icon="solar:camera-add-bold" width={28} />
          <Typography variant="caption" fontWeight={600}>{label}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>JPG, PNG, WEBP — max 4MB</Typography>
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

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

  const apiBaseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dropdown lists
  const [classes, setClasses] = useState<any[]>([]);
  const [institutes, setInstitutes] = useState<any[]>([]);

  // Quiz cover image
  const [quizImage, setQuizImage] = useState<File | string | null>(null);

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
      question_image: null,
      options: [
        { option_text: '', is_correct: false, option_image: null },
        { option_text: '', is_correct: false, option_image: null },
        { option_text: '', is_correct: false, option_image: null },
        { option_text: '', is_correct: false, option_image: null },
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

        // Load existing quiz cover image path
        if (q.image) setQuizImage(q.image);

        if (q.questions && q.questions.length > 0) {
          setQuestions(
            q.questions.map((quest: any) => ({
              id: quest.id,
              question_text: quest.question_text || '',
              explanation: quest.explanation || '',
              marks: Number(quest.marks) || 1,
              question_image: quest.question_image || null,
              options: quest.options
                ? quest.options.map((opt: any) => ({
                    id: opt.id,
                    option_text: opt.option_text || '',
                    is_correct: Boolean(opt.is_correct),
                    option_image: opt.option_image || null,
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
        question_image: null,
        options: [
          { option_text: '', is_correct: false, option_image: null },
          { option_text: '', is_correct: false, option_image: null },
          { option_text: '', is_correct: false, option_image: null },
          { option_text: '', is_correct: false, option_image: null },
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
          options: [...q.options, { option_text: '', is_correct: false, option_image: null }],
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

  const handleOptionImageChange = (qIndex: number, oIndex: number, file: File | null) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx !== qIndex) return q;
        return {
          ...q,
          options: q.options.map((opt, oIdx) => {
            if (oIdx !== oIndex) return opt;
            return { ...opt, option_image: file };
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

  // Build FormData for multipart submission (PHP requires POST for file uploads)
  const buildFormData = (): FormData => {
    const fd = new FormData();

    // Quiz-level fields
    fd.append('title', quizData.title);
    fd.append('description', quizData.description || '');
    if (quizData.class_id) fd.append('class_id', quizData.class_id);
    if (quizData.institute_id) fd.append('institute_id', quizData.institute_id);
    if (quizData.scheduled_at) fd.append('scheduled_at', quizData.scheduled_at);
    fd.append('duration_minutes', String(quizData.duration_minutes));
    if (quizData.pass_marks) fd.append('pass_marks', String(quizData.pass_marks));
    fd.append('status', quizData.status);
    fd.append('randomize_questions', quizData.randomize_questions ? '1' : '0');
    fd.append('randomize_options', quizData.randomize_options ? '1' : '0');

    // Quiz cover image
    if (quizImage instanceof File) {
      fd.append('image', quizImage);
    } else if (typeof quizImage === 'string') {
      fd.append('image', quizImage);
    }

    // For update: PHP can't receive files via PUT, use method spoofing
    if (isEditing) {
      fd.append('_method', 'PUT');
    }

    // Questions & options (bracket notation for Laravel array parsing)
    questions.forEach((q, qIdx) => {
      fd.append(`questions[${qIdx}][question_text]`, q.question_text);
      fd.append(`questions[${qIdx}][explanation]`, q.explanation || '');
      fd.append(`questions[${qIdx}][marks]`, String(q.marks));

      if (q.question_image instanceof File) {
        fd.append(`questions[${qIdx}][question_image]`, q.question_image);
      } else if (typeof q.question_image === 'string' && q.question_image) {
        fd.append(`questions[${qIdx}][question_image]`, q.question_image);
      }

      q.options.forEach((opt, oIdx) => {
        fd.append(`questions[${qIdx}][options][${oIdx}][option_text]`, opt.option_text);
        fd.append(`questions[${qIdx}][options][${oIdx}][is_correct]`, opt.is_correct ? '1' : '0');

        if (opt.option_image instanceof File) {
          fd.append(`questions[${qIdx}][options][${oIdx}][option_image]`, opt.option_image);
        } else if (typeof opt.option_image === 'string' && opt.option_image) {
          fd.append(`questions[${qIdx}][options][${oIdx}][option_image]`, opt.option_image);
        }
      });
    });

    return fd;
  };

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

      const formData = buildFormData();

      // Always POST — PHP file uploads break on PUT. We use _method=PUT for editing.
      const url = isEditing ? `/quizzes/${id}` : '/quizzes';
      await axiosInstance.post(url, formData);

      navigate('/quizzes');
    } catch (err: any) {
      console.error('Quiz save error:', err);
      // err = error.response.data from axios interceptor
      // Validation error: { status, message, errors: MessageBag }
      if (err?.errors && typeof err.errors === 'object') {
        const firstKey = Object.keys(err.errors)[0];
        const firstMsg = Array.isArray(err.errors[firstKey])
          ? err.errors[firstKey][0]
          : String(err.errors[firstKey]);
        setErrorMsg(firstMsg || err.message || 'Validation failed. Please check your inputs.');
      } else if (err?.message) {
        setErrorMsg(err.message);
      } else if (typeof err === 'string') {
        setErrorMsg(err);
      } else {
        setErrorMsg('Failed to save quiz. Please try again.');
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

              {/* Quiz Cover Image */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Cover Image (Optional)
                </Typography>
                <ImageUploader
                  label="Upload Cover Image"
                  value={quizImage}
                  onChange={(file) => setQuizImage(file)}
                  onRemove={() => setQuizImage(null)}
                  apiBaseUrl={apiBaseUrl}
                />
              </Box>

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

                  {/* Question Image Upload */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.75, display: 'block' }}>
                      Question Image (Optional)
                    </Typography>
                    <ImageUploader
                      label="Upload Question Image"
                      value={q.question_image}
                      onChange={(file) => handleQuestionChange(qIndex, 'question_image', file)}
                      onRemove={() => handleQuestionChange(qIndex, 'question_image', null)}
                      apiBaseUrl={apiBaseUrl}
                    />
                  </Box>

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
                              flexShrink: 0,
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
                              sx={{ flexShrink: 0 }}
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

                          {/* Option Image Upload (compact) */}
                          <ImageUploader
                            label="Add image"
                            value={opt.option_image}
                            onChange={(file) => handleOptionImageChange(qIndex, oIndex, file)}
                            onRemove={() => handleOptionImageChange(qIndex, oIndex, null)}
                            compact
                            apiBaseUrl={apiBaseUrl}
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
