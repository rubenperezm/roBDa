import cookie from 'cookie';
import { API_URL } from '../../../../config/index';

export default async (req, res) => {
    if (req.method === 'GET') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver los temas'
            });
        }

        const page = req.query.page ?? 1;

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/temas/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                }
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(
                    data
                );
            } else {
                return res.status(apiRes.status).json({
                    error: data
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: 'Algo salió mal al intentar obtener los temas'
            });
        }
    } else if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para ver temas'
            });
        }

        const { id } = req.query;

        const { nombre } = req.body;

        try {
            const apiRes = await fetch(`${API_URL}/preguntas/temas/${id}/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
                body: JSON.stringify({
                    nombre
                })
            });

            if (apiRes.status === 200) {
                return res.status(200);
            } else {
                return res.status(apiRes.status);
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }

    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
