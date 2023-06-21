import Head from 'next/head';
import NextLink from 'next/link';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import StarIcon from '@heroicons/react/24/solid/StarIcon';
import BoltIcon from '@heroicons/react/24/solid/BoltIcon';
import TrophyIcon from '@heroicons/react/24/solid/TrophyIcon';

import {
    Box,
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';


export const Layout = (props) => {
    const { children, title, hideButtons } = props;

    return (
        <DashboardLayout>
            <Head>
                <title>
                    {title} | ROBDA
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4">
                                    {title}
                                </Typography>
                            </Grid>
                            {!hideButtons &&
                                <Grid container xs={12}>
                                    <Grid item alignItems="center">
                                        <Button
                                            component={NextLink}
                                            color="inherit"
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <ChartBarIcon />
                                                </SvgIcon>
                                            )}
                                            href="/admin/stats"
                                        >
                                            Estadísticas
                                        </Button>
                                    </Grid>
                                    <Grid item alignItems="center">
                                        <Button
                                            component={NextLink}
                                            color="inherit"
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <StarIcon />
                                                </SvgIcon>
                                            )}
                                            href="/admin/stats/study"
                                        >
                                            Repasos
                                        </Button>
                                    </Grid>
                                    <Grid item alignItems="center">
                                        <Button
                                            component={NextLink}
                                            color="inherit"
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <TrophyIcon />
                                                </SvgIcon>
                                            )}
                                            href="/admin/stats/competitions"
                                        >
                                            Competiciones
                                        </Button>
                                    </Grid>
                                    <Grid item alignItems="center">
                                        <Button
                                            component={NextLink}
                                            color="inherit"
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <BoltIcon />
                                                </SvgIcon>
                                            )}
                                            href="/admin/stats/battles"
                                        >
                                            Duelos
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        {children}
                    </Stack>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

