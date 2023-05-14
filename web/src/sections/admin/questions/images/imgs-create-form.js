import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FormikConsumer, useFormik } from 'formik';
import * as Yup from 'yup';
import axiosAuth from 'src/utils/axiosAuth';
import { TopicsSelection } from '../topics/topics-selection';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Input,
    Snackbar,
    TextField,
    Unstable_Grid2 as Grid
} from '@mui/material';

export const ImgsForm = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const formik = useFormik({
        initialValues: {
            nombre: '',
            tema: '',
            path: '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(30)
                .required('Introduce un nombre para la imagen'),
            tema: Yup
                .string()
                .required('Selecciona un tema'),
            path: Yup
                .mixed()
                .required("Introduce una imagen"),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = new FormData();

                    body.append('nombre', values.nombre);
                    body.append('tema', values.tema);
                    body.append('path', values.path);

                    await axiosAuth.post(`/api/questions/images`, body, {
                        headers: {
                            'Content-Type': `multipart/form-data`
                        }
                    });

                    setShowAlert(true);

                    helpers.setSubmitting(false);
                    helpers.resetForm();
                    setImagePreview(null);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
            setImagePreview(() => e.target.result);
        };

        formik.setFieldValue('path', file);
        reader.readAsDataURL(file);
    };

    return (
        <>
            <form
                autoComplete="off"
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>Imagen subida correctamente</Alert>
                </Snackbar>
                <Card>
                    <CardContent>
                        <Box>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid item xs={12}>
                                        <Box
                                            component="img"
                                            src={imagePreview ?? "/assets/placeholder.png"}
                                            alt={"Preview de la imagen a subir"}
                                            sx={{
                                                height: 'auto',
                                                maxHeight: 400,
                                                maxWidth: '80%',
                                                borderRadius: 1,
                                                display: 'block',
                                                marginX: 'auto',
                                                marginY: 2,
                                                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 6px 20px 0 rgba(0, 0, 0, 0.07)"
                                            }}
                                        />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <TextField
                                        error={!!(formik.touched.nombre && formik.errors.nombre)}
                                        fullWidth
                                        helperText={formik.touched.nombre && formik.errors.nombre}
                                        label="Nombre"
                                        name="nombre"
                                        required
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.nombre}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <TopicsSelection formik={formik} defaultOption/>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Input
                            id="image-upload-input"
                            type="file"
                            inputProps={{ accept: "image/*" }}
                            name="path"
                            onChange={(e) => {
                                handleFileChange(e);
                            }}
                            onBlur={formik.handleBlur}
                            style={{ display: "none" }}
                        />
                        <label htmlFor="image-upload-input">
                            <Button variant="contained" component="span">
                                Seleccionar Imagen
                            </Button>
                        </label>
                        { formik.values.path && 
                            <Button variant="contained" type="submit" sx={{marginLeft: 1}}>
                                Crear
                            </Button>
                        }
                    </CardActions>
                </Card>
            </form>
        </>
    );
}

