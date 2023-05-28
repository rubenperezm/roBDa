import { useState } from 'react';
import { withAuthorization } from 'src/hocs/with-authorization';
import NextLink from 'next/link';

import {
    Button,
    Container,
    Stack,
    SvgIcon,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import { Layout as QuizLayout } from 'src/layouts/quiz/layout';
import { StartQuizForm } from 'src/sections/play/study/start-quiz-form';
import { Quiz } from 'src/sections/play/study/quiz';

import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';


const Page = () => {
    const [onQuiz, setOnQuiz] = useState(0);
    return (
        <QuizLayout
            title="Repaso"
        >
            {
                onQuiz !== 0 ?
                    //<Quiz idPartida={onQuiz}/>
                    <Button onClick={() => setOnQuiz(0)}>Volver</Button>
                    :
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
                                            href="/battles"
                                        >
                                            Volver a duelos
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <StartQuizForm setOnQuiz={setOnQuiz}/>
                    </Container>
            }
        </QuizLayout>
    );
};


export default withAuthorization(Page, false);

