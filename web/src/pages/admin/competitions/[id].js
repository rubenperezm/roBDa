import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import {
    Alert,
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Snackbar,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    Tooltip
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { EventForm } from 'src/sections/admin/events/events-form';
import { EventOverview } from 'src/sections/admin/events/events-overview';

const Page = (props) => {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [updateFlag, setUpdateFlag] = useState(true);
    const [openDialogFinish, setOpenDialogFinish] = useState(false);
    const { id } = router.query;

    const handleUpdate = useCallback(async (event, body) => {
        await axiosAuth.put(`/api/events/${event.id}`, body);
    }, [event]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowAlert(false);
    };

    const terminarEvento = () => {
        setOpenDialogFinish(true);
    }

    const handleFinish = async () => {
        await axiosAuth.put(`/api/events/finish/${event.id}`);
        setOpenDialogFinish(false);
        setUpdateFlag(true);
        setMessageAlert('Competición finalizada');
        setShowAlert(true);
    }

    const handleCloseFinish = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenDialogFinish(false);
    };

    useEffect(() => {
        if (id && updateFlag) {
            const getEvent = async (id) => {
                try {
                    let response = await axiosAuth.get(`/api/events/${id}`).then(res => res.data);
                    setEvent(response);
                } catch (err) {
                    if (err.response.status === 404)
                        router.push('/404', router.asPath);
                    else
                        router.push('/admin/competitions', router.asPath);
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
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>{messageAlert}</Alert>
                </Snackbar>
                <Dialog
                    open={openDialogFinish}
                    onClose={handleCloseFinish}
                    aria-labelledby="alert-confirm-title"
                    aria-describedby="alert-confirm-description"
                >
                    <DialogTitle id="alert-confirm-title">
                        ¿Estás seguro de que quieres terminar esta competición?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-confirm-description">
                            Los resultados serán definitivos, y no podrás volver a editar la competición.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseFinish}>Cancelar</Button>
                        <Button onClick={handleFinish} autoFocus>
                            Terminar
                        </Button>
                    </DialogActions>
                </Dialog>
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
                                        href="/admin/competitions"
                                    >
                                        Volver a competiciones
                                    </Button>
                                </Stack>
                            </Grid>
                            {!event.terminada &&
                                <>
                                    <Grid item xs={12} sm={3} md={2}>
                                        {
                                            !event.terminable || editMode ?
                                                <Tooltip title="Se podrá terminar la competición en la última fase tras haber revisado todos los reportes">
                                                    <span>
                                                    <Button
                                                        disabled
                                                        fullWidth
                                                        variant="contained"
                                                    >
                                                        Terminar
                                                    </Button>
                                                    </span>
                                                </Tooltip>
                                                :
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{ float: 'right' }}
                                                    onClick={() => terminarEvento()}
                                                >
                                                    Terminar
                                                </Button>
                                        }
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={2}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{ float: 'right' }}
                                            onClick={() => setEditMode(!editMode)}
                                        >
                                            {editMode ? "Cancelar" : "Editar"}
                                        </Button>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    {editMode ?
                        <EventForm
                            event={event}
                            formHandler={handleUpdate}
                            alertMessage="Competición actualizada correctamente"
                            setEditMode={setEditMode}
                            setUpdateFlag={setUpdateFlag}
                            setShowAlert={setShowAlert}
                            setMessageAlert={setMessageAlert}
                        />
                        :
                        <>
                            <EventOverview
                                event={event}
                            />
                        </>
                    }

                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);