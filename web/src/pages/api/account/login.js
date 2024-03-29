import cookie from 'cookie';
import axiosAuth from 'src/utils/axiosAuth';
import { API_URL } from 'src/config';


export default async (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const body = JSON.stringify({
            username,
            password
        });

        try {
            const apiRes = await fetch(`${API_URL}/api/token/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                res.setHeader('Set-Cookie', [
                    cookie.serialize(
                        'access', data.access, {
                            httpOnly: true,
                            secure: process.env.SECURE !== 'False',
                            maxAge: 60 * 30,
                            sameSite: 'strict',
                            path: '/'
                        }
                    ),
                    cookie.serialize(
                        'refresh', data.refresh, {
                            httpOnly: true,
                            secure: process.env.SECURE !== 'False',
                            maxAge: 60 * 60 * 24 * 15,
                            sameSite: 'strict',
                            path: '/'
                        }
                    )
                ]);

                return res.status(200).json({
                    success: 'Inició sesión exitosamente'
                });
            } else {
                return res.status(apiRes.status).json({
                    error: 'Usuario o contraseña incorrectos'
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar autenticar'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    } 
};
