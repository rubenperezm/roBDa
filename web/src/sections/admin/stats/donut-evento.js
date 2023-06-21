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
            theme.palette.warning.main,
            theme.palette.success.main,
            theme.palette.error.main,
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

export const DonutEvento = (props) => {
    const { data } = props;
    const [evento, setEvento] = useState('Fuera de evento');
    const [chartSeries, setChartSeries] = useState(null);
    const [eventos, setEventos] = useState(null);
    const labels = ['Pendiente', 'Validado', 'Rechazado'];
    const chartOptions = useChartOptions(labels);

    useEffect(() => {
        if(!data) return;
        setEventos([...new Set(data.map(d => d.evento !== null ? d.evento : 'Fuera de evento'))])
    }, [data]);

    useEffect(() => {
        if(!data) return;

        const dataEvento = data.filter(d => d.evento === (evento === 'Fuera de evento' ? null : evento));
        const pendientes = dataEvento.filter(d => d.estado === 1);
        const validados = dataEvento.filter(d => d.estado === 2);
        const rechazados = dataEvento.filter(d => d.estado === 3);


        setChartSeries([pendientes.length > 0 ? pendientes[0].numero : 0, validados.length > 0 ? validados[0].numero : 0, rechazados.length > 0 ? rechazados[0].numero : 0 ])
    }, [evento, data]);

    if(!eventos || !chartSeries) return null;

    return (
        <>
        <TextField
            fullWidth
            label="Evento"
            name="evento"
            select
            SelectProps={{ native: true }}
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
        >
            {eventos.map((ev) => (
                <option key={ev} value={ev}>{ev}</option>
            ))}
        </TextField>
        <Chart
            height={300}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
        />
        </>
    );
};