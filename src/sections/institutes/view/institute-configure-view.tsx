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
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
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

export function InstituteConfigureView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [instituteName, setInstituteName] = useState('');
  const [teachers, setTeachers] = useState<TeacherProps[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Associate Modal ──
  const [openAssociateModal, setOpenAssociateModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // ── Edit Modal ──
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<TeacherProps | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSubjects, setEditSubjects] = useState<number[]>([]);

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

  // ─── Associate handlers ───────────────────────────────────────
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
        subjects: selectedSubjects,
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
    setEditSubjects(teacher.subjects ? teacher.subjects.map((s) => s.id) : []);
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
        subjects: editSubjects,
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
  const handleRemoveTeacher = async (userId: number, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove teacher ${userName}?`)) return;
    setLoading(true);
    setErrorMsg('');

    try {
      await axiosInstance.delete(`/institutes/${id}/teachers/${userId}`);
      setSuccessMsg('Teacher removed successfully!');
      fetchAssociatedTeachers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove teacher');
      setLoading(false);
    }
  };

  // ─── Subject multi-select renderer ──────────────────────────
  const renderSubjectChips = (selected: number[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((value) => {
        const subject = allSubjects.find((s) => s.id === value);
        return <Chip key={value} label={subject ? subject.name : value} size="small" />;
      })}
    </Box>
  );

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
                            onClick={() => handleRemoveTeacher(row.id, row.name)}
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
            <Stack spacing={3} sx={{ mt: 1 }}>
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

              <FormControl fullWidth required>
                <InputLabel id="assoc-subjects-label">Subjects</InputLabel>
                <Select
                  labelId="assoc-subjects-label"
                  multiple
                  value={selectedSubjects}
                  onChange={(e) => setSelectedSubjects(e.target.value as number[])}
                  input={<OutlinedInput label="Subjects" />}
                  renderValue={renderSubjectChips}
                >
                  {allSubjects.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      <Checkbox checked={selectedSubjects.indexOf(sub.id) > -1} />
                      <ListItemText primary={`${sub.name} (${sub.code})`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Stack spacing={3} sx={{ mt: 1 }}>
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

              <FormControl fullWidth required>
                <InputLabel id="edit-subjects-label">Subjects</InputLabel>
                <Select
                  labelId="edit-subjects-label"
                  multiple
                  value={editSubjects}
                  onChange={(e) => setEditSubjects(e.target.value as number[])}
                  input={<OutlinedInput label="Subjects" />}
                  renderValue={renderSubjectChips}
                >
                  {allSubjects.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      <Checkbox checked={editSubjects.indexOf(sub.id) > -1} />
                      <ListItemText primary={`${sub.name} (${sub.code})`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
    </DashboardContent>
  );
}
