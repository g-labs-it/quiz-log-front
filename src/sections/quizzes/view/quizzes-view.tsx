import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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

import { QuizTableHead } from '../quiz-table-head';
import { QuizTableRow, type QuizItem } from '../quiz-table-row';

// ----------------------------------------------------------------------

export function QuizzesView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const permissions = (user as any)?.all_permissions || [];
  const canCreate = permissions.includes('create_quiz_management');
  const canEdit = permissions.includes('update_quiz_management');
  const canDelete = permissions.includes('delete_quiz_management');

  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [classesList, setClassesList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Dialog state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<QuizItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch classes for filter dropdown
  const fetchClasses = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/classes');
      if (res.data && res.data.data) {
        setClassesList(res.data.data.data || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch classes', err);
    }
  }, []);

  // Fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/quizzes', {
        params: {
          search: filterSearch || null,
          status: filterStatus || null,
          class_id: filterClass || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      if (response.data && response.data.data) {
        const paginated = response.data.data;
        setQuizzes(paginated.data || paginated || []);
        setTotalQuizzes(paginated.total || (paginated.data ? paginated.data.length : 0));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to retrieve quizzes.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterSearch, filterStatus, filterClass]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/quizzes/${quizToDelete.id}`);
      setSuccessMsg('Quiz deleted successfully.');
      setOpenDeleteModal(false);
      setQuizToDelete(null);
      fetchQuizzes();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete quiz.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4">Quiz Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Create and manage class quizzes, scheduled tests, and question banks.
          </Typography>
        </Box>

        {canCreate && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate('/quizzes/create')}
          >
            Create Quiz
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
            placeholder="Search title..."
            value={filterSearch}
            onChange={(e) => {
              setFilterSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: 240 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="DRAFT">DRAFT</MenuItem>
              <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
              <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Class Filter</InputLabel>
            <Select
              label="Class Filter"
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Classes</MenuItem>
              {classesList.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
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
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            )}

            <Table sx={{ minWidth: 800 }}>
              <QuizTableHead
                headLabel={[
                  { id: 'title', label: 'Quiz Title' },
                  { id: 'class', label: 'Assigned Target' },
                  { id: 'scheduled_at', label: 'Scheduled Date' },
                  { id: 'duration', label: 'Duration', align: 'center' },
                  { id: 'questions', label: 'Questions & Marks', align: 'center' },
                  { id: 'status', label: 'Status', align: 'center' },
                  { id: 'actions', label: 'Actions', align: 'right' },
                ]}
              />
              <TableBody>
                {quizzes.map((row) => (
                  <QuizTableRow
                    key={row.id}
                    row={row}
                    onView={() => navigate(`/quizzes/${row.id}/overview`)}
                    onEdit={() => navigate(`/quizzes/${row.id}/edit`)}
                    onDelete={() => {
                      setQuizToDelete(row);
                      setOpenDeleteModal(true);
                    }}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                ))}

                {!loading && quizzes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        No quizzes found.
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
          count={totalQuizzes}
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
          setQuizToDelete(null);
        }}
      >
        <DialogTitle>Delete Quiz</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete the quiz <strong>{quizToDelete?.title}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteModal(false);
              setQuizToDelete(null);
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
