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
            theme.palette.success.main,
            theme.palette.error.main,
            theme.palette.primary.main,
            theme.palette.warning.main,
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

export const DonutSimple = (props) => {
    const { data } = props;
    const [chartSeries, setChartSeries] = useState(null);
    const chartOptions = useChartOptions(['Acierto', 'Error', 'No respondida']);
    
    useEffect(() => {
        if (!data) return;
        const aciertos = data.filter(d => d.acierto === true);
        const errores = data.filter(d => d.acierto === false);
        const sinRespuesta = data.filter(d => d.acierto === null);

        setChartSeries([aciertos.length > 0 ? aciertos[0].numero : 0, errores.length > 0 ? errores[0].numero : 0, sinRespuesta.length > 0 ? sinRespuesta[0].numero : 0]);
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