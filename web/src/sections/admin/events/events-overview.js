import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Check from '@mui/icons-material/Check';
import { DistFecha } from 'src/components/distFecha';


const fases = [
    'Previa',
    'Preguntas',
    'Test',
    'Fin',
];

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


const Ranking = ({ ranking, title }) => {
    if (ranking.length == 0) {
        return <Typography variant="body1" sx={{ mt: 2 }}>No hay puntuaciones registradas</Typography>
    }
    else {
        return (
            <>
            <Typography variant="h5">{title}</Typography>
            <TableContainer sx={{ mt: 2, display: 'flex', justifyContent: 'center', maxHeight: 320 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Posición</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Puntuación</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranking.map((row, index) => (
                            <TableRow hover key={index + 1}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.user}</TableCell>
                                <TableCell>{row.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </>
        );
    }
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};



export const EventOverview = (props) => {
    const { event } = props;
    const [fase, setFase] = useState(calcularFase(event));

    useEffect(() => {
        const interval = setInterval(() => {
            setFase(calcularFase(event));
        }, 1000);
        return () => clearInterval(interval);
    }, [event]);

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Grid
                    container
                    spacing={2}
                    mt={3}
                    sx={{
                        textAlign: 'center'
                    }}
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            color="textPrimary"
                            variant="h4"
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {event.name}
                        </Typography>
                    </Grid>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <Stack sx={{ width: '100%' }} spacing={4}>
                                <Stepper alternativeLabel activeStep={fase} connector={<QontoConnector />}>
                                    {fases.map((label, index) => (
                                        <Step key={index}>
                                            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Stack>
                        </Grid>
                    </div>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        mt={1}
                    >
                        <Typography display="inline" variant="h6" color="textPrimary" mr={1}>
                            Tema:
                        </Typography>
                        <Typography display="inline" variant="body1" color="textSecondary">
                            {event.tema}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        display="flex"
                        justifyContent="center"
                        flexDirection="row"
                    >
                        <Typography variant="h6" color="textPrimary" mt={1} mr={1}>
                            Idioma:
                        </Typography>
                        <Avatar
                            src={`/assets/flags/${event.idioma}.png`}>
                        </Avatar>
                    </Grid>

                    <Grid
                        xs={12}
                    >
                        <Grid
                            container
                            xs={12}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Grid xs={12} md={4} mb={1}>
                                <Typography variant="body1" color="textPrimary" mr={1}>
                                    Fecha de inicio:
                                </Typography>
                                <DistFecha fecha={event.fechaInicio} />
                            </Grid>
                            <Grid xs={12} md={4} mb={1}>
                                <Typography variant="body1" color="textPrimary" mr={1}>
                                    Fecha límite de creación de preguntas:
                                </Typography>
                                <DistFecha fecha={event.finFase1} />
                            </Grid>
                            <Grid xs={12} md={4} mb={1}>
                                <Typography variant="body1" color="textPrimary" mr={1}>
                                    Fecha límite de realización del test:
                                </Typography>
                                <DistFecha fecha={event.finFase2} />
                            </Grid>
                        </Grid>
                    </Grid>
                    {fase === 4 && (
                        <>
                            <Grid
                                item
                                xs={12}
                            >
                                <Divider />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                textAlign={'center'}
                            >
                                {event.ranking ?
                                <Ranking ranking={event.ranking} title="Clasificación" />
                                :
                                <Ranking ranking={event.mejoresJugadores} title="Mejores jugadores" />
                                }
                            </Grid>
                        </>
                    )}

                </Grid>
            </CardContent>
        </Card>
    );
}