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
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import type { User } from '@/types/user';
import { useSearchParams } from 'react-router-dom';
import { authClient } from '@/lib/auth/custom/client';
import { useUser } from '@/hooks/use-user';
import Typography from '@mui/material/Typography';

export interface AccountProps {
  user: User | null | undefined
  updateFunction: (e: User) => void
}

export function AccountDetails({user, updateFunction}: AccountProps): React.JSX.Element {
  const [ searchParams ] = useSearchParams();
  const [ code, setCode ] = React.useState<string | null>(null);
  const { checkSession } = useUser();

  const schema = zod.object({
    firstName: zod.string().min(1, { message: 'First name is required' }),
    lastName: zod.string().min(1, { message: 'Last name is required' }),
    enterpriseName: zod.string().refine(
      (val) => initialValues.enterpriseName !== '' || val.trim() !== '',
      { message: 'Enterprise name is required to complete registration' }
    ),
    domain: zod.string().refine(
      (val) => initialValues.domain !== '' || val.trim() !== '',
      { message: 'Enterprise domain is required to access the dashboard' }
    ),
  });

  type Values = zod.infer<typeof schema>;

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    enterpriseName: user?.enterpriseName || '',
    domain: user?.websites?.[0]?.domain || user?.website?.domain || '',
    id: user?.id
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
    trigger,
  } = useForm<Values>({ defaultValues: initialValues, resolver: zodResolver(schema) });

  const handleSignIn = React.useCallback(
    async (): Promise<void> => {
      try {
        const { error } = await authClient.handleTokenFormGoogle(code ?? '');

        if (error) {
          setError('root', { type: 'server', message: String(error) });
          return;
        }
      } catch (error) {
        setError('root', { type: 'server', message: String(error) });
        throw error;
      }
      // Refresh the auth state
      await checkSession?.();
    },
    [checkSession, setError, code]
  );

  React.useEffect(() => {
    setCode((searchParams.get('code') ?? ''));
    if(code) void handleSignIn();
    void trigger(['enterpriseName', 'domain']);
  }, [trigger, code]);

  const [_, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>(user?.avatar || '/assets/placeholder-person-image.png');

  const onSubmit = (data: Values) => {
    if (isDirty) {
      const updatedUser: User = {
        ...user!,
        ...data,
      };
      if(updatedUser.websites?.[0]) {
        updatedUser.websites[0].domain = data.domain;
      }
      if(data.domain) {
        updatedUser.website!.domain = data.domain;
      }

      updateFunction(updatedUser);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('/assets/placeholder-person-image.png'); // Restablecer a la imagen por defecto
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Mostrar la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              {
                (!user?.websites?.[0]?.domain && !user?.website?.domain) &&
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'var(--mui-palette-error-main)' }}>
                  It is necessary to capture the domain of your company to access the dashboard.
                </Typography>
              }
              {
                (!user?.websites?.[0]?.googleAccessToken && !user?.website?.googleAccessToken) &&
                <Typography gutterBottom variant="h5" component="div" sx={{ color: 'var(--mui-palette-error-main)' }}>
                  It is necessary to grant access to your Google account to access the dashboard.
                </Typography>
              }
            </Stack>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormControl sx={{ flex: '1 1 auto' }} error={Boolean(errors.firstName)}>
                        <InputLabel>First Name</InputLabel>
                        <OutlinedInput name="firstName"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="This is your name" />
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormControl sx={{ flex: '1 1 auto' }} error={Boolean(errors.lastName)}>
                        <InputLabel>Last Name</InputLabel>
                        <OutlinedInput name="lastName"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="This is your last name" />
                      </FormControl>
                    )}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Controller
                    control={control}
                    name="enterpriseName"
                    render={({ field }) => (
                      <FormControl sx={{ flex: '1 1 auto' }} error={Boolean(errors.enterpriseName) || (initialValues.enterpriseName.length === 0 && !isDirty)}>
                        <InputLabel>Enterprise name</InputLabel>
                        <OutlinedInput name="enterpriseName"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="This is the name of your enterprise" />
                          { errors.enterpriseName && ( <FormHelperText error >{errors.enterpriseName.message}</FormHelperText> ) }
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="domain"
                    render={({ field }) => (
                      <FormControl sx={{ flex: '1 1 auto' }} error={Boolean(errors.domain) || (initialValues.domain.length === 0 && !isDirty)}>
                        <InputLabel>Domain</InputLabel>
                        <OutlinedInput name="domain"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="This is the domain of your enterprise" />
                          { errors.domain && ( <FormHelperText error>{errors.domain.message}</FormHelperText> ) }
                      </FormControl>
                    )}
                  />
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
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary">Cancel</Button>
          <Button variant="contained" type="submit" disabled={!isDirty}>Save changes</Button>
        </CardActions>
      </form>
    </Card>
  );
}
