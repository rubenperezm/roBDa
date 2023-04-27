import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import axiosAuth from 'src/utils/axiosAuth';
import { TopicsSelection } from './topics/topics-selection';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Unstable_Grid2 as Grid,
    Checkbox,
    FormGroup,
    FormControlLabel,
    FormLabel
} from '@mui/material';

export const QuestionsFilters = (props) => {
    const { setNumberOfResults, setPreguntas, setPagina } = props;
    const formik = useFormik({
        initialValues: {
            creador: '',
            tema: '',
            evento: '',
            estado: [],
            idioma: [],
            submit: null
        },

        onSubmit: async (values, helpers) => {
            try {
                const res = await axiosAuth.get('/api/questions', {
                    params: {
                        creador: values.creador,
                        tema: values.tema,
                        evento: values.evento,
                        estado: values.estado.join(','),
                        idioma: values.idioma.join(','),
                    }
                }).then(res => res.data);
                setPreguntas(res.results);
                setNumberOfResults(res.count);
                setPagina(0);


            } catch (err) {
                helpers.setStatus({ success: false });
                //helpers.setErrors(err.response.data.error);
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
                <CardHeader
                    title="Filtrar"
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
                                    fullWidth
                                    label="Creador"
                                    name="creador"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.creador}
                                />
                            </Grid>
                            <Grid
                                xs={6}
                                md={3}
                            >
                                <TopicsSelection formik={formik} emptyOption/>
                            </Grid>
                            <Grid
                                xs={6}
                                md={3}
                            >
                                <TextField
                                    fullWidth
                                    label="Evento"
                                    name="evento"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.evento}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <FormGroup>
                                    <FormLabel component="legend">Idioma</FormLabel>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="idioma"
                                                onChange={formik.handleChange}
                                                value={1}
                                            />}
                                            label="Español"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="idioma"
                                                onChange={formik.handleChange}
                                                value={2}
                                            />}
                                            label="Inglés"
                                        />
                                    </div>
                                </FormGroup>
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <FormGroup>
                                    <FormLabel component="legend">Estado</FormLabel>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="estado"
                                                onChange={formik.handleChange}
                                                value={1}
                                            />}
                                            label="En evento"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="estado"
                                                onChange={formik.handleChange}
                                                value={2}
                                            />}
                                            label="Activa"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="estado"
                                                onChange={formik.handleChange}
                                                value={4}
                                            />}
                                            label="Reportada"
                                        />
                                    </div>
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" type="submit">
                        Buscar
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

QuestionsFilters.propTypes = {
    setNumberOfResults: PropTypes.func,
    setPreguntas: PropTypes.func,
    setPagina: PropTypes.func
};