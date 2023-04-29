import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
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
import { TopicForm } from 'src/sections/admin/questions/topics/topics-form';

const Page = (props) => {
    const router = useRouter();
    const [topic, setTopic] = useState(null);
    const { id } = router.query;

    const handleUpdate = useCallback(async (topic, body) => {
        await axiosAuth.put(`/api/questions/topics/${topic.id}`, body);
    }, [topic]);


    useEffect(() => {
        if (id) {
            const getTopic = async (id) => {
                try {
                    const response = await axiosAuth.get(`/api/questions/topics/${id}`).then(res => res.data);
                    setTopic(response);
                } catch (err) {
                    if (err.response.status === 404)
                        router.push('/404', router.asPath);
                    else
                        router.push('/admin/questions/topics', router.asPath);
                }
            }
            getTopic(id);
        }
    }, [id]);

    if (!topic) {
        return null;
    }

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Editar tema | ROBDA
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
                                    Editar tema
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
                        topic={topic}
                        formHandler={handleUpdate}
                        alertMessage="Tema actualizado correctamente"
                    />
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default Page;