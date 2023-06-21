import { useState, useEffect } from 'react';
import {
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
            theme.palette.info.main,
            theme.palette.warning.main,
            theme.palette.primary.main,
            theme.palette.error.main,
            theme.palette.success.main,
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

export const DonutDuelo = (props) => {
    const { data } = props;
    const [chartSeries, setChartSeries] = useState(null);
    const chartOptions = useChartOptions(['En creación', 'Pendiente', 'Finalizado', 'Rechazado', 'Aceptado']);
    
    useEffect(() => {
        if (!data) return;
        const en_creacion = data.filter(d => d.estado === 1);
        const pendientes = data.filter(d => d.estado === 2);
        const finalizados = data.filter(d => d.estado === 3);
        const rechazados = data.filter(d => d.estado === 4);
        const aceptados = data.filter(d => d.estado === 5);

        setChartSeries([
            en_creacion.length > 0 ? en_creacion[0].numero : 0, 
            pendientes.length > 0 ? pendientes[0].numero : 0, 
            finalizados.length > 0 ? finalizados[0].numero : 0,
            rechazados.length > 0 ? rechazados[0].numero : 0,
            aceptados.length > 0 ? aceptados[0].numero : 0
        ]);
    }, [data]);

    if (!chartSeries) return null;

    return (
        <Chart
            height={300}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
        />
    );
};