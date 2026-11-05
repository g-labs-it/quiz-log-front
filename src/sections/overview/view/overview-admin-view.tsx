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
      total_institutes: number;
      total_users: number;
      total_classes: number;
      total_quizzes: number;
      total_attempts: number;
      completed_attempts: number;
      average_score: number;
      overall_pass_rate: number;
      roles_distribution: {
        admins: number;
        managers: number;
        institute_owners: number;
        teachers: number;
        students: number;
      };
    };
    recent_users: any[];
    recent_quizzes: any[];
    recent_attempts: any[];
  };
}

export function OverviewAdminView({ data }: Props) {
  const navigate = useNavigate();
  const { summary, recent_quizzes = [], recent_attempts = [] } = data;

  const statCards = [
    {
      title: 'Total Institutes',
      total: summary.total_institutes,
      icon: 'solar:buildings-bold-duotone',
      color: '#00A76F',
      bgColor: 'rgba(0, 167, 111, 0.08)',
      path: '/institutes',
    },
    {
      title: 'Total Users',
      total: summary.total_users,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: '#0288d1',
      bgColor: 'rgba(2, 136, 209, 0.08)',
      path: '/user',
    },
    {
      title: 'Total Classes',
      total: summary.total_classes,
      icon: 'solar:book-bookmark-bold-duotone',
      color: '#8e24aa',
      bgColor: 'rgba(142, 36, 170, 0.08)',
      path: '/classes',
    },
    {
      title: 'Total Quizzes',
      total: summary.total_quizzes,
      icon: 'solar:document-text-bold-duotone',
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.08)',
      path: '/quizzes',
    },
  ];

  return (
    <Stack spacing={4}>
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

      {/* Secondary Metrics Row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Overall Quiz Pass Rate
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {summary.overall_pass_rate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({summary.completed_attempts} of {summary.total_attempts} attempts completed)
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, summary.overall_pass_rate)}
              color="success"
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Average Quiz Score
            </Typography>
            <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
              {summary.average_score}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calculated across all student completed attempts
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Registered Users by Role
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Students</Typography>
                <Chip label={summary.roles_distribution?.students || 0} size="small" color="primary" />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Teachers</Typography>
                <Chip label={summary.roles_distribution?.teachers || 0} size="small" color="secondary" />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Institute Owners</Typography>
                <Chip label={summary.roles_distribution?.institute_owners || 0} size="small" color="warning" />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Managers & Admins</Typography>
                <Chip
                  label={(summary.roles_distribution?.admins || 0) + (summary.roles_distribution?.managers || 0)}
                  size="small"
                  color="default"
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Sections */}
      <Grid container spacing={3}>
        {/* Recent Quizzes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Recent Quizzes"
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
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_quizzes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No quizzes found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent_quizzes.map((q) => (
                      <TableRow key={q.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 180 }}>
                            {q.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{q.class?.name || 'General'}</TableCell>
                        <TableCell>
                          <Chip
                            label={q.status}
                            size="small"
                            color={q.status === 'PUBLISHED' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{fDateTime(q.created_at, 'DD/MM/YYYY')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        {/* Recent Attempts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Recent Quiz Submissions" />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_attempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No quiz attempts recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent_attempts.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{a.student_name}</TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                            {a.quiz_title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {a.score} / {a.total_marks} ({a.percentage}%)
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={a.is_passed ? 'PASSED' : 'FAILED'}
                            size="small"
                            color={a.is_passed ? 'success' : 'error'}
                          />
                        </TableCell>
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
