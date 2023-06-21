import { useState, useEffect } from 'react';
import {
    TextField,
    Unstable_Grid2 as Grid,
    useTheme
} from '@mui/material';
import { Chart } from 'src/components/chart';

const useChartOptions = (labels) => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent',
            height: 'auto',
        },
        colors: [
            theme.palette.success.main,
            theme.palette.error.main,
            theme.palette.primary.main,
        ],
        dataLabels: {
            enabled: true,
            enabledOnSeries: true,
        },
        labels,
        legend: {
            //show: false
            fontSize: '16px',
            position: 'bottom',
        },
        plotOptions: {
            pie: {
                expandOnClick: false
            }
        },
        states: {
            active: {
                filter: {
                    type: 'none'
                }
            },
            hover: {
                filter: {
                    type: 'none'
                }
            }
        },
        stroke: {
            width: 0
        },
        theme: {
            mode: theme.palette.mode
        },
        tooltip: {
            fillSeriesColor: false
        }
    };
};

const idiomasList = {
    1: 'Español',
    2: 'Inglés',
}

export const DonutTemaIdioma = (props) => {
    const { data } = props;
    const [tema, setTema] = useState(null);
    const [idioma, setIdioma] = useState(null);
    const [chartSeries, setChartSeries] = useState(null);
    const [temas, setTemas] = useState(null);
    const [idiomas, setIdiomas] = useState(null);
    const labels = ['Acierto', 'Error', 'No respondida'];
    const chartOptions = useChartOptions(labels);

    useEffect(() => {
        if (!data) return;
        setTemas([...new Set(data.map(d => d.tema))])
        setIdiomas([...new Set(data.map(d => d.idioma))])
    }, [data]);

    useEffect(() => {
        if (!temas || !idiomas) return;
        setTema(temas[0]);
        setIdioma(idiomas[0]);
    }, [temas, idiomas]);

    
    useEffect(() => {
        if (!data) return;

        const dataTemaIdioma = data.filter(d => d.tema === tema && d.idioma === idioma);
        const aciertos = dataTemaIdioma.filter(d => d.acierto === true);
        const errores = dataTemaIdioma.filter(d => d.acierto === false);
        const sinRespuesta = dataTemaIdioma.filter(d => d.acierto === null);

        setChartSeries([aciertos.length > 0 ? aciertos[0].numero : 0, errores.length > 0 ? errores[0].numero : 0, sinRespuesta.length > 0 ? sinRespuesta[0].numero : 0]);
    }, [tema, idioma, data]);

    if (!tema || !idioma || !chartSeries) return null;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Tema"
                    name="tema"
                    select
                    SelectProps={{ native: true }}
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 1 }}
                >
                    {temas.map((ev) => (
                        <option key={ev} value={ev}>{ev}</option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="Idioma"
                    name="idioma"
                    select
                    SelectProps={{ native: true }}
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 3 }}
                >
                    {idiomas.map((ev) => (
                        <option key={ev} value={ev}>{idiomasList[ev]}</option>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <Chart
                    height={300}
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    width="100%"
                />
            </Grid>
        </Grid>
    );
};