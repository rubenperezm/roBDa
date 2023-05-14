import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import axiosAuth from 'src/utils/axiosAuth';
import { TopicsSelection } from '../questions/topics/topics-selection';
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

export const EventsFilters = (props) => {
    const { setNumberOfResults, setPreguntas, setPagina } = props;
    const formik = useFormik({
        initialValues: {
            name: '',
            tema: '',
            terminada: [],
            idioma: [],
            submit: null
        },

        onSubmit: async (values, helpers) => {
            try {
                const res = await axiosAuth.get('/api/events', {
                    params: {
                        name: values.name,
                        tema: values.tema,
                        terminada: values.terminada.join(','),
                        idioma: values.idioma.join(','),
                    }
                }).then(res => res.data);
                setPreguntas(res.results);
                setNumberOfResults(res.count);
                setPagina(0);


            } catch (err) {
                helpers.setStatus({ success: false });
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
                                    label="Nombre"
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
                                <TopicsSelection formik={formik} emptyOption/>
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
                                    <FormLabel component="legend">Mostrar</FormLabel>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="terminada"
                                                onChange={formik.handleChange}
                                                value={false}
                                            />}
                                            label="En curso"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                name="terminada"
                                                onChange={formik.handleChange}
                                                value={true}
                                            />}
                                            label="Finalizadas"
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

EventsFilters.propTypes = {
    setNumberOfResults: PropTypes.func,
    setPreguntas: PropTypes.func,
    setPagina: PropTypes.func
};