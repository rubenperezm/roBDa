import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
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
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { QuestionForm } from 'src/sections/admin/questions/questions-form';

const Page = () => {
    const handleCreate = useCallback(async (body) => {
        await axiosAuth.post('/api/questions', body);
    }, []);


    return (
        <>
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
                    />
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;