import { Box, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";


export const ReportList = (props) => {
    const { reports } = props;

    console.log(reports);
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

    return (
        <Box>
        <Typography variant="h4">
            Lista de reportes
        </Typography>

        {reports.map((report) => (
            <Card key={report.id}>
                <CardHeader title={report.user} subheader={`Motivo: ${report.motivo}`}/>
                <CardContent>
                    <Typography variant="body1">
                        {report.descripcion}
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* TODO: BOTONES Iconos Tick Cross a la derecha de CardHeader y CardActions */}
                </CardActions>

            </Card>        
        ))}
        </Box>

    );
}