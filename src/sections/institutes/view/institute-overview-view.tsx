import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

interface SubjectItem {
  id: number;
  name: string;
  code: string;
}

interface TeacherItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subjects?: SubjectItem[];
}

interface InstituteDetail {
  id: number;
  name: string;
  address: string;
  is_active: boolean;
  owner?: { id: number; name: string; email: string } | null;
  created_at: string;
}

export function InstituteOverviewView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const canConfigure = user?.all_permissions?.includes('configure_institue_management');
  const canEdit = user?.all_permissions?.includes('update_institue_management');

  const [institute, setInstitute] = useState<InstituteDetail | null>(null);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [instRes, teachRes] = await Promise.all([
        axiosInstance.get(`/institutes/${id}`),
        axiosInstance.get(`/institutes/${id}/teachers`),
      ]);
      setInstitute(instRes.data?.data ?? null);
      setTeachers(teachRes.data?.data ?? []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load institute data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Flatten unique subjects across all teachers
  const allSubjects = Array.from(
    new Map(
      teachers.flatMap((t) => t.subjects ?? []).map((s) => [s.id, s])
    ).values()
  );

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate('/institutes')}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          sx={{ mb: 2 }}
        >
          Back to Institutes
        </Button>

        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {institute?.name?.charAt(0) ?? 'I'}
            </Avatar>
            <Box>
              <Typography variant="h4">{institute?.name}</Typography>
              <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                <Iconify icon="solar:home-angle-bold-duotone" width={16} sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {institute?.address}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            {canEdit && (
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={() => navigate(`/institutes/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            {canConfigure && (
              <Button
                variant="contained"
                startIcon={<Iconify icon="solar:settings-bold-duotone" />}
                onClick={() => navigate(`/institutes/${id}/configure`)}
              >
                Configure
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            label: 'Total Teachers',
            value: teachers.length,
            icon: 'solar:shield-keyhole-bold-duotone',
            color: '#4f80ff',
            bg: '#eef2ff',
          },
          {
            label: 'Subjects Taught',
            value: allSubjects.length,
            icon: 'solar:settings-bold-duotone',
            color: '#00b37e',
            bg: '#e6f9f2',
          },
          {
            label: 'Status',
            value: institute?.is_active ? 'Active' : 'Inactive',
            icon: 'solar:check-circle-bold',
            color: institute?.is_active ? '#00b37e' : '#919EAB',
            bg: institute?.is_active ? '#e6f9f2' : '#f4f6f8',
          },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 1.5,
                    bgcolor: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={stat.icon as any} width={28} sx={{ color: stat.color }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Institute Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Institute Details
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                    Name
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{institute?.name}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                    Address
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{institute?.address}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                    Owner
                  </Typography>
                  {institute?.owner ? (
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.75 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: 'secondary.main' }}>
                        {institute.owner.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{institute.owner.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{institute.owner.email}</Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>No owner assigned</Typography>
                  )}
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.75 }}>
                    <Chip
                      label={institute?.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={institute?.is_active ? 'success' : 'default'}
                    />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Teachers List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">Teachers</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {teachers.length > 0
                      ? `${teachers.length} teacher${teachers.length > 1 ? 's' : ''} associated with this institute`
                      : 'No teachers associated yet'}
                  </Typography>
                </Box>
                {canConfigure && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => navigate(`/institutes/${id}/configure`)}
                  >
                    Manage
                  </Button>
                )}
              </Stack>
            </Box>

            <CardContent sx={{ p: 0 }}>
              {teachers.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Iconify icon="solar:shield-keyhole-bold-duotone" width={48} sx={{ color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No teachers assigned yet.
                  </Typography>
                  {canConfigure && (
                    <Button
                      sx={{ mt: 1.5 }}
                      size="small"
                      onClick={() => navigate(`/institutes/${id}/configure`)}
                    >
                      Associate a teacher
                    </Button>
                  )}
                </Box>
              ) : (
                <Stack divider={<Divider />}>
                  {teachers.map((teacher) => (
                    <Stack
                      key={teacher.id}
                      direction="row"
                      alignItems="flex-start"
                      spacing={2}
                      sx={{ px: 3, py: 2 }}
                    >
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', color: 'primary.dark', fontWeight: 700 }}>
                        {teacher.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2">{teacher.name}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            Email: {teacher.email}
                          </Typography>
                        </Stack>
                        {teacher.phone && (
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                            <Typography variant="caption" color="text.secondary">
                              Phone: {teacher.phone}
                            </Typography>
                          </Stack>
                        )}
                        {teacher.subjects && teacher.subjects.length > 0 && (
                          <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.75 }}>
                            {teacher.subjects.map((sub) => (
                              <Chip
                                key={sub.id}
                                label={sub.code}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ height: 20, fontSize: '0.68rem' }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
