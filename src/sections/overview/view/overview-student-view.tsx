import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface ScoreTrendItem {
  attempt_id: number;
  quiz_id: number;
  title: string;
  score_percentage: number;
  pass_percentage: number;
  is_passed: boolean;
  date: string;
}

interface Props {
  data: {
    summary: {
      enrolled_classes_count: number;
      available_quizzes_count: number;
      in_progress_count: number;
      completed_quizzes_count: number;
      passed_quizzes_count: number;
      failed_quizzes_count?: number;
      average_score: number;
      highest_score?: number;
      lowest_score?: number;
      pass_rate: number;
      total_time_spent_seconds?: number;
    };
    score_trend?: ScoreTrendItem[];
    available_quizzes: any[];
    recent_attempts: any[];
    enrolled_classes: any[];
  };
}

function formatDuration(totalSeconds: number) {
  if (!totalSeconds || totalSeconds <= 0) return '0 mins';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} mins`;
}

export function OverviewStudentView({ data }: Props) {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    summary,
    score_trend = [],
    available_quizzes = [],
    recent_attempts = [],
    enrolled_classes = [],
  } = data;

  const failedCount =
    summary.failed_quizzes_count ??
    Math.max(0, summary.completed_quizzes_count - summary.passed_quizzes_count);

  // Metric Cards
  const statCards = [
    {
      title: 'Quizzes Completed',
      total: summary.completed_quizzes_count,
      sublabel: `${summary.in_progress_count} in progress`,
      icon: 'solar:check-circle-bold-duotone',
      color: '#8e24aa',
      bgColor: 'rgba(142, 36, 170, 0.08)',
      path: '/student/quizzes',
    },
    {
      title: 'Passed Quizzes',
      total: summary.passed_quizzes_count,
      sublabel: `${summary.pass_rate}% pass rate`,
      icon: 'solar:diploma-verified-bold-duotone',
      color: '#00A76F',
      bgColor: 'rgba(0, 167, 111, 0.08)',
      path: '/student/quizzes',
    },
    {
      title: 'Average Score',
      total: `${summary.average_score}%`,
      sublabel: 'Across all tests',
      icon: 'solar:cup-star-bold-duotone',
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.08)',
    },
    {
      title: 'Highest Score',
      total: `${summary.highest_score ?? summary.average_score}%`,
      sublabel: 'Personal best',
      icon: 'solar:medal-ribbons-star-bold-duotone',
      color: '#0288d1',
      bgColor: 'rgba(2, 136, 209, 0.08)',
    },
    {
      title: 'Time Invested',
      total: formatDuration(summary.total_time_spent_seconds || 0),
      sublabel: 'Total test duration',
      icon: 'solar:clock-circle-bold-duotone',
      color: '#454f5b',
      bgColor: 'rgba(69, 79, 91, 0.08)',
    },
  ];

  // Chart configuration for learning progress curve
  const chartCategories = score_trend.map((item, idx) => item.date || `#${idx + 1}`);
  const userScores = score_trend.map((item) => item.score_percentage);
  const passMarks = score_trend.map((item) => item.pass_percentage);

  const chartOptions = useChart({
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    stroke: { width: [3, 2], curve: 'smooth', dashArray: [0, 5] },
    fill: {
      type: ['gradient', 'solid'],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartCategories,
      labels: {
        rotate: -20,
        rotateAlways: chartCategories.length > 6,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (val: number) => `${Math.round(val)}%`,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => (val !== undefined ? `${val.toFixed(1)}%` : ''),
      },
    },
  });

  return (
    <Stack spacing={4}>
      {/* Quick Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Student Learning & Progress Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Measure your quiz performance, review past test answers, and track your learning curve.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:play-circle-bold" />}
          onClick={() => navigate('/student/quizzes')}
        >
          Browse Quizzes
        </Button>
      </Stack>

      {/* KPI Stat Cards */}
      <Grid container spacing={2.5}>
        {statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card
              sx={{
                p: 2.5,
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
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {card.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    {card.sublabel}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: card.bgColor,
                    color: card.color,
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={card.icon} width={28} />
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress Chart & Mastery Breakdown */}
      <Grid container spacing={3}>
        {/* Learning Progress Curve (ApexCharts) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Learning Progress & Score Trend"
              subheader="Chronological percentage scores across your completed quiz attempts"
            />
            <Box sx={{ p: 2.5, flexGrow: 1 }}>
              {score_trend.length === 0 ? (
                <Box
                  sx={{
                    py: 8,
                    textAlign: 'center',
                    color: 'text.secondary',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="solar:chart-square-bold"
                    width={56}
                    sx={{ color: 'text.disabled', mb: 1.5 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    No quiz score trend yet
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: 360, mb: 2.5 }}>
                    Complete your first quiz to view your real-time score progression and benchmark curve.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Iconify icon="solar:play-circle-bold" />}
                    onClick={() => navigate('/student/quizzes')}
                  >
                    Start a Quiz
                  </Button>
                </Box>
              ) : (
                <Chart
                  type="area"
                  series={[
                    { name: 'Your Score (%)', data: userScores },
                    { name: 'Pass Mark Baseline (%)', data: passMarks },
                  ]}
                  options={chartOptions}
                  sx={{ height: 320 }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Performance Mastery & Success Gauge */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Performance Mastery
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Overall quiz pass rate and success ratio
            </Typography>

            <Box sx={{ textAlign: 'center', my: 'auto', py: 2 }}>
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  color:
                    summary.pass_rate >= 75
                      ? 'success.main'
                      : summary.pass_rate >= 50
                        ? 'warning.main'
                        : 'text.primary',
                }}
              >
                {summary.pass_rate}%
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                Overall Pass Rate
              </Typography>
              <Box sx={{ px: 2, mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, summary.pass_rate)}
                  color={summary.pass_rate >= 50 ? 'success' : 'warning'}
                  sx={{ height: 10, borderRadius: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} textAlign="center">
              <Grid size={4}>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {summary.passed_quizzes_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Passed
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {failedCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Failed
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {summary.available_quizzes_count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Available
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Available Quizzes & Recent Quiz Results */}
      <Grid container spacing={3}>
        {/* Available to Take (Class + Public Quizzes) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Available Quizzes"
              subheader="Quizzes open for you to take right now"
              action={
                <Button size="small" onClick={() => navigate('/student/quizzes')}>
                  View All ({summary.available_quizzes_count})
                </Button>
              }
            />
            <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1 }}>
              {available_quizzes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Iconify
                    icon="solar:check-circle-bold"
                    width={44}
                    sx={{ color: 'text.disabled', mb: 1 }}
                  />
                  <Typography variant="body2">No pending quizzes available right now.</Typography>
                </Box>
              ) : (
                available_quizzes.map((q) => (
                  <Card
                    key={q.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      borderRadius: 1.5,
                      transition: 'border-color 0.2s',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {q.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={q.is_public ? 'Public Quiz' : q.class_name}
                          size="small"
                          variant="outlined"
                          color={q.is_public ? 'secondary' : 'primary'}
                          sx={{ fontSize: '0.72rem', height: 20 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          ⏱ {q.duration_minutes}m • ❓ {q.questions_count} Qs
                        </Typography>
                      </Stack>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Iconify icon="solar:play-bold" />}
                      onClick={() => navigate(`/student/quizzes/${q.id}/take`)}
                      sx={{ flexShrink: 0 }}
                    >
                      Start
                    </Button>
                  </Card>
                ))
              )}
            </Stack>
          </Card>
        </Grid>

        {/* Recent Quiz Results Table */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Recent Quiz Results & History"
              subheader="Review your completed submissions and answer keys"
            />
            <Box sx={{ p: 2, overflowX: 'auto', flexGrow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Target</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_attempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No quiz attempts submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent_attempts.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 180 }}>
                            {a.quiz_title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fDateTime(a.completed_at, 'DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={a.is_public ? 'Public Quiz' : a.class_name}
                            size="small"
                            variant="outlined"
                            color={a.is_public ? 'secondary' : 'default'}
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>
                            {a.percentage}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {a.score} / {a.total_marks}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={a.is_passed ? 'PASSED' : 'FAILED'}
                            size="small"
                            color={a.is_passed ? 'success' : 'error'}
                            variant="filled"
                            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<Iconify icon="solar:document-text-bold" />}
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

        {/* Enrolled Classes (if any) */}
        {enrolled_classes.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader title="My Enrolled Classes" subheader="Classes you are actively registered in" />
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
                    {enrolled_classes.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                        <TableCell>{c.institute_name}</TableCell>
                        <TableCell>{c.teacher_name}</TableCell>
                        <TableCell>{c.day ? `${c.day} ${c.time || ''}` : 'Flexible'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
