import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';

import axiosInstance from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface ParsedOption {
  option_text: string;
  is_correct: boolean;
}

export interface ParsedQuestion {
  question_text: string;
  marks: number;
  explanation: string;
  options: ParsedOption[];
  correct_label: string;
}

export interface ParsedQuiz {
  title: string;
  description: string;
  duration_minutes: number;
  pass_marks: number;
  class_name: string;
  class_id?: number | null;
  status: 'DRAFT' | 'PUBLISHED';
  questions: ParsedQuestion[];
  total_marks: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: (importedCount: number) => void;
  onImportQuestions?: (questions: ParsedQuestion[]) => void;
  classesList?: { id: number; name: string }[];
}

export function QuizBulkImportDialog({
  open,
  onClose,
  onSuccess,
  onImportQuestions,
  classesList = [],
}: Props) {
  const [quizzes, setQuizzes] = useState<ParsedQuiz[]>([]);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper to parse CSV lines taking into account quotes and commas
  const parseCsvRows = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"';
          i += 1; // skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i += 1;
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Convert parsed CSV rows into grouped Quizzes with questions & options
  const processCsvText = (csvText: string) => {
    setErrorMsg('');
    const rawRows = parseCsvRows(csvText);

    if (rawRows.length < 2) {
      setErrorMsg('The CSV file does not contain enough data. Please include the header and at least one quiz question.');
      setQuizzes([]);
      return;
    }

    const header = rawRows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

    // Map column indices dynamically
    const colIndex = {
      quizTitle: header.findIndex((h) => h.includes('quiztitle') || h === 'title' || h.includes('quiz')),
      quizDesc: header.findIndex((h) => h.includes('desc')),
      duration: header.findIndex((h) => h.includes('duration')),
      passMarks: header.findIndex((h) => h.includes('pass')),
      targetClass: header.findIndex((h) => h.includes('class') || h.includes('target')),
      questionText: header.findIndex((h) => h.includes('question')),
      marks: header.findIndex((h) => h === 'marks' || h.includes('mark')),
      optionA: header.findIndex((h) => h === 'optiona' || h === 'a'),
      optionB: header.findIndex((h) => h === 'optionb' || h === 'b'),
      optionC: header.findIndex((h) => h === 'optionc' || h === 'c'),
      optionD: header.findIndex((h) => h === 'optiond' || h === 'd'),
      optionE: header.findIndex((h) => h === 'optione' || h === 'e'),
      correctOption: header.findIndex((h) => h.includes('correct') || h === 'answer' || h === 'ans'),
      explanation: header.findIndex((h) => h.includes('explain') || h.includes('note')),
    };

    if (colIndex.questionText === -1) {
      setErrorMsg('Could not find the "Question Text" column in your CSV. Please check headers.');
      setQuizzes([]);
      return;
    }

    const quizMap = new Map<string, ParsedQuiz>();

    for (let r = 1; r < rawRows.length; r += 1) {
      const row = rawRows[r];
      const title = (colIndex.quizTitle !== -1 ? row[colIndex.quizTitle] : '') || 'Imported Quiz';
      const qText = colIndex.questionText !== -1 ? row[colIndex.questionText] : '';

      if (!qText) {
        continue; // skip blank rows
      }

      // Check if quiz group already exists or initialize
      let quiz = quizMap.get(title);
      if (!quiz) {
        const rawClass = colIndex.targetClass !== -1 ? row[colIndex.targetClass] || '' : '';
        const rawDuration = colIndex.duration !== -1 ? Number(row[colIndex.duration]) : 30;
        const rawPassMarks = colIndex.passMarks !== -1 ? Number(row[colIndex.passMarks]) : 0;
        const rawDesc = colIndex.quizDesc !== -1 ? row[colIndex.quizDesc] || '' : '';

        // Match class from classesList if possible
        const matchedCls = classesList.find(
          (c) => c.name.toLowerCase() === rawClass.toLowerCase()
        );

        quiz = {
          title,
          description: rawDesc,
          duration_minutes: rawDuration > 0 ? rawDuration : 30,
          pass_marks: rawPassMarks > 0 ? rawPassMarks : 0,
          class_name: rawClass || 'Public',
          class_id: matchedCls ? matchedCls.id : null,
          status: defaultStatus,
          questions: [],
          total_marks: 0,
        };
        quizMap.set(title, quiz);
      }

      // Parse question details
      const marksVal = colIndex.marks !== -1 ? parseFloat(row[colIndex.marks]) : 1;
      const questionMarks = isNaN(marksVal) || marksVal <= 0 ? 1 : marksVal;
      const correctStr = (colIndex.correctOption !== -1 ? row[colIndex.correctOption] || '' : '')
        .toUpperCase()
        .replace(/[^A-E]/g, '');

      const explanation = colIndex.explanation !== -1 ? row[colIndex.explanation] || '' : '';

      // Parse options A-E
      const options: ParsedOption[] = [];
      const optionCols = [
        { letter: 'A', idx: colIndex.optionA },
        { letter: 'B', idx: colIndex.optionB },
        { letter: 'C', idx: colIndex.optionC },
        { letter: 'D', idx: colIndex.optionD },
        { letter: 'E', idx: colIndex.optionE },
      ];

      optionCols.forEach((opt) => {
        if (opt.idx !== -1 && row[opt.idx] && row[opt.idx].trim().length > 0) {
          const isCorrect = correctStr.includes(opt.letter);
          options.push({
            option_text: row[opt.idx].trim(),
            is_correct: isCorrect,
          });
        }
      });

      // Default first option as correct if none marked
      if (!options.some((o) => o.is_correct) && options.length > 0) {
        options[0].is_correct = true;
      }

      quiz.questions.push({
        question_text: qText,
        marks: questionMarks,
        explanation,
        options,
        correct_label: correctStr || 'A',
      });

      quiz.total_marks += questionMarks;
      if (!quiz.pass_marks || quiz.pass_marks <= 0) {
        quiz.pass_marks = Math.round(quiz.total_marks * 0.5);
      }
    }

    const parsedList = Array.from(quizMap.values());
    if (parsedList.length === 0) {
      setErrorMsg('No valid quiz questions found in the CSV. Please check formatting.');
      setQuizzes([]);
      return;
    }

    setQuizzes(parsedList);
  };

  // File upload reader
  const handleFileUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setErrorMsg('Please upload a valid .csv file.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCsvText(text);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read the selected CSV file.');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Download Sample CSV template
  const handleDownloadSample = async () => {
    try {
      const res = await axiosInstance.get('/quizzes/sample-csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample_quizzes_bulk_import.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback client-side generator if offline
      const fallbackCsv =
        'Quiz Title,Quiz Description,Duration Minutes,Pass Marks,Target Class,Question Text,Marks,Option A,Option B,Option C,Option D,Option E,Correct Option,Explanation\n' +
        'General Science Quiz,A basic fundamentals science quiz,30,2,Public,What is the chemical formula for Pure Water?,1,H2O,CO2,NaCl,O2,,A,Water consists of two hydrogen atoms bonded to one oxygen atom.\n' +
        'General Science Quiz,,,Public,Which of the following are planets in our Solar System?,1.5,Mars,Sirius,Jupiter,Proxima,,A,C,Mars and Jupiter are planets; Sirius and Proxima are stars.\n' +
        'World Geography & History,Introductory global geography test,45,5,Public,What is the capital city of France?,1,Paris,Rome,Berlin,Madrid,,A,Paris is the capital of France.\n' +
        'World Geography & History,,,Public,Mount Everest is situated in which mountain range?,1,Himalayas,Andes,Alps,Rockies,,A,Mount Everest is in the Himalayas.\n';

      const blob = new Blob([fallbackCsv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample_quizzes_bulk_import.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Submit bulk import to backend or pass questions to parent form
  const handleSubmit = async () => {
    if (quizzes.length === 0) {
      setErrorMsg('Please upload a CSV file with at least one quiz to import.');
      return;
    }

    if (onImportQuestions) {
      const allQuestions = quizzes.flatMap((q) => q.questions);
      onImportQuestions(allQuestions);
      handleReset();
      onClose();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        status: defaultStatus,
        quizzes: quizzes.map((q) => ({
          title: q.title,
          description: q.description,
          duration_minutes: q.duration_minutes,
          pass_marks: q.pass_marks,
          class_id: q.class_id || null,
          class_name: q.class_name,
          status: q.status || defaultStatus,
          questions: q.questions.map((ques) => ({
            question_text: ques.question_text,
            marks: ques.marks,
            explanation: ques.explanation,
            options: ques.options.map((opt) => ({
              option_text: opt.option_text,
              is_correct: opt.is_correct,
            })),
          })),
        })),
      };

      const response = await axiosInstance.post('/quizzes/bulk-import', payload);
      const importedCount = response.data?.data?.imported_quizzes_count || quizzes.length;

      if (onSuccess) {
        onSuccess(importedCount);
      }
      handleReset();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to bulk import quizzes. Please check your data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setQuizzes([]);
    setFileName('');
    setErrorMsg('');
  };

  const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:document-add-bold-duotone" width={28} color="primary.main" />
          <Typography variant="h6">
            {onImportQuestions ? 'Import Questions from CSV' : 'Bulk Import Quizzes (CSV)'}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
          onClick={handleDownloadSample}
        >
          Download Sample CSV
        </Button>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        <Stack spacing={3}>
          {/* Instructions banner */}
          <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Create Multiple Quizzes at Once
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              Rows sharing the same <strong>Quiz Title</strong> are automatically grouped into the same quiz. You can specify options A–E, marks, and correct answer letters (e.g. <code>A</code> or <code>A,C</code>). Images can be added manually after import.
            </Typography>
          </Alert>

          {!!errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg('')}>
              {errorMsg}
            </Alert>
          )}

          {/* Upload Dropzone */}
          {quizzes.length === 0 ? (
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'divider',
                bgcolor: isDragging ? 'primary.lighter' : 'background.neutral',
                borderRadius: 2,
                p: 5,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.csv,text/csv,application/vnd.ms-excel';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileUpload(file);
                };
                input.click();
              }}
            >
              <Iconify
                icon="solar:upload-track-bold-duotone"
                width={56}
                sx={{ color: 'primary.main', mb: 1.5 }}
              />
              <Typography variant="subtitle1" fontWeight={700}>
                Click to browse or drag and drop your CSV file here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Supports standard UTF-8 .CSV files exported from Excel or Google Sheets
              </Typography>
            </Box>
          ) : (
            // Parsed Preview
            <Stack spacing={2.5}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Iconify icon="solar:file-check-bold" width={28} color="success.main" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {fileName || 'CSV File Loaded'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Detected <strong>{quizzes.length}</strong> Quizzes ({totalQuestions} Total Questions)
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Default Status</InputLabel>
                    <Select
                      value={defaultStatus}
                      label="Default Status"
                      onChange={(e) => {
                        const val = e.target.value as 'DRAFT' | 'PUBLISHED';
                        setDefaultStatus(val);
                        setQuizzes((prev) => prev.map((q) => ({ ...q, status: val })));
                      }}
                    >
                      <MenuItem value="DRAFT">DRAFT</MenuItem>
                      <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    size="small"
                    color="inherit"
                    variant="outlined"
                    startIcon={<Iconify icon="solar:restart-bold" />}
                    onClick={handleReset}
                  >
                    Replace CSV
                  </Button>
                </Stack>
              </Card>

              {/* Accordion list of quizzes */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Preview of Quizzes to be Created:
                </Typography>

                <Stack spacing={1.5} sx={{ maxHeight: 380, overflowY: 'auto', pr: 0.5 }}>
                  {quizzes.map((q, qIndex) => (
                    <Accordion key={qIndex} defaultExpanded={qIndex === 0} variant="outlined">
                      <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-linear" />}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%', pr: 2 }}>
                          <Chip
                            label={`Quiz #${qIndex + 1}`}
                            size="small"
                            color="primary"
                            variant="filled"
                            sx={{ borderRadius: 0.75, height: 22, fontWeight: 700, fontSize: '0.72rem' }}
                          />
                          <Typography variant="subtitle2" fontWeight={700} sx={{ flexGrow: 1 }} noWrap>
                            {q.title}
                          </Typography>
                          <Chip
                            label={q.class_name || 'Public'}
                            size="small"
                            color={q.class_name?.toLowerCase() === 'public' ? 'secondary' : 'default'}
                            variant="outlined"
                            sx={{ borderRadius: 0.75, height: 22, fontSize: '0.7rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {q.questions.length} Qs • {q.total_marks} Marks
                          </Typography>
                        </Stack>
                      </AccordionSummary>

                      <AccordionDetails sx={{ pt: 0 }}>
                        <Divider sx={{ mb: 1.5 }} />
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ width: 40 }}>#</TableCell>
                              <TableCell>Question</TableCell>
                              <TableCell>Options & Correct Answer</TableCell>
                              <TableCell sx={{ width: 70 }}>Marks</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {q.questions.map((ques, quesIdx) => (
                              <TableRow key={quesIdx}>
                                <TableCell>{quesIdx + 1}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={600}>
                                    {ques.question_text}
                                  </Typography>
                                  {ques.explanation && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                      Note: {ques.explanation}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Stack spacing={0.5}>
                                    {ques.options.map((opt, optIdx) => {
                                      const letter = String.fromCharCode(65 + optIdx);
                                      return (
                                        <Box
                                          key={optIdx}
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            fontSize: '0.78rem',
                                            color: opt.is_correct ? 'success.dark' : 'text.primary',
                                            fontWeight: opt.is_correct ? 700 : 400,
                                          }}
                                        >
                                          <span><strong>{letter}.</strong> {opt.option_text}</span>
                                          {opt.is_correct && (
                                            <Iconify icon="solar:check-circle-bold" width={14} color="success.main" />
                                          )}
                                        </Box>
                                      );
                                    })}
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={`${ques.marks}m`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderRadius: 0.75, height: 20, fontSize: '0.7rem' }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={quizzes.length === 0 || submitting}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Iconify icon="solar:check-read-bold" />}
        >
          {submitting
            ? 'Importing...'
            : onImportQuestions
              ? `Add ${totalQuestions} Question${totalQuestions !== 1 ? 's' : ''} to Quiz`
              : `Confirm & Import ${quizzes.length} Quiz${quizzes.length !== 1 ? 'zes' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
