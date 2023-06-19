import { useState, useEffect } from "react"
import axiosAuth from "src/utils/axiosAuth"
import {
    Alert,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Rating,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    Box
} from "@mui/material"
import { QuestionFormComp } from "./question-form-comp";
import {ScoreOverview } from "./score-overview";
import { QuestionQuiz } from "src/sections/admin/questions/question-quiz";
import { IniciarParticipacionQuiz } from "./iniciar-participacion-quiz";
import { PartidaReview } from "../partida-review";
import { Rate } from "../rate";

const calcularFase = (event) => {
    const now = new Date().toISOString();
    if (event.fechaInicio >= now) {
        return 0;
    } else if (event.finFase1 >= now) {
        return 1;
    } else if (event.finFase2 >= now) {
        return 2;
    } else if (!event.terminada) {
        return 3;
    } else {
        return 4;
    }
}


export const ParticipacionOverview = ({ participacion, setParticipacion, pregunta, evento, setUpdateFlag }) => {
    const [fase, setFase] = useState(calcularFase(evento));
    const [rate, setRate] = useState(null);

    const toggleReportada = (currentQuestion) => {
        const newParticipacion = { ...participacion };
        newParticipacion.partida.preguntas[currentQuestion].reportada = true;
        setParticipacion(newParticipacion);
    };

    const sendRate = async () => {
        const body = {
            valoracion: rate
        }
        await axiosAuth.patch(`/api/play/competitions/${participacion.id}/rate`, body);

        const newParticipacion = { ...participacion };
        newParticipacion.valoracion = rate;
        setParticipacion(newParticipacion);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setFase(calcularFase(evento));
        }, 1000);
        return () => clearInterval(interval);
    }, [evento]);

    if (fase == 0) {
        return (
            <Card sx={{ mt: 2 }}>
                <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        La competición no ha comenzado todavía.
                    </Typography>
                </CardContent>
            </Card>
        )
    }
    else if (fase == 1) {
        return (
            <>
                {
                    participacion && (
                        <Alert severity="info" variant="filled" sx={{ mt: 2 }}>
                            Ya has creado la pregunta. Prepárate para la siguiente fase.
                        </Alert>
                    )

                }
                <Card sx={{ mt: 2 }}>
                    {
                        participacion ? (
                            <CardContent>
                                <Typography variant="h5">
                                    Fase 1: Creación de preguntas
                                </Typography>
                                <QuestionQuiz question={pregunta} solved />
                            </CardContent>
                        ) : (
                            <QuestionFormComp evento={evento} setUpdateFlag={setUpdateFlag} />
                        )
                    }
                </Card >
            </>
        )
    }
    else if (fase == 2) {
        if (!pregunta) {
            return (
                <Card sx={{ mt: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            No has participado en esta competición
                        </Typography>
                    </CardContent>
                </Card>
            )
        } else {
            return (
                <>
                    {
                        participacion?.partida && (
                            <Alert severity="info" variant="filled" sx={{ mt: 2 }}>
                                Ya has realizado el cuestionario.
                            </Alert>
                        )
                    }
                    <Card sx={{ mt: 2 }}>
                        {
                            participacion?.partida ? (
                                <>
                                    <CardHeader title="Fase 2: Cuestionario" subheader="Gana 20 puntos extra valorando la competición, y 15 puntos por cada reporte justificado de preguntas incorrectas." titleTypographyProps={{ variant: "h5" }} />
                                    <CardContent>
                                        <Stack display="flex" flexDirection="column" alignItems="center" mb={6}>
                                            {
                                                participacion?.valoracion ? (
                                                    <>
                                                        <Typography component="legend">¡Gracias por la valoración!</Typography>
                                                        <Rating value={participacion.valoracion} size="large" readOnly />
                                                    </>

                                                ) : (
                                                    <>
                                                        <Typography component="legend">¿Qué te ha parecido la competición?</Typography>
                                                        <Stack alignItems="center" flexDirection="row" mt={2}>
                                                            <Rate rate={rate} setRate={setRate} />
                                                            <Button
                                                                disabled={rate == null}
                                                                variant="contained"
                                                                onClick={() => sendRate()}
                                                                sx={{ ml: 2 }}
                                                            >
                                                                Enviar valoración
                                                            </Button>
                                                        </Stack>
                                                    </>

                                                )
                                            }
                                        </Stack>
                                        <Divider />
                                        <PartidaReview partida={participacion.partida} showReportButton toggleReportada={toggleReportada} />
                                    </CardContent>
                                </>
                            ) : (
                                <IniciarParticipacionQuiz participacion={participacion.id} />
                            )
                        }
                    </Card>
                </>
            )
        }
    } else if (fase === 3) {
        if (participacion?.partida) {
            return (
                <>
                    <Alert severity="info" variant="filled" sx={{ mt: 2 }}>
                        Esperando corrección del profesor.
                    </Alert>
                    <Card sx={{ mt: 2 }}>
                        <CardHeader title="Mi partida" titleTypographyProps={{ variant: "h5" }} />
                        <CardContent>
                            <PartidaReview partida={participacion.partida} />
                        </CardContent>
                    </Card>
                </>
            )
        } else {
            return (
                <Card sx={{ mt: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            No has jugado tu partida
                        </Typography>
                    </CardContent>
                </Card>
            )
        }
    } else {
        console.log(participacion)
        if (participacion) {
            return (
                <Card sx={{ mt: 2 }}>
                    <CardHeader title="Resumen" titleTypographyProps={{ variant: "h4" }} />
                    <CardContent>
                        <ScoreOverview 
                            score1={participacion.score_f1}
                            score2={participacion.score_f2}
                            score3={participacion.score_f3}
                            valoracion={participacion.valoracion}
                        />
                        <Divider />
                        <Typography variant="h5" sx={{ my: 3 }}>
                            Mi pregunta creada
                        </Typography>
                        <QuestionQuiz question={pregunta} solved />
                        <Divider />
                        <Typography variant="h5" sx={{ my: 3 }}>
                            Mi partida
                        </Typography>
                        {participacion.partida ? (
                            <PartidaReview partida={participacion.partida} />
                        ) : (
                            <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                                No has jugado tu partida
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            )
        } else {
            return (
                <Card sx={{ mt: 2 }}>
                    <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            No has participado en la competición
                        </Typography>
                    </CardContent>
                </Card>
            )
        }
    }
}