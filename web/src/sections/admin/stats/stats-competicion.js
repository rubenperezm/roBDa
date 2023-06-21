import { useEffect, useState } from 'react';
import { Stack, TextField, Typography} from '@mui/material';

export const StatsCompeticion = (props) => {
    const { preguntas, puntos, valoracion } = props;
    const [evento, setEvento] = useState(null);
    const [eventos, setEventos] = useState(null);
    const [preguntasEvento, setPreguntasEvento] = useState(0);
    const [puntosEvento, setPuntosEvento] = useState(0);
    const [valoracionEvento, setValoracionEvento] = useState(0);


    useEffect(() => {
        if (!preguntas) return;
        setEventos([...new Set(preguntas.map((item) => item.evento))]);
    }, [preguntas]);

    useEffect(() => {
        if (!eventos) return;
        setEvento(eventos[0]);
    }, [eventos]);

    useEffect(() => {
        if (!evento) return;
        const prg = preguntas.filter((item) => item.evento === evento);
        const pnt = puntos.filter((item) => item.evento === evento);
        const val = valoracion.filter((item) => item.evento === evento);
        setPreguntasEvento(prg.length > 0 ? prg[0].numero || 0 : 0);
        setPuntosEvento(pnt.length > 0 ? pnt[0].media || 0 : 0);
        setValoracionEvento(val.length > 0 ? val[0].media || 0 : 0);
    }, [evento]);

    if (!evento) return null;

    return (
        <Stack spacing={3}>
            <TextField
                fullWidth
                label="Competición"
                name="competicion"
                select
                SelectProps={{ native: true }}
                value={evento}
                onChange={(e) => setEvento(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 6 }}
            >
                {eventos.map((ev) => (
                    <option key={ev} value={ev}>{ev}</option>
                ))}
            </TextField>
            <Typography variant="h6" component="div" gutterBottom sx={{pl: 5}}>
                Valoración media: {valoracionEvento}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom sx={{pl: 5}}>
                Preguntas creadas: {preguntasEvento}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom sx={{pl: 5}}>
                Media de puntos: {puntosEvento}
            </Typography>
        </Stack>
    )

}