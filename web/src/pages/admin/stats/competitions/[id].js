import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import {
    Box,
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { EventForm } from 'src/sections/admin/events/events-form';
import { EventOverview } from 'src/sections/admin/events/events-overview';
import { ParticipacionOverview } from 'src/sections/play/participaciones/participacion-overview';

const Page = (props) => {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [participacion, setParticipacion] = useState(null);
    const [pregunta, setPregunta] = useState(null);
    const [updateFlag, setUpdateFlag] = useState(true);

    const { id } = router.query;

    useEffect(() => {
        if (id && updateFlag) {
            const getEvent = async (id) => {
                try {
                    let response = await axiosAuth.get(`/api/stats/competitions/${id}`).then(res => res.data);
                    setParticipacion(response.participacion);
                    setPregunta(response.pregunta);
                    let event = await axiosAuth.get(`/api/events/${response.participacion.evento}`).then(res => res.data);
                    setEvent(event);
                } catch (err) {
                    if (err.response.status === 404)
                        router.push('/404', router.asPath);
                    else
                        router.push('/admin/stats/competitions');
                }
            }
            getEvent(id);
            setUpdateFlag(false);
        }
    }, [id, updateFlag]);


    if (!event) {
        return null;
    }

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Ver competición | ROBDA
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
                                    Detalle competición
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8}>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        component={NextLink}
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <ArrowLeftIcon />
                                            </SvgIcon>
                                        )}
                                        href="/admin/stats/competitions"
                                    >
                                        Volver a competiciones
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    <EventOverview
                        event={event}
                    />
                    <ParticipacionOverview 
                        participacion={participacion}
                        evento={event}
                        pregunta={pregunta} 
                        setParticipacion={setParticipacion}
                        setUpdateFlag={setUpdateFlag}/>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);