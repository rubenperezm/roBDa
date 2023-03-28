import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import axiosAuth from 'src/utils/axiosAuth';
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
} from '@mui/material';

export const TopicsFilters = (props) => {
    const { setNumberOfResults, setTemas, setPagina } = props;
    const formik = useFormik({
        initialValues: {
            tema: '',
            submit: null
        },

        onSubmit: async (values, helpers) => {
            try {
                const res = await axiosAuth.get('/api/questions/topics', {
                    params: {
                        tema: values.tema,
                    }
                }).then(res => res.data);
                setTemas(res.results);
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
                                    label="Tema"
                                    name="tema"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.tema}
                                />
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

TopicsFilters.propTypes = {
    setNumberOfResults: PropTypes.func,
    setTemas: PropTypes.func,
    setPagina: PropTypes.func
};