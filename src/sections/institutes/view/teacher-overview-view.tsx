import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface SubjectItem {
  id: number;
  name: string;
  code: string;
}

interface TeacherDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subjects?: SubjectItem[];
}

interface ClassItem {
  id: number;
  name: string;
  day: string;
  time: string;
  is_active: boolean;
  institute_id: number;
  teacher_id: number;
  created_at: string;
  updated_at: string;
}

export function TeacherOverviewView() {
  const { id: instituteId, teacherId } = useParams<{ id: string; teacherId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const canCreate = user?.all_permissions?.includes('create_class_management');
  const canEdit = user?.all_permissions?.includes('update_class_management');
  const canDelete = user?.all_permissions?.includes('delete_class_management');

  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterSearch, setFilterSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form dialog
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // Delete dialog
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    day: '',
    time: '',
    is_active: true,
  });

  // ─── Fetch teacher & classes data ────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch teacher details from the list of teachers in this institute
      const teachersRes = await axiosInstance.get(`/institutes/${instituteId}/teachers`);
      const matchedTeacher = (teachersRes.data?.data || []).find(
        (t: any) => t.id === Number(teacherId)
      );
      if (matchedTeacher) {
        setTeacher(matchedTeacher);
      } else {
        // Fallback to fetching user detail directly if not associated
        const userRes = await axiosInstance.get(`/users/${teacherId}`);
        setTeacher(userRes.data?.data ?? null);
      }

      // 2. Fetch classes scoped to this teacher and this institute
      const classesRes = await axiosInstance.get('/classes', {
        params: {
          teacher_id: teacherId,
          institute_id: instituteId,
          search: filterSearch || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      const paginatedData = classesRes.data?.data;
      setClasses(paginatedData?.data || []);
      setTotalClasses(paginatedData?.total || 0);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load teacher or class details');
    } finally {
      setLoading(false);
    }
  }, [instituteId, teacherId, page, rowsPerPage, filterSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Form submit handler ──────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedClass(null);
    setFormData({
      name: '',
      day: '',
      time: '',
      is_active: true,
    });
    setErrorMsg('');
    setOpenFormModal(true);
  };

  const handleOpenEdit = (classItem: ClassItem) => {
    setIsEditing(true);
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      day: classItem.day,
      time: classItem.time,
      is_active: classItem.is_active,
    });
    setErrorMsg('');
    setOpenFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        institute_id: Number(instituteId),
        teacher_id: Number(teacherId),
      };

      if (isEditing && selectedClass) {
        await axiosInstance.put(`/classes/${selectedClass.id}`, payload);
        setSuccessMsg('Class updated successfully!');
      } else {
        await axiosInstance.post('/classes', payload);
        setSuccessMsg('Class created successfully!');
      }
      setOpenFormModal(false);
      fetchData();
    } catch (err: any) {
      const firstError = err.errors ? (Object.values(err.errors)[0] as string[])[0] : null;
      setErrorMsg(firstError || err.message || 'Failed to save class');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;
    setSubmitLoading(true);
    try {
      await axiosInstance.delete(`/classes/${classToDelete.id}`);
      setSuccessMsg('Class deleted successfully!');
      setOpenDeleteModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete class');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading && !teacher) {
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
          onClick={() => navigate(`/institutes/${instituteId}/configure`)}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          sx={{ mb: 2 }}
        >
          Back to Configure Institute
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
              {teacher?.name?.charAt(0) ?? 'T'}
            </Avatar>
            <Box>
              <Typography variant="h4">{teacher?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {teacher?.email} {teacher?.phone ? `• ${teacher.phone}` : ''}
              </Typography>
            </Box>
          </Stack>

          {canCreate && (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenCreate}
            >
              New Class
            </Button>
          )}
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

      <Grid container spacing={3}>
        {/* Left Side: Teacher's Details Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Teacher Information</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{teacher?.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{teacher?.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{teacher?.phone || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Subjects Taught</Typography>
                {teacher?.subjects && teacher.subjects.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {teacher.subjects.map((sub) => (
                      <Chip key={sub.id} label={`${sub.name} (${sub.code})`} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No subjects mapped.</Typography>
                )}
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Right Side: Classes Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Assigned Classes</Typography>
              <TextField
                size="small"
                placeholder="Search classes..."
                value={filterSearch}
                onChange={(e) => { setFilterSearch(e.target.value); setPage(0); }}
                sx={{ width: 220 }}
              />
            </Box>

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset', position: 'relative' }}>
                {loading && (
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                  </Box>
                )}

                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Class Name</TableCell>
                      <TableCell>Day</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                        <TableCell>{row.day}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>
                          <Chip label={row.is_active ? 'Active' : 'Inactive'} size="small" color={row.is_active ? 'success' : 'default'} />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            {canEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleOpenEdit(row)}
                                  sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#4f80ff', color: '#fff', '&:hover': { bgcolor: '#4f80ff', opacity: 0.9 } }}
                                >
                                  <Iconify icon="solar:pen-bold" width={20} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {canDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => { setClassToDelete(row); setOpenDeleteModal(true); }}
                                  sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#ff7a5a', color: '#fff', '&:hover': { bgcolor: '#ff7a5a', opacity: 0.9 } }}
                                >
                                  <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && classes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">No classes found.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              component="div"
              page={page}
              count={totalClasses}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Class Create/Edit Dialog */}
      <Dialog open={openFormModal} onClose={() => setOpenFormModal(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogTitle>{isEditing ? 'Edit Class' : 'Create New Class'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField fullWidth label="Class Name" name="name" value={formData.name} onChange={handleInputChange} required />

              <FormControl fullWidth required>
                <InputLabel id="t-cls-day-lbl">Day</InputLabel>
                <Select labelId="t-cls-day-lbl" name="day" value={formData.day} onChange={handleSelectChange} label="Day">
                  <MenuItem value=""><em>Select Day...</em></MenuItem>
                  {DAYS_OF_WEEK.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField fullWidth label="Time (e.g. 09:00 AM - 11:00 AM)" name="time" value={formData.time} onChange={handleInputChange} required />

              <FormControlLabel
                control={<Switch checked={formData.is_active} onChange={handleSwitchChange} name="is_active" color="primary" />}
                label="Active"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpenFormModal(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
              {submitLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>Delete Class</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete class <strong>{classToDelete?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDeleteModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={submitLoading}>
            {submitLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
