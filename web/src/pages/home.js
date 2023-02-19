import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import PageLayout from '../components/PageLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Home = () => {
    const router = useRouter();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isLecturer = useSelector(state => state.auth.isLecturer);
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    if (typeof window !== 'undefined' && !loading && !isAuthenticated)
        router.push('/login');

    return (
        <PageLayout title='robda | Home'>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
                <Typography variant="h2" gutterBottom>
                    ¡Bienvenido, {user && user.username}!
                </Typography>
                <Typography variant ="body">
                    {isLecturer ? 'Eres un profesor' : 'Eres un alumno'}
                </Typography>
            </Box>
        </PageLayout>
    );
};

export default Home;
