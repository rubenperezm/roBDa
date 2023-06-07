import Head from 'next/head';
import NextLink from 'next/link';
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
                    py: 4
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

