import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
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

export interface ClassProps {
  id: number;
  name: string;
  day: string;
  time: string;
  is_active: boolean;
  institute_id: number;
  institute?: { id: number; name: string };
  teacher_id: number;
  teacher?: { id: number; name: string; email: string };
  created_at: string;
  updated_at: string;
}

interface InstituteOption {
  id: number;
  name: string;
}

interface TeacherOption {
  id: number;
  name: string;
  email: string;
}

// ----------------------------------------------------------------------

export function ClassesView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Role helpers — using role names to determine view hierarchy
  const roles: string[] = Array.isArray(user?.role) ? user.role : user?.role ? [user.role] : [];
  const isSuperOrAdmin = roles.some((r) => ['Super Admin', 'Admin'].includes(r));
  const isOwner = roles.includes('Institute Owner');
  const isTeacher = roles.includes('Teacher');

  // Permissions gate CRUD actions
  const canCreate = user?.all_permissions?.includes('create_class_management');
  const canEdit = user?.all_permissions?.includes('update_class_management');
  const canDelete = user?.all_permissions?.includes('delete_class_management');
  const canCreateQuiz = user?.all_permissions?.includes('create_quiz_management');

  // List state
  const [classes, setClasses] = useState<ClassProps[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterSearch, setFilterSearch] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form dialog
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassProps | null>(null);

  // Delete dialog
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassProps | null>(null);

  // Form options
  const [institutesList, setInstitutesList] = useState<InstituteOption[]>([]);
  const [teachersList, setTeachersList] = useState<TeacherOption[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    time: '',
    is_active: true,
    institute_id: '' as string | number,
    teacher_id: '' as string | number,
  });

  // ─── Fetch list ──────────────────────────────────────────────
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/classes', {
        params: { search: filterSearch || null, per_page: rowsPerPage, page: page + 1 },
      });
      const paginatedData = response.data?.data;
      setClasses(paginatedData?.data || []);
      setTotalClasses(paginatedData?.total || 0);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve classes');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterSearch]);

  // ─── Fetch institute options for the form ────────────────────
  const fetchInstituteOptions = useCallback(async () => {
    try {
      if (isSuperOrAdmin) {
        // Admin: all institutes
        const res = await axiosInstance.get('/institutes', { params: { per_page: 500 } });
        const raw = res.data?.data;
        setInstitutesList(raw?.data ?? raw ?? []);
      } else {
        // Owner & Teacher: only their associated institutes
        const res = await axiosInstance.get('/institutes/my-institutes');
        setInstitutesList(res.data?.data ?? []);
      }
    } catch (err) {
      console.error('Failed to load institutes', err);
    }
  }, [isSuperOrAdmin]);

  // ─── Fetch teachers by institute (Admin/Owner only) ──────────
  const fetchTeachersByInstitute = useCallback(async (instituteId: number | string) => {
    if (!instituteId) {
      setTeachersList([]);
      return;
    }
    setLoadingTeachers(true);
    try {
      const res = await axiosInstance.get(`/institutes/${instituteId}/teachers`);
      setTeachersList(res.data?.data ?? []);
    } catch (err) {
      console.error('Failed to load teachers', err);
      setTeachersList([]);
    } finally {
      setLoadingTeachers(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);
  useEffect(() => { fetchInstituteOptions(); }, [fetchInstituteOptions]);

  // ─── When institute changes in form, reload teachers ─────────
  useEffect(() => {
    if ((isSuperOrAdmin || isOwner) && formData.institute_id) {
      fetchTeachersByInstitute(formData.institute_id);
    }
  }, [formData.institute_id, isSuperOrAdmin, isOwner, fetchTeachersByInstitute]);

  // ─── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset teacher when institute changes (for admin/owner)
    if (name === 'institute_id' && (isSuperOrAdmin || isOwner)) {
      setFormData((prev) => ({ ...prev, institute_id: value, teacher_id: '' }));
    }
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
      institute_id: institutesList.length === 1 ? institutesList[0].id : '',
      // Teachers create for themselves; admin/owner pick from list
      teacher_id: isTeacher ? (user?.id ?? '') : '',
    });
    setErrorMsg('');
    setOpenFormModal(true);
  };

  const handleOpenEdit = (classItem: ClassProps) => {
    setIsEditing(true);
    setSelectedClass(classItem);

    // Ensure the class institute is present in options list even if not in my-institutes
    if (classItem.institute && !institutesList.some((i) => Number(i.id) === Number(classItem.institute_id))) {
      setInstitutesList((prev) => [...prev, classItem.institute!]);
    }

    setFormData({
      name: classItem.name,
      day: classItem.day,
      time: classItem.time,
      is_active: classItem.is_active,
      institute_id: classItem.institute_id,
      teacher_id: classItem.teacher_id,
    });
    setErrorMsg('');
    setOpenFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      if (isEditing && selectedClass) {
        await axiosInstance.put(`/classes/${selectedClass.id}`, formData);
        setSuccessMsg('Class updated successfully!');
      } else {
        await axiosInstance.post('/classes', formData);
        setSuccessMsg('Class created successfully!');
      }
      setOpenFormModal(false);
      fetchClasses();
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
      fetchClasses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete class');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── Determine form title label ───────────────────────────────
  const viewTitle = isTeacher ? 'My Classes' : 'Classes Management';

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">{viewTitle}</Typography>
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
        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search class..."
            value={filterSearch}
            onChange={(e) => { setFilterSearch(e.target.value); setPage(0); }}
            sx={{ width: 240 }}
            InputProps={{
              startAdornment: <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled', mr: 1 }} />,
            }}
          />
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset', position: 'relative' }}>
            {loading && (
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="inherit" />
              </Box>
            )}

            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Institute</TableCell>
                  {!isTeacher && <TableCell>Teacher</TableCell>}
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
                    <TableCell>{row.institute?.name || '-'}</TableCell>
                    {!isTeacher && <TableCell>{row.teacher?.name || '-'}</TableCell>}
                    <TableCell>{row.day}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        color={row.is_active ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {canCreateQuiz && (
                          <Tooltip title="Create Quiz for this Class">
                            <IconButton
                              onClick={() => navigate(`/quizzes/create?class_id=${row.id}`)}
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                bgcolor: '#00a76f',
                                color: '#fff',
                                '&:hover': { bgcolor: '#00a76f', opacity: 0.9 },
                              }}
                            >
                              <Iconify icon="mingcute:add-line" width={20} />
                            </IconButton>
                          </Tooltip>
                        )}
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
                    <TableCell colSpan={isTeacher ? 6 : 7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No classes found.
                      </Typography>
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

      {/* ─── Create / Edit Dialog ─── */}
      <Dialog
        open={openFormModal}
        onClose={() => { setOpenFormModal(false); setErrorMsg(''); }}
        maxWidth="sm"
        fullWidth
      >
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogTitle>{isEditing ? 'Edit Class' : 'Create New Class'}</DialogTitle>
          <DialogContent dividers>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Class Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              {/* Institute selector */}
              <FormControl fullWidth required>
                <InputLabel id="cls-institute-lbl">Institute</InputLabel>
                <Select
                  labelId="cls-institute-lbl"
                  name="institute_id"
                  value={formData.institute_id}
                  onChange={handleSelectChange}
                  label="Institute"
                >
                  <MenuItem value=""><em>Select Institute...</em></MenuItem>
                  {institutesList.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>{inst.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Teacher selector — Admin and Owner only, scoped to selected institute */}
              {(isSuperOrAdmin || isOwner) && (
                <FormControl fullWidth required disabled={!formData.institute_id || loadingTeachers}>
                  <InputLabel id="cls-teacher-lbl">
                    {loadingTeachers ? 'Loading teachers...' : 'Teacher'}
                  </InputLabel>
                  <Select
                    labelId="cls-teacher-lbl"
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleSelectChange}
                    label={loadingTeachers ? 'Loading teachers...' : 'Teacher'}
                  >
                    <MenuItem value=""><em>Select Teacher...</em></MenuItem>
                    {teachersList.map((t) => (
                      <MenuItem key={t.id} value={t.id}>{t.name} ({t.email})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Day */}
              <FormControl fullWidth required>
                <InputLabel id="cls-day-lbl">Day</InputLabel>
                <Select
                  labelId="cls-day-lbl"
                  name="day"
                  value={formData.day}
                  onChange={handleSelectChange}
                  label="Day"
                >
                  <MenuItem value=""><em>Select Day...</em></MenuItem>
                  {DAYS_OF_WEEK.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Time */}
              <TextField
                fullWidth
                label="Time (e.g. 09:00 AM)"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                placeholder="e.g. 09:00 AM - 11:00 AM"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleSwitchChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label="Active"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => { setOpenFormModal(false); setErrorMsg(''); }} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
              {submitLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog
        open={openDeleteModal}
        onClose={() => { setOpenDeleteModal(false); setErrorMsg(''); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Delete Class</DialogTitle>
        <DialogContent>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete class <strong>{classToDelete?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => { setOpenDeleteModal(false); setErrorMsg(''); }} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={submitLoading}>
            {submitLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
