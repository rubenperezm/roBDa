import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { ImageLightbox } from './images/imgs-lightbox';
import { API_URL } from 'src/config';
export const QuestionQuiz = (props) => {
    const { question, solved } = props;
    const [selected, setSelected] = useState(null);

    const handleSelect = (option) => {
        setSelected(option);
    }

    return (
        <Grid
            container
            spacing={2}
            p={5}
        >
            <Grid
                item
                xs={12}
                sx={{
                    textAlign: 'center'

                }}
            >
                <Typography
                    color="textPrimary"
                    variant="h5"
                >
                    {question.enunciado}
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
            >
                <ImageLightbox imagePath={`${API_URL}${question.imagen.path}`} />
            </Grid>
            {question.opciones.map((opcion) => (
                <Grid
                    item
                    xs={12}
                >
                    <Card
                        disabled={solved}
                        onClick={() => handleSelect(opcion.id)}
                        sx={{
                            backgroundColor: selected === opcion.id ? 'primary.main' : 'background.paper',
                            cursor: solved ? 'default' : 'pointer',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                            }
                        }}
                    >
                        <CardContent
                            sx={{
                                textAlign: 'center'
                            }}
                        >
                            <Typography
                                color={selected === opcion.id? "white" : "textPrimary"}
                                variant="h6"
                            >
                                {opcion.texto}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

}
