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

  const isPublic = !row.class_id;

  return (
    <TableRow hover>
      <TableCell sx={{ minWidth: 220, maxWidth: 320 }}>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
          {row.title}
        </Typography>
        {row.description && (
          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'text.secondary', maxWidth: 300 }}
          >
            {row.description}
          </Typography>
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {isPublic ? (
          <Chip
            label="Public Quiz"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        ) : row.class?.name ? (
          <Stack spacing={0.25}>
            <Typography variant="body2" fontWeight={500}>
              Class: {row.class.name}
            </Typography>
            {row.institute?.name && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {row.institute.name}
              </Typography>
            )}
          </Stack>
        ) : row.institute?.name ? (
          <Typography variant="body2">
            Institute: {row.institute.name}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            -
          </Typography>
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">
          {isPublic
            ? '-'
            : row.scheduled_at
            ? new Date(row.scheduled_at).toLocaleString()
            : 'Not Scheduled'}
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">{row.duration_minutes} mins</Typography>
      </TableCell>

      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">
          {row.questions?.length || 0} Qs ({row.total_marks} Marks)
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
        <Chip label={row.status} color={statusColor} size="small" variant="filled" />
      </TableCell>

      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
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
