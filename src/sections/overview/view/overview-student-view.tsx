import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  data: {
    summary: {
      enrolled_classes_count: number;
      available_quizzes_count: number;
      in_progress_count: number;
      completed_quizzes_count: number;
      passed_quizzes_count: number;
      average_score: number;
      pass_rate: number;
    };
    available_quizzes: any[];
    recent_attempts: any[];
    enrolled_classes: any[];
  };
}

export function OverviewStudentView({ data }: Props) {
  const navigate = useNavigate();
  const { summary, available_quizzes = [], recent_attempts = [], enrolled_classes = [] } = data;

  const statCards = [
    {
      title: 'Enrolled Classes',
      total: summary.enrolled_classes_count,
      icon: 'solar:book-bookmark-bold-duotone',
      color: '#00A76F',
      bgColor: 'rgba(0, 167, 111, 0.08)',
      actionText: 'View Classes',
    },
    {
      title: 'Quizzes Available',
      total: summary.available_quizzes_count,
      icon: 'solar:document-text-bold-duotone',
      color: '#0288d1',
      bgColor: 'rgba(2, 136, 209, 0.08)',
      path: '/student/quizzes',
    },
    {
      title: 'Quizzes Completed',
      total: summary.completed_quizzes_count,
      icon: 'solar:check-circle-bold-duotone',
      color: '#8e24aa',
      bgColor: 'rgba(142, 36, 170, 0.08)',
      path: '/student/quizzes',
    },
    {
      title: 'Average Score',
      total: `${summary.average_score}%`,
      icon: 'solar:cup-star-bold-duotone',
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.08)',
    },
  ];

  return (
    <Stack spacing={4}>
      {/* Quick Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4">My Learning & Quiz Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your class progress, take scheduled tests, and review past results
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:play-circle-bold" />}
          onClick={() => navigate('/student/quizzes')}
        >
          Go to My Quizzes
        </Button>
      </Stack>

      {/* Primary Stat Cards */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                cursor: card.path ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': card.path
                  ? {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 20px 0 rgba(0,0,0,0.1)',
                    }
                  : undefined,
              }}
              onClick={() => card.path && navigate(card.path)}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
                    {card.total}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: card.bgColor,
                    color: card.color,
                  }}
                >
                  <Iconify icon={card.icon} width={32} />
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Progress Card */}
      <Card sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" spacing={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              Overall Success Rate
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You have passed {summary.passed_quizzes_count} out of {summary.completed_quizzes_count} completed quizzes ({summary.pass_rate}%).
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, summary.pass_rate)}
              color="success"
              sx={{ height: 10, borderRadius: 1 }}
            />
          </Box>
          <Stack direction="row" spacing={3} sx={{ pl: { md: 4 }, borderLeft: { md: '1px dashed' }, borderColor: 'divider' }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="success.main">
                {summary.passed_quizzes_count}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Passed
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="error.main">
                {Math.max(0, summary.completed_quizzes_count - summary.passed_quizzes_count)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Failed
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* Available Quizzes & Recent Attempts */}
      <Grid container spacing={3}>
        {/* Available to Take */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Available Quizzes"
              subheader="Quizzes open for submission right now"
              action={
                <Button size="small" onClick={() => navigate('/student/quizzes')}>
                  View All
                </Button>
              }
            />
            <Stack spacing={2} sx={{ p: 3 }}>
              {available_quizzes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Iconify icon="solar:check-circle-bold" width={48} sx={{ color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2">No active quizzes pending! Great job.</Typography>
                </Box>
              ) : (
                available_quizzes.map((q) => (
                  <Card
                    key={q.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {q.title}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip label={q.class_name} size="small" variant="outlined" color="primary" />
                        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                          ⏱ {q.duration_minutes} mins | ❓ {q.questions_count} Qs
                        </Typography>
                      </Stack>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Iconify icon="solar:play-bold" />}
                      onClick={() => navigate(`/student/quizzes/${q.id}/take`)}
                    >
                      Start
                    </Button>
                  </Card>
                ))
              )}
            </Stack>
          </Card>
        </Grid>

        {/* Recent Performance & Results */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Recent Quiz Results" subheader="Review your submitted quiz answers" />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_attempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No quiz attempts submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent_attempts.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 160 }}>
                            {a.quiz_title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fDateTime(a.completed_at, 'DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {a.percentage}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {a.score}/{a.total_marks}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={a.is_passed ? 'PASSED' : 'FAILED'}
                            size="small"
                            color={a.is_passed ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/student/quiz-attempts/${a.id}/review`)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        {/* Enrolled Classes */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="My Enrolled Classes" />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Institute</TableCell>
                    <TableCell>Teacher</TableCell>
                    <TableCell>Schedule</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrolled_classes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        You are not enrolled in any classes yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrolled_classes.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                        <TableCell>{c.institute_name}</TableCell>
                        <TableCell>{c.teacher_name}</TableCell>
                        <TableCell>{c.day ? `${c.day} ${c.time || ''}` : 'Flexible'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

