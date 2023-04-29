import { Box, Typography } from "@mui/material";


export const ReportList = (props) => {
    const { reports } = props;

    if (reports.length === 0) {
        return (
            <Box>
                <Typography variant="h4" p={2}>
                    Lista de reportes
                </Typography>
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="h6">
                        No hay reportes para esta pregunta
                    </Typography>
                </div>
            </Box>
        );
    }

    {/* TODO: Mostrar todos los reports en Cards, junto a los botones de aceptar/rechazar */}
    return (
        <Typography variant="h4">
            Lista de reportes
        </Typography>
    );
}