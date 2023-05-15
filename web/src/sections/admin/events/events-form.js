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
import { TopicsSelection } from '../questions/topics/topics-selection';
import { LangSelection } from '../questions/languages/lang-selection';
import { DateTimePicker } from '@mui/x-date-pickers';

export const EventForm = (props) => {
    const { 
        formHandler,
        event,
        alertMessage,
        setMessageAlert,
        setShowAlert,
        setEditMode,
        setUpdateFlag,
    } = props;
    
    const router = useRouter();
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: event?.name ?? '',
            tema: event?.tema ?? '',
            idioma: event?.idioma ?? '',
            fechaInicio: event?.fechaInicio ?? null,
            finFase1: event?.finFase1 ?? null,
            finFase2: event?.finFase2 ?? null,
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup
                .string()
                .max(400)
                .required('Introduce un nombre para la competición'),
            tema: Yup
                .string()
                .max(30)
                .required('Introduce un tema para la competición'),
            idioma: Yup
                .string()
                .max(30)
                .required('Introduce un idioma para la competición'),
            fechaInicio: Yup
                .date()
                .required('Introduce una fecha de inicio'),
            finFase1: Yup
                .date()
                .required('Introduce una fecha de fin de fase')
                .min(
                    Yup.ref('fechaInicio'),
                    'Debe introducir una fecha y hora posterior a la de inicio'
                ),
            finFase2: Yup
                .date()
                .required('Introduce una fecha de fin de fase')
                .min(
                    Yup.ref('finFase1'),
                    'Debe introducir una fecha y hora posterior a la de fin de fase 1'
                ),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        name: values.name,
                        tema: values.tema,
                        idioma: values.idioma,
                        fechaInicio: values.fechaInicio,
                        finFase1: values.finFase1,
                        finFase2: values.finFase2,
                    };

                    if (event){
                        await formHandler(event, body);
                        setUpdateFlag(true);
                        setEditMode(false);
                    }else{
                        await formHandler(body);
                    }

                    setMessageAlert(alertMessage);
                    setShowAlert(true);

                    helpers.setSubmitting(false);

                    if (!event)
                        helpers.resetForm();

                } catch (err) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors(err.response.data.error);
                    helpers.setSubmitting(false);
                }
            }
    });

    const handleCloseConfirmDelete = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialogDelete(false);
    }, []);

    const handleConfirmDelete = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const deleteEvent = async () => {
            try {
                const res = await axiosAuth.delete(`/api/events/${event.id}`).then(res => res.data);
            } catch (error) {
                console.log(error);
            }
        };

        deleteEvent();

        setOpenDialogDelete(false);
        setMessageAlert('Competición eliminada correctamente');
        setShowAlert(true);

        router.push('/admin/competitions');
    };

    return (
        <>
            {event &&
                <Dialog // Confirm delete dialog
                    open={openDialogDelete}
                    onClose={handleCloseConfirmDelete}
                    aria-labelledby="alert-confirm-title"
                    aria-describedby="alert-confirm-description"
                >
                    <DialogTitle id="alert-confirm-title">
                        ¿Estás seguro de que quieres eliminar esta competición?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-confirm-description">
                            No se podrán revertir los cambios.
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
                <Card>
                    <CardContent>
                        <Box>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    xs={12}
                                >
                                    <TextField
                                        error={!!(formik.touched.name && formik.errors.name)}
                                        fullWidth
                                        helperText={formik.touched.name && formik.errors.name}
                                        label="Nombre de la competición"
                                        name="name"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                    />
                                </Grid>

                                <Grid
                                    xs={12}
                                    md={6}
                                >
                                    <TopicsSelection
                                        formik={formik}
                                        defaultOption={!event}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                >
                                    <LangSelection formik={formik} defaultOption={!event}/>
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <DateTimePicker
                                        label="Fecha de inicio"
                                        value={formik.values.fechaInicio}
                                        onChange={(value) => { formik.setFieldValue('fechaInicio', value); }}
                                        onBlur={formik.handleBlur}
                                        ampm={false}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        views={['year', 'month', 'day', 'hours', 'minutes']}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                variant="standard"
                                                error={!!(formik.touched.fechaInicio && formik.errors.fechaInicio)}
                                                fullWidth
                                                helperText={formik.touched.fechaInicio && formik.errors.fechaInicio}
                                            />
                                        )}
                                    />
                                </Grid>  
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <DateTimePicker
                                        label="Fecha de fin de fase de creación"
                                        value={formik.values.finFase1}
                                        onChange={(value) => { formik.setFieldValue('finFase1', value); }}
                                        onBlur={formik.handleBlur}
                                        ampm={false}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        views={['year', 'month', 'day', 'hours', 'minutes']}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                error={!!(formik.touched.finFase1 && formik.errors.finFase1)}
                                                fullWidth
                                                helperText={formik.touched.finFase1 && formik.errors.finFase1}
                                            />
                                        )}
                                    />
                                </Grid>  
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <DateTimePicker
                                        label="Fecha de fin de fase de cuestionario"
                                        value={formik.values.finFase2}
                                        onChange={(value) => { formik.setFieldValue('finFase2', value); }}
                                        onBlur={formik.handleBlur}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        ampm={false}
                                        views={['year', 'month', 'day', 'hours', 'minutes']}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                error={!!(formik.touched.finFase2 && formik.errors.finFase2)}
                                                fullWidth
                                                helperText={formik.touched.finFase2 && formik.errors.finFase2}
                                            />
                                        )}
                                    />
                                </Grid>                       
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        {event && event.fase_actual !== "Finalizada" &&
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => setOpenDialogDelete(true)}
                            >
                                Eliminar
                            </Button>
                        }
                        <Button variant="contained" type="submit">
                            {event ? "Guardar" : "Crear"}
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
}

