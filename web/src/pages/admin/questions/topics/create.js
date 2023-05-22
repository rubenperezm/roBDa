import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
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
import { TopicForm } from 'src/sections/admin/questions/topics/topics-form';

const Page = () => {
    const handleCreate = useCallback(async (body) => {
        await axiosAuth.post('/api/questions/topics', body);
    }, []);


    return (
        <DashboardLayout>
            <Head>
                <title>
                    Crear tema | ROBDA
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
                                    Crear tema
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
                                        href="/admin/questions/topics"
                                    >
                                        Volver a temas
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    <TopicForm 
                        formHandler={handleCreate}
                        alertMessage="Tema creado correctamente"
                    />
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);