import { useCallback, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useFormik } from 'formik';
import axiosAuth from 'src/utils/axiosAuth';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Snackbar,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const AccountPassword = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      password: '',
      password2: '',
      submit: null
    },
    validationSchema: Yup.object({
      password: Yup
        .string()
        .max(255)
        .required('Introduce una nueva contraseña'),
      password2: Yup
        .string()
        .max(255)
        .required('Repite la nueva contraseña')
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const body = {
          password: values.password,
          password2: values.password2
        }

        await axiosAuth.put('/api/account/set-password', body);
        setShowAlert(true);
        auth.signOut();
        router.push('/auth/login');

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
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>Se ha modificado la contraseña</Alert>
      </Snackbar>
      <Card>
        <CardHeader
          subheader="Cambiar contraseña"
          title="Contraseña"
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
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Nueva contraseña"
                  name="password"
                  type="password"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  error={!!(formik.touched.password2 && formik.errors.password2)}
                  fullWidth
                  helperText={formik.touched.password2 && formik.errors.password2}
                  label="Confirmar nueva contraseña"
                  name="password2"
                  type="password"
                  required
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password2}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Cambiar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

/*
export const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Cambiar contraseña"
          title="Contraseña"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              fullWidth
              label="Nueva contraseña"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="Confirmar nueva contraseña"
              name="confirm"
              onChange={handleChange}
              type="password"
              value={values.confirm}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Cambiar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
*/