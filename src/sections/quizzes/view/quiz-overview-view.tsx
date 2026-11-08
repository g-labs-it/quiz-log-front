import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';
import { getImageUrl } from 'src/utils/image-url';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { QuizItem } from '../quiz-table-row';

// ----------------------------------------------------------------------

interface SubmissionItem {
  id: number;
  student_name: string;
  student_code: string;
  email: string | null;
  score: number;
  total_marks: number;
  percentage: number;
  is_passed: boolean;
  status: 'IN_PROGRESS' | 'COMPLETED';
  duration_taken_seconds: number;
  started_at: string;
  completed_at: string | null;
}

export function QuizOverviewView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [currentTab, setCurrentTab] = useState(0);
  const [quiz, setQuiz] = useState<QuizItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Submissions state
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const fetchSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axiosInstance.get(`/quizzes/${id}/attempts`);
      if (res.data?.status === 'success' || res.data?.success || res.data?.data) {
        setSubmissions(res.data.data.attempts || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingSubmissions(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuiz();
    fetchSubmissions();
  }, [fetchQuiz, fetchSubmissions]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
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

  if (errorMsg || !quiz) {
    return (
      <DashboardContent>
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg || 'Quiz not found.'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
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
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="solar:arrow-left-bold" />}
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, val) => setCurrentTab(val)}>
          <Tab label="Quiz Overview & Questions" />
          <Tab label={`Student Submissions (${submissions.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Overview & Questions */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {/* Left Column: Summary Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3 }}>
              <Box
                component="img"
                src={
                  quiz.image
                    ? getImageUrl(quiz.image)
                    : `/assets/images/cover/cover-${((quiz.id || 0) % 24) + 1}.webp`
                }
                alt={quiz.title}
                sx={{
                  width: '100%',
                  height: 160,
                  borderRadius: 1.5,
                  objectFit: 'cover',
                  mb: 2.5,
                }}
              />
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

                  {q.question_image && (
                    <Box sx={{ my: 1.5 }}>
                      <Box
                        component="img"
                        src={getImageUrl(q.question_image)}
                        alt="Question"
                        onClick={() => setPreviewImage(getImageUrl(q.question_image))}
                        sx={{
                          maxHeight: 240,
                          maxWidth: '100%',
                          borderRadius: 1,
                          objectFit: 'contain',
                          cursor: 'zoom-in',
                          transition: 'opacity 0.2s ease',
                          '&:hover': { opacity: 0.9 },
                        }}
                      />
                    </Box>
                  )}

                  {q.explanation && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                      Note: {q.explanation}
                    </Typography>
                  )}

                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {q.options?.map((opt: any, oIndex: number) => (
                      <Box
                        key={opt.id || oIndex}
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: opt.is_correct ? 'success.lighter' : 'background.neutral',
                          border: opt.is_correct ? '1px solid #00a76f' : '1px solid transparent',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25, flexShrink: 0 }}>
                            {String.fromCharCode(65 + oIndex)}.
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, flexGrow: 1 }}>
                            {opt.option_text && (
                              <Typography variant="body2" sx={{ fontWeight: opt.is_correct ? 600 : 400 }}>
                                {opt.option_text}
                              </Typography>
                            )}

                            {opt.option_image && (
                              <Box
                                sx={{
                                  position: 'relative',
                                  display: 'inline-flex',
                                  maxWidth: { xs: '100%', sm: 320 },
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  bgcolor: 'background.paper',
                                  p: 0.5,
                                  cursor: 'zoom-in',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: 2,
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewImage(getImageUrl(opt.option_image));
                                }}
                              >
                                <Box
                                  component="img"
                                  src={getImageUrl(opt.option_image)}
                                  alt="Option"
                                  sx={{
                                    display: 'block',
                                    maxHeight: 140,
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    borderRadius: 0.5,
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 6,
                                    right: 6,
                                    bgcolor: 'rgba(0,0,0,0.65)',
                                    color: 'common.white',
                                    px: 0.75,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    pointerEvents: 'none',
                                  }}
                                >
                                  <Iconify icon="solar:magnifer-zoom-in-bold" width={12} />
                                  Zoom
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Stack>

                        {opt.is_correct && (
                          <Chip label="Correct Answer" color="success" size="small" sx={{ flexShrink: 0 }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Student Submissions */}
      {currentTab === 1 && (
        <Card>
          <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Student Results & Submissions</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:refresh-bold" />}
              onClick={fetchSubmissions}
              disabled={loadingSubmissions}
            >
              Refresh
            </Button>
          </Box>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell>Student Code</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Time Taken</TableCell>
                    <TableCell>Submitted At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingSubmissions ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          No student submissions yet for this quiz.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((sub) => (
                      <TableRow key={sub.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                              {sub.student_code}
                            </Typography>
                            <Tooltip title={copiedCode === sub.student_code ? 'Copied!' : 'Copy Code'}>
                              <IconButton size="small" onClick={() => handleCopy(sub.student_code)}>
                                <Iconify
                                  icon={copiedCode === sub.student_code ? 'solar:check-read-bold' : 'solar:copy-bold'}
                                  width={16}
                                  color={copiedCode === sub.student_code ? 'success.main' : 'text.secondary'}
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{sub.student_name || 'Student'}</Typography>
                          {sub.email && (
                            <Typography variant="caption" color="text.secondary">
                              {sub.email}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sub.status}
                            size="small"
                            color={sub.status === 'COMPLETED' ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {sub.score} / {sub.total_marks}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {sub.percentage}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {sub.status === 'COMPLETED' ? (
                            <Chip
                              label={sub.is_passed ? 'PASSED' : 'FAILED'}
                              size="small"
                              color={sub.is_passed ? 'success' : 'error'}
                            />
                          ) : (
                            <Chip label="In Progress" size="small" color="default" />
                          )}
                        </TableCell>
                        <TableCell>{formatDuration(sub.duration_taken_seconds)}</TableCell>
                        <TableCell>
                          {sub.completed_at ? new Date(sub.completed_at).toLocaleString() : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Iconify icon="solar:document-text-bold" />}
                            onClick={() => navigate(`/student/quiz-attempts/${sub.id}/review`)}
                            disabled={sub.status !== 'COMPLETED'}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      )}

      {/* Enlarged Image Preview Lightbox Dialog */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={() => setPreviewImage(null)} size="small" aria-label="Close preview">
            <Iconify icon="solar:close-circle-bold" width={24} />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, textAlign: 'center', overflow: 'auto', maxHeight: '80vh' }}>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt="Enlarged view"
              sx={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 1.5,
                mx: 'auto',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}
