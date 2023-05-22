import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import {
    Alert,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Snackbar,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { QuestionForm } from 'src/sections/admin/questions/questions-form';
import { QuestionQuiz } from 'src/sections/admin/questions/question-quiz';
import { ReportList } from 'src/sections/admin/questions/report-list';

const Page = (props) => {
    const router = useRouter();
    const [question, setQuestion] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [updateFlag, setUpdateFlag] = useState(true);
    const { id } = router.query;

    const handleUpdate = useCallback(async (question, body) => {
        await axiosAuth.put(`/api/questions/${question.id}`, body);
    }, [question]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowAlert(false);
    };

    useEffect(() => {
        if (id && updateFlag) {
            const getQuestion = async (id) => {
                try {
                    let response = await axiosAuth.get(`/api/questions/${id}`).then(res => res.data);
                    response.opciones = response.opciones.sort(function (x, y) { return y.esCorrecta - x.esCorrecta });
                    setQuestion(response);
                } catch (err) {
                    if (err.response.status === 404)
                        router.push('/404', router.asPath);
                    else
                        router.push('/admin/questions', router.asPath);
                }
            }
            getQuestion(id);
            setUpdateFlag(false);
        }
    }, [id, updateFlag]);


    if (!question) {
        return null;
    }

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Ver pregunta | ROBDA
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4
                }}
            >
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>{messageAlert}</Alert>
                </Snackbar>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4">
                                    Detalle pregunta
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
                                    fullWidth
                                    variant="contained"
                                    sx={{ float: 'right' }}
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    { editMode ? "Cancelar" : "Editar" }
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    {editMode ?
                        <QuestionForm
                            question={question}
                            formHandler={handleUpdate}
                            alertMessage="Pregunta actualizada correctamente"
                            setEditMode={setEditMode}
                            setUpdateFlag={setUpdateFlag}
                            setShowAlert={setShowAlert}
                            setMessageAlert={setMessageAlert}
                        />
                        :
                        <>
                            <QuestionQuiz
                                question={question}
                                solved={true}
                            />
                            <Divider />
                            <ReportList reports={question.reports} />
                        </>
                    }

                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);