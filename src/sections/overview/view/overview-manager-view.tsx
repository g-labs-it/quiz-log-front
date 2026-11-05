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

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  data: {
    summary: {
      total_institutes: number;
      total_classes: number;
      total_teachers: number;
      total_students: number;
      total_quizzes: number;
      total_attempts: number;
      pass_rate: number;
    };
    recent_classes: any[];
    recent_quizzes: any[];
    recent_attempts: any[];
  };
}

export function OverviewManagerView({ data }: Props) {
  const navigate = useNavigate();
  const { summary, recent_classes = [], recent_attempts = [] } = data;

  const statCards = [
    {
      title: 'Active Institutes',
      total: summary.total_institutes,
      icon: 'solar:buildings-bold-duotone',
      color: '#00A76F',
      bgColor: 'rgba(0, 167, 111, 0.08)',
      path: '/institutes',
    },
    {
      title: 'Total Classes',
      total: summary.total_classes,
      icon: 'solar:book-bookmark-bold-duotone',
      color: '#0288d1',
      bgColor: 'rgba(2, 136, 209, 0.08)',
      path: '/classes',
    },
    {
      title: 'Teachers',
      total: summary.total_teachers,
      icon: 'solar:user-bold-duotone',
      color: '#8e24aa',
      bgColor: 'rgba(142, 36, 170, 0.08)',
      path: '/user',
    },
    {
      title: 'Enrolled Students',
      total: summary.total_students,
      icon: 'solar:users-group-rounded-bold-duotone',
      color: '#ed6c02',
      bgColor: 'rgba(237, 108, 2, 0.08)',
      path: '/user',
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Platform Quiz Pass Rate
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {summary.pass_rate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                from {summary.total_attempts} total student attempts
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
              Total Quizzes Created
            </Typography>
            <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
              {summary.total_quizzes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active question banks and scheduled assessments across all classes
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Content Tables */}
      <Grid container spacing={3}>
        {/* Active Classes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Classes Overview"
              action={
                <Button size="small" onClick={() => navigate('/classes')}>
                  View All
                </Button>
              }
            />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Institute</TableCell>
                    <TableCell>Teacher</TableCell>
                    <TableCell align="center">Students</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_classes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No classes recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recent_classes.map((c) => (
                      <TableRow key={c.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                        <TableCell>{c.institute_name}</TableCell>
                        <TableCell>{c.teacher_name}</TableCell>
                        <TableCell align="center">
                          <Chip label={c.students_count} size="small" variant="outlined" />
                        </TableCell>
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
            <CardHeader title="Latest Quiz Submissions" />
            <Box sx={{ p: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Quiz</TableCell>
                    <TableCell>Score %</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent_attempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No submissions yet.
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
                        <TableCell>{a.percentage}%</TableCell>
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

