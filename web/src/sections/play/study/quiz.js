import { Button, Container } from "@mui/material";
import { useState, useEffect } from "react";
import { QuestionQuiz } from "src/sections/admin/questions/question-quiz";

import axiosAuth from "src/utils/axiosAuth";

export const Quiz = (props) => {
    const { idPartida } = props;
    const [question, setQuestion] = useState(null);
    const [nextQuestion, setNextQuestion] = useState(true);
    const [solution, setSolution] = useState(false);

    useEffect(() => {
        const getQuestion = async () => {
            if (nextQuestion){
                const response = await axiosAuth.put(`http://localhost:3000/api/play/study/${idPartida}`);
                setQuestion(response.data);
                setNextQuestion(false);
            }
        };
        getQuestion();
    }, [nextQuestion]);

    if (!question) return null;

    return (
        <Container maxWidth="xl">
        {solution ?
        <QuestionQuiz question={question} solved />
        :
        <QuestionQuiz question={question} />
        }
        <Button variant="contained" sx={{float: "right"}} onClick={() => setSolution(!solution)}>
            Comprobar
        </Button>
        </Container>
    );
}