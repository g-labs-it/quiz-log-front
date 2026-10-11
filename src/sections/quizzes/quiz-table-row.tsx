import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type QuizItem = {
  id: number;
  title: string;
  description?: string;
  institute_id?: number;
  class_id?: number;
  image?: string;
  scheduled_at?: string;
  duration_minutes: number;
  total_marks: number;
  pass_marks?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  randomize_questions?: boolean;
  randomize_options?: boolean;
  institute?: { id: number; name: string };
  class?: { id: number; name: string };
  questions?: any[];
  creator?: { id: number; name: string };
};

type QuizTableRowProps = {
  row: QuizItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
};

export function QuizTableRow({
  row,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: QuizTableRowProps) {
  const statusColor =
    row.status === 'PUBLISHED' ? 'success' : row.status === 'DRAFT' ? 'warning' : 'default';

  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {row.title}
        </Typography>
        {row.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {row.description}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <Typography variant="body2">
          {row.class?.name ? `Class: ${row.class.name}` : row.institute?.name ? `Institute: ${row.institute.name}` : 'General / Global'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">
          {row.scheduled_at ? new Date(row.scheduled_at).toLocaleString() : 'Not Scheduled'}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">{row.duration_minutes} mins</Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">
          {row.questions?.length || 0} Qs ({row.total_marks} Marks)
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Chip label={row.status} color={statusColor} size="small" variant="filled" />
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="View Quiz Details">
            <IconButton
              onClick={onView}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: '#00a76f',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#00a76f',
                  opacity: 0.9,
                },
              }}
            >
              <Iconify icon="solar:eye-bold" width={20} />
            </IconButton>
          </Tooltip>

          {canEdit && (
            <Tooltip title="Edit Quiz">
              <IconButton
                onClick={onEdit}
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
            <Tooltip title="Delete Quiz">
              <IconButton
                onClick={onDelete}
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
  );
}
