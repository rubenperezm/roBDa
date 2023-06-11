import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
import { withAuthorization } from 'src/hocs/with-authorization';
import NextLink from 'next/link';

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
import { StateColor, Score } from 'src/sections/play/battles/battles-misc';
import { Quiz10 } from 'src/sections/play/quiz-10';
import { PartidaReview } from 'src/sections/play/partida-review';

const Page = () => {
    const router = useRouter();
    const auth = useAuth();
    const { id } = router.query;
    const [questions, setQuestions] = useState(null);
    const [battle, setBattle] = useState();
    const [notUser, setNotUser] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (id) {
            const getBattle = async () => {
                const res = await fetch(`/api/play/battles/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (res.status === 200) {
                    const data = await res.json();
                    setBattle(data);
                    setNotUser(false);
                } else {
                    setNotUser(true)
                }
            }
            getBattle();
        }
    }, [id]);


    const handleStart = () => {
        const getQuestions = async () => {
            const res = await fetch(`/api/play/battles/${id}/questions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setQuestions(data);
        };

        getQuestions();
    };

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    const toggleReportada = (currentQuestion) => {
        const newBattle = { ...battle };
        if (auth.user.username === battle.user1){
            newBattle.partidaUser1.preguntas[currentQuestion].reportada = true;
        }else{
            newBattle.partidaUser2.preguntas[currentQuestion].reportada = true;
        }
        setBattle(newBattle);
    };

    const sendResults = async () => {
        try {
            const res = await axiosAuth.put(`/api/play/battles/${id}`, { respuestas: responses });
            return res;
        } catch (err) {
            return err;
        }
    }

    if (!battle && !notUser) return null;

    return (
        <QuizLayout
            title="Duelo"
        >
            {
                questions ?
                    <Quiz10 id={id} questions={questions} sendResults={sendResults}/>
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
                                            component={NextLink}
                                            color="inherit"
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <ArrowLeftIcon />
                                                </SvgIcon>
                                            )}
                                            href="/battles"
                                        >
                                            Volver a duelos
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>

                        {notUser ?
                            <Typography variant="body1" sx={{ textAlign: "center", pt: 12 }}>
                                No tienes permiso para ver esta partida
                            </Typography>
                            :
                            <>
                            <Card sx={{ mt: 3 }}>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={4} mt={6}>
                                            <Typography noWrap variant="h6" sx={{ textAlign: "center" }}>
                                                {battle.user1}
                                            </Typography>
                                        </Grid>
                                        <Grid container xs={4}>
                                            <Grid
                                                item
                                                xs={12}
                                                display="flex"
                                                justifyContent="center"
                                            >
                                                <StateColor estado={battle.estado} user1={battle.user1} />
                                            </Grid>
                                            <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
                                                <Score estado={battle.estado} score1={battle.score1} score2={battle.score2} isUser1={auth.user.username === battle.user1} />
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={4} mt={6}>
                                            <Typography noWrap variant="h6" sx={{ textAlign: "center" }}>
                                                {battle.user2}
                                            </Typography>
                                        </Grid>

                                        <Grid container xs={12} justifyContent="center" mt={2}>
                                            <Grid
                                                item
                                                xs={4}
                                                sm={3}
                                                md={2}
                                                display="flex"
                                                justifyContent="center"
                                                mt={1}
                                            >
                                                <Typography display="inline" variant="body1" color="textPrimary">
                                                    Tema: {battle.tema}
                                                </Typography>
                                            </Grid>

                                            <Grid
                                                item
                                                xs={4}
                                                sm={3}
                                                md={2}
                                                display="flex"
                                                justifyContent="center"
                                                flexDirection="row"
                                            >
                                                <Typography variant="body1" color="textPrimary" mt={1} pr={1}>
                                                    Idioma:
                                                </Typography>
                                                <Avatar
                                                    src={`/assets/flags/${battle.idioma}.png`}>
                                                </Avatar>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                                {
                                    ((battle.user1 === auth.user.username && battle.estado === "En Creacion") ||
                                        (battle.user2 === auth.user.username && battle.estado === "Aceptado")) &&
                                    <CardActions>
                                        <Grid xs={12} container sx={{ justifyContent: "flex-end" }}>
                                            <Grid item xs={12} md={2}>
                                                <Button fullWidth variant="contained" onClick={() => handleStart()}>Jugar</Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                }
                            </Card>
                            {
                                battle.estado === "Finalizado" &&
                                <Card sx={{ mt: 2 }}>
                                    <CardHeader title="Informes de partida" />
                                    <CardContent>
                                        <Box>
                                            <Tabs value={tabValue} onChange={handleChangeTab}>
                                                <Tab label={battle.user1} />
                                                <Tab label={battle.user2} />
                                            </Tabs>
                                        </Box>
                                            
                                        {
                                            tabValue === 0 ?
                                            <PartidaReview 
                                                partida={battle.partidaUser1} 
                                                toggleReportada={toggleReportada}
                                                showReportButton={auth.user.username === battle.user1} 
                                            />
                                            :
                                            <PartidaReview 
                                                partida={battle.partidaUser2} 
                                                toggleReportada={toggleReportada}
                                                showReportButton={auth.user.username === battle.user2}
                                            />
                                        }
                                        
                                    </CardContent>
                                </Card>
                            }
                            </>
                        }
                    </Container>
            }
        </QuizLayout>
    );
};


export default withAuthorization(Page, false);

