import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { QuestionForm } from 'src/sections/admin/questions/questions-form';
import { QuestionQuiz } from 'src/sections/admin/questions/question-quiz';

const Page = (props) => {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const { id } = router.query;

    const handleUpdate = useCallback(async (question, body) => {
        await axiosAuth.put(`/api/questions/${question.id}`, body);
    }, [question]);


    useEffect(() => {
        if (id) {
            const getQuestion = async (id) => {
                try {
                    let response = await axiosAuth.get(`/api/questions/${id}`).then(res => res.data);
                    response.opciones = response.opciones.sort(function(x, y) { return y.esCorrecta - x.esCorrecta });
                    setQuestion(response);
                } catch (err) {
                    router.push('/404', router.asPath);

                }
            }
            getQuestion(id);
        }
    }, [id]);


    if (!question) {
        return null;
    }

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Editar pregunta | ROBDA
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4">
                                    Editar pregunta
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={9} md={10}>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        component={NextLink}
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowLeftIcon />
                                            </SvgIcon>
                                        )}
                                        href="/admin/questions"
                                    >
                                        Volver a preguntas
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <Button
                                    component={NextLink}
                                    fullWidth
                                    variant="contained"
                                    sx={{ float: 'right' }}
                                    href={`/admin/questions/${question.id}/edit`}
                                >
                                    Editar Pregunta
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    {/* <QuestionForm
                        question={question}
                        formHandler={handleUpdate}
                        alertMessage="Pregunta actualizada correctamente"
                    /> */}{/* TODO: Poner el questionForm en la ruta de [id]/edit*/ }
                    <QuestionQuiz
                        question={question}
                    />
                    {/* TODO: Reports */}
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default Page;