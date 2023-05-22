import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';
import { 
    Box,
    Button,
    Card,
    Container,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import { ImgsForm } from 'src/sections/admin/questions/images/imgs-form';
import { ImageLightbox } from 'src/sections/admin/questions/images/imgs-lightbox';

const Page = (props) => {
    const router = useRouter();
    const [image, setImage] = useState(null);
    const { id } = router.query;

    const handleUpdate = useCallback(async (image, body) => {
        await axiosAuth.put(`/api/questions/images/${image.id}`, body);
    }, [image]);


    useEffect(() => {
        if (id) {
            const getImage = async (id) => {
                try {
                    const response = await axiosAuth.get(`/api/questions/images/${id}`).then(res => res.data);
                    setImage(response);
                } catch (err) {
                    if (err.response.status === 404)
                        router.push('/404', router.asPath);  
                    else
                        router.push('/admin/questions/images', router.asPath);
                }
            }
            getImage(id);
        }
    }, [id]);


    if (!image) {
        return null;
    }

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Editar imagen | ROBDA
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
                                    Editar imagen
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
                                        href="/admin/questions/images"
                                    >
                                        Volver a imágenes
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth= "xl">
                    <Card sx={{marginY: 5}}>
                        <ImageLightbox imagePath={image.path}/>
                    </Card>
                </Container>
                <Container maxWidth="xl">
                    <ImgsForm 
                        image={image}
                        formHandler={handleUpdate}
                        alertMessage="Imagen actualizada correctamente"
                    />
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);