import { Button, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { QuestionQuiz } from "src/sections/admin/questions/question-quiz";

import axiosAuth from "src/utils/axiosAuth";

import { Report } from "../report";
import { Rate } from "../rate";

export const Quiz = (props) => {
    const { idPartida } = props;
    const [question, setQuestion] = useState(null);
    const [solution, setSolution] = useState(false);
    const [selected, setSelected] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const getQuestion = async () => {
            setSelected(null);
            setRating(0);
            const response = await axiosAuth.put(`/api/play/study/${idPartida}`);
            setQuestion(response.data);
        };

        const sendAnswer = async () => {
            const body = {
                respuesta: selected,
                valoracion: rating
            }
            const response = await axiosAuth.patch(`/api/play/study/${question.id_log}`, body);
            console.log(response.data);
        };
        if (!solution)
            getQuestion();
        else
            sendAnswer();
    }, [solution]);

    if (!question) return null;

    if (solution)
        return (
            <Container maxWidth="xl">
                <QuestionQuiz question={question} solved selected={selected} setSelected={setSelected}/>
                <Grid container >
                    <Grid item xs={12} sm={3}>
                        <Report question={question} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Rate rate={rating} setRate={setRating} label="Valora la dificultad de esta pregunta:" />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            disabled={rating == 0}
                            variant="contained"
                            sx={{ float: "right" }}
                            onClick={() => setSolution(!solution)}
                        >
                            Continuar
                        </Button>
                    </Grid>

                </Grid>
            </Container>
        );
    else return (
        <Container maxWidth="xl">
            <QuestionQuiz question={question} selected={selected} setSelected={setSelected}/>
            <Grid container >
                <Grid item xs={12}>
                    <Button
                        disabled={!selected}
                        variant="contained"
                        sx={{ float: "right" }}
                        onClick={() => setSolution(!solution)}
                    >
                        Comprobar
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

}