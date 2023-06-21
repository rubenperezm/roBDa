import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
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
import { StateColor, Score } from 'src/sections/play/battles/battles-misc';
import { PartidaReview } from 'src/sections/play/partida-review';

const Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [battle, setBattle] = useState();
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (id) {
            const getBattle = async () => {
                try {
                    const res = await axiosAuth.get(`/api/play/battles/${id}`);
                    if (res.status === 200) {
                        setBattle(res.data);
                    }
                } catch (err) {
                }
            }
            getBattle();
        }
    }, [id]);


    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!battle) return null;

    return (
        <StatsLayout
            title="Duelo"
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
                                    href="/admin/stats/battles"
                                >
                                    Volver a duelos
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={4} mt={6}>
                                <Typography noWrap variant="h6" sx={{ textAlign: "center" }}>
                                    {battle.user1}
                                </Typography>
                            </Grid>
                            <Grid container xs={4}>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <StateColor estado={battle.estado} user1={battle.user1} />
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
                                    <Score estado={battle.estado} score1={battle.score1} score2={battle.score2} />
                                </Grid>
                            </Grid>
                            <Grid item xs={4} mt={6}>
                                <Typography noWrap variant="h6" sx={{ textAlign: "center" }}>
                                    {battle.user2}
                                </Typography>
                            </Grid>

                            <Grid container xs={12} justifyContent="center" mt={2}>
                                <Grid
                                    item
                                    xs={4}
                                    sm={3}
                                    md={2}
                                    display="flex"
                                    justifyContent="center"
                                    mt={1}
                                >
                                    <Typography display="inline" variant="body1" color="textPrimary">
                                        Tema: {battle.tema}
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={4}
                                    sm={3}
                                    md={2}
                                    display="flex"
                                    justifyContent="center"
                                    flexDirection="row"
                                >
                                    <Typography variant="body1" color="textPrimary" mt={1} pr={1}>
                                        Idioma:
                                    </Typography>
                                    <Avatar
                                        src={`/assets/flags/${battle.idioma}.png`}>
                                    </Avatar>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                </Card>
                {
                    (battle.estado === "Finalizado" || battle.estado === 'Rechazado') &&
                    <Card sx={{ mt: 2 }}>
                        <CardHeader title="Informes de partida" />
                        <CardContent>
                            <Box>
                                <Tabs value={tabValue} onChange={handleChangeTab}>
                                    <Tab label={battle.user1} />
                                    <Tab label={battle.user2} />
                                </Tabs>
                            </Box>

                            {
                                tabValue === 0 ?
                                    <PartidaReview
                                        partida={battle.partidaUser1}
                                    />
                                    :
                                    <PartidaReview
                                        partida={battle.partidaUser2}
                                    />
                            }

                        </CardContent>
                    </Card>
                }
            </Container>
        </StatsLayout>
    );
};


export default withAuthorization(Page, true);

