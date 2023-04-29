import Head from 'next/head';
import NextLink from 'next/link';
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon';
import HashtagIcon from '@heroicons/react/24/solid/HashtagIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
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


export const Layout = (props) => {
    const {children, buttonText, creationLink, title} = props;

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
                    py: 8
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
                                                <ListBulletIcon />
                                            </SvgIcon>
                                        )}
                                        href="/admin/questions"
                                    >
                                        Preguntas
                                    </Button>
                                    <Button
                                        component={NextLink}
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <PhotoIcon />
                                            </SvgIcon>
                                        )}
                                        href="/admin/questions/images"
                                    >
                                        Imágenes
                                    </Button>
                                    <Button
                                        component={NextLink}
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <HashtagIcon />
                                            </SvgIcon>
                                        )}
                                        href="/admin/questions/topics"
                                    >
                                        Temas
                                    </Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <Button
                                    component={NextLink}
                                    fullWidth
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    sx={{ float: 'right' }}
                                    href={creationLink}
                                >
                                    {buttonText}
                                </Button>
                            </Grid>
                        </Grid>
                        {children}
                    </Stack>
                </Container>
            </Box>
        </DashboardLayout>
    );
};

