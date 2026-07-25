import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export interface TeacherProps {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export function InstituteConfigureView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [instituteName, setInstituteName] = useState('');
  const [teachers, setTeachers] = useState<TeacherProps[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [openAssociateModal, setOpenAssociateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | number>('');

  const fetchInstituteDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/institutes/${id}`);
      if (response.data && response.data.data) {
        setInstituteName(response.data.data.name);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch institute details');
    }
  }, [id]);

  const fetchAssociatedTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/institutes/${id}/teachers`);
      if (response.data && response.data.data) {
        setTeachers(response.data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users', {
        params: { per_page: 200 }
      });
      if (response.data && response.data.data) {
        const usersList = response.data.data.data || response.data.data || [];
        setAllUsers(usersList);
      }
    } catch (err) {
      console.error('Failed to fetch users list', err);
    }
  }, []);

  useEffect(() => {
    fetchInstituteDetails();
    fetchAssociatedTeachers();
    fetchAllUsers();
  }, [fetchInstituteDetails, fetchAssociatedTeachers, fetchAllUsers]);

  const handleAssociate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.post(`/institutes/${id}/teachers`, {
        user_id: selectedUserId,
      });
      setSuccessMsg('Teacher associated successfully!');
      setOpenAssociateModal(false);
      setSelectedUserId('');
      fetchAssociatedTeachers();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to associate teacher');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRemoveTeacher = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove teacher ${userName}?`)) {
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.delete(`/institutes/${id}/teachers/${userId}`);
      setSuccessMsg('Teacher removed successfully!');
      fetchAssociatedTeachers();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to remove teacher');
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate('/institutes')}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          sx={{ mb: 2 }}
        >
          Back to Institutes
        </Button>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">
            Configure {instituteName || 'Institute'}
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenAssociateModal(true)}
          >
            Associate Teacher
          </Button>
        </Stack>
      </Box>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      <Card>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Associated Teachers</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage the list of teachers assigned to teach classes within this institute.
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset', position: 'relative' }}>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}

            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Remove Association">
                        <IconButton
                          onClick={() => handleRemoveTeacher(row.id, row.name)}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            bgcolor: '#ff7a5a',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#ff7a5a',
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                      <Typography variant="body2" color="text.secondary">
                        No teachers associated with this institute yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      {/* Associate Teacher Dialog */}
      <Dialog
        open={openAssociateModal}
        onClose={() => {
          setOpenAssociateModal(false);
          setErrorMsg('');
        }}
        maxWidth="xs"
        fullWidth
      >
        <Box component="form" onSubmit={handleAssociate}>
          <DialogTitle>Associate Teacher</DialogTitle>
          <DialogContent dividers>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel id="teacher-user-label">Select User</InputLabel>
                <Select
                  labelId="teacher-user-label"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  label="Select User"
                >
                  <MenuItem value="">
                    <em>Select a user...</em>
                  </MenuItem>
                  {allUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenAssociateModal(false);
                setErrorMsg('');
              }}
              color="inherit"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitLoading || !selectedUserId}>
              {submitLoading ? 'Associating...' : 'Associate'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </DashboardContent>
  );
}
