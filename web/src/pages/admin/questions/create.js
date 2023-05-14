import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import { 
    Alert,
    Box,
    Button,
    Container,
    Stack,
    Snackbar,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { QuestionForm } from 'src/sections/admin/questions/questions-form';

const Page = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    const handleCreate = useCallback(async (body) => {
        await axiosAuth.post('/api/questions', body);
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowAlert(false);
    };


    return (
        <DashboardLayout>
            <Head>
                <title>
                    Crear pregunta | ROBDA
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={showAlert} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "100%" }}>{messageAlert}</Alert>
                </Snackbar>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4">
                                    Crear pregunta
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={9} md={10}>
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
                                        href="/admin/questions"
                                    >
                                        Volver a preguntas
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    <QuestionForm 
                        formHandler={handleCreate}
                        alertMessage="Pregunta creada correctamente"
                        setShowAlert={setShowAlert}
                        setMessageAlert={setMessageAlert}
                    />
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);