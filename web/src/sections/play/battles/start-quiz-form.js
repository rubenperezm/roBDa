import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
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
    Unstable_Grid2 as Grid
} from '@mui/material';
import { TopicsSelection } from 'src/sections/admin/questions/topics/topics-selection';
import { LangSelection } from 'src/sections/admin/questions/languages/lang-selection';

export const StartQuizForm = (props) => {
    const router = useRouter();

    const handleCreate = useCallback(async (body) => {
        const { data } = await axiosAuth.post('/api/play/battles', body);
        router.push(`/battles/${data.id}`);
    }, []);

    const formik = useFormik({
        initialValues: {
            user2: '',
            tema: '',
            idioma: '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            user2: Yup
                .string()
                .max(30)
                .required('Indica un rival para la partida'),
            tema: Yup
                .string()
                .max(30)
                .required('Elige un tema para la partida'),
            idioma: Yup
                .string()
                .max(30)
                .required('Elige un idioma para la partida'),
        }),
        onSubmit:
            async (values, helpers) => {
                try {
                    const body = {
                        user2: values.user2,
                        tema: values.tema,
                        idioma: values.idioma,
                    };

                    await handleCreate(body);

                    helpers.setSubmitting(false);

                } catch (err) {
                    console.log(err)
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
                    <CardHeader
                        title="Elige rival, tema e idioma para empezar a jugar"
                    />
                    <CardContent>
                        <Box>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid 
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <TextField
                                        error={!!(formik.touched.user2 && formik.errors.user2)}
                                        fullWidth
                                        helperText={formik.touched.user2 && formik.errors.user2}
                                        label="Rival"
                                        name="user2"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.user2}
                                    /> 
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={3}
                                >
                                    <TopicsSelection formik={formik} defaultOption />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={3}
                                >
                                    <LangSelection formik={formik} defaultOption />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant="contained" type="submit">
                            Crear
                        </Button>
                    </CardActions>
                </Card>
            </form>
    );
}

