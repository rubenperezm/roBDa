import React, { useEffect, useState, useCallback } from 'react';
import NextLink from 'next/link';
import { useFormik } from 'formik';
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
    Unstable_Grid2 as Grid
} from '@mui/material';
import { TopicsSelection } from 'src/sections/admin/questions/topics/topics-selection';
import { LangSelection } from 'src/sections/admin/questions/languages/lang-selection';

export const StartQuizForm = (props) => {
    const { setOnQuiz } = props; // Actualizar a true en el handleCreate

    const handleCreate = useCallback(async (body) => {
        const { data } = await axiosAuth.post('/api/play/study', body);
        setOnQuiz(data.partida.id);
    }, []);

    const formik = useFormik({
        initialValues: {
            tema: '',
            idioma: '',
            submit: null
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
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
                        tema: values.tema,
                        idioma: values.idioma,
                    };

                    await handleCreate(body);

                    helpers.setSubmitting(false);

                } catch (err) {
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
                        title="Elige un tema y un idioma para empezar a jugar"
                    />
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
                                    <TopicsSelection formik={formik} defaultOption />
                                </Grid>

                                <Grid
                                    xs={12}
                                    md={6}
                                >
                                    <LangSelection formik={formik} defaultOption />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant="contained" type="submit">
                            Jugar
                        </Button>
                    </CardActions>
                </Card>
            </form>
    );
}

