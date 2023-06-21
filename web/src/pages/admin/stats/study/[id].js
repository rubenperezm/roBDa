import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthorization } from 'src/hocs/with-authorization';
import NextLink from 'next/link';
import axiosAuth from 'src/utils/axiosAuth';

import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    Divider,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';

import { Layout as StatsLayout } from 'src/layouts/stats/layout';
import { PartidaReview } from 'src/sections/play/partida-review';

const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [study, setStudy] = useState();

    useEffect(() => {
        if (id) {
            const getStudy = async () => {
                try {
                    const res = await axiosAuth.get(`/api/play/study/${id}`);
                    if (res.status === 200) {
                        setStudy(res.data);
                    }
                } catch (err) {
                }
            }
            getStudy();
        }
    }, [id]);


    if (!study) return null;

    return (
        <StatsLayout
            title="Repaso"
            hideButtons
        >
            <Container maxWidth="xl">
                <Stack spacing={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                    href="/admin/stats/study"
                                >
                                    Volver a repasos
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>

                    <Card sx={{ mt: 2 }}>
                        <CardHeader title="Informe de partida" />
                        <CardContent>
                            <PartidaReview
                                partida={study.partida}
                            />
                        </CardContent>
                    </Card>
            </Container>
        </StatsLayout>
    );
};


export default withAuthorization(Page, true);

