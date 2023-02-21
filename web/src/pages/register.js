import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { router, useRouter } from 'next/router';
import Link from 'next/link';
import { register } from '../actions/auth';
import PageLayout from '../components/PageLayout';
import AccessCard from '../components/AccessCard';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, CardContent, Typography, Button } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const register_success = useSelector(state => state.auth.register_success);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const error = useSelector(state => state.auth.error);
    const loading = useSelector(state => state.auth.loading);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });

    const {
        username,
        email,
        password,
        password2
    } = formData;


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (dispatch && dispatch !== null && dispatch !== undefined)
            dispatch(register(email, username, password, password2));
    };

    if (typeof window !== 'undefined' && isAuthenticated)
        router.push('/home');
    if (register_success)
        router.push('/login');

    return (
        <PageLayout title="Robda | Registro">
            <AccessCard title="Crear cuenta">
                <CardContent component="form" autoComplete="off" onSubmit={onSubmit} >

                    <TextField
                    error={error && error.email ? true : false}
                    helperText={error && error.email ? error.email : ""}
                    fullWidth
                    margin="normal"
                    onChange={onChange}
                    required
                    name="email"
                    label="Correo electrónico"
                    value={email}
                    />
                    
                    <TextField
                    error={error && error.username ? true : false}
                    helperText={error && error.username ? error.username : ""}
                    fullWidth
                    margin="normal"
                    onChange={onChange}
                    required
                    name="username"
                    label="Nombre de usuario"
                    value={username}
                    />

                    <TextField
                    error={error && error.password ? true : false}
                    helperText={error && error.password ? error.password : ""}
                    fullWidth
                    margin="normal"
                    onChange={onChange}
                    required
                    type="password"
                    name="password"
                    label="Contraseña"
                    value={password}
                    />

                    <TextField
                    error={error && (error.password2) ? true : false}
                    helperText={error && error.password2 ? error.password2 : ""}
                    fullWidth
                    margin="normal"
                    onChange={onChange}
                    required
                    type="password"
                    name="password2"
                    label="Repetir contraseña"
                    value={password2}
                    />

                    {
                        loading ? (
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <CircularProgress sx={{m: "0 auto"}}/>
                            </div>
                            
                        ) : (
                            <Grid2 container spacing={2} sx={{mt: 2}}>
                                <Grid2 item xs={12}>
                                    <Button fullWidth type="submit" variant="contained">Crear cuenta</Button>      
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <Button fullWidth href="/login" LinkComponent={Link}>Ya tengo una cuenta</Button>
                                </Grid2>
                            </Grid2>
                        )
                    }
                </CardContent>
            </AccessCard>
        </PageLayout>
    );
};

export default RegisterPage;
