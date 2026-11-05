import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { OverviewAdminView } from './overview-admin-view';
import { OverviewTeacherView } from './overview-teacher-view';
import { OverviewStudentView } from './overview-student-view';
import { OverviewManagerView } from './overview-manager-view';
import { OverviewInstituteOwnerView } from './overview-institute-owner-view';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard metrics:', err);
      setErrorMsg(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const role = stats?.role;

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        {/* Welcome Greeting */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">
              Hi, {user?.name || 'Welcome back'} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here is what is happening across your workspace today.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="solar:refresh-bold" />}
            onClick={fetchStats}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>

        {/* Error Alert */}
        {!!errorMsg && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchStats}>
                Retry
              </Button>
            }
          >
            {errorMsg}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
            <CircularProgress size={44} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading your dashboard insights...
            </Typography>
          </Box>
        )}

        {/* Role-Specific Dashboard Views */}
        {!loading && stats && (
          <>
            {role === 'admin' && <OverviewAdminView data={stats} />}
            {role === 'manager' && <OverviewManagerView data={stats} />}
            {role === 'institute_owner' && <OverviewInstituteOwnerView data={stats} />}
            {role === 'teacher' && <OverviewTeacherView data={stats} />}
            {role === 'student' && <OverviewStudentView data={stats} />}
            {!['admin', 'manager', 'institute_owner', 'teacher', 'student'].includes(role) && (
              <OverviewAdminView data={stats} />
            )}
          </>
        )}

        {/* Fallback empty card */}
        {!loading && !stats && !errorMsg && (
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No dashboard statistics available.
            </Typography>
          </Card>
        )}
      </Stack>
    </DashboardContent>
  );
}
