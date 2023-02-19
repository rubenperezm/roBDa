import { API_URL } from '../../../config/index';
import cookie from 'cookie';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(403).json({
                error: 'Usuario no autorizado para realizar esta solicitud'
            });
        }

        const body = JSON.stringify({
            token: access
        });

        try {
            const apiRes = await fetch(`${API_URL}/api/token/verify/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body
            });

            if (apiRes.status === 200) {
                return res.status(200).json({ success: 'Autenticación correcta' });
            } else {
                return res.status(apiRes.status).json({
                    error: 'Autenticación incorrecta'
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar verificar el token'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
};