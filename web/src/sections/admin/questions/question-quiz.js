import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { ImageLightbox } from './images/imgs-lightbox';

export const QuestionQuiz = (props) => {
    const { question, solved, selected, setSelected } = props;

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
                    variant="h6"
                    style={{whiteSpace: 'pre-line'}}
                >
                    {question.enunciado}
                </Typography>
            </Grid>
            { question.imagen &&
                <Grid
                    item
                    xs={12}
                >
                    <ImageLightbox imagePath={question.imagen.path} />
                </Grid>
            }
            {question.opciones.map((opcion) => (
                <Grid
                    item
                    xs={12}
                    key={opcion.id}
                >
                    <Card
                        onClick={!solved ? () => handleSelect(opcion.id) : null}
                        sx={{
                            backgroundColor: solved && opcion.esCorrecta ? 'green'
                                : selected === opcion.id ? solved ? '#f42323' : 'primary.main' : '#f0f0f0',
                            cursor: solved ? 'default' : 'pointer',
                            '&:hover': {
                                backgroundColor: !solved ? 'primary.main' : null,
                            }
                        }}
                    >
                        <CardContent
                            sx={{
                                textAlign: 'center'
                            }}
                        >
                            <Typography
                                color={selected === opcion.id && !solved || (solved && opcion.esCorrecta)? "white" : "textPrimary"}
                                variant="body"
                                style={{whiteSpace: 'pre-line'}}
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
