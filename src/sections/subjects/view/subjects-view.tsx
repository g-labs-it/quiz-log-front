import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
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
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export interface SubjectProps {
  id: number;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function SubjectsView() {
  const { user } = useAuth();

  const canCreate = user?.all_permissions?.includes('create_masterdata_management');
  const canEdit = user?.all_permissions?.includes('update_masterdata_management');
  const canDelete = user?.all_permissions?.includes('delete_masterdata_management');

  const [subjects, setSubjects] = useState<SubjectProps[]>([]);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterSearch, setFilterSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectProps | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectProps | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/subjects', {
        params: {
          search: filterSearch || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        if (paginatedData.data) {
          setSubjects(paginatedData.data || []);
          setTotalSubjects(paginatedData.total || 0);
        } else {
          setSubjects(response.data.data || []);
          setTotalSubjects(response.data.data.length || 0);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to retrieve subjects');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterSearch]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedSubject(null);
    setFormData({
      name: '',
      code: '',
      description: '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setOpenFormModal(true);
  };

  const handleOpenEdit = (subjectItem: SubjectProps) => {
    setIsEditing(true);
    setSelectedSubject(subjectItem);
    setFormData({
      name: subjectItem.name,
      code: subjectItem.code,
      description: subjectItem.description || '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setOpenFormModal(true);
  };

  const handleOpenDelete = (subjectItem: SubjectProps) => {
    setSubjectToDelete(subjectItem);
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
      if (isEditing && selectedSubject) {
        await axiosInstance.put(`/subjects/${selectedSubject.id}`, formData);
        setSuccessMsg('Subject updated successfully!');
      } else {
        await axiosInstance.post('/subjects', formData);
        setSuccessMsg('Subject created successfully!');
      }
      setOpenFormModal(false);
      fetchSubjects();
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to save subject');
      } else {
        setErrorMsg(err.message || 'Failed to save subject');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.delete(`/subjects/${subjectToDelete.id}`);
      setSuccessMsg('Subject deleted successfully!');
      setOpenDeleteModal(false);
      fetchSubjects();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete subject');
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
        <Typography variant="h4">Subjects Management</Typography>
        {canCreate && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreate}
          >
            New Subject
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
            placeholder="Search subject..."
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
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  { (canEdit || canDelete) && <TableCell align="right">Actions</TableCell> }
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{row.name}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.description || '-'}</TableCell>
                    { (canEdit || canDelete) && (
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
                    )}
                  </TableRow>
                ))}

                {!loading && subjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No subjects found.
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
          count={totalSubjects}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Subject Create/Edit Dialog */}
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
          <DialogTitle>{isEditing ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          <DialogContent dividers>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Subject Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Subject Code (e.g. MATH, SCI)"
                name="code"
                value={formData.code}
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
                rows={3}
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
        <DialogTitle>Delete Subject</DialogTitle>
        <DialogContent dividers>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          Are you sure you want to delete subject <strong>{subjectToDelete?.name}</strong>? This action
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
