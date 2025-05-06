'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { Option } from '@/components/core/option';
import { UserData } from '@/hooks/use-client';

export interface AccountProps {
  user: UserData | undefined
  updateFunction: (e: UserData) => void
}

export function AccountDetails({user, updateFunction}: AccountProps): React.JSX.Element {
  
  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    id: user?.id
  };

  const [formData, setFormData] = React.useState(initialValues);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>(user?.avatarUrl || '/assets/avatar.png');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value,
    });
  };

  const hasChanges = () => {
    return (
      formData?.firstName !== initialValues?.firstName ||
      formData?.lastName !== initialValues?.lastName 
    );
  };

  const handleSubmit = () => {
    if (hasChanges()) {
      console.log('Form data submitted:', formData);
      updateFunction(formData)
    } else {
      alert('No changes detected.');
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('/assets/avatar.png'); // Restablecer a la imagen por defecto
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Mostrar la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <UserIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Basic details"
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                border: '1px dashed var(--mui-palette-divider)',
                borderRadius: '50%',
                display: 'inline-flex',
                p: '4px',
              }}
            >
              <Box sx={{ borderRadius: 'inherit', position: 'relative' }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 'inherit',
                    bottom: 0,
                    color: 'var(--mui-palette-common-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    left: 0,
                    opacity: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 1,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <CameraIcon fontSize="var(--icon-fontSize-md)" />
                  </Stack>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                    Select
                  </label>
                </Box>
                <Avatar src={imagePreview} sx={{ '--Avatar-size': '100px' }} />
              </Box>
            </Box>
            <Button color="secondary" size="small" onClick={handleRemoveImage}>
              Remove
            </Button>
          </Stack>
          <form>
            <Stack spacing={2}>
              <FormControl disabled>
                <InputLabel>Full name</InputLabel>
                <OutlinedInput value={user?.name} name="fullName" />
              </FormControl>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flex: '1 1 auto' }}>
                  <InputLabel>First Name</InputLabel>
                  <OutlinedInput name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={user?.firstName} />
                </FormControl>
                <FormControl sx={{ flex: '1 1 auto' }}>
                  <InputLabel>Last Name</InputLabel>
                  <OutlinedInput name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={user?.lastName}/>
                </FormControl>
              </Stack>
              <FormControl disabled>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput name="email" type="email" value={user?.email} />
                <FormHelperText>
                  Please <Link variant="inherit">contact us</Link> to change your email
                </FormHelperText>
              </FormControl>
              {/* <Stack direction="row" spacing={2}>
                <FormControl sx={{ width: '160px' }}>
                  <InputLabel>Dial code</InputLabel>
                  <Select
                    name="countryCode"
                    startAdornment={
                      <InputAdornment position="start">
                        <Box
                          alt="Spain"
                          component="img"
                          src="/assets/flag-es.svg"
                          sx={{ display: 'block', height: '20px', width: 'auto' }}
                        />
                      </InputAdornment>
                    }
                    value="+34"
                  >
                    <Option value="+1">United States</Option>
                    <Option value="+49">Germany</Option>
                    <Option value="+34">Spain</Option>
                  </Select>
                </FormControl>
                <FormControl sx={{ flex: '1 1 auto' }}>
                  <InputLabel>Phone number</InputLabel>
                  <OutlinedInput defaultValue="965 245 7623" name="phone" />
                </FormControl>
              </Stack> */}
              {/* <FormControl>
                <InputLabel>Title</InputLabel>
                <OutlinedInput name="title" placeholder="e.g Golang Developer" />
              </FormControl>
              <FormControl>
                <InputLabel>Biography (optional)</InputLabel>
                <OutlinedInput name="bio" placeholder="Describe yourself..." />
                <FormHelperText>0/200 characters</FormHelperText>
              </FormControl> */}
            </Stack>
          </form>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="secondary">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!hasChanges()}>Save changes</Button>
      </CardActions>
    </Card>
  );
}
