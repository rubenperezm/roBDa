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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    TextField,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { TopicsSelection } from './topics/topics-selection';
import { LangSelection } from './languages/lang-selection';
import { ImgsSelection } from './images/imgs-selection';
import { ImageLightbox } from './images/imgs-lightbox';

export const QuestionForm = (props) => {
    const { 
        formHandler,
        question,
        alertMessage,
        setMessageAlert,
        setShowAlert,
        setEditMode,
        setUpdateFlag,
    } = props;
    
    const router = useRouter();
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [image, setImage] = useState(null);

    const formik = useFormik({
        initialValues: {
            enunciado: question?.enunciado ?? '',
            opcion1: question?.opciones[0]?.texto ?? '',
            opcion2: question?.opciones[1]?.texto ?? '',
            opcion3: question?.opciones[2]?.texto ?? '',
            opcion4: question?.opciones[3]?.texto ?? '',
            tema: question?.tema ?? '',
            idioma: question?.idioma ?? '',
            image: question?.imagen?.id ?? '',


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
            tema: Yup
                .string()
                .max(30)
                .required('Introduce un tema para la pregunta'),
            idioma: Yup
                .string()
                .max(30)
                .required('Introduce un idioma para la pregunta'),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        enunciado: values.enunciado,
                        tema: values.tema,
                        idioma: values.idioma,
                        image: values.image,
                    }

                    if (question){
                        body.opciones = [
                            {id: question.opciones[0].id, texto: values.opcion1, esCorrecta: true},
                            {id: question.opciones[1].id, texto: values.opcion2, esCorrecta: false},
                            {id: question.opciones[2].id, texto: values.opcion3, esCorrecta: false},
                            {id: question.opciones[3].id, texto: values.opcion4, esCorrecta: false},
                        ];
                        await formHandler(question, body);
                        setUpdateFlag(true);
                        setEditMode(false);

                    }else{
                        body.opciones = [
                            {texto: values.opcion1, esCorrecta: true},
                            {texto: values.opcion2, esCorrecta: false},
                            {texto: values.opcion3, esCorrecta: false},
                            {texto: values.opcion4, esCorrecta: false},
                        ];
                        await formHandler(body);
                    }

                    setMessageAlert(alertMessage);
                    setShowAlert(true);

                    helpers.setSubmitting(false);

                    if (!question)
                        helpers.resetForm();

                } catch (err) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors(err.response.data.error);
                    helpers.setSubmitting(false);
                }
            }
    });

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
        const deleteQuestion = async () => {
            try {
                const res = await axiosAuth.delete(`/api/questions/${question.id}`).then(res => res.data);
            } catch (error) {
                //console.log(error);
            }
        };

        deleteQuestion();

        setOpenDialogDelete(false);
        setMessageAlert('Pregunta eliminada correctamente');
        setShowAlert(true);

        router.push('/admin/questions');
    };


    return (
        <>
            {question &&
                <Dialog // Confirm delete dialog
                    open={openDialogDelete}
                    onClose={handleCloseConfirmDelete}
                    aria-labelledby="alert-confirm-title"
                    aria-describedby="alert-confirm-description"
                >
                    <DialogTitle id="alert-confirm-title">
                        ¿Estás seguro de que quieres eliminar esta pregunta?
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
                                    <ImgsSelection formik={formik}/>
                                        
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <TopicsSelection
                                        formik={formik}
                                        defaultOption={!question}
                                        disabled={!!formik.values.image}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <LangSelection formik={formik} defaultOption={!question}/>
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
                        {question &&
                            <Button
                                color="error"
                                variant="contained"
                                onClick={() => setOpenDialogDelete(true)}
                            >
                                Eliminar
                            </Button>
                        }
                        <Button variant="contained" type="submit">
                            {question ? "Guardar" : "Crear"}
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </>
    );
}

