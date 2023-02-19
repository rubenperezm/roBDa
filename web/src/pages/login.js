import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { login, reset_register_success } from "../actions/auth";
import PageLayout from "../components/PageLayout";
import AccessCard from "../components/AccessCard";
import { CircularProgress, TextField, Button, CardContent, CardActions } from "@mui/material";

const LoginPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const loading = useSelector(state => state.auth.loading);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const {
        username,
        password,
    } = formData;

    useEffect(() => {
        if (dispatch && dispatch !== null && dispatch !== undefined)
            dispatch(reset_register_success());
    }, [dispatch]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (dispatch && dispatch !== null && dispatch !== undefined)
            dispatch(login(username, password));

    };

    if (typeof window !== "undefined" && isAuthenticated)
        router.push("/home");

    return (
        /* TODO cambiar para que no haya bordes blancos en la pantalla */
        <PageLayout title="Robda | Login" color="#000044">
            <AccessCard title="Login" >
                <CardContent component="form" noValidate autoComplete="off" onSubmit={onSubmit} >
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
                                <div style={{display: "flex", justifyContent: "right"}}>
                                    <CircularProgress sx={{mr: "4rem"}}/>
                                </div>
                                
                            ) : (
                                /* TODO hacerlos grid items para que cuando la pantalla sea chica sean 2 filas */
                                <CardActions sx={{ justifyContent: "space-between"}}>
                                        <Button href="/register" LinkComponent={Link}>Crear una cuenta</Button>
                                        <Button type="submit" variant="contained">Iniciar sesión</Button>   
                                </CardActions>
                            )
                        }
                            
                </CardContent>
            </AccessCard>
        </PageLayout>
    );
};

export default LoginPage;
