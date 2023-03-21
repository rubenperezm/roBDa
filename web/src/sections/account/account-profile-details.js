import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useFormik } from 'formik';
import axiosAuth from 'src/utils/axiosAuth';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Snackbar,
  Alert,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const AccountProfileDetails = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const auth = useAuth();
  const user = auth.user || {username: '', email: ''};
  const formik = useFormik({
    initialValues: {
      email: user.email,
      username: user.username,
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Introduce una dirección de correo válida')
        .max(255)
        .required('Introduce una dirección de correo'),
      username: Yup
        .string()
        .max(255)
        .required('Introduce un nombre de usuario'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {
          username: values.username,
          email: values.email
        }

        await axiosAuth.put('/api/account/modify', body);
        setShowAlert(true);
        window.location.reload();

      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors(err.response.data.error);
        helpers.setSubmitting(false);
      }
    }
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setShowAlert(false);  
  };

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="success" sx={{width: "100%"}}>Perfil modificado</Alert>
      </Snackbar>
      <Card>
        <CardHeader
          subheader="Edita tu perfil"
          title="Perfil"
        />

        <Divider />

        <CardContent>
          <Box>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Nombre de usuario"
                  name="username"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo electrónico"
                  name="email"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
