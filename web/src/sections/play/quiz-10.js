import { useState, useEffect } from 'react';
import Router from 'next/router';
import { addMinutes } from 'date-fns';
import { Button, Container, Divider, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { QuestionQuiz } from '../admin/questions/question-quiz';
import axiosAuth from 'src/utils/axiosAuth';
import { CountDown } from 'src/components/countDown';

export const Quiz10 = (props) => {
    const { id, questions, sendResults, endDate } = props;
    const [selected, setSelected] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]);
    const [finished, setFinished] = useState(false);
    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js


    useEffect(() => {
        setResponses([...responses, { id: questions[currentQuestion].id, timeIni: new Date().toISOString() }]);
    }, [currentQuestion]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!finished) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [finished]);

    useEffect(() => {
        if (finished) {
            sendResults(responses);
            Router.reload();
        }
    }, [finished]);

    const scrollToTop = () => {
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    const handleNext = async () => {
        setResponses(prevResponses => {
            const updatedResponses = [...prevResponses];
            const currentResponse = updatedResponses[updatedResponses.length - 1];
            currentResponse.timeFin = new Date().toISOString();
            currentResponse.respuesta = selected;
            return updatedResponses;
        });
        if (currentQuestion < questions.length - 1) {
            setSelected(null)
            setCurrentQuestion(currentQuestion + 1);
            scrollToTop();
        } else {
            setFinished(true);
        }
    }

    if (!questions) return null;

    return (
        <Container maxWidth="xl">
            <Grid container display="flex-end" justifyContent="center" textAlign="center">
                <Grid item xs={0} sm={4}></Grid>
                <Grid item xs={12} sm={4} mb={{xs: 2, sm: 0}}>
                    <Typography variant="h6">
                        {currentQuestion + 1}/{questions.length}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <CountDown setFinished={setFinished} endDate={endDate}/>
                </Grid>
            </Grid>

            <QuestionQuiz question={questions[currentQuestion]} selected={selected} setSelected={setSelected} />

            <Grid container display="flex" justifyContent="right">
                <Grid item xs={12} sm={4} md={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleNext()}
                        disabled={selected === null}
                    >
                        {(currentQuestion < questions.length - 1) ? 'Siguiente' : 'Finalizar'}
                    </Button>
                </Grid>
            </Grid>
        </Container>

    );


}