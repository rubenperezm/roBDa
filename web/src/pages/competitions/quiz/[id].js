import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
import { withAuthorization } from 'src/hocs/with-authorization';
import NextLink from 'next/link';
import axiosAuth from 'src/utils/axiosAuth';

import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';

import { Layout as QuizLayout } from 'src/layouts/quiz/layout';
import { Quiz10 } from 'src/sections/play/quiz-10';

const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [questions, setQuestions] = useState(null);
    const [participacion, setParticipacion] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [notUser, setNotUser] = useState(true);
    const [date, setDate] = useState(null);

    useEffect(() => {
        if (id) {
            const getParticipacion = async () => {
                try {
                    const res = await axiosAuth.get(`/api/events/${id}`);
                    if (res.status === 200) {
                        if (res.data.participacion) {
                            setParticipacion(res.data.participacion);
                            setFechaInicio(new Date(res.data.evento.finFase1));
                            setFechaFin(new Date(res.data.evento.finFase2));
                            setNotUser(false)
                        }
                        else {
                            router.push(`/competitions/${id}`);
                            setNotUser(true);
                        }

                    } else {
                        router.push(`/competitions/${id}`);
                        setNotUser(true);
                    }
                } catch (err) {
                    router.push(`/competitions/${id}`);
                    setNotUser(true);
                }
            }
            getParticipacion();
        }
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleStart = () => {
        const getQuestions = async () => {
            const res = await axiosAuth.put(`/api/play/competitions/${participacion.id}`);
            setQuestions(res.data);
        };

        getQuestions();
    };

    const sendResults = async (responses) => {
        try {
            await axiosAuth.patch(`/api/play/competitions/${participacion.id}`, { respuestas: responses });
        } catch (err) {
            //console.log(err);
        }
    }

    if (notUser) return null;

    return (
        <QuizLayout
            title="Competición"
        >
            {
                questions ?
                    <Quiz10 id={id} questions={questions} sendResults={sendResults} endDate={fechaFin}/>
                    :
                    <Container maxWidth="xl">
                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={1}
                                    >
                                        <Button
                                            color="inherit"
                                            component={NextLink}
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <ArrowLeftIcon />
                                                </SvgIcon>
                                            )}
                                            href={`/competitions/${id}`}
                                        >
                                            Volver a competición
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Card sx={{ mt: 3 }}>
                            <CardHeader title="Información de partida" titleTypographyProps={{ variant: "h4" }} />
                            <CardContent sx={{ justifyContent: "center", alignItems: "center" }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                                    <QuizIcon sx={{ mb: 2 }} />
                                    <Typography variant="h5" sx={{ ml: 2, mb: 2 }}>
                                        10 preguntas
                                    </Typography>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                                    <LibraryAddCheckIcon sx={{ mb: 2 }} />
                                    <Typography variant="h5" sx={{ ml: 2, mb: 2 }}>
                                        10 puntos por acierto
                                    </Typography>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                                    <AccessTimeIcon sx={{ mb: 2 }} />
                                    <Typography variant="h5" sx={{ ml: 2, mb: 2 }}>
                                        15 minutos
                                    </Typography>
                                </div>
                            </CardContent>
                            <Divider />
                            {
                                (!participacion.partida && fechaInicio < date && date < fechaFin ?
                                    <CardActions>
                                        <Grid xs={12} container sx={{ justifyContent: "flex-end" }}>
                                            <Grid item xs={12} md={2}>
                                                <Button fullWidth variant="contained" onClick={() => handleStart()}>Jugar</Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                    :
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography variant="body1">
                                            No puedes jugar esta partida
                                        </Typography>
                                    </CardContent>
                                )
                            }
                        </Card>
                    </Container>
            }
        </QuizLayout>
    );
};


export default withAuthorization(Page, false);

