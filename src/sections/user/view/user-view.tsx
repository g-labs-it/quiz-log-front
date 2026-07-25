import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [roles, setRoles] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals / Dialogs states
  const [openFormModal, setOpenFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProps | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    status: 'APPROVED',
    role: '',
  });

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/roles');
      if (response.data && response.data.data) {
        // Handle paginated or plain array response
        const rolesList = response.data.data.data || response.data.data;
        setRoles(rolesList);
        if (rolesList.length > 0) {
          setFormData((prev) => ({ ...prev, role: rolesList[0].name }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch roles', err);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get('/users', {
        params: {
          search: filterName || null,
          role: filterRole || null,
          status: filterStatus || null,
          per_page: rowsPerPage,
          page: page + 1,
        },
      });

      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        setUsers(paginatedData.data || []);
        setTotalUsers(paginatedData.total || 0);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to retrieve users');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filterName, filterRole, filterStatus]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      password_confirmation: '',
      status: 'APPROVED',
      role: roles.length > 0 ? roles[0].name : '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setOpenFormModal(true);
  };

  const handleOpenEdit = (user: UserProps) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || '',
      password: '',
      password_confirmation: '',
      status: user.status,
      role: user.role,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setOpenFormModal(true);
  };

  const handleOpenDelete = (user: UserProps) => {
    setUserToDelete(user);
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
      if (isEditing && selectedUser) {
        // Edit User
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          status: formData.status,
          role: formData.role,
        };
        await axiosInstance.put(`/users/${selectedUser.id}`, payload);
        setSuccessMsg('User updated successfully!');
      } else {
        // Create User
        await axiosInstance.post('/users', formData);
        setSuccessMsg('User created successfully!');
      }
      setOpenFormModal(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to save user');
      } else {
        setErrorMsg(err.message || 'Failed to save user');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.delete(`/users/${userToDelete.id}`);
      setSuccessMsg('User deleted successfully!');
      setOpenDeleteModal(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete user');
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
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleOpenCreate}
        >
          New User
        </Button>
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
            placeholder="Search user..."
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setPage(0);
            }}
            sx={{ width: 240 }}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Role Filter</InputLabel>
            <Select
              label="Role Filter"
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Roles</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              label="Status Filter"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="APPROVED">APPROVED</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="DELETED">DELETED</MenuItem>
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
              <UserTableHead
                order="desc"
                orderBy="id"
                rowCount={users.length}
                numSelected={0}
                onSort={() => {}}
                onSelectAllRows={() => {}}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {users.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={false}
                    onSelectRow={() => {}}
                    onEditRow={() => handleOpenEdit(row)}
                    onDeleteRow={() => handleOpenDelete(row)}
                  />
                ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={Math.max(0, rowsPerPage - users.length)}
                />

                {!loading && users.length === 0 && (
                  <TableNoData searchQuery={filterName || filterRole || filterStatus || ''} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={page}
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* User Create/Edit Dialog */}
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
          <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogContent dividers>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <TextField
                fullWidth
                label="Phone Number (10 digits)"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                slotProps={{ htmlInput: { maxLength: 10 } }}
              />

              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />

              {!isEditing && (
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={2}>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      label="Role"
                      onChange={(e) => handleSelectChange('role', e.target.value)}
                      required
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => handleSelectChange('status', e.target.value)}
                      required
                    >
                      <MenuItem value="APPROVED">APPROVED</MenuItem>
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="DELETED">DELETED</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent dividers>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}
          Are you sure you want to delete user <strong>{userToDelete?.name}</strong>? This action cannot be undone.
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
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={submitLoading}>
            {submitLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
