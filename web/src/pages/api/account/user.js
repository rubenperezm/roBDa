import cookie from 'cookie';
import { API_URL } from '../../../config/index';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para acceder a esta ruta'
            });
        }

        try {
            const apiRes = await fetch(`${API_URL}/users/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });
            const data = await apiRes.json();


            if (apiRes.status === 200) {
                return res.status(200).json({
                    user: data
                });
            } else {
                return res.status(apiRes.status).json({
                    error: data
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar obtener la información del usuario'
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
