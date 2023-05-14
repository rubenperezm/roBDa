import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosAuth from 'src/utils/axiosAuth';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    Snackbar,
    CircularProgress,
    TextField,
    Unstable_Grid2 as Grid
} from '@mui/material';

export const TopicForm = (props) => {
    const { formHandler, topic, alertMessage } = props;
    const router = useRouter();
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const formik = useFormik({
        initialValues: {
            nombre: topic?.nombre ?? '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            nombre: Yup
                .string()
                .max(30)
                .required('Introduce un nombre para el tema'),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        nombre: values.nombre,
                    }

                    if (topic) // Update
                        await formHandler(topic, body);

                    else // Create
                        await formHandler(body);

                    setMessageAlert(alertMessage);
                    setShowAlert(true);

                    helpers.setSubmitting(false);

                    if (!topic)
                        helpers.resetForm();

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

    const handleCloseConfirmDelete = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialogDelete(false);
    }, []);

    const handleConfirmDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const deleteTopic = async () => {
            try {
                const res = await axiosAuth.delete(`/api/questions/topics/${topic.id}`).then(res => res.data);
            } catch (error) {
                console.log(error);
            }
        };

        deleteTopic();

        setOpenDialogDelete(false);
        setMessageAlert('Tema eliminado correctamente');
        setShowAlert(true);

        router.push('/admin/questions/topics');
    };


    return (
        <>
            {topic &&
                <Dialog // Confirm delete dialog
                    open={openDialogDelete}
                    onClose={handleCloseConfirmDelete}
                    aria-labelledby="alert-confirm-title"
                    aria-describedby="alert-confirm-description"
                >
                    <DialogTitle id="alert-confirm-title">
                        ¿Estás seguro de que quieres eliminar este tema?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-confirm-description">
                            Se eliminarán todas las preguntas y competiciones asociadas a este tema.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDelete}>Cancelar</Button>
                        <Button onClick={handleConfirmDelete} autoFocus>
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            <form
                autoComplete="off"
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>{messageAlert}</Alert>
                </Snackbar>
                <Card>
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
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        {topic &&
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => setOpenDialogDelete(true)}
                            >
                                Eliminar
                            </Button>
                        }
                        <Button variant="contained" type="submit">
                            {topic ? "Guardar" : "Crear"}
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
}

