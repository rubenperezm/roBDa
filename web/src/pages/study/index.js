import { useEffect, useState } from 'react';
import { withAuthorization } from 'src/hocs/with-authorization';
import NextLink from 'next/link';

import {
    Button,
    Container,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';

import { Layout as QuizLayout } from 'src/layouts/quiz/layout';
import { StartQuizForm } from 'src/sections/play/study/start-quiz-form';

import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';


const Page = () => {
    const [onQuiz, setOnQuiz] = useState(false);
    return (
        <QuizLayout
            title="Repaso"
        >
            {
                onQuiz ?
                    // <Quiz />
                    <div>Quiz</div>
                    :
                    <Container maxWidth="xl">
                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h4">
                                        Repaso
                                    </Typography>
                                </Grid>
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
                                            href="/"
                                        >
                                            Volver al menú
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <StartQuizForm />
                    </Container>
            }
        </QuizLayout>
    );
};


export default withAuthorization(Page, false);

