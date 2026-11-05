import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { ClassProps } from './classes-view';

// ----------------------------------------------------------------------

const extractErrorMessage = (err: any, fallback: string) => {
  if (!err) return fallback;
  if (typeof err.errors === 'string') return err.errors;
  if (err.errors && typeof err.errors === 'object') {
    const first = Object.values(err.errors)[0];
    if (Array.isArray(first)) return first[0] as string;
    if (typeof first === 'string') return first;
  }
  if (err.message) return err.message;
  return fallback;
};

interface StudentItem {
  id: number;
  name: string;
  username: string;
  email: string | null;
  student_code: string;
  enrolled_at: string;
  needs_password_change: boolean;
  status: string;
}

interface ClassStudentsDialogProps {
  open: boolean;
  onClose: () => void;
  cls: ClassProps | null;
}

export function ClassStudentsDialog({ open, onClose, cls }: ClassStudentsDialogProps) {
  const [currentTab, setCurrentTab] = useState(0);

  // Class meta from backend
  const [classMeta, setClassMeta] = useState<{
    id: number;
    name: string;
    institute_id: number;
    teacher_id: number;
    code_prefix: string;
  } | null>(null);

  // Enrolled list state
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Single add state
  const [singleCode, setSingleCode] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleEmail, setSingleEmail] = useState('');
  const [singleSubmitting, setSingleSubmitting] = useState(false);
  const [singleCreated, setSingleCreated] = useState<{
    student_code: string;
    name: string;
    default_password?: string | null;
    is_new_user: boolean;
  } | null>(null);

  // Bulk add state
  const [bulkText, setBulkText] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkResults, setBulkResults] = useState<{
    total: number;
    enrolled: number;
    results: Array<{
      student_code: string;
      name: string;
      default_password?: string | null;
      is_new_user: boolean;
      already_enrolled: boolean;
    }>;
  } | null>(null);

  // Delete student confirm
  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Copied alert helper
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!cls?.id) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get(`/classes/${cls.id}/students`);
      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        setStudents(response.data.data?.students || (Array.isArray(response.data.data) ? response.data.data : []));
        if (response.data.data?.class) {
          setClassMeta(response.data.data.class);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(extractErrorMessage(err, 'Failed to fetch enrolled students.'));
    } finally {
      setLoading(false);
    }
  }, [cls?.id]);

  useEffect(() => {
    if (open && cls?.id) {
      fetchStudents();
      setCurrentTab(0);
      setSingleCreated(null);
      setBulkResults(null);
      setSingleCode('');
      setSingleName('');
      setSingleEmail('');
      setBulkText('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [open, cls?.id, fetchStudents]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Add single student
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cls?.id) return;
    setSingleSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await axiosInstance.post(`/classes/${cls.id}/students`, {
        student_code: singleCode.trim(),
        name: singleName.trim(),
        email: singleEmail.trim() || null,
      });

      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        setSingleCreated(response.data.data);
        setSuccessMsg(`Student enrolled successfully!`);
        setSingleCode('');
        setSingleName('');
        setSingleEmail('');
        fetchStudents();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(extractErrorMessage(err, 'Failed to add student.'));
    } finally {
      setSingleSubmitting(false);
    }
  };

  // Bulk add parse & submit
  const handleBulkSubmit = async () => {
    if (!cls?.id || !bulkText.trim()) return;

    // Parse lines: STU001, John Doe, john@example.com OR 001, John Doe
    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const parsed = lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      return {
        student_code: parts[0] || '',
        name: parts[1] || `Student ${parts[0]}`,
        email: parts[2] || null,
      };
    }).filter((item) => item.student_code.length > 0);

    if (parsed.length === 0) {
      setErrorMsg('No valid rows parsed. Each line should be: StudentCode, Name, Email (optional)');
      return;
    }

    setBulkSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await axiosInstance.post(`/classes/${cls.id}/students/bulk`, {
        students: parsed,
      });

      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        const resData = response.data.data;
        setBulkResults({
          total: resData.total_processed ?? resData.total ?? 0,
          enrolled: resData.enrolled_count ?? resData.enrolled ?? 0,
          results: resData.students ?? resData.results ?? [],
        });
        setSuccessMsg(`Successfully processed ${resData.enrolled_count ?? resData.enrolled} students!`);
        fetchStudents();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(extractErrorMessage(err, 'Failed to bulk enroll students.'));
    } finally {
      setBulkSubmitting(false);
    }
  };

  // Remove student
  const handleRemoveStudent = async () => {
    if (!cls?.id || !studentToDelete) return;
    setDeleting(true);
    try {
      const response = await axiosInstance.delete(`/classes/${cls.id}/students/${studentToDelete.id}`);
      if (response.data?.status === 'success' || response.data?.success || response.data?.data) {
        setSuccessMsg(`Student removed from class.`);
        setDeleteConfirmOpen(false);
        setStudentToDelete(null);
        fetchStudents();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(extractErrorMessage(err, 'Failed to remove student.'));
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.student_code?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q)
    );
  });

  const codePrefix =
    classMeta?.code_prefix ||
    (cls?.institute_id && cls?.teacher_id
      ? `INS${cls.institute_id}/T${cls.teacher_id}/CLS${cls.id}/`
      : cls?.id
      ? `CLS${cls.id}/`
      : '');

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6">Students in {cls?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Prefix: <strong>{codePrefix}STU...</strong>
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Iconify icon="solar:close-circle-bold" width={24} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={currentTab} onChange={(_, val) => { setCurrentTab(val); setErrorMsg(''); setSuccessMsg(''); }}>
            <Tab label={`Enrolled Students (${students.length})`} />
            <Tab label="Add Single Student" />
            <Tab label="Bulk Add Students" />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ p: 3 }}>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}

          {!!successMsg && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>
              {successMsg}
            </Alert>
          )}

          {/* ────────── TAB 0: Enrolled Students ────────── */}
          {currentTab === 0 && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <TextField
                  size="small"
                  placeholder="Search student code, name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ width: 320 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="solar:magnifer-bold" width={18} color="text.secondary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Iconify icon="solar:refresh-bold" />}
                  onClick={fetchStudents}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Stack>

              <Card variant="outlined">
                <Scrollbar>
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'background.neutral' }}>
                        <TableRow>
                          <TableCell>Student Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Enrolled Date</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                              <CircularProgress size={28} />
                            </TableCell>
                          </TableRow>
                        ) : filteredStudents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                              <Typography variant="body2" color="text.secondary">
                                No students found. Switch to &quot;Add Single Student&quot; or &quot;Bulk Add&quot; to enroll students.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStudents.map((st) => (
                            <TableRow key={st.id} hover>
                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                    {st.student_code}
                                  </Typography>
                                  <Tooltip title={copiedText === st.student_code ? 'Copied!' : 'Copy Code'}>
                                    <IconButton size="small" onClick={() => handleCopy(st.student_code)}>
                                      <Iconify
                                        icon={copiedText === st.student_code ? 'solar:check-read-bold' : 'solar:copy-bold'}
                                        width={16}
                                        color={copiedText === st.student_code ? 'success.main' : 'text.secondary'}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                              <TableCell>{st.name}</TableCell>
                              <TableCell>{st.email || '-'}</TableCell>
                              <TableCell>
                                {st.enrolled_at ? new Date(st.enrolled_at).toLocaleDateString() : '-'}
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="Remove from class">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      setStudentToDelete(st);
                                      setDeleteConfirmOpen(true);
                                    }}
                                  >
                                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
            </Stack>
          )}

          {/* ────────── TAB 1: Add Single Student ────────── */}
          {currentTab === 1 && (
            <Box component="form" onSubmit={handleAddSingle}>
              <Stack spacing={2.5}>
                <Alert severity="info" variant="outlined">
                  New student accounts will receive the default password <strong>Student@123</strong> and will be prompted to change their password upon first login.
                </Alert>

                {singleCreated && (
                  <Card sx={{ p: 2, bgcolor: 'success.lighter', border: '1px solid', borderColor: 'success.light' }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="success.darker">
                        Student Account Ready:
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">
                          <strong>Student Code:</strong> <code>{singleCreated.student_code}</code>
                        </Typography>
                        <Tooltip title={copiedText === singleCreated.student_code ? 'Copied!' : 'Copy'}>
                          <IconButton size="small" onClick={() => handleCopy(singleCreated.student_code)}>
                            <Iconify icon="solar:copy-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <Typography variant="body2">
                        <strong>Password:</strong> {singleCreated.default_password || '(Existing password retained)'}
                      </Typography>
                    </Stack>
                  </Card>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Student Code Suffix"
                    placeholder="e.g. STU001 or 001"
                    value={singleCode}
                    onChange={(e) => setSingleCode(e.target.value)}
                    required
                    helperText={`Full code will be: ${codePrefix}${singleCode.toUpperCase().startsWith('STU') ? singleCode.toUpperCase() : singleCode ? 'STU' + singleCode : 'STU001'}`}
                  />

                  <TextField
                    fullWidth
                    label="Student Full Name"
                    placeholder="e.g. Jane Doe"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    required
                  />
                </Stack>

                <TextField
                  fullWidth
                  label="Email Address (Optional)"
                  placeholder="e.g. jane@example.com"
                  type="email"
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  helperText="Optional. If omitted, student will log in exclusively using their Student Code."
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={singleSubmitting || !singleCode.trim() || !singleName.trim()}
                  startIcon={singleSubmitting ? <CircularProgress size={18} /> : <Iconify icon="solar:user-plus-bold" />}
                >
                  Enroll Student
                </Button>
              </Stack>
            </Box>
          )}

          {/* ────────── TAB 2: Bulk Add Students ────────── */}
          {currentTab === 2 && (
            <Stack spacing={2.5}>
              <Alert severity="info" variant="outlined">
                Paste student records below, one per line in the format:
                <br />
                <code>StudentCode, Full Name, Email (optional)</code>
                <br />
                Example:
                <br />
                <code>001, John Doe, john@example.com</code>
                <br />
                <code>STU002, Alice Smith</code>
              </Alert>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Paste Student Data"
                placeholder={`001, John Doe, john@example.com\n002, Alice Smith\n003, Bob Dylan, bob@example.com`}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  disabled={bulkSubmitting || !bulkText.trim()}
                  onClick={handleBulkSubmit}
                  startIcon={bulkSubmitting ? <CircularProgress size={18} /> : <Iconify icon="solar:users-group-rounded-bold" />}
                >
                  Import & Enroll Students
                </Button>
              </Stack>

              {bulkResults && (
                <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">
                      Import Summary: {bulkResults.enrolled} / {bulkResults.total} Students Enrolled
                    </Typography>

                    <TableContainer sx={{ maxHeight: 250 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Full Student Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Default Password</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bulkResults.results.map((r, idx) => (
                            <TableRow key={idx}>
                              <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                {r.student_code}
                              </TableCell>
                              <TableCell>{r.name}</TableCell>
                              <TableCell>{r.default_password || '(Existing)'}</TableCell>
                              <TableCell>
                                {r.is_new_user ? 'New Account Created' : r.already_enrolled ? 'Already Enrolled' : 'Enrolled'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ────────── Delete Confirmation Dialog ────────── */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove Student from Class</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to remove <strong>{studentToDelete?.name}</strong> ({studentToDelete?.student_code}) from this class?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveStudent}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
