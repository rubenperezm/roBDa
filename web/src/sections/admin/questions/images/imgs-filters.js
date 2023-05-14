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
    InputLabel,
    FormControl,
    MenuItem,
    OutlinedInput,
    TextField,
    Unstable_Grid2 as Grid,
    Select
} from '@mui/material';
import { useEffect, useState } from 'react';
import { TopicsSelection } from '../topics/topics-selection';

export const ImgsFilters = (props) => {
    const { setNumberOfResults, setImagenes, setPagina } = props;
    const formik = useFormik({
        initialValues: {
            nombre: '',
            tema: '',
            submit: null
        },

        onSubmit: async (values, helpers) => {
            try {
                const res = await axiosAuth.get('/api/questions/images', {
                    params: {
                        nombre: values.nombre,
                        tema: values.tema
                    }
                }).then(res => res.data);
                setImagenes(res.results);
                setNumberOfResults(res.count);
                setPagina(1);


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
                                    name="nombre"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.nombre}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TopicsSelection formik={formik} emptyOption/>
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

ImgsFilters.propTypes = {
    setNumberOfResults: PropTypes.func,
    setPreguntas: PropTypes.func,
    setPagina: PropTypes.func
};