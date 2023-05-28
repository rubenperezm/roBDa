import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Button, Container, Stack, Unstable_Grid2 as Grid } from "@mui/material";
import { QuestionQuiz } from "src/sections/admin/questions/question-quiz";

import axiosAuth from "src/utils/axiosAuth";

import { Report } from "../reports/report";
import { Rate } from "../rate";

export const Quiz = (props) => {
    const { idPartida } = props;
    const [question, setQuestion] = useState(null);
    const [solution, setSolution] = useState(false);
    const [selected, setSelected] = useState(null);
    const [rating, setRating] = useState(null);
    const [canContinue, setCanContinue] = useState(false);

    useEffect(() => {
        const getQuestion = async () => {
            setSelected(null);
            setCanContinue(false);
            setRating(null);
            const response = await axiosAuth.put(`/api/play/study/${idPartida}`);
            setQuestion(response.data);
        };

        const sendAnswer = async () => {
            const body = {
                respuesta: selected,
            }
            await axiosAuth.patch(`/api/play/study/${question.id_log}`, body);
        };
        if (!solution)
            getQuestion();
        else
            sendAnswer();
    }, [solution]);

    useEffect(() => {
        const sendRate = async () => {
            const body = {
                valoracion: rating
            }
            await axiosAuth.patch(`/api/play/study/rate/${question.id_log}`, body);
        }
        if (canContinue)
            sendRate();

    }, [canContinue]);

    if (!question) return null;

    if (solution)
        return (
            <Container maxWidth="xl">
                <QuestionQuiz question={question} solved selected={selected} setSelected={setSelected} />

                {
                    canContinue ?
                        <Grid container p={5} spacing={2} pt={0}>
                            <Grid item xs={2} sm={4} md={6} lg={8} sx={{display: "flex", justifyContent: "right"}}>
                                <Report question={question} />
                            </Grid>
                            <Grid item xs={10} sm={4} md={3} lg={2}>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => { window.location.reload(); }}
                                >
                                    Terminar Repaso
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} lg={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => { setSolution(false) }}
                                >
                                    Continuar
                                </Button>
                            </Grid>
                        </Grid>

                        :

                        <Grid container p={5} spacing={2} pt={0}>
                            <Grid item xs={12} sm={8} pb={{xs: 2, sm: 0}} display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                <Rate rate={rating} setRate={setRating} label="Valora la dificultad de esta pregunta:" />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Stack spacing={2} direction="row" display="flex" justifyContent={{ xs: "center", sm: "right" }}>
                                    <Report question={question} />
                                    <Button
                                        disabled={rating === null}
                                        variant="contained"
                                        onClick={() => setCanContinue(true)}
                                    >
                                        Enviar valoración
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                }

            </Container>
        );
    else return (
        <Container maxWidth="xl">
            <QuestionQuiz question={question} selected={selected} setSelected={setSelected} />
            <Grid container >
                <Grid item xs={12}>
                    <Button
                        disabled={!selected}
                        variant="contained"
                        sx={{ float: "right" }}
                        onClick={() => setSolution(true)}
                    >
                        Comprobar
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

}