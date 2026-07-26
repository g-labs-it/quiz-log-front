import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
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
  subjects?: {
    id: number;
    name: string;
    code: string;
  }[];
}

interface SubjectOption {
  id: number;
  name: string;
  code: string;
}

export function InstituteConfigureView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [instituteName, setInstituteName] = useState('');
  const [teachers, setTeachers] = useState<TeacherProps[]>([]);
  const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Associate Modal ──
  const [openAssociateModal, setOpenAssociateModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectOption[]>([]);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // ── Edit Modal ──
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<TeacherProps | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSubjects, setEditSubjects] = useState<SubjectOption[]>([]);

  // ── Delete Confirmation Modal ──
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<{ id: number; name: string } | null>(null);

  const fetchInstituteDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/institutes/${id}`);
      if (response.data?.data) setInstituteName(response.data.data.name);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch institute details');
    }
  }, [id]);

  const fetchAssociatedTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/institutes/${id}/teachers`);
      if (response.data?.data) setTeachers(response.data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAllSubjects = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/subjects', { params: { per_page: 200 } });
      if (response.data?.data) {
        setAllSubjects(response.data.data.data || response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch subjects list', err);
    }
  }, []);

  useEffect(() => {
    fetchInstituteDetails();
    fetchAssociatedTeachers();
    fetchAllSubjects();
  }, [fetchInstituteDetails, fetchAssociatedTeachers, fetchAllSubjects]);

  // ─── Associate handlers ──────────────────────────────────────
  const handleEmailBlur = async () => {
    if (!email || !email.includes('@')) return;
    setCheckingEmail(true);
    try {
      const response = await axiosInstance.get('/users', { params: { search: email } });
      const usersList = response.data?.data?.data || response.data?.data || [];
      const exactMatch = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exactMatch) {
        setUserExists(true);
        setName(exactMatch.name);
        setPhone(exactMatch.phone || '');
      } else {
        setUserExists(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleOpenAssociate = () => {
    setEmail('');
    setName('');
    setPhone('');
    setSelectedSubjects([]);
    setUserExists(false);
    setErrorMsg('');
    setOpenAssociateModal(true);
  };

  const handleAssociate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedSubjects.length === 0) return;
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      await axiosInstance.post(`/institutes/${id}/teachers`, {
        email,
        name: userExists ? undefined : name,
        phone: userExists ? undefined : phone || undefined,
        subjects: selectedSubjects.map((s) => s.id),
      });
      setSuccessMsg(
        userExists
          ? 'Teacher associated successfully!'
          : 'Teacher account created and associated successfully!'
      );
      setOpenAssociateModal(false);
      fetchAssociatedTeachers();
    } catch (err: any) {
      const firstError = err.errors ? (Object.values(err.errors)[0] as string[])[0] : null;
      setErrorMsg(firstError || err.message || 'Failed to associate teacher');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── Edit handlers ───────────────────────────────────────────
  const handleOpenEdit = (teacher: TeacherProps) => {
    setEditTeacher(teacher);
    setEditName(teacher.name);
    setEditPhone(teacher.phone || '');
    const preSelected = teacher.subjects
      ? allSubjects.filter((s) => teacher.subjects!.some((ts) => ts.id === s.id))
      : [];
    setEditSubjects(preSelected);
    setErrorMsg('');
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacher || editSubjects.length === 0) return;
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      await axiosInstance.put(`/institutes/${id}/teachers/${editTeacher.id}`, {
        name: editName,
        phone: editPhone || null,
        subjects: editSubjects.map((s) => s.id),
      });
      setSuccessMsg('Teacher updated successfully!');
      setOpenEditModal(false);
      fetchAssociatedTeachers();
    } catch (err: any) {
      const firstError = err.errors ? (Object.values(err.errors)[0] as string[])[0] : null;
      setErrorMsg(firstError || err.message || 'Failed to update teacher');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ─── Remove handler ──────────────────────────────────────────
  const handleOpenDeleteModal = (userId: number, userName: string) => {
    setTeacherToDelete({ id: userId, name: userName });
    setOpenDeleteModal(true);
  };

  const handleConfirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    setOpenDeleteModal(false);
    setLoading(true);
    setErrorMsg('');

    try {
      await axiosInstance.delete(`/institutes/${id}/teachers/${teacherToDelete.id}`);
      setSuccessMsg('Teacher removed successfully!');
      fetchAssociatedTeachers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove teacher');
      setLoading(false);
    } finally {
      setTeacherToDelete(null);
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
          <Typography variant="h4">Configure {instituteName || 'Institute'}</Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenAssociate}
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
                  inset: 0,
                  bgcolor: 'rgba(255,255,255,0.7)',
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

            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone || '-'}</TableCell>
                    <TableCell>
                      {row.subjects && row.subjects.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {row.subjects.map((sub) => (
                            <Chip
                              key={sub.id}
                              label={`${sub.name} (${sub.code})`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Overview">
                          <IconButton
                            onClick={() => navigate(`/institutes/${id}/teachers/${row.id}/overview`)}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              bgcolor: '#00b37e',
                              color: '#fff',
                              '&:hover': { bgcolor: '#00b37e', opacity: 0.9 },
                            }}
                          >
                            <Iconify icon="solar:eye-bold" width={20} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenEdit(row)}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              bgcolor: '#4f80ff',
                              color: '#fff',
                              '&:hover': { bgcolor: '#4f80ff', opacity: 0.9 },
                            }}
                          >
                            <Iconify icon="solar:pen-bold" width={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Association">
                          <IconButton
                            onClick={() => handleOpenDeleteModal(row.id, row.name)}
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '10px',
                              bgcolor: '#ff7a5a',
                              color: '#fff',
                              '&:hover': { bgcolor: '#ff7a5a', opacity: 0.9 },
                            }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {!loading && teachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
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

      {/* ── Associate Teacher Dialog ── */}
      <Dialog
        open={openAssociateModal}
        onClose={() => { setOpenAssociateModal(false); setErrorMsg(''); }}
        maxWidth="sm"
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
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
                type="email"
                helperText={
                  checkingEmail
                    ? 'Checking system...'
                    : userExists
                    ? `Matching account found: "${name}". Subjects will be linked.`
                    : 'System will auto-create password & invite them if new user.'
                }
              />

              <TextField
                fullWidth
                label="Teacher Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!userExists}
                disabled={userExists || checkingEmail}
                helperText={userExists ? 'Existing accounts cannot change name here.' : ''}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={userExists || checkingEmail}
                helperText={userExists ? 'Phone can be edited via the Edit button.' : ''}
              />

              <Autocomplete
                multiple
                options={allSubjects}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                value={selectedSubjects}
                onChange={(_, newValue) => setSelectedSubjects(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={`${option.name} (${option.code})`}
                      size="small"
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subjects"
                    placeholder={selectedSubjects.length === 0 ? 'Search and select subjects...' : ''}
                    required={selectedSubjects.length === 0}
                    helperText="Type to search. Click a subject to add it."
                  />
                )}
                disableCloseOnSelect
                limitTags={4}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenAssociateModal(false); setErrorMsg(''); }} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitLoading || checkingEmail || !email || selectedSubjects.length === 0}
            >
              {submitLoading ? 'Associating...' : 'Associate'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ── Edit Teacher Dialog ── */}
      <Dialog
        open={openEditModal}
        onClose={() => { setOpenEditModal(false); setErrorMsg(''); }}
        maxWidth="sm"
        fullWidth
      >
        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Teacher — {editTeacher?.email}</DialogTitle>
          <DialogContent dividers>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Teacher Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />

              <Autocomplete
                multiple
                options={allSubjects}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                value={editSubjects}
                onChange={(_, newValue) => setEditSubjects(newValue)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={`${option.name} (${option.code})`}
                      size="small"
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subjects"
                    placeholder={editSubjects.length === 0 ? 'Search and select subjects...' : ''}
                    required={editSubjects.length === 0}
                    helperText="Type to filter. Selected subjects are shown as chips above."
                  />
                )}
                disableCloseOnSelect
                limitTags={4}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenEditModal(false); setErrorMsg(''); }} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitLoading || !editName || editSubjects.length === 0}
            >
              {submitLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Remove Teacher Association</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove teacher <strong>{teacherToDelete?.name}</strong> from this institute?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDeleteModal(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteTeacher}
            variant="contained"
            color="error"
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
