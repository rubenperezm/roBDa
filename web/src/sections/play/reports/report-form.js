import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Snackbar,
    CircularProgress,
    TextField,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { MotivoSelection } from './motivo-selection';
export const ReportForm = (props) => {
    const {
        log,
        formHandler,
        handleCloseConfirmReport,
    } = props;

    const formik = useFormik({
        initialValues: {
            motivo: 1,
            descripcion: '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            motivo: Yup
                .string()
                .required('Introduce un motivo para el reporte'),
            descripcion: Yup
                .string()
                .min(10, 'La descripción debe tener al menos 10 caracteres')
                .max(400, 'La descripción debe tener como máximo 400 caracteres')
                .required('Introduce una descripción para el reporte'),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        log: log,
                        motivo: values.motivo,
                        descripcion: values.descripcion,
                    };

                    await formHandler(body);

                    helpers.setSubmitting(false);

                    // Salir del modal de reporte y pasar a la siguiente pregunta

                } catch (err) {
                    console.log(err);
                    helpers.setStatus({ success: false });
                    helpers.setErrors(err.response.data.error);
                    helpers.setSubmitting(false);
                }
            }
    });

    return (
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
                                <MotivoSelection formik={formik} />
                            </Grid>
                            <Grid
                                xs={12}
                            >
                                <TextField
                                    error={!!(formik.touched.descripcion && formik.errors.descripcion)}
                                    fullWidth
                                    helperText={formik.touched.descripcion && formik.errors.descripcion}
                                    label="Descripción"
                                    name="descripcion"
                                    multiline
                                    rows={8}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.descripcion}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button onClick={handleCloseConfirmReport} >
                        Cancelar
                    </Button>
                    <Button type="submit" autoFocus>
                        Reportar
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}

