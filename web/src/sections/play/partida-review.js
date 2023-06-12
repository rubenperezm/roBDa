import { useState, useEffect } from 'react';
import {
    Box,
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

import { formatDuration, intervalToDuration } from 'date-fns';
import { Scrollbar } from 'src/components/scrollbar';
import { QuestionQuiz } from '../admin/questions/question-quiz';
import { ReportReview } from './reports/report-review';

export const PartidaReview = (props) => {
    const { partida, lecturerView, showReportButton, toggleReportada } = props; // TODO: Ver si con reports nos podemos ahorrar lecturerView
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const tiempoDeCuestionario = (fecha) => {
        const endTime = new Date(fecha);
        const startTime = new Date(partida.preguntas[0].timeIni);
        const duracion = intervalToDuration({ start: startTime, end: endTime });
        const zeroPad = (num) => String(num).padStart(2, "0");

        const formatted = formatDuration(duracion, {
            format: ["hours", "minutes", "seconds"],
            zero: true,
            delimiter: ":",
            locale: {
                formatDistance: (_token, count) => zeroPad(count)
            }
        });
        
        return formatted + " (" + endTime.toLocaleString('es', { hour12: false }) + ")";

    };


    return (
        <Grid container display="flex" justifyContent="center">
            <Grid item xs={12} sm={10} md={8} my={2}
                sx={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 6px 20px 0 rgba(0, 0, 0, 0.07)", borderRadius: "10px" }}
            >
                <Scrollbar>
                    <Stack maxHeight="80px" direction="row" px={2.5} my={2.5} spacing={3}>
                        {
                            partida.preguntas.map((pregunta, index) => {
                                return (
                                    <Button key={index}
                                        variant="contained"
                                        onClick={() => setCurrentQuestion(index)}
                                        sx={{ borderRadius: '50%', border: '2px solid', borderColor: 'black' }}
                                        color={pregunta.acierto ? 'success' : pregunta.timeFin ? 'error' : pregunta.timeIni ? 'warning' : 'primary'}>
                                        {index + 1}
                                    </Button>
                                );
                            })
                        }
                    </Stack>
                </Scrollbar>
            </Grid>
            <Grid item xs={12} my={3} >
                <Divider />
            </Grid>
            <Grid container xs={12} textAlign="center">
                <Grid container xs={12} px={5}>
                    {
                        showReportButton ?
                            <>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" color="text.secondary">
                                        {currentQuestion + 1}/{partida.preguntas.length} {partida.preguntas[currentQuestion].acierto ? "Pregunta Acertada" : partida.preguntas[currentQuestion].timeFin ? "Pregunta Fallada" : "Pregunta Sin Reponder"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} display="flex" justifyContent="right">
                                    <ReportReview log={partida.preguntas[currentQuestion].id} disabled={partida.preguntas[currentQuestion].reportada} setDisabled={toggleReportada} currentQuestion={currentQuestion}/>
                                </Grid>
                            </>
                            :
                            <Grid item xs={12} pb={2.3}>
                                <Typography variant="h6" color="text.secondary">
                                    {currentQuestion + 1}/{partida.preguntas.length} {partida.preguntas[currentQuestion].acierto ? "Pregunta Acertada" : partida.preguntas[currentQuestion].timeFin ? "Pregunta Fallada" : "Pregunta Sin Reponder"}
                                </Typography>
                            </Grid>

                    }
                </Grid>
                <Grid item xs={12} mt={1}>
                    <Typography variant="body1">
                        {partida.preguntas[currentQuestion].timeIni ? "Leída: " + tiempoDeCuestionario(partida.preguntas[currentQuestion].timeIni) : ""}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        {partida.preguntas[currentQuestion].timeFin ? "Respondida: " + tiempoDeCuestionario(partida.preguntas[currentQuestion].timeFin) : ""}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <QuestionQuiz
                    solved
                    question={partida.preguntas[currentQuestion].pregunta}
                    selected={partida.preguntas[currentQuestion].respuesta}
                />
            </Grid>
        </Grid>
    );
}