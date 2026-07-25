import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

export interface ClassProps {
  id: number;
  name: string;
  description?: string;
  schedule: string;
  is_active: boolean;
  institute_id: number;
  institute?: {
    id: number;
    name: string;
  };
  teacher_id: number;
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export function ClassesView() {
  const { user } = useAuth();

  const isSuperOrAdmin = user?.role?.includes('Super Admin') || user?.role?.includes('Admin');
  const isTeacher = user?.role?.includes('Teacher');
  const isOwner = user?.role?.includes('Institute Owner');

  const canCreate = user?.all_permissions?.includes('create_class_management');
  const canEdit = user?.all_permissions?.includes('update_class_management');
  const canDelete = user?.all_permissions?.includes('delete_class_management');

  const [classes, setClasses] = useState<ClassProps[]>([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterSearch, setFilterSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassProps | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassProps | null>(null);

  const [institutesList, setInstitutesList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    is_active: true,
    institute_id: '' as string | number,
    teacher_id: '' as string | number,
  });

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/classes', {
        params: {
          search: filterSearch || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        setClasses(paginatedData.data || []);
        setTotalClasses(paginatedData.total || 0);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to retrieve classes');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterSearch]);

  const fetchInstitutesAndTeachers = useCallback(async () => {
    try {
      // 1. Fetch Institutes
      if (isSuperOrAdmin) {
        const res = await axiosInstance.get('/institutes', { params: { per_page: 200 } });
        setInstitutesList(res.data?.data?.data || res.data?.data || []);
      } else if (isOwner) {
        setInstitutesList(user?.owned_institutes || []);
      } else if (isTeacher) {
        setInstitutesList(user?.institutes || []);
      }

      // 2. Fetch Teachers (Only needed if current user is Super Admin or Admin)
      if (isSuperOrAdmin) {
        const res = await axiosInstance.get('/users', { params: { role: 'Teacher', per_page: 200 } });
        setTeachersList(res.data?.data?.data || res.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to load form options', err);
    }
  }, [isSuperOrAdmin, isOwner, isTeacher, user]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchInstitutesAndTeachers();
  }, [fetchInstitutesAndTeachers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedClass(null);
    setFormData({
      name: '',
      description: '',
      schedule: '',
      is_active: true,
      institute_id: institutesList.length === 1 ? institutesList[0].id : '',
      teacher_id: isSuperOrAdmin ? '' : (user?.id || ''),
    });
    setErrorMsg('');
    setSuccessMsg('');
    setOpenFormModal(true);
  };

  const handleOpenEdit = (classItem: ClassProps) => {
    setIsEditing(true);
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      schedule: classItem.schedule,
      is_active: classItem.is_active,
      institute_id: classItem.institute_id || '',
      teacher_id: classItem.teacher_id || '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setOpenFormModal(true);
  };

  const handleOpenDelete = (classItem: ClassProps) => {
    setClassToDelete(classItem);
    setErrorMsg('');
    setSuccessMsg('');
    setOpenDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

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
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to save class');
      } else {
        setErrorMsg(err.message || 'Failed to save class');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.delete(`/classes/${classToDelete.id}`);
      setSuccessMsg('Class deleted successfully!');
      setOpenDeleteModal(false);
      fetchClasses();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete class');
    } finally {
      setSubmitLoading(false);
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
        <Typography variant="h4">Classes Management</Typography>
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
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search class..."
            value={filterSearch}
            onChange={(e) => {
              setFilterSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: 240 }}
          />
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
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}

            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Institute</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{row.name}</TableCell>
                    <TableCell>{row.institute?.name || '-'}</TableCell>
                    <TableCell>{row.teacher?.name || '-'}</TableCell>
                    <TableCell>{row.schedule}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          typography: 'subtitle2',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          bgcolor: row.is_active ? 'success.lighter' : 'action.selected',
                          color: row.is_active ? 'success.darker' : 'text.secondary',
                        }}
                      >
                        {row.is_active ? 'Active' : 'Inactive'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                ))}

                {!loading && classes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
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
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Class Create/Edit Dialog */}
      <Dialog
        open={openFormModal}
        onClose={() => {
          setOpenFormModal(false);
          setErrorMsg('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogTitle>{isEditing ? 'Edit Class' : 'Create New Class'}</DialogTitle>
          <DialogContent dividers>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Class Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                label="Schedule (e.g. Monday 10-12)"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                required
              />

              <FormControl fullWidth required>
                <InputLabel id="class-institute-label">Institute</InputLabel>
                <Select
                  labelId="class-institute-label"
                  name="institute_id"
                  value={formData.institute_id}
                  onChange={handleSelectChange}
                  label="Institute"
                >
                  <MenuItem value="">
                    <em>Select Institute...</em>
                  </MenuItem>
                  {institutesList.map((inst) => (
                    <MenuItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {isSuperOrAdmin && (
                <FormControl fullWidth required>
                  <InputLabel id="class-teacher-label">Teacher</InputLabel>
                  <Select
                    labelId="class-teacher-label"
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleSelectChange}
                    label="Teacher"
                  >
                    <MenuItem value="">
                      <em>Select Teacher...</em>
                    </MenuItem>
                    {teachersList.map((teach) => (
                      <MenuItem key={teach.id} value={teach.id}>
                        {teach.name} ({teach.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleSwitchChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label="Active Status"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenFormModal(false);
                setErrorMsg('');
              }}
              color="inherit"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
              {submitLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setErrorMsg('');
        }}
      >
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent dividers>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          Are you sure you want to delete class <strong>{classToDelete?.name}</strong>? This action
          cannot be undone.
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
