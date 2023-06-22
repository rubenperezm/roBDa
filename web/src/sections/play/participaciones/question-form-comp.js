import { useEffect, useState, useCallback } from 'react';
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
    CardHeader,
    Divider,
    Snackbar,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';

import { ImgsSelection } from 'src/sections/admin/questions/images/imgs-selection';
import { ImageLightbox } from 'src/sections/admin/questions/images/imgs-lightbox';


export const QuestionFormComp = (props) => {
    const {
        evento,
        setUpdateFlag,
    } = props;

    const [image, setImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const formik = useFormik({
        initialValues: {
            enunciado: '',
            opcion1: '',
            opcion2: '',
            opcion3: '',
            opcion4: '',
            image: '',


            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            enunciado: Yup
                .string()
                .max(400)
                .required('Introduce un enunciado para la pregunta'),
            opcion1: Yup
                .string()
                .max(300)
                .required('Introduce una opción')
                .notOneOf(
                    [
                        Yup.ref('opcion2'),
                        Yup.ref('opcion3'),
                        Yup.ref('opcion4')
                    ],
                    'Las opciones deben ser diferentes'
                ),
            opcion2: Yup
                .string()
                .max(300)
                .required('Introduce una opción')
                .notOneOf(
                    [
                        Yup.ref('opcion1'),
                        Yup.ref('opcion3'),
                        Yup.ref('opcion4')
                    ],
                    'Las opciones deben ser diferentes'
                ),
            opcion3: Yup
                .string()
                .max(300)
                .required('Introduce una opción')
                .notOneOf(
                    [
                        Yup.ref('opcion2'),
                        Yup.ref('opcion1'),
                        Yup.ref('opcion4')
                    ],
                    'Las opciones deben ser diferentes'
                ),
            opcion4: Yup
                .string()
                .max(300)
                .required('Introduce una opción')
                .notOneOf(
                    [
                        Yup.ref('opcion2'),
                        Yup.ref('opcion3'),
                        Yup.ref('opcion1')
                    ],
                    'Las opciones deben ser diferentes'
                ),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        evento: evento.id,
                        enunciado: values.enunciado,
                        tema: evento.tema,
                        idioma: evento.idioma,
                        image: values.image,
                        opciones: [
                            { texto: values.opcion1, esCorrecta: true },
                            { texto: values.opcion2, esCorrecta: false },
                            { texto: values.opcion3, esCorrecta: false },
                            { texto: values.opcion4, esCorrecta: false },
                        ],
                    }

                    await axiosAuth.post('/api/questions', body);
                    await axiosAuth.post('/api/play/competitions', { evento: evento.id})

                    setShowAlert(true);
                    setUpdateFlag(true);

                    helpers.setSubmitting(false);


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


    useEffect(() => {
        const getQuestionImage = async () => {
            try {
                const res = await axiosAuth.get(`/api/questions/images/${formik.values.image}`).then(res => res.data);
                setImage(res.path);
            } catch (error) {
                //console.log(error);
            }
        };

        if (formik.values.image)
            getQuestionImage();
        else
            setImage(null);

    }, [formik.values.image]);


    return (
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>Pregunta creada</Alert>
            </Snackbar>
            <form
                autoComplete="off"
                noValidate
                onSubmit={formik.handleSubmit}
            >
                <Card sx={{mt: 2}}>
                    <CardHeader 
                        title="Fase 1: Creación de preguntas" 
                        subheader="Crea una pregunta para participar en la competición. Recuerda que el tema y el idioma vienen dados en los detalles de la competición."
                        titleTypographyProps={{ mb: 1 }}    
                    />

                    <CardContent>
                        <Box>
                            <Grid
                                container
                                spacing={3}
                                display="flex"
                                justifyContent="center"
                            >
                                {image &&
                                    <Grid
                                        xs={12}
                                    >
                                        <ImageLightbox imagePath={image} />
                                    </Grid>
                                }
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <ImgsSelection formik={formik} tema={evento.tema} />

                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <Divider />
                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <TextField
                                        error={!!(formik.touched.enunciado && formik.errors.enunciado)}
                                        fullWidth
                                        helperText={formik.touched.enunciado && formik.errors.enunciado}
                                        label="Enunciado"
                                        name="enunciado"
                                        multiline
                                        rows={6}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.enunciado}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <Divider />
                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <TextField
                                        error={!!(formik.touched.opcion1 && formik.errors.opcion1)}
                                        fullWidth
                                        helperText={formik.touched.opcion1 && formik.errors.opcion1}
                                        label="Respuesta correcta"
                                        name="opcion1"
                                        multiline
                                        rows={3}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.opcion1}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <TextField
                                        error={!!(formik.touched.opcion2 && formik.errors.opcion2)}
                                        fullWidth
                                        helperText={formik.touched.opcion2 && formik.errors.opcion2}
                                        label="Opción incorrecta 1"
                                        name="opcion2"
                                        multiline
                                        rows={3}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.opcion2}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <TextField
                                        error={!!(formik.touched.opcion3 && formik.errors.opcion3)}
                                        fullWidth
                                        helperText={formik.touched.opcion3 && formik.errors.opcion3}
                                        label="Opción incorrecta 2"
                                        name="opcion3"
                                        multiline
                                        rows={3}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.opcion3}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                >
                                    <TextField
                                        error={!!(formik.touched.opcion4 && formik.errors.opcion4)}
                                        fullWidth
                                        helperText={formik.touched.opcion4 && formik.errors.opcion4}
                                        label="Opción incorrecta 3"
                                        name="opcion4"
                                        multiline
                                        rows={3}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.opcion4}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant="contained" type="submit">
                            Crear pregunta
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
}

