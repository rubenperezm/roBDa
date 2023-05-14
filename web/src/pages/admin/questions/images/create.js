import Head from 'next/head';
import NextLink from 'next/link';
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
import { ImgsForm } from 'src/sections/admin/questions/images/imgs-create-form';

const Page = () => {
    return (
        <DashboardLayout>
            <Head>
                <title>
                    Subir imagen | ROBDA
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
                                        href="/admin/questions/images"
                                    >
                                        Volver a imágenes
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Container>
                <Container maxWidth="xl">
                    <ImgsForm />
                </Container>
            </Box>
        </DashboardLayout>
    );
};

export default withAuthorization(Page, true);