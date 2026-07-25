import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import axiosInstance from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

export function InstituteCreateEditView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [ownersList, setOwnersList] = useState<any[]>([]);
  const [ownerMode, setOwnerMode] = useState<'select' | 'create'>('select');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    is_active: true,
    owner_id: '' as string | number,
    create_owner: false,
    owner_name: '',
    owner_email: '',
    owner_password: '',
  });

  const fetchOwners = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users', {
        params: { role: 'Institute Owner', per_page: 200 },
      });
      if (response.data && response.data.data) {
        const usersList = response.data.data.data || response.data.data || [];
        setOwnersList(usersList);
      }
    } catch (err) {
      console.error('Failed to fetch owners list', err);
    }
  }, []);

  const fetchInstitute = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/institutes/${id}`);
      if (response.data && response.data.data) {
        const inst = response.data.data;
        setFormData({
          name: inst.name,
          address: inst.address,
          is_active: !!inst.is_active,
          owner_id: inst.owner_id || '',
          create_owner: false,
          owner_name: '',
          owner_email: '',
          owner_password: '',
        });
        setOwnerMode('select');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to fetch institute data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOwners();
    if (isEdit) {
      fetchInstitute();
    }
  }, [fetchOwners, fetchInstitute, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name: formData.name,
      address: formData.address,
      is_active: formData.is_active,
      owner_id: ownerMode === 'select' ? (formData.owner_id || null) : null,
      create_owner: ownerMode === 'create',
      owner_name: ownerMode === 'create' ? formData.owner_name : '',
      owner_email: ownerMode === 'create' ? formData.owner_email : '',
      owner_password: ownerMode === 'create' ? formData.owner_password : '',
    };

    try {
      if (isEdit) {
        await axiosInstance.put(`/institutes/${id}`, payload);
        navigate('/institutes', { state: { successMsg: 'Institute updated successfully!' } });
      } else {
        await axiosInstance.post('/institutes', payload);
        navigate('/institutes', { state: { successMsg: 'Institute created successfully!' } });
      }
    } catch (err: any) {
      console.error(err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0] as string[];
        setErrorMsg(firstError[0] || 'Failed to save institute');
      } else {
        setErrorMsg(err.message || 'Failed to save institute');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate('/institutes')}
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          sx={{ mb: 2 }}
        >
          Back to Institutes
        </Button>
        <Typography variant="h4">
          {isEdit ? 'Edit Institute' : 'Create New Institute'}
        </Typography>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Card>
          <CardHeader title="Institute Information" subheader="Configure the details of the institute and assign or create its owner user." />
          
          <Box component="form" onSubmit={handleFormSubmit}>
            <CardContent>
              <Stack spacing={4}>
                <TextField
                  fullWidth
                  label="Institute Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  required
                />

                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>Institute Owner Option</FormLabel>
                  <RadioGroup
                    row
                    value={ownerMode}
                    onChange={(e) => setOwnerMode(e.target.value as 'select' | 'create')}
                  >
                    <FormControlLabel
                      value="select"
                      control={<Radio />}
                      label="Assign Existing Owner"
                    />
                    <FormControlLabel
                      value="create"
                      control={<Radio />}
                      label="Create New Owner User"
                    />
                  </RadioGroup>
                </FormControl>

                {ownerMode === 'select' && (
                  <FormControl fullWidth>
                    <InputLabel id="owner-select-label">Select Owner</InputLabel>
                    <Select
                      labelId="owner-select-label"
                      name="owner_id"
                      value={formData.owner_id}
                      onChange={handleSelectChange}
                      label="Select Owner"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {ownersList.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {ownerMode === 'create' && (
                  <Card variant="outlined" sx={{ p: 3, bgcolor: 'background.neutral' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      New Owner User Credentials
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="owner_name"
                        value={formData.owner_name}
                        onChange={handleInputChange}
                        required={ownerMode === 'create'}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="owner_email"
                        type="email"
                        value={formData.owner_email}
                        onChange={handleInputChange}
                        required={ownerMode === 'create'}
                      />
                      <TextField
                        fullWidth
                        label="Password"
                        name="owner_password"
                        type="password"
                        value={formData.owner_password}
                        onChange={handleInputChange}
                        required={ownerMode === 'create'}
                      />
                    </Stack>
                  </Card>
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={handleSwitchChange}
                      name="is_active"
                      color="primary"
                    />
                  }
                  label="Active Status"
                />
              </Stack>
            </CardContent>

            <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/institutes')}
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitLoading}
              >
                {submitLoading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Card>
      )}
    </DashboardContent>
  );
}
