import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
import { withAuthorization } from 'src/hocs/with-authorization';
import NextLink from 'next/link';

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Divider,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import { Layout as QuizLayout } from 'src/layouts/quiz/layout';
import { Quiz } from 'src/sections/play/study/quiz';

import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { StateColor, Score } from 'src/sections/play/battles/battles-misc';


const getScore = (score1, score2, estado) => {
    return `${score1} : ${score2}`
}
const Page = () => {
    const router = useRouter();
    const auth = useAuth();
    const { id } = router.query;
    const [onQuiz, setOnQuiz] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [battle, setBattle] = useState();
    const [notUser, setNotUser] = useState(false);


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
            console.log(data)
            setQuestions(data.preguntas);
        };

        getQuestions();
        setOnQuiz(true);
    };

    if (!battle && !notUser) return null;

    return (
        <QuizLayout
            title="Duelo"
        >
            {
                onQuiz ?
                    //<Quiz idPartida={onQuiz}/>
                    <Button onClick={() => setOnQuiz(0)}>Quitar este botón</Button>
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
                                                <StateColor estado={battle.estado} user1={battle.user1}/>
                                            </Grid>
                                            <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
                                                <Score estado={battle.estado} score1={battle.score1} score2={battle.score2} isUser1={auth.user.username === battle.user1}/>
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
                        }
                    </Container>
            }
        </QuizLayout>
    );
};


export default withAuthorization(Page, false);

