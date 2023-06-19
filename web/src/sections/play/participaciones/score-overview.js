import {
    Rating,
    Typography,
    Unstable_Grid2 as Grid,
} from "@mui/material"

import CreateIcon from '@mui/icons-material/Create';
import FeedbackIcon from '@mui/icons-material/Feedback';
import QuizIcon from "@mui/icons-material/Quiz";

export const ScoreOverview = ({ score1, score2, score3, valoracion }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h5" sx={{mb: 3}}>
                    Mi puntuación
                </Typography>
                <div style={{
                    display: 'flex',
                    marginLeft: '25%',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <CreateIcon sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ ml: 2, mb: 2 }}>
                        Pregunta: {score1}
                    </Typography>
                </div>
                <div style={{
                    display: 'flex',
                    marginLeft: '25%',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <QuizIcon sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ ml: 2, mb: 2 }}>
                        Cuestionario: {score2}
                    </Typography>
                </div>
                <div style={{
                    display: 'flex',
                    marginLeft: '25%',
                    marginBottom: '24px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    <FeedbackIcon sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ ml: 2, mb: 2 }}>
                        Feedback: {score3}
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="h5" sx={{mb: {xs: 3, sm: 5}}}>
                    Mi valoración
                </Typography>
                {
                    valoracion ? (
                            <Rating value={valoracion} readOnly size="large" sx={{ml: '25%'}}/>
                    )
                    :
                    (
                        <Typography variant="body1" sx={{mb: {xs: 3, sm: 5}}}>
                            No has valorado la competición
                        </Typography>
                    )
                }
                
            </Grid>
        </Grid>
    )
}
