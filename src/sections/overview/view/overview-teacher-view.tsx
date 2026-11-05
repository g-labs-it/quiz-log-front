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
      total_classes: number;
      total_students: number;
      total_quizzes: number;
      published_quizzes: number;
      draft_quizzes: number;
      total_submissions: number;
      pass_rate: number;
      average_score: number;
    };
    my_classes: any[];
    upcoming_quizzes: any[];
    recent_attempts: any[];
  };
}

export function OverviewTeacherView({ data }: Props) {
  const navigate = useNavigate();
  const { summary, my_classes = [], upcoming_quizzes = [], recent_attempts = [] } = data;

  const statCards = [
    {
      title: 'My Classes',
      total: summary.total_classes,
      icon: 'solar:book-bookmark-bold-duotone',
      color: '#00A76F',
      bgColor: 'rgba(0, 167, 111, 0.08)',
      path: '/classes',
    },
    {
      title: 'My Students',
      total: summary.total_students,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: '#0288d1',
      bgColor: 'rgba(2, 136, 209, 0.08)',
      path: '/classes',
    },
    {
      title: 'Quizzes Created',
      total: summary.total_quizzes,
      icon: 'solar:document-text-bold-duotone',
      color: '#8e24aa',
      bgColor: 'rgba(142, 36, 170, 0.08)',
      path: '/quizzes',
    },
    {
      title: 'Total Submissions',
      total: summary.total_submissions,
      icon: 'solar:check-circle-bold-duotone',
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.08)',
      path: '/quizzes',
    },
  ];

  return (
    <Stack spacing={4}>
      {/* Quick Action Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4">Teacher Classroom & Quiz Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your classes, schedule tests, and monitor student progress
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={() => navigate('/quizzes/create')}
          >
            Create Quiz
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:users-group-rounded-bold" />}
            onClick={() => navigate('/classes')}
          >
            My Classes
          </Button>
        </Stack>
      </Stack>

      {/* Primary Stat Cards */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                cursor: 'pointer',
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 20px 0 rgba(0,0,0,0.1)',
                },
              }}
              onClick={() => navigate(card.path)}
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

      {/* Secondary Performance Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Student Overall Pass Rate
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {summary.pass_rate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                from {summary.total_submissions} graded attempts
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, summary.pass_rate)}
              color="success"
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Quiz Inventory & Average Performance
            </Typography>
            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Published Quizzes
                </Typography>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {summary.published_quizzes}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Drafts
                </Typography>
                <Typography variant="h4" fontWeight={700} color="text.secondary">
                  {summary.draft_quizzes}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Avg. Score
                </Typography>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {summary.average_score}%
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Tables: Upcoming Quizzes & My Classes */}
      <Grid container spacing={3}>
        {/* Active & Scheduled Quizzes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Active & Upcoming Quizzes"
              action={
                <Button size="small" onClick={() => navigate('/quizzes')}>
                  View All
                </Button>
              }
            />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Quiz Title</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Scheduled</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcoming_quizzes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No upcoming quizzes scheduled.
                      </TableCell>
                    </TableRow>
                  ) : (
                    upcoming_quizzes.map((q) => (
                      <TableRow key={q.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 160 }}>
                            {q.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{q.class?.name || 'All Classes'}</TableCell>
                        <TableCell>
                          {q.scheduled_at ? fDateTime(q.scheduled_at, 'DD/MM h:mm A') : 'Anytime'}
                        </TableCell>
                        <TableCell>{q.duration_minutes}m</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        {/* My Classes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="My Classes"
              action={
                <Button size="small" onClick={() => navigate('/classes')}>
                  Manage Classes
                </Button>
              }
            />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell align="center">Enrolled Students</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {my_classes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No classes assigned to you yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    my_classes.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                        <TableCell>
                          {c.day ? `${c.day} ${c.time || ''}` : 'Flexible Schedule'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${c.students_count} students`} size="small" color="primary" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        {/* Recent Student Submissions */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="Latest Student Submissions" />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Score %</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Submitted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_attempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No submissions received yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent_attempts.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{a.student_name}</TableCell>
                        <TableCell>{a.quiz_title}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{a.percentage}%</TableCell>
                        <TableCell>
                          <Chip
                            label={a.is_passed ? 'PASSED' : 'FAILED'}
                            size="small"
                            color={a.is_passed ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>{fDateTime(a.completed_at, 'DD/MM/YYYY h:mm A')}</TableCell>
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

