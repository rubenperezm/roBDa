import NextLink from 'next/link';
import {
    Button,
    CardActions,
    CardHeader,
    Divider,
    Unstable_Grid2 as Grid
} from '@mui/material';

export const IniciarParticipacionQuiz = (props) => {
    const { participacion } = props;
    return (
        <>
            <CardHeader sx={{mb: 2}} title="Fase 2: Cuestionario" subheader="Realiza un cuestionario con preguntas creadas por tus compañeros" titleTypographyProps={{variant: "h5"}}/>
            <Divider/>
            <CardActions>
                <Grid container spacing={2} xs={12} sx={{ justifyContent: "flex-end" }}>
                    <Grid item xs={12} md={3}>
                        <Button 
                            component={NextLink}
                            variant="contained"
                            fullWidth
                            href={`/competitions/quiz/${participacion}`}
                        >
                            Realizar cuestionario
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </>
    );
}