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
    const {children} = props;

    return (
        <DashboardLayout>
            <Head>
                <title>
                    Competiciones | ROBDA
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
                                    Competiciones
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} sm={4} md={3} sx={{marginLeft: 'auto'}}>
                                <Button
                                    component={NextLink}
                                    fullWidth
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    href='/admin/competitions/create'
                                >
                                    Crear competición
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

