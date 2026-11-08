import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type HeadCell = {
  id: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
};

type QuizTableHeadProps = {
  headLabel: HeadCell[];
};

export function QuizTableHead({ headLabel }: QuizTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sx={{
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              ...(headCell.id === 'title' && { minWidth: 220, maxWidth: 320 }),
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
