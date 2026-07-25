import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

const getRoleAvatar = (index: number) => {
  const avatars = [
    '/assets/images/avatar/avatar-25.webp',
    '/assets/images/avatar/avatar-10.webp',
    '/assets/images/avatar/avatar-5.webp',
  ];
  return avatars[index % avatars.length];
};

export function RolesView() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Matrix state
  // Key: roleId, Value: array of permission names
  const [matrixState, setMatrixState] = useState<Record<number, string[]>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Dynamic modules state
  const [modules, setModules] = useState<Record<string, string[]>>({});
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');

  // Role Management state
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [roleName, setRoleName] = useState('');

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any | null>(null);

  // Action popover state
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [activeRole, setActiveRole] = useState<any | null>(null);

  const fetchRolesAndPermissions = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const rolesRes = await axiosInstance.get('/roles');
      const fetchedRoles = rolesRes.data?.data?.data || rolesRes.data?.data || [];

      setRoles(fetchedRoles);

      // Initialize Matrix state
      const initialMatrix: Record<number, string[]> = {};
      fetchedRoles.forEach((role: any) => {
        initialMatrix[role.id] = (role.permissions || []).map((p: any) => p.name);
      });
      setMatrixState(initialMatrix);
      setHasChanges(false);



      // Fetch dynamic modules
      let fetchedModules = {};
      try {
        const modulesRes = await axiosInstance.get('/permissions/modules');
        fetchedModules = modulesRes.data?.data || {};
      } catch (e) {
        console.error('Failed to fetch dynamic modules, using fallback', e);
        fetchedModules = {
          dashboard: ['view'],
          user_management: ['view', 'create', 'update', 'delete', 'restore'],
          notification_management: ['view', 'manual'],
          role_management: ['view', 'create', 'update', 'delete'],
          setting_management: [],
          activity_management: [],
          masterdata_management: [],
        };
      }
      setModules(fetchedModules);

    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load roles and permissions data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [fetchRolesAndPermissions]);



  // Core Checkbox toggler
  const handleCoreToggle = (roleId: number, moduleName: string) => {
    setMatrixState((prev) => {
      const rolePerms = prev[roleId] || [];
      const isEnabled = rolePerms.includes(moduleName);

      let updated: string[];
      if (isEnabled) {
        // Disable: remove the core module permission AND all its actions
        const moduleActions = modules[moduleName] || [];
        const actionsToRemove = moduleActions.map((action) => `${action}_${moduleName}`);
        updated = rolePerms.filter(
          (p) => p !== moduleName && !actionsToRemove.includes(p)
        );
      } else {
        // Enable: add the core module permission
        updated = [...rolePerms, moduleName];
      }

      return {
        ...prev,
        [roleId]: updated,
      };
    });
    setHasChanges(true);
  };

  // Action Checkbox toggler
  const handleActionToggle = (roleId: number, moduleName: string, action: string) => {
    const permissionName = `${action}_${moduleName}`;
    setMatrixState((prev) => {
      const rolePerms = prev[roleId] || [];
      const updated = rolePerms.includes(permissionName)
        ? rolePerms.filter((p) => p !== permissionName)
        : [...rolePerms, permissionName];

      return {
        ...prev,
        [roleId]: updated,
      };
    });
    setHasChanges(true);
  };

  const handleSaveMatrix = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const promises = roles.map((role) => {
        const payload = {
          name: role.name,
          permissions: matrixState[role.id] || [],
        };
        return axiosInstance.put(`/roles/${role.id}`, payload);
      });

      await Promise.all(promises);
      setSuccessMsg('Permission matrix saved successfully!');
      setHasChanges(false);
      fetchRolesAndPermissions();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save permission matrix.');
    } finally {
      setSaving(false);
    }
  };

  // Role Actions
  const handleOpenCreateRole = () => {
    setIsEditingRole(false);
    setSelectedRole(null);
    setRoleName('');
    setErrorMsg('');
    setSuccessMsg('');
    setOpenRoleModal(true);
  };

  const handleOpenEditRole = (role: any) => {
    setIsEditingRole(true);
    setSelectedRole(role);
    setRoleName(role.name);
    setErrorMsg('');
    setSuccessMsg('');
    setOpenRoleModal(true);
  };

  const handleOpenDeleteRole = (role: any) => {
    setRoleToDelete(role);
    setErrorMsg('');
    setSuccessMsg('');
    setOpenDeleteModal(true);
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isEditingRole && selectedRole) {
        await axiosInstance.put(`/roles/${selectedRole.id}`, { name: roleName });
        setSuccessMsg('Role renamed successfully!');
      } else {
        await axiosInstance.post('/roles', { name: roleName });
        setSuccessMsg('Role created successfully!');
      }
      setOpenRoleModal(false);
      fetchRolesAndPermissions();
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to save role');
      } else {
        setErrorMsg(err.message || 'Failed to save role');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoleConfirm = async () => {
    if (!roleToDelete) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.delete(`/roles/${roleToDelete.id}`);
      setSuccessMsg('Role deleted successfully!');
      setOpenDeleteModal(false);
      fetchRolesAndPermissions();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete role.');
    } finally {
      setSaving(false);
    }
  };

  // Popover menu helpers
  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, role: any) => {
    setOpenPopover(event.currentTarget);
    setActiveRole(role);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setActiveRole(null);
  };



  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress color="inherit" />
        </Box>
      </DashboardContent>
    );
  }

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
          <Typography variant="h4" sx={{ mb: 1 }}>
            {selectedRoleId ? 'Role Permissions' : 'Roles List'}
          </Typography>
          {!selectedRoleId && (
            <Typography variant="body2" color="text.secondary">
              A role provided access to predefined menus and features so that depending on
              assigned role an administrator can have access to what user needs.
            </Typography>
          )}
        </Box>

        {!selectedRoleId && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenCreateRole}
          >
            New Role
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

      {!selectedRoleId ? (
        <Grid container spacing={3}>
          {roles.map((role, idx) => (
            <Grid key={role.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  p: 3,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 1,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {`Total ${role.users_count || 0} ${
                      role.name === 'Admin'
                        ? 'Admins'
                        : role.name === 'User'
                        ? 'Users'
                        : role.name === 'Manager'
                        ? 'Managers'
                        : role.name + 's'
                    }`}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="img"
                      src={getRoleAvatar(idx)}
                      sx={{ width: 44, height: 44, borderRadius: '50%' }}
                    />
                    <IconButton
                      onClick={(e) => handleOpenPopover(e, role)}
                      sx={{ mr: -1 }}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {role.name}
                  </Typography>

                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setSelectedRoleId(role.id)}
                    sx={{ p: 0, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    View Permissions
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              onClick={() => {
                setSelectedRoleId('');
                setHasChanges(false);
              }}
              color="inherit"
            >
              Back to Roles List
            </Button>

            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              Permissions for {roles.find((r) => r.id === selectedRoleId)?.name}
            </Typography>
          </Box>

          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderBottom: 1,
                borderColor: 'divider',
                pb: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={!hasChanges || saving}
                onClick={handleSaveMatrix}
                startIcon={
                  saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Iconify icon="eva:checkmark-fill" />
                  )
                }
              >
                {saving ? 'Saving...' : 'Save Permissions Matrix'}
              </Button>
            </Box>

            <Stack spacing={3}>
              {Object.keys(modules).map((moduleName) => {
                const moduleLabel = moduleName
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                const rolePerms = matrixState[selectedRoleId] || [];
                const isModuleEnabled = rolePerms.includes(moduleName);
                const moduleActions = modules[moduleName] || [];

                return (
                  <Box
                    key={moduleName}
                    sx={{
                      pb: 3,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 0,
                        pb: 0,
                      },
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: moduleActions.length > 0 ? 2 : 0,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {moduleLabel}
                      </Typography>
                      <Checkbox
                        checked={isModuleEnabled}
                        onChange={() => handleCoreToggle(selectedRoleId as number, moduleName)}
                        color="primary"
                      />
                    </Box>

                    {/* Actions */}
                    {moduleActions.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 3,
                          pl: 1,
                        }}
                      >
                        {moduleActions.map((action) => {
                          const actionLabel = action
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase());

                          const permissionName = `${action}_${moduleName}`;
                          const isActionChecked = rolePerms.includes(permissionName);

                          return (
                            <FormControlLabel
                              key={action}
                              control={
                                <Checkbox
                                  checked={isModuleEnabled && isActionChecked}
                                  onChange={() =>
                                    handleActionToggle(
                                      selectedRoleId as number,
                                      moduleName,
                                      action
                                    )
                                  }
                                  disabled={!isModuleEnabled}
                                  color="primary"
                                />
                              }
                              label={actionLabel}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  typography: 'body2',
                                  color: isModuleEnabled ? 'text.primary' : 'text.disabled',
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Card>
        </Stack>
      )}

      {/* Role Action Popover */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              if (activeRole) handleOpenEditRole(activeRole);
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Rename
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (activeRole) handleOpenDeleteRole(activeRole);
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Create / Edit Role Dialog */}
      <Dialog open={openRoleModal} onClose={() => setOpenRoleModal(false)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={handleRoleSubmit}>
          <DialogTitle>{isEditingRole ? 'Rename Role' : 'Create New Role'}</DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRoleModal(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Role Confirm Dialog */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete role <strong>{roleToDelete?.name}</strong>? Users assigned to this role will lose their association.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteRoleConfirm} variant="contained" color="error" disabled={saving}>
            {saving ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
