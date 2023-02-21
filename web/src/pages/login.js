import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { login, reset_register_success } from "../actions/auth";
import PageLayout from "../components/PageLayout";
import AccessCard from "../components/AccessCard";
import { CircularProgress, TextField, Button, CardContent, CardActions, Typography, Alert } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

const LoginPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const error = useSelector(state => state.auth.error);
    const loading = useSelector(state => state.auth.loading);
    const register_success = useSelector(state => state.auth.register_success);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const {
        username,
        password,
    } = formData;

    useEffect(() => {
        if (dispatch && dispatch !== null && dispatch !== undefined){
            dispatch(reset_register_success());
        }
            
    }, [dispatch]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (dispatch && dispatch !== null && dispatch !== undefined){
            dispatch(login(username, password));
        }
    };

    if (typeof window !== "undefined" && isAuthenticated)
        router.push("/home");

    return (
        <PageLayout title="Robda | Login">
            {
                register_success && <Alert severity="success">Cuenta creada correctamente</Alert>
            }
            <AccessCard title="Iniciar sesión">
                {
                    error && <Typography display="block "variant="caption" sx={{color:"red", textAlign: "center"}}>{error}</Typography>
                }
                <CardContent component="form" autoComplete="off" onSubmit={onSubmit} >
                        <TextField
                        fullWidth
                        margin="normal"
                        onChange={onChange}
                        InputLabelProps={{ required: false }}
                        required
                        name="username"
                        label="Nombre de usuario"
                        />
                        <TextField
                        fullWidth
                        margin="normal"
                        onChange={onChange}
                        InputLabelProps={{ required: false }}
                        required
                        type="password"
                        name="password"
                        label="Contraseña"
                        />
                        {
                            loading ? (
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <CircularProgress sx={{m: "0 auto"}}/>
                                </div>
                                
                            ) : (
                                <Grid2 container spacing={2} sx={{mt: 2}}>
                                    <Grid2 item xs={12}>
                                        <Button fullWidth type="submit" variant="contained">Iniciar sesión</Button>      
                                    </Grid2>
                                    <Grid2 item xs={12}>
                                        <Button fullWidth href="/register" LinkComponent={Link}>Crear una cuenta</Button>
                                    </Grid2>
                                </Grid2>
                            )
                        }
                            
                </CardContent>
            </AccessCard>
        </PageLayout>
    );
};

export default LoginPage;
