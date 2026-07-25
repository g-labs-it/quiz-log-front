import { useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
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

import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useAuth } from 'src/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export interface InstituteProps {
  id: number;
  name: string;
  address: string;
  is_active: boolean;
  owner_id?: number | null;
  owner?: {
    id: number;
    name: string;
    email: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export function InstitutesView() {
  const { user } = useAuth();
  const router = useRouter();
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).successMsg) {
      setSuccessMsg((location.state as any).successMsg);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const canView = user?.all_permissions?.includes('view_institue_management');
  const canConfigure = user?.all_permissions?.includes('configure_institue_management');
  const canCreate = user?.all_permissions?.includes('create_institue_management');
  const canEdit = user?.all_permissions?.includes('update_institue_management');
  const canDelete = user?.all_permissions?.includes('delete_institue_management');

  const [institutes, setInstitutes] = useState<InstituteProps[]>([]);
  const [totalInstitutes, setTotalInstitutes] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterSearch, setFilterSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [instituteToDelete, setInstituteToDelete] = useState<InstituteProps | null>(null);

  const fetchInstitutes = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/institutes', {
        params: {
          search: filterSearch || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        setInstitutes(paginatedData.data || []);
        setTotalInstitutes(paginatedData.total || 0);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to retrieve institutes');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterSearch]);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  const handleOpenDelete = (institute: InstituteProps) => {
    setInstituteToDelete(institute);
    setErrorMsg('');
    setSuccessMsg('');
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!instituteToDelete) return;
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.delete(`/institutes/${instituteToDelete.id}`);
      setSuccessMsg('Institute deleted successfully!');
      setOpenDeleteModal(false);
      fetchInstitutes();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete institute');
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
        <Typography variant="h4">Institute Management</Typography>
        {canCreate && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/institutes/create')}
          >
            New Institute
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
            placeholder="Search institute..."
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
                  <TableCell>Address</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {institutes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.owner ? row.owner.name : 'No Owner'}</TableCell>
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
                        {canView && (
                          <Tooltip title="Overview">
                            <IconButton
                              onClick={() => router.push(`/institutes/${row.id}/overview`)}
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

                        {canConfigure && (
                          <Tooltip title="Configure">
                            <IconButton
                              onClick={() => router.push(`/institutes/${row.id}/configure`)}
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                bgcolor: '#7c4dff',
                                color: '#fff',
                                '&:hover': {
                                  bgcolor: '#7c4dff',
                                  opacity: 0.9,
                                },
                              }}
                            >
                              <Iconify icon="solar:settings-bold-duotone" width={20} />
                            </IconButton>
                          </Tooltip>
                        )}

                        {canEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => router.push(`/institutes/${row.id}/edit`)}
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

                {!loading && institutes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No institutes found.
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
          count={totalInstitutes}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
          setErrorMsg('');
        }}
      >
        <DialogTitle>Delete Institute</DialogTitle>
        <DialogContent dividers>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          Are you sure you want to delete institute <strong>{instituteToDelete?.name}</strong>? This
          action cannot be undone.
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
