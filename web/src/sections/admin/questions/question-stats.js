import PropTypes from 'prop-types';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Rating,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    useTheme
} from '@mui/material';
import { Chart } from 'src/components/chart';

const useChartOptions = (labels) => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent'
        },
        colors: [
            theme.palette.success.main,
            theme.palette.error.main,
            theme.palette.warning.main,
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

const Porcentajes = (props) => {
    const { chartSeries, labels, sx } = props;
    const chartOptions = useChartOptions(labels);


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

const Valoraciones = (props) => {
    const { media, nValorada } = props;

    return (
                <Stack>
                <Box display="flex" justifyContent="center">
                    <Rating readOnly value={media} precision={0.1}/>
                </Box>
                    
                    <Typography
                        align="center"
                        color="textSecondary"
                        variant="body1"
                    >
                        {media} de valoración media ({nValorada} {nValorada == 1 ? 'valoración' : 'valoraciones'})
                    </Typography>
                </Stack>
    );

};

export const QuestionStats = (props) => {
    const { stats } = props;
    const visible = (stats.vecesAcertada + stats.vecesFallada + stats.vecesLeida + stats.vecesNoLeida) > 0 && stats.vecesValorada > 0;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography color="textPrimary" variant="h4" sx={{my: 3}}>
                    Estadísticas
                </Typography>
            </Grid>
            {
                visible ? (
                    <>
                        <Grid item xs={12} sm={4} md={6} py={{xs: 2, sm: 14}}>
                            <Valoraciones media={stats.valoracion} nValorada={stats.vecesValorada} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={6}>
                            <Porcentajes
                                chartSeries={[stats.vecesAcertada, stats.vecesFallada, stats.vecesLeida, stats.vecesNoLeida]}
                                labels={['Acertada', 'Fallada', 'Leída', 'No leída']}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                    </>

                ) : (
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography color="textPrimary" variant="body1">
                            No hay estadísticas disponibles
                        </Typography>
                    </Grid>
                )
            }

        </Grid>
    );
};
