import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { getImageUrl } from 'src/utils/image-url';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: number;
  name: string;
  username?: string;
  student_code?: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
  role: string;
  profile_picture?: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
  onResetPassword?: () => void;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onResetPassword,
}: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'DELETED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt={row.name}
              src={row.profile_picture ? getImageUrl(row.profile_picture) : ''}
            />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>
          {row.student_code || row.username ? (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: '0.85rem',
                }}
              >
                {row.student_code || row.username}
              </Box>
              {row.email && (
                <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                  {row.email}
                </Box>
              )}
            </Box>
          ) : (
            row.email || '—'
          )}
        </TableCell>

        <TableCell>{row.phone}</TableCell>

        <TableCell>{row.role}</TableCell>

        <TableCell>
          <Label color={getStatusColor(row.status)}>{row.status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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
            width: 170,
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
              onEditRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          {onResetPassword && (
            <MenuItem
              onClick={() => {
                onResetPassword();
                handleClosePopover();
              }}
            >
              <Iconify icon="solar:lock-password-bold" />
              Reset Password
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              onDeleteRow();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
