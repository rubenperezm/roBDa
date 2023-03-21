import { API_URL } from '../../../config/index';
import cookie from 'cookie';

export default async (req, res) => {
    if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para cambiar la contraseña'
            });
        }
        const {
            password,
            password2,
        } = req.body;

        const body = JSON.stringify({
            password,
            password2,
        });

        try {
            const apiRes = await fetch(`${API_URL}/users/set-password/`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                const flattenedResults = {};
                Object.keys(data.error).forEach((key) => {
                    flattenedResults[key] = data.error[key][0];
                });

                return res.status(apiRes.status).json({
                    error: flattenedResults
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Algo salió mal al editar el usuario'
            });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({ 'error': `Método ${req.method} no permitido`});
    }
};
