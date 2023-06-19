import { CheckCircle, Cancel } from "@mui/icons-material";
import axiosAuth from "src/utils/axiosAuth";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    SvgIcon,
    Tooltip,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material";



export const ReportList = (props) => {
    const { reports, setUpdateFlag, setShowAlert, setMessageAlert } = props;

    if (reports.length === 0) {
        return (
            <Box>
                <Typography variant="h4" p={2}>
                    Lista de reportes
                </Typography>
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="body">
                        No hay reportes para esta pregunta
                    </Typography>
                </div>
            </Box>
        );
    }

    const decideReport = (id, isAcepted) => {
        const sendDecision = async () => {
            try {
                await axiosAuth.patch(`/api/play/report/${id}`, { isAcepted });
                setUpdateFlag(true);
                setShowAlert(true);
                if (isAcepted)
                    setMessageAlert('Reporte aceptado');
                else
                    setMessageAlert('Reporte rechazado');
            } catch (err) {
                //console.log(err);
            }
        }
        sendDecision();
    }

    return (
        <Box sx={{ pt: 2 }}>
            <Typography variant="h4">
                Lista de reportes
            </Typography>

            {reports.map((report) => (
                <Card key={report.id} sx={{ mt: 2 }}>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <CardHeader sx={{ display: "flex", flex: "1" }} title={report.user} subheader={`Motivo: ${report.motivo}`} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CardActions
                                disableSpacing
                                sx={{
                                    alignSelf: "stretch",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-start",
                                    pt: { xs: 0, sm: 4 },
                                    pb: { xs: 1, sm: 2 },
                                    px: 3,
                                }}
                            >
                                <Tooltip title="Aceptar reporte">
                                    <IconButton
                                        onClick={() => decideReport(report.id, true)}
                                    >
                                        <SvgIcon>
                                            <CheckCircle style={{ color: 'green' }} />
                                        </SvgIcon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Rechazar reporte">
                                    <IconButton
                                        onClick={() => decideReport(report.id, false)}
                                    >
                                        <SvgIcon>
                                            <Cancel style={{ color: 'red' }} />
                                        </SvgIcon>
                                    </IconButton>
                                </Tooltip>
                            </CardActions>
                        </Grid>
                    </Grid>
                    <Divider />
                    <CardContent>
                        <Typography variant="body1">
                            {report.descripcion}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>

    );
}