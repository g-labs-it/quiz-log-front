import { useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export interface SubjectItem {
  id: number;
  name: string;
  code: string;
}

export interface InstituteItem {
  id: number;
  name: string;
}

export interface TeacherProps {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  institutes?: InstituteItem[];
  subjects?: SubjectItem[];
  created_at?: string;
}

export function TeachersView() {
  const { user } = useAuth();
  const router = useRouter();
  const location = useLocation();

  const userRoles: string[] = Array.isArray(user?.role) ? user.role : user?.role ? [user.role] : [];
  const isSuperOrAdmin = userRoles.some((r) => ['Super Admin', 'Admin', 'Manager'].includes(r));

  const canCreate = user?.all_permissions?.includes('create_teacher_management');
  const canEdit = user?.all_permissions?.includes('update_teacher_management');
  const canDelete = user?.all_permissions?.includes('delete_teacher_management');
  const canViewClass = user?.all_permissions?.includes('view_class_management');

  const [teachers, setTeachers] = useState<TeacherProps[]>([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterSearch, setFilterSearch] = useState('');
  const [filterInstitute, setFilterInstitute] = useState<number | ''>('');
  const [filterSubject, setFilterSubject] = useState<number | ''>('');

  const [institutesList, setInstitutesList] = useState<InstituteItem[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInstituteId, setSelectedInstituteId] = useState<number | ''>('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectItem[]>([]);
  const [userExists, setUserExists] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<TeacherProps | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editInstituteId, setEditInstituteId] = useState<number | ''>('');
  const [editSubjects, setEditSubjects] = useState<SubjectItem[]>([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherProps | null>(null);

  useEffect(() => {
    if (location.state && (location.state as any).successMsg) {
      setSuccessMsg((location.state as any).successMsg);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/teachers', {
        params: {
          search: filterSearch || null,
          institute_id: filterInstitute || null,
          subject_id: filterSubject || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        setTeachers(paginatedData.data || []);
        setTotalTeachers(paginatedData.total || 0);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to retrieve teachers');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterSearch, filterInstitute, filterSubject]);

  const fetchInstitutes = useCallback(async () => {
    try {
      if (isSuperOrAdmin) {
        const res = await axiosInstance.get('/institutes', { params: { per_page: 500 } });
        const raw = res.data?.data;
        setInstitutesList(raw?.data ?? raw ?? []);
      } else {
        const res = await axiosInstance.get('/institutes/my-institutes');
        setInstitutesList(res.data?.data ?? []);
      }
    } catch (err) {
      console.error('Failed to load institutes', err);
    }
  }, [isSuperOrAdmin]);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/subjects', { params: { per_page: 500 } });
      const raw = res.data?.data;
      setAllSubjects(raw?.data ?? raw ?? []);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    fetchInstitutes();
    fetchSubjects();
  }, [fetchInstitutes, fetchSubjects]);

  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      const res = await axiosInstance.get('/users', { params: { search: email } });
      const found = (res.data?.data?.data || []).find(
        (u: any) => u.email?.toLowerCase() === email.toLowerCase()
      );
      if (found) {
        setUserExists(true);
        setName(found.name || '');
        setPhone(found.phone || '');
      } else {
        setUserExists(false);
      }
    } catch {
      setUserExists(false);
    }
  };

  const handleOpenCreate = () => {
    setEmail('');
    setName('');
    setPhone('');
    setSelectedInstituteId(institutesList.length === 1 ? institutesList[0].id : '');
    setSelectedSubjects([]);
    setUserExists(false);
    setErrorMsg('');
    setOpenCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedInstituteId || selectedSubjects.length === 0) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      const res = await axiosInstance.post('/teachers', {
        email,
        name: userExists ? undefined : name,
        phone: userExists ? undefined : phone || undefined,
        institute_id: selectedInstituteId,
        subjects: selectedSubjects.map((s) => s.id),
      });

      setSuccessMsg(res.data?.message || 'Teacher created successfully!');
      setOpenCreateModal(false);
      fetchTeachers();
    } catch (err: any) {
      const firstError = err.errors ? (Object.values(err.errors)[0] as string[])[0] : null;
      setErrorMsg(firstError || err.message || 'Failed to create teacher');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenEdit = (teacher: TeacherProps) => {
    setEditTeacher(teacher);
    setEditName(teacher.name);
    setEditPhone(teacher.phone || '');
    setEditInstituteId(teacher.institutes && teacher.institutes.length > 0 ? teacher.institutes[0].id : '');
    const preSelected = teacher.subjects
      ? allSubjects.filter((s) => teacher.subjects!.some((ts) => ts.id === s.id))
      : [];
    setEditSubjects(preSelected);
    setErrorMsg('');
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacher || editSubjects.length === 0) {
      setErrorMsg('Please assign at least one subject.');
      return;
    }
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      await axiosInstance.put(`/teachers/${editTeacher.id}`, {
        name: editName,
        phone: editPhone || null,
        institute_id: editInstituteId || undefined,
        subjects: editSubjects.map((s) => s.id),
      });

      setSuccessMsg('Teacher updated successfully!');
      setOpenEditModal(false);
      fetchTeachers();
    } catch (err: any) {
      const firstError = err.errors ? (Object.values(err.errors)[0] as string[])[0] : null;
      setErrorMsg(firstError || err.message || 'Failed to update teacher');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDelete = (teacher: TeacherProps) => {
    setTeacherToDelete(teacher);
    setErrorMsg('');
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      const instId = teacherToDelete.institutes && teacherToDelete.institutes.length > 0 ? teacherToDelete.institutes[0].id : undefined;
      const params = instId ? { institute_id: instId } : {};
      await axiosInstance.delete(`/teachers/${teacherToDelete.id}`, { params });
      setSuccessMsg('Teacher deleted successfully!');
      setOpenDeleteModal(false);
      fetchTeachers();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete teacher');
    } finally {
      setSubmitLoading(false);
      setTeacherToDelete(null);
    }
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4">Teacher Management</Typography>
        {canCreate && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreate}
          >
            New Teacher
          </Button>
        )}
      </Box>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMsg('')} severity="success" sx={{ width: '100%', boxShadow: 3 }}>
          {successMsg}
        </Alert>
      </Snackbar>

      <Card>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search teacher..."
            value={filterSearch}
            onChange={(e) => {
              setFilterSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: 240 }}
          />

          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Institute</InputLabel>
            <Select
              value={filterInstitute}
              label="Institute"
              onChange={(e) => {
                setFilterInstitute(e.target.value as number | '');
                setPage(0);
              }}
            >
              <MenuItem value="">All Institutes</MenuItem>
              {institutesList.map((inst) => (
                <MenuItem key={inst.id} value={inst.id}>
                  {inst.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={filterSubject}
              label="Subject"
              onChange={(e) => {
                setFilterSubject(e.target.value as number | '');
                setPage(0);
              }}
            >
              <MenuItem value="">All Subjects</MenuItem>
              {allSubjects.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Institute</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((row) => {
                  const firstInstId = row.institutes && row.institutes.length > 0 ? row.institutes[0].id : null;
                  const isActive = !row.status || row.status === 'APPROVED';

                  return (
                    <TableRow key={row.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone || '-'}</TableCell>
                      <TableCell>
                        {row.institutes && row.institutes.length > 0
                          ? row.institutes.map((i) => i.name).join(', ')
                          : 'No Institute'}
                      </TableCell>
                      <TableCell>
                        {row.subjects && row.subjects.length > 0
                          ? row.subjects.map((s) => s.name).join(', ')
                          : 'No Subjects'}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            typography: 'subtitle2',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            bgcolor: isActive ? 'success.lighter' : 'action.selected',
                            color: isActive ? 'success.darker' : 'text.secondary',
                          }}
                        >
                          {isActive ? 'Active' : row.status}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {canViewClass && firstInstId && (
                            <Tooltip title="Overview">
                              <IconButton
                                onClick={() => router.push(`/institutes/${firstInstId}/teachers/${row.id}/overview`)}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '10px',
                                  bgcolor: '#00b37e',
                                  color: '#fff',
                                  '&:hover': {
                                    bgcolor: '#00b37e',
                                    opacity: 0.9,
                                  },
                                }}
                              >
                                <Iconify icon="solar:eye-bold" width={20} />
                              </IconButton>
                            </Tooltip>
                          )}

                          {canEdit && (
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleOpenEdit(row)}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '10px',
                                  bgcolor: '#4f80ff',
                                  color: '#fff',
                                  '&:hover': {
                                    bgcolor: '#4f80ff',
                                    opacity: 0.9,
                                  },
                                }}
                              >
                                <Iconify icon="solar:pen-bold" width={20} />
                              </IconButton>
                            </Tooltip>
                          )}

                          {canDelete && (
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleOpenDelete(row)}
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
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {!loading && teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No teachers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={totalTeachers}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      {/* ─── CREATE / ASSOCIATE MODAL ───────────────────────── */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle>New Teacher</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                required
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                helperText={
                  userExists
                    ? 'Existing user found. They will be granted Teacher access and linked to the selected institute.'
                    : 'A new teacher account will be created and temporary login credentials emailed.'
                }
              />

              <TextField
                fullWidth
                required={!userExists}
                disabled={userExists}
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                fullWidth
                disabled={userExists}
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <FormControl fullWidth required>
                <InputLabel>Institute</InputLabel>
                <Select
                  value={selectedInstituteId}
                  label="Institute"
                  onChange={(e) => setSelectedInstituteId(e.target.value as number)}
                >
                  {institutesList.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                options={allSubjects}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                value={selectedSubjects}
                onChange={(_, newValue) => setSelectedSubjects(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={selectedSubjects.length === 0}
                    label="Assigned Subjects"
                    placeholder="Select subjects..."
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateModal(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── EDIT MODAL ─────────────────────────────────────── */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                disabled
                label="Email Address"
                value={editTeacher?.email || ''}
              />

              <TextField
                fullWidth
                required
                label="Full Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel>Primary Institute</InputLabel>
                <Select
                  value={editInstituteId}
                  label="Primary Institute"
                  onChange={(e) => setEditInstituteId(e.target.value as number)}
                >
                  <MenuItem value="">None / Unassigned</MenuItem>
                  {institutesList.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                multiple
                options={allSubjects}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                value={editSubjects}
                onChange={(_, newValue) => setEditSubjects(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={editSubjects.length === 0}
                    label="Assigned Subjects"
                    placeholder="Select subjects..."
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── DELETE / UNLINK CONFIRMATION MODAL ─────────────── */}
      <Dialog
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setErrorMsg('');
        }}
      >
        <DialogTitle>Delete Teacher</DialogTitle>
        <DialogContent dividers>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          Are you sure you want to delete teacher <strong>{teacherToDelete?.name}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteModal(false);
              setErrorMsg('');
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={submitLoading}
          >
            {submitLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
