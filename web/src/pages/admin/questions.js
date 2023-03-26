import Head from 'next/head';
import { useEffect, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon';
import HashtagIcon from '@heroicons/react/24/solid/HashtagIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
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
import { QuestionsTable } from 'src/sections/admin/questions/questions-table';
import { QuestionsFilters } from 'src/sections/admin/questions/questions-filters';

const Page = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(0);

    useEffect(() => {
        const getQuestions = async () => {
            const res = await axiosAuth.get('/api/questions', {
                params: {
                    page: pagina + 1
                }
            }).then(res => res.data);
            setPreguntas(res.results);
            setNumberOfResults(res.count);
        };
        getQuestions();
    }, [pagina]);

    return (
        <>
            <Head>
                <title>
                    Preguntas | ROBDA
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
                                    Preguntas
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={9} md={10}>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <PhotoIcon />
                                            </SvgIcon>
                                        )}
                                    >
                                        Imágenes
                                    </Button>
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <HashtagIcon />
                                            </SvgIcon>
                                        )}
                                    >
                                        Temas
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <Button
                                    fullWidth
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    sx={{float: 'right'}}
                                >
                                    Crear pregunta
                                </Button>
                            </Grid>
                        </Grid>
                        <QuestionsFilters setNumberOfResults={setNumberOfResults} setPreguntas={setPreguntas} setPagina={setPagina} />
                        <QuestionsTable
                            setPagina={setPagina}
                            pagina={pagina}
                            numberOfResults={numberOfResults}
                            preguntas={preguntas}
                        />
                    </Stack>
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

